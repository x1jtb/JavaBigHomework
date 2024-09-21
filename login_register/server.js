// 引入依赖
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();  // 加载 .env 文件中的变量

// 初始化 Express 应用
const secretKey = process.env.SECRET_KEY;  // 从环境变量中读取密钥
const app = express();
const PORT = process.env.PORT || 5500;

const cors = require('cors');
app.use(cors({
    origin: '*',  // 允许所有来源
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // 允许的方法
    allowedHeaders: ['Content-Type', 'Authorization']  // 允许的请求头
}));

// 使用 bodyParser 解析 JSON 数据
app.use(bodyParser.json());

// 假设这是你的用户数据库
const users = [
    { id: 1, username: 'huangjiaxi666', password: 'scnu' },
    { id: 2, username: 'user2', password: 'password2' }
];

// 登录路由
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // 查找用户
    const user = users.find(u => u.username === username && u.password === password);

    // 如果用户存在，生成 JWT
    if (user) {
        const token = jwt.sign(
            { id: user.id, username: user.username },
            secretKey,  // 使用环境变量中的密钥
            { expiresIn: '1h' }  // 设置 token 的过期时间
        );
        res.json({ token });  // 返回 token
    } else {
        // 用户名或密码错误
        res.status(401).send('用户名或密码错误');
    }
});

// 中间件：验证 JWT
function authenticateToken(req, res, next) {
    // 从请求头部的 Authorization 字段获取 token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 如果没有 token，返回 401 Unauthorized
    if (!token) return res.sendStatus(401);

    // 验证 JWT
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);  // 如果验证失败，返回 403 Forbidden
        req.user = user;  // 将解码后的用户信息保存到 req 对象中
        next();  // 调用下一个中间件或路由
    });
}

// 受保护的路由示例
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({
        message: '这是一个保护的路由',
        user: req.user  // 显示已通过验证的用户信息
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
