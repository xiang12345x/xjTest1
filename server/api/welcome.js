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

module.exports = router;
