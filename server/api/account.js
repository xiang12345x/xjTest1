const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// 从数据库查询该用户的账单记录
const Record = require('../models/record');

// 将回调函数改为异步函数
router.get('/getList', async (req, res) => {
    try {
        // 从请求头获取token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: '未提供认证token' });
        }

        // 验证token
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: '服务器配置错误' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // 获取日期范围参数
        const { startDate, endDate } = req.query;

        // 验证日期格式
        const isValidDate = dateStr => {
            const date = new Date(dateStr);
            return !isNaN(date.getTime()) && dateStr === date.toISOString().split('T')[0];
        };

        // 构建查询条件
        const query = { userId };
        if (startDate && endDate) {
            if (!isValidDate(startDate) || !isValidDate(endDate)) {
                return res.status(400).json({ message: '日期格式不正确，请使用YYYY-MM-DD格式' });
            }
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
            };
        } else if (startDate) {
            if (!isValidDate(startDate)) {
                return res
                    .status(400)
                    .json({ message: '开始日期格式不正确，请使用YYYY-MM-DD格式' });
            }
            query.date = { $gte: new Date(startDate) };
        } else if (endDate) {
            if (!isValidDate(endDate)) {
                return res
                    .status(400)
                    .json({ message: '结束日期格式不正确，请使用YYYY-MM-DD格式' });
            }
            query.date = { $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) };
        }

        // 从数据库查询该用户的账单记录
        const records = await Record.find(query).sort({ date: -1 });
        res.status(200).json({ message: '查询成功', data: records });
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ code: 401, message: 'Token已过期，请重新登录' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// 添加保存账单记录的接口
router.post('/save', async (req, res) => {
    try {
        // 从请求头获取token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: '未提供认证token' });
        }

        // 验证token
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: '服务器配置错误' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // 从请求体获取记录数据
        const { amount, category, description, date } = req.body;

        // 验证必填字段
        if (!amount || !category) {
            return res.status(500).json({ message: '金额和类别为必填项' });
        }

        // 创建新记录
        const newRecord = new Record({
            userId,
            amount,
            category,
            description: description || '',
            date: new Date(date),
        });

        // 保存到数据库
        await newRecord.save();

        res.status(200).json({ message: '记录保存成功', record: newRecord });
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ code: 401, message: 'Token已过期，请重新登录' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// 删除账单记录接口
router.delete('/delete/:id', async (req, res) => {
    try {
        // 从请求头获取token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: '未提供认证token' });
        }

        // 验证token
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: '服务器配置错误' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // 获取记录ID
        const recordId = req.params.id;

        // 查找并删除记录，确保只有记录所有者可以删除
        const deletedRecord = await Record.findOneAndDelete({ _id: recordId, userId });

        if (!deletedRecord) {
            return res.status(404).json({ message: '未找到记录或无权删除' });
        }

        res.status(200).json({ message: '记录删除成功', data: deletedRecord });
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ code: 401, message: 'Token已过期，请重新登录' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;
