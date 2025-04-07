// 在文件顶部添加环境变量配置
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const login = require('./api/login');
const welcome = require('./api/welcome');
const account = require('./api/account');

const app = express();
// const port = 3000;

app.use(cors());
app.use(express.json());

// 在路由最前面添加
app.use((req, res, next) => {
    res.set('X-Server-Region', process.env.VERCEL_REGION || 'local');
    next();
});

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

app.use('/api', login);
app.use('/api', welcome);
app.use('/api/account', account);

// 连接MongoDB
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-program', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
        console.log('✅ MongoDB连接成功');
        // 启动Express服务器
        app.listen(PORT, () => {
            console.log(`服务器运行在端口 ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB连接失败:', err.message);
        process.exit(1); // 连接失败时退出
    });

// 测试接口
app.get('/test', async (req, res) => {
    res.send('test');
});
