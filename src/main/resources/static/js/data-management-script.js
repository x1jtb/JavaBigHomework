const apiUrl = 'http://localhost:8080/api/data'; // 替换为实际的后端API URL
const fileDropArea = document.getElementById('fileDropArea');
const fileMessage = document.getElementById('fileMessage');
let selectedFile = null;


// 页面加载时检查登录状态并获取所有数据
window.onload = async () => {
    await checkLogin(); // 确保用户登录
    await fetchAllData(); // 自动获取所有数据
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
    const response = await fetch('/api/auth/authority/user', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // 如果需要传递额外的参数，可以在此处添加到对象中
    });
    if (!response.ok) {
        alert("权限认证失败，请重新登录");
        window.location.href = "/index.html";

        // 处理权限认证成功的逻辑
        const data = await response.json();
        console.log('权限认证通过', data);
    }
}

// 获取特定数据并渲染
async function fetchData(dataID) {
    const token = localStorage.getItem('token'); // 获取JWT Token

    if (!token) {               // 确保用户已登录
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    if (typeof dataID === 'undefined' || isNaN(dataID)) {
        console.error("fetchData 调用失败：无效的 dataID");
        return;
    }
    // 如果没有token，直接返回并跳转到登录页面
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    try {
        // 发送 GET 请求获取指定 dataID 的数据
        const response = await fetch(`/api/data/${dataID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // 根据返回的状态码进行处理
        if (response.ok) {
            const data = await response.json(); // 获取数据
            renderDataList([data]); // 渲染数据列表，这里假设只返回一个数据项
        } else if (response.status === 404) {
            alert("数据未找到");
        } else if (response.status === 403) {
            alert("没有权限访问该数据");
        } else {
            alert("获取数据失败");
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert("网络错误，请稍后重试");
    }
}

// 获取所有数据并渲染
async function fetchAllData() {
    const token = localStorage.getItem('token'); // 确保用户已登录
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    try {
        const response = await fetch('/api/data/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const allData = await response.json(); // 获取所有数据
            renderDataList(allData); // 渲染数据列表
        } else {
            alert("获取数据失败");
        }
    } catch (error) {
        console.error("Error fetching all data:", error);
        alert("网络错误，请稍后重试");
    }
}

// 渲染数据列表
function renderDataList(data) {
    const dataTableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    dataTableBody.innerHTML = ''; // 清空当前表格

    data.forEach(item => {
        const row = dataTableBody.insertRow();
        row.innerHTML = `
            <td>${item.dataID}</td>
            <td>${item.dataName}</td>
            <td>${item.CreatedAt}</td>
            <td>${item.UpdatedAt}</td>
            <td>
                <button onclick="editData('${item.dataID}', '${item.dataName}', '${item.dataContent}')">编辑</button>
                <button class="delete" onclick="deleteData('${item.dataID}')">删除</button>
            </td>
        `;
    });
}


//编辑按钮
function editData(dataID, dataName, dataContent) {
    document.getElementById('editDataID').value = dataID;
    document.getElementById('editName').value = dataName;
    document.getElementById('editContent').value = dataContent;
    document.getElementById('editModal').classList.add('open');
}

//关闭弹窗
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('editModal').classList.remove('open');
});

//提交编辑后的数据
document.getElementById('editForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const dataID = document.getElementById('editDataID').value;
    const dataName = document.getElementById('editName').value;
    const dataContent = document.getElementById('editContent').value;


    const token = localStorage.getItem('token');
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    try {
        const response = await fetch(`/api/data/${dataID}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dataID, dataName, dataContent, CreatedAt, UpdatedAt})
        });

        if (response.ok) {
            alert("修改成功");
            document.getElementById('editModal').classList.remove('open');
            fetchAllData(); // 重新加载数据
        } else {
            alert("修改失败");
        }
    } catch (error) {
        console.error("Error updating data:", error);
        alert("网络错误，请稍后重试");
    }
});


// 上传数据，包括可选的文件
document.getElementById('dataForm').addEventListener('submit', async event => {
    event.preventDefault();

    const dataName = document.getElementById('name').value;
    const dataContent = document.getElementById('content').value;

    // 检查是否有内容或文件，确保至少满足一个条件
    if (!dataContent && !selectedFile) {
        alert("请提供文字内容或选择文件进行上传");
        return;
    }

    let fileContent = null;
    if (selectedFile) {
        fileContent = await selectedFile.text();
    }

    const dataToSend = {
        dataName,
        dataContent: dataContent || fileContent,
        fileContent: fileContent || null
    };

    // 发送 POST 请求上传数据
    const token = localStorage.getItem('token');//获取token
    fetch('/api/data/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(() => {
        fetchAllData();     // 重新获取数据
        renderDataList();   // 刷新数据列表
        document.getElementById('dataForm').reset(); // 重置表单
        resetFileUpload();  // 重置文件上传区域
    })
    .catch(error => console.error('Error uploading data:', error));
});

// 删除指定数据
async function deleteData(dataID) {
    const token = localStorage.getItem('token'); // 获取JWT Token
    if (!token) {
        alert("请先登录");
        window.location.href = "/index.html";
        return;
    }

    if (!dataID) {
        alert("无效的ID");
        return;
    }

    try {
        const response = await fetch(`/api/data/${dataID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("删除成功");
            await fetchAllData(); // 重新加载数据
        } else if (response.status === 404) {
            alert("未找到该数据");
        } else {
            alert("删除失败");
        }
    } catch (error) {
        console.error("Error deleting data:", error);
        alert("网络错误，请稍后重试");
    }
}


// 处理文件拖拽事件
fileDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    fileDropArea.classList.add('dragover');
});

fileDropArea.addEventListener('dragleave', () => {
    fileDropArea.classList.remove('dragover');
});

fileDropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    fileDropArea.classList.remove('dragover');

    selectedFile = event.dataTransfer.files[0];
    displaySelectedFile();
});

// 点击文件框选择文件
fileDropArea.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = ".txt,.json";
    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
            selectedFile = fileInput.files[0];
            displaySelectedFile();
        }
    };
    fileInput.click();
});

// 显示已选文件和“×”号
function displaySelectedFile() {
    fileMessage.innerHTML = `已选择文件: ${selectedFile.name} <span class="file-remove" onclick="removeSelectedFile()">×</span>`;
}

// 移除选择的文件
function removeSelectedFile() {
    selectedFile = null;
    fileMessage.textContent = "点击选择文件，或将文件拖拽到此处";
}

// 重置文件上传区域
function resetFileUpload() {
    selectedFile = null;
    fileMessage.textContent = "点击选择文件，或将文件拖拽到此处";
}

// 导出数据
document.getElementById('exportButton').addEventListener('click', () => {
    const format = document.getElementById('exportFormat').value;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (format === 'json') {
                exportToJson(data);
            } else if (format === 'csv') {
                exportToCsv(data);
            }
        })
        .catch(error => console.error('Error fetching data for export:', error));
});

// 导出为 JSON
function exportToJson(data) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url); // 释放 Blob 对象
}

// 导出为 CSV
function exportToCsv(data) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(',')); // 添加表头

    for (const row of data) {
        csvRows.push(headers.map(field => JSON.stringify(row[field], replacer)).join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url); // 释放 Blob 对象
}

// JSON.stringify 的自定义替换函数
function replacer(key, value) {
    if (typeof value === 'string') {
        return value.replace(/"/g, '""'); // 替换引号以便于 CSV
    }
    return value;
}

// 初始化数据列表
//fetchData();
