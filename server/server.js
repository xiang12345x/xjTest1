const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 添加在所有路由之前的中间件
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: '数据库未连接，请稍后再试',
        });
    }
    next();
});

// 连接MongoDB
mongoose
    .connect('mongodb://localhost:27017/mini-program', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('✅ MongoDB连接成功');
        // 启动Express服务器
        app.listen(port, () => {
            console.log(`服务器运行在 http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB连接失败:', err.message);
        process.exit(1); // 连接失败时退出
    });

// 登录接口
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && user.password === password) {
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
            res.status(200).json({ success: true, token, message: '登录成功！' });
        } else {
            res.status(200).json({ success: false, message: '用户名或密码错误！' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 获取用户信息接口
app.get('/api/userInfo', async (req, res) => {
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

        res.status(200).json({ success: true, user });
    } catch (err) {
        console.error('Get user info error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// 注册接口
app.post('/api/register', async (req, res) => {
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
