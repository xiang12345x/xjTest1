const express = require('express');
const router = express.Router();
const User = require('../models/user');

// 获取用户信息接口
router.get('/userInfo', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(200).json({ success: false, message: 'No token provided' });
        }

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, 'your-secret-key');
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(200).json({ success: false, message: '没有找到该用户！' });
        }

        res.status(200).json({ success: true, data: user });
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

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, 'your-secret-key');

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

module.exports = router;
