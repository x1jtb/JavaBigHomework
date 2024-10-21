// 通用的错误提示函数
function showError(message) {
    alert(message);
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // 存储 token
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('data-container').style.display = 'block';
    } else {
        alert('登录失败：用户名或密码错误');
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
        alert('未授权访问');
    }
}

// 注册函数
async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert('注册成功，请登录');
            toggleForm(); // 注册成功后切换到登录表单
        } else {
            showError('注册失败，请检查输入');
        }
    } catch (error) {
        showError('注册失败，请检查网络连接');
    }
}

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

// 上传数据函数
async function uploadData() {
    const data = document.getElementById('data-input').value;

    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });

        if (response.ok) {
            alert('数据上传成功');
            queryData(); // 上传成功后自动刷新数据列表
        } else {
            showError('数据上传失败');
        }
    } catch (error) {
        showError('数据上传失败，请检查网络连接');
    }
}

// 查询数据函数
async function queryData() {
    try {
        const response = await fetch('/api/data');
        if (response.ok) {
            const data = await response.json();
            const dataList = document.getElementById('data-list');
            dataList.innerHTML = ''; // 清空旧数据

            data.forEach((item, index) => {
                const div = document.createElement('div');
                div.classList.add('data-item');
                div.innerHTML = `
                    <span>${item}</span>
                `;
                dataList.appendChild(div);
            });
        } else {
            showError('查询数据失败');
        }
    } catch (error) {
        showError('查询数据失败，请检查网络连接');
    }
}
