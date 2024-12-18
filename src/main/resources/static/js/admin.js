// admin.js
let users = []; // 定义全局变量

// 页面加载时检查登录状态并获取所有用户数据
window.onload = async () => {
    checkLogin();
    setupDynamicSearch(); // 设置动态查找功能

    // 获取所有用户数据并渲染
    users = await fetchAllUsers(); // 将用户数据赋值给全局变量
    renderUsers(users);
};

// 检查用户是否已登录
async function checkLogin() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    // 使用 POST 请求调用 API 以验证权限
    const response = await fetch('/api/auth/authority/admin', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
    if (!response.ok) {
        alert("权限认证失败，请重新登录");
        window.location.href = "/index.html";
    }

    // 处理权限认证成功的逻辑
    const data = await response.text();
    console.log('权限认证通过', data);
}

// 获取所有用户数据
async function fetchAllUsers() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    // 使用 GET 请求调用 API 以获取所有用户数据
    const response = await fetch('/api/auth/admin/getusers', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        alert("获取用户数据失败，请重新登录");
        window.location.href = "/index.html";
        return;
    }

    return await response.json();
}

// 渲染用户数据
function renderUsers(usersList) {
    const userTableBody = document.getElementById('user-table-body');
    userTableBody.innerHTML = ''; // 清空现有内容

    if (usersList.length === 0) {
        userTableBody.innerHTML = '<tr><td colspan="8" class="text-center">没有找到相关用户</td></tr>';
        return;
    }

    usersList.forEach(user => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td><button class="btn btn-warning" onclick="editUser(${user.id})">修改</button></td>
            <td><button class="btn btn-primary" onclick="downloadUser(${user.id})">下载</button></td>
            <td><button class="btn btn-danger" onclick="deleteUser(${user.id})">删除用户</button></td>
            <td><button class="btn btn-secondary" onclick="deleteUserData(${user.id})">删除用户数据</button></td>
            <td><button class="btn btn-info" onclick="resetPassword(${user.id})">重置密码</button></td>
            <td><button class="btn btn-success" onclick="viewUserDetails(${user.id})">查看详细信息</button></td>
        `;

        userTableBody.appendChild(tr);
    });
}

// 动态查找用户
function setupDynamicSearch() {
    const searchInput = document.getElementById('search-query');

    // 监听输入框的 input 事件
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        let filteredUsers = [];

        if (query) {
            // 判断输入的是用户名还是用户ID
            if (isNaN(query)) {
                // 输入的是用户名
                filteredUsers = users.filter(user => user.username.includes(query));
            } else {
                // 输入的是用户ID
                filteredUsers = users.filter(user => user.id === parseInt(query));
            }
        } else {
            // 如果没有输入内容，显示所有用户
            filteredUsers = users;
        }

        renderUsers(filteredUsers);
    });
}

// 修改用户
async function editUser(id) {
    // 检查 users 数组是否存在并且不为空
    if (!users || users.length === 0) {
        alert("用户数据为空，请刷新页面或重新登录");
        return;
    }

    const user = users.find(u => u.id === id);

    // 检查是否找到了对应的用户
    if (!user) {
        alert("未找到对应的用户，请刷新页面");
        return;
    }

    const newUsername = prompt('修改用户名：', user.username);

    if (newUsername) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("请先登录");
            window.location.href = "/index.html";
            return;
        }

        // 使用 PUT 请求调用 API 以修改用户名
        const response = await fetch(`/api/auth/admin/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: newUsername })
        });

        if (!response.ok) {
            // 处理错误响应
            const errorMessage = await response.text();
            alert(`修改用户名失败：${errorMessage}`);
            return;
        }

        // 更新前端的用户数据
        user.username = newUsername;
        renderUsers(users);
        alert('用户名已修改');
    }
}

// 下载用户
function downloadUser(id) {
    const user = users.find(u => u.id === id);
    const userData = JSON.stringify(user);
    const blob = new Blob([userData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user_${user.id}.json`;
    link.click();
    alert('用户数据已下载');
}

// 删除用户
async function deleteUser(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    // 确认删除
    const confirmDelete = confirm("确定要删除该用户及其所有数据吗？");
    if (!confirmDelete) {
        return;
    }

    // 使用 DELETE 请求调用 API 以删除用户
    const response = await fetch(`/api/auth/admin/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        alert(`删除用户失败：${errorMessage}`);
        return;
    }

    // 更新前端的用户数据
    users = users.filter(user => user.id !== id);
    renderUsers(users);
    alert('用户及其关联数据已删除');
}

// 删除用户数据
async function deleteUserData(userId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    // 确认删除
    const confirmDelete = confirm("确定要删除该用户的数据吗？");
    if (!confirmDelete) {
        return;
    }

    // 使用 DELETE 请求调用 API 以删除用户数据
    const response = await fetch(`/api/auth/admin/${userId}/data`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        alert(`删除用户数据失败：${errorMessage}`);
        return;
    }

    // 更新前端的用户数据
    renderUsers(users);
    alert('用户数据已删除');
}

// 重置密码
async function resetPassword(userId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    // 确认重置密码
    const confirmReset = confirm("确定要重置该用户的密码为 123456 吗？");
    if (!confirmReset) {
        return;
    }


    // 使用 POST 请求调用 API 以重置密码
    const response = await fetch(`/api/auth/admin/${userId}/reset-password`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        alert(`重置密码失败：${errorMessage}`);
        return;
    }

    alert('密码已重置为 123456');
}

// 查看用户详细信息
async function viewUserDetails(userId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    // 使用 GET 请求调用 API 以获取用户详细信息
    const response = await fetch(`/api/auth/admin/${userId}/details`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        alert(`获取用户详细信息失败：${errorMessage}`);
        return;
    }

    const userDetails = await response.json();

    // 显示用户详细信息
    const userDataDetailsSection = document.getElementById('user-data-details');
    userDataDetailsSection.style.display = 'block';

    // 渲染用户数据
    renderUserData(userDetails.data);
}

// 渲染用户数据
function renderUserData(dataList) {
    const userDataTableBody = document.getElementById('user-data-table-body');
    userDataTableBody.innerHTML = ''; // 清空现有内容

    if (dataList.length === 0) {
        userDataTableBody.innerHTML = '<tr><td colspan="5" class="text-center">没有找到相关数据</td></tr>';
        return;
    }

    dataList.forEach(data => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${data.dataID}</td>
            <td>${data.dataName}</td>
            <td>${data.createdAt}</td>
            <td>${data.updatedAt}</td>
            <td>
                <button class="btn btn-warning" onclick="editData(${data.dataID})">编辑</button>
                <button class="btn btn-danger" onclick="deleteData(${data.dataID})">删除</button>
            </td>
        `;

        userDataTableBody.appendChild(tr);
    });
}

// 编辑数据
async function editData(dataID) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    const newDataName = prompt('修改数据名称：');
    const newDataContent = prompt('修改数据内容：');

    if (newDataName || newDataContent) {
        const response = await fetch(`/api/data/${dataID}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dataName: newDataName, dataContent: newDataContent })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            alert(`修改数据失败：${errorMessage}`);
            return;
        }

        alert('数据已修改');
        // 重新加载用户数据
        const userId = users.find(user => user.data.some(data => data.dataID === dataID)).id;
        viewUserDetails(userId);
    }
}

// 删除数据
async function deleteData(dataID) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    const confirmDelete = confirm("确定要删除该数据吗？");
    if (!confirmDelete) {
        return;
    }

    const response = await fetch(`/api/data/${dataID}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        alert(`删除数据失败：${errorMessage}`);
        return;
    }

    alert('数据已删除');
    // 重新加载用户数据
    const userId = users.find(user => user.data.some(data => data.dataID === dataID)).id;
    viewUserDetails(userId);
}

// 初始渲染所有用户
renderUsers(users);