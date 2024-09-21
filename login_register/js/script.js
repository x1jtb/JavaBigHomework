// 通用的错误提示函数
function showError(message) {
    alert(message);
}

// 切换表单显示
function toggleForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
}

// 登录函数
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                localStorage.setItem('token', data.token); // 存储 token
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('data-container').style.display = 'block';
                queryData(); // 登录后查询数据
            } else {
                alert('登录失败：用户名或密码错误');
            }
        }
    };

    xhr.send(JSON.stringify({ username, password }));
}

// 注册用户函数
function registerUser() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 201) {
                alert('注册成功，请登录');
                toggleForm();
            } else {
                showError('注册失败，请检查输入');
            }
        }
    };

    xhr.send(JSON.stringify({ username, password }));
}

// 上传数据函数
function uploadData() {
    const data = document.getElementById('data-input').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/data', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 201) {
                alert('数据上传成功');
                queryData(); // 上传成功后自动刷新数据列表
            } else {
                showError('数据上传失败');
            }
        }
    };

    xhr.send(JSON.stringify({ data }));
}

// 查询数据函数
function queryData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/data', true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
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
        }
    };

    xhr.send();
}

// 删除数据函数
function deleteData(index) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/api/data/${index}`, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                alert('数据删除成功');
                queryData(); // 删除后自动刷新数据列表
            } else {
                showError('数据删除失败');
            }
        }
    };

    xhr.send();
}

// 修改数据函数
function editData(index) {
    const newData = prompt('请输入修改后的数据：');
    if (newData) {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `/api/data/${index}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    alert('数据修改成功');
                    queryData(); // 修改后自动刷新数据列表
                } else {
                    showError('数据修改失败');
                }
            }
        };

        xhr.send(JSON.stringify({ data: newData }));
    }
}
