const mongoose = require('mongoose');

/**
 * 短信验证码模型
 * @property {string} phone - 手机号码
 * @property {string} code - 验证码
 * @property {Date} expiresAt - 过期时间
 */
const smsCodeSchema = new mongoose.Schema({
    phone: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

// 自动删除过期验证码
smsCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('SmsCode', smsCodeSchema);
