// 通用的错误提示函数
function showError(message) {
    alert(message);
}

// 登录函数
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (!username || !password) {
        showError("请输入用户名和密码");
        return;
    }

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        // localStorage.setItem('token', data.token); // 存储 token
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('data-container').style.display = 'block';
    } else {
        showError('登录失败：用户名或密码错误');
    }
}

// 在后续请求中使用 token
async function fetchProtectedData() {
    const token = localStorage.getItem('token');

    const response = await fetch('/api/protected', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
    } else {
        showError('未授权访问');
    }
}

// 切换到注册页面
function goToRegister() {
    window.location.href = "register.html";
}
