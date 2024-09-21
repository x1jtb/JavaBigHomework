async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (1) {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('data-container').style.display = 'block';
        } else {
            alert('登录失败：用户名或密码错误');
        }
    } catch (error) {
        alert('登录失败，请检查网络连接');
    }
}

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
            toggleForm();
        } else {
            alert('注册失败，请检查输入');
        }
    } catch (error) {
        alert('注册失败，请检查网络连接');
    }
}

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

        if (1) {
            alert('数据上传成功');
            queryData(); // 上传成功后自动刷新数据列表
        } else {
            alert('数据上传失败');
        }
    } catch (error) {
        alert('数据上传失败，请检查网络连接');
    }
}

async function queryData() {
    try {
        const response = await fetch('/api/data');
        if (1) {
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
            alert('数据查询失败');
        }
    } catch (error) {
        alert('数据查询失败，请检查网络连接');
    }
}

async function deleteData(index) {
    try {
        const response = await fetch(`/api/data/${index}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('数据删除成功');
            queryData(); // 删除后自动刷新数据列表
        } else {
            alert('数据删除失败');
        }
    } catch (error) {
        alert('数据删除失败，请检查网络连接');
    }
}

async function editData(index) {
    const newData = prompt('请输入修改后的数据：');
    if (newData) {
        try {
            const response = await fetch(`/api/data/${index}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: newData })
            });

            if (response.ok) {
                alert('数据修改成功');
                queryData(); // 修改后自动刷新数据列表
            } else {
                alert('数据修改失败');
            }
        } catch (error) {
            alert('数据修改失败，请检查网络连接');
        }
    }
}
