const express = require('express');
const router = express.Router();
const User = require('../models/user');

// 登录接口
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && user.password === password) {
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            res.status(200).json({ success: true, token, message: '登录成功！' });
        } else {
            res.status(200).json({ success: false, message: '用户名或密码错误！' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 注册接口
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 检查用户名是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: '用户名已经存在!',
            });
        }

        // 创建新用户
        const newUser = new User({ username, password });
        await newUser.save();

        res.status(201).json({ success: true, message: '注册成功！' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
