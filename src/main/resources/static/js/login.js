// 错误提示函数
function showError(message) {
    alert(message);
}

window.onload = () => {
    // 清空本地存储的 token
    localStorage.removeItem('token');
    console.log('本地 token 已清空');
};

// 检查用户是否已登录
function checkLogin() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
    }

}

// 封装 POST 请求函数，自动处理 Authorization 头和错误状态
async function apiPostRequest(url, body = {}) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });

    // 如果返回 401 状态码，自动跳转到登录页
    if (response.status === 401) {
        alert("身份验证失败，请重新登录");
        localStorage.removeItem('token');
        window.location.href = "/index.html";
        return null;
    }

    if (!response.ok) {
        const errorData = await response.json();
        showError(errorData.message || '请求失败');
        return null;
    }

    return response.json();
}

// 登录函数
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (!username || !password) {
        alert("请输入用户名和密码");
        return;
    }

    try {
        const data = await apiPostRequest('/api/auth/login', { username, password });

        if (data) {
            const jwt = data.jwt;
            const redirectUrl = data.redirectUrl;

            localStorage.setItem('token', jwt);
            window.location.href = redirectUrl;
        }
    } catch (error) {
        showError('登录失败，请检查输入或网络连接');
    }
}

// 添加回车键事件监听器，实现回车登录
document.addEventListener('DOMContentLoaded', () => {
    // 监听整个文档的 keydown 事件
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            login();
        }
    });
});
