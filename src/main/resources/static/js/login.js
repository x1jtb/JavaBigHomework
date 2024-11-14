// 通用的错误提示函数
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

    const data = await apiPostRequest('/api/auth/login', { username, password });

    if (data) {
        const jwt = data.jwt;
        const redirectUrl = data.redirectUrl;

        localStorage.setItem('token', jwt);
        window.location.href = redirectUrl;
    }
}

// 注册函数
async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const data = await apiPostRequest('/api/auth/register', { username, password });

    if (data) {
        alert('注册成功，请登录');
        toggleForm();
    }
}
/*
// 上传数据函数
async function uploadData() {
    const data = document.getElementById('data-input').value;

    const result = await apiPostRequest('/api/data/upload', { data });

    if (result) {
        alert('数据上传成功');
        queryData();
    }
}

// 查询数据函数（使用 POST 方法）
async function queryData() {
    const result = await apiPostRequest('/api/data/query', {});

    if (result) {
        const dataList = document.getElementById('data-list');
        dataList.innerHTML = '';

        result.forEach((item) => {
            const div = document.createElement('div');
            div.classList.add('data-item');
            div.innerHTML = `<span>${item}</span>`;
            dataList.appendChild(div);
        });
    }
}

// 页面加载时检查登录状态
window.onload = () => {
    checkLogin();
};
*/
// 切换表单的显示
function toggleForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}
