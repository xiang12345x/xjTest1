const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// 在multer配置前添加目录检查
const uploadDir = 'uploads/avatars';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 替换原来的multer配置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 限制2MB
}).single('avatar');

// 获取用户信息接口
router.get('/userInfo', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(200).json({ success: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(200).json({ success: false, message: '没有找到该用户！' });
        }

        // 构造返回数据，包含用户信息和头像URL
        const userData = {
            ...user.toObject(),
            avatarUrl: user.avatarUrl || null,
        };

        res.status(200).json({ success: true, data: userData });
    } catch (err) {
        console.error('Get user info error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 修改用户信息接口
router.post('/updateUser', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(200).json({ success: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { username, date, address, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            { username, date, address, email },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(200).json({ success: false, message: '没有找到该用户！' });
        }

        res.status(200).json({ success: true, data: updatedUser, message: '更新用户信息成功！' });
    } catch (err) {
        console.error('Update user error:', err);
        if (err.name === 'TokenExpiredError') {
            return res
                .status(200)
                .json({ code: 401, success: false, message: 'Token已过期，请重新登录' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 上传用户头像接口
router.post('/uploadAvatar', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: '未提供认证token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        upload(req, res, async err => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    message:
                        err.code === 'LIMIT_FILE_SIZE' ? '文件大小不能超过2MB' : '文件上传失败',
                });
            } else if (err) {
                console.error('Upload error:', err);
                return res.status(500).json({ success: false, message: '文件处理失败' });
            }

            if (!req.file) {
                return res.status(400).json({ success: false, message: '未选择文件' });
            }

            // 构造可访问的URL路径
            const avatarUrl = `${process.env.URL}/api/${uploadDir}/${req.file.filename}`;

            // 更新用户头像路径
            const updatedUser = await User.findByIdAndUpdate(
                decoded.userId,
                {
                    avatar: req.file.path, // 存储实际文件路径
                    avatarUrl: avatarUrl, // 存储可访问的URL
                },
                { new: true }
            ).select('-password');

            if (!updatedUser) {
                return res.status(404).json({ success: false, message: '用户不存在' });
            }

            res.status(200).json({
                success: true,
                data: {
                    avatarUrl: avatarUrl,
                    user: updatedUser,
                },
                message: '头像上传成功',
            });
        });
    } catch (err) {
        console.error('Upload avatar error:', err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'Token已过期，请重新登录',
            });
        }
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

module.exports = router;
