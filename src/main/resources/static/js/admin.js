// admin.js

// 模拟用户数据
let users = [
    { id: 1, username: 'admin1' },
    { id: 2, username: 'admin2' },
    { id: 3, username: 'user1' },
    { id: 4, username: 'user2' }
];

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
            <td><button class="btn btn-success" onclick="addUser(${user.id})">增加</button></td>
            <td><button class="btn btn-info" onclick="viewUser(${user.id})">查看</button></td>
            <td><button class="btn btn-warning" onclick="editUser(${user.id})">修改</button></td>
            <td><button class="btn btn-primary" onclick="downloadUser(${user.id})">下载</button></td>
            <td><button class="btn btn-danger" onclick="deleteUser(${user.id})">删除用户</button></td>
            <td><button class="btn btn-secondary" onclick="deleteUserData(${user.id})">删除用户数据</button></td>
        `;

        userTableBody.appendChild(tr);
    });
}

// 查找用户
function searchUser() {
    const query = document.getElementById('search-query').value.trim();

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
}

// 增加用户
function addUser(id) {
    alert(`增加用户：${id}`);
}

// 查看用户
function viewUser(id) {
    const user = users.find(u => u.id === id);
    alert(`查看用户：\nID: ${user.id}\n用户名: ${user.username}`);
}

// 修改用户
function editUser(id) {
    const user = users.find(u => u.id === id);
    const newUsername = prompt('修改用户名：', user.username);
    if (newUsername) {
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
function deleteUser(id) {
    users = users.filter(user => user.id !== id);
    renderUsers(users);
    alert('用户已删除');
}

// 删除用户数据
function deleteUserData(id) {
    const user = users.find(u => u.id === id);
    alert(`删除用户数据：\nID: ${user.id}\n用户名: ${user.username} 的数据已删除`);
    // 这里可以添加删除用户数据的逻辑
    // 比如：删除该用户在数据库或本地存储中的所有数据
}

// 初始渲染所有用户
renderUsers(users);
