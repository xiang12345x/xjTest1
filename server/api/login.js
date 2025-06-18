const express = require('express');
const router = express.Router();
const User = require('../models/user');
const SmsCode = require('../models/smsCode');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

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
        const { username, password, phone } = req.body;

        // 检查用户名是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(200).json({
                success: false,
                message: '用户名已经存在!',
            });
        }

        // 创建新用户
        const newUser = new User({ username, password, phone });
        await newUser.save();

        res.status(201).json({ success: true, message: '注册成功！' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 发送短信验证码接口
router.post('/sms/send', async (req, res) => {
    try {
        const { phone } = req.body;
        // 在发送验证码前先删除旧记录
        await SmsCode.deleteMany({ phone });

        // 生成6位随机验证码
        const code = crypto.randomInt(100000, 999999).toString();

        // 保存验证码到数据库，有效期5分钟
        const newCode = new SmsCode({
            phone,
            code,
            expiresAt: new Date(Date.now() + 60 * 1000),
        });
        await newCode.save();

        // 调用阿里云短信服务API发送验证码
        const SMSClient = require('@alicloud/sms-sdk');
        const accessKeyId = process.env.ALI_SMS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.ALI_SMS_ACCESS_KEY_SECRET;

        // 初始化sms_client
        const smsClient = new SMSClient({ accessKeyId, secretAccessKey });

        try {
            // 发送短信
            const result = await smsClient.sendSMS({
                PhoneNumbers: phone,
                SignName: '您的签名',
                TemplateCode: 'SMS_318245268',
                TemplateParam: `{"code":"${code}"}`,
            });

            if (result.Code !== 'OK') {
                console.error('短信发送失败:', result);
                return res.status(500).json({
                    success: false,
                    message: '短信发送失败',
                });
            }
        } catch (err) {
            console.error('调用短信API错误:', err);
            return res.status(500).json({
                success: false,
                message: '短信发送失败',
            });
        }

        res.status(200).json({
            success: true,
            message: '验证码已发送',
            expiresIn: 60, // 1分钟有效期
        });
    } catch (err) {
        console.error('发送短信验证码错误:', err);
        res.status(500).json({ success: false, message: '发送验证码失败' });
    }
});

// 短信验证码登录接口
router.post('/login/sms', async (req, res) => {
    try {
        const { phone, code } = req.body;

        // 验证验证码
        const smsCode = await SmsCode.findOne({
            phone,
            code,
            expiresAt: { $gt: new Date() },
        });

        if (!smsCode) {
            return res.status(200).json({
                success: false,
                message: '验证码错误或已过期',
            });
        }

        // 查找用户
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(200).json({
                success: false,
                message: '该手机号未注册',
            });
        }

        // 生成JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // 删除已使用的验证码
        await SmsCode.deleteOne({ _id: smsCode._id });

        res.status(200).json({
            success: true,
            token,
            message: '登录成功！',
        });
    } catch (err) {
        console.error('短信登录错误:', err);
        res.status(500).json({ success: false, message: '登录失败' });
    }
});

module.exports = router;
