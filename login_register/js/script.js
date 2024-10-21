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
        queryData(); // 登录后查询数据
    } else {
        alert('登录失败：用户名或密码错误');
    }
}

// 切换登录/注册表单
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

// 上传数据函数
async function uploadData() {
    const data = document.getElementById('data-input').value;

    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
        const response = await fetch('/api/data', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const dataList = document.getElementById('data-list');
            dataList.innerHTML = ''; // 清空旧数据

            data.forEach((item, index) => {
                const div = document.createElement('div');
                div.classList.add('data-item');
                div.innerHTML = `
                    <span>${item}</span>
                    <button onclick="editData(${index})">修改</button>
                    <button onclick="deleteData(${index})">删除</button>
                `;
                dataList.appendChild(div);
            });
        } else {
            showError('数据查询失败');
        }
    } catch (error) {
        showError('数据查询失败，请检查网络连接');
    }
}

// 删除数据函数
async function deleteData(index) {
    try {
        const response = await fetch(`/api/data/${index}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            alert('数据删除成功');
            queryData(); // 删除后自动刷新数据列表
        } else {
            showError('数据删除失败');
        }
    } catch (error) {
        showError('数据删除失败，请检查网络连接');
    }
}

// 修改数据函数
async function editData(index) {
    const newData = prompt('请输入修改后的数据：');
    if (newData) {
        try {
            const response = await fetch(`/api/data/${index}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: newData })
            });

            if (response.ok) {
                alert('数据修改成功');
                queryData(); // 修改后自动刷新数据列表
            } else {
                showError('数据修改失败');
            }
        } catch (error) {
            showError('数据修改失败，请检查网络连接');
        }
    }
}
