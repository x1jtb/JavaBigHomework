// 通用的错误提示函数
function showError(message) {
    alert(message);
}

// 注册函数
async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    // 检查是否填写用户名和密码
    if (!username || !password) {
        showError("请输入用户名和密码");
        return;
    }

    try {
        // 发送注册请求到后端
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        // 检查响应状态
        if (response.ok) {
            alert('注册成功，请登录');
            window.location.href = '/loginlogin.html';  // 跳转到登录页面
        } else {
            showError('注册失败，请检查输入');
        }
    } catch (error) {
        showError('注册失败，请检查网络连接');
    }
}
