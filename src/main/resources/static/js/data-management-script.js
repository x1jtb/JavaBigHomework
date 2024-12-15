const fileDropArea = document.getElementById('fileDropArea');
const fileMessage = document.getElementById('fileMessage');
let selectedFiles = []; // 初始化 selectedFiles 变量
let selectedData = []; // 存储选中的数据项


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

let allData = []; // 存储所有数据

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
            allData = await response.json(); // 获取所有数据
            renderDataList(allData); // 渲染数据列表
        } else {
            alert("获取数据失败");
        }
    } catch (error) {
        console.error("Error fetching all data:", error);
        alert("网络错误，请稍后重试");
    }
}

// 搜索数据
function searchData() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = allData.filter(data => {
        return (
            data.dataName.toLowerCase().includes(searchInput) ||
            (data.dataContent ? data.dataContent.toLowerCase().includes(searchInput) : false)
        );
    });
    renderDataList(filteredData);
}

document.getElementById('dataTable').addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-primary')) {
        const dataID = event.target.dataset.id;
        const dataName = event.target.dataset.name;
        const dataContent = event.target.dataset.content;
        const fileContent = event.target.dataset.filecontent;
        editData(dataID, dataName, dataContent, fileContent);
    }
});

// 渲染数据列表
function renderDataList(data) {
    const dataTableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    dataTableBody.innerHTML = '';

    let counter = 1;

    data.forEach(item => {
        // 格式化时间
        const createdAt = item.createdAt.replace('T', ' ');
        const updatedAt = item.updatedAt.replace('T', ' ');

        const row = dataTableBody.insertRow();
        row.innerHTML = `
            <td>${counter}</td>
            <td>${item.dataName}</td>
            <td>${createdAt}</td>
            <td>${updatedAt}</td>
            <td>
                <button data-id="${item.dataID}" data-name="${item.dataName}" data-content="${item.dataContent}" data-filecontent="${item.fileContent}" class="btn btn-primary">编辑</button>
                <button class="delete  btn btn-danger" onclick="deleteData('${item.dataID}')">删除</button>
            </td>
        `;

        row.addEventListener('click', () => {
            if (row.classList.contains('selected')) {
                row.classList.remove('selected');
                selectedData = selectedData.filter(d => d.dataID !== item.dataID);
            } else {
                row.classList.add('selected');
                selectedData.push(item);
            }
        });

        counter++;
    });
}

// 全选按钮点击事件
document.getElementById('selectAllButton').addEventListener('click', () => {
    const rows = document.querySelectorAll('#dataTable tbody tr');
    let allSelected = true; // 假设所有数据项都已被选中

    // 检查是否所有数据项都已被选中
    rows.forEach(row => {
        if (!row.classList.contains('selected')) {
            allSelected = false; // 如果有未选中的数据项，则设置为 false
        }
    });

    if (allSelected) {
        // 如果所有数据项都已被选中，则取消所有选中状态
        rows.forEach(row => {
            row.classList.remove('selected');
        });
        selectedData = []; // 清空选中的数据
    } else {
        // 如果未全部选中，则选中所有数据项
        rows.forEach(row => {
            if (!row.classList.contains('selected')) {
                row.classList.add('selected');
                const dataID = row.querySelector('button.delete').getAttribute('onclick').match(/'(\d+)'/)[1];
                const dataName = row.cells[1].textContent;
                const dataContent = row.cells[2].textContent;
                const createdAt = row.cells[3].textContent;
                const updatedAt = row.cells[4].textContent;
                selectedData.push({ dataID, dataName, dataContent, createdAt, updatedAt });
            }
        });
    }
});

// 编辑按钮
function editData(dataID, dataName, dataContent, fileContent) {
    document.getElementById('editDataID').value = dataID;
    document.getElementById('editName').value = dataName;
    document.getElementById('editContent').value = dataContent;
    document.getElementById('editFileContent').value = fileContent || '';

    const editFileInput = document.getElementById('editFile');
    const editFileContentTextarea = document.getElementById('editFileContent');

    if (fileContent) {
        editFileContentTextarea.style.display = 'block';
        editFileInput.style.display = 'none';
    } else {
        editFileContentTextarea.style.display = 'none';
        editFileInput.style.display = 'block';
    }

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
    const editFileInput = document.getElementById('editFile');
    let fileContent = null;

    if (editFileInput.files && editFileInput.files.length > 0) {
        fileContent = await editFileInput.files[0].text();
    } else {
        fileContent = document.getElementById('editFileContent').value;
    }

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
            body: JSON.stringify({ dataName, dataContent, fileContent })
        });

        if (response.ok) {
            alert("修改成功");
            document.getElementById('editModal').classList.remove('open');
            await fetchAllData(); // 重新加载数据
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
    if (!dataContent && selectedFiles.length === 0) {
        alert("请提供文字内容或选择文件进行上传");
        return;
    }

    const dataToSend = [];
    if (selectedFiles.length > 0) {
        for (let file of selectedFiles) {
            const fileContent = await file.text();
            dataToSend.push({
                dataName,
                dataContent: dataContent || fileContent,
                fileContent: fileContent || null,
                isFile: true
            });
        }
    } else {
        dataToSend.push({
            dataName,
            dataContent,
            isFile: false
        });
    }

    // 发送 POST 请求上传数据
    const token = localStorage.getItem('token'); // 获取token
    const uploadPromises = dataToSend.map(data =>
        fetch('/api/data/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    );

    await Promise.all(uploadPromises); // 等待所有上传完成

    await fetchAllData(); // 重新获取数据
    document.getElementById('dataForm').reset(); // 重置表单
    resetFileUpload();  // 重置文件上传区域
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
    selectedFiles = [...event.dataTransfer.files];
    displaySelectedFile();
});

// 点击文件框选择文件
fileDropArea.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = ".txt,.json";
    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
            selectedFiles = [...fileInput.files];
            displaySelectedFile();
        }
    };
    fileInput.click();
});

// 显示已选文件和“×”号
function displaySelectedFile() {
    let message = "已选择文件: ";
    selectedFiles.forEach((file, index) => {
        message += `${file.name} `;
    });
    message += `<span class="file-remove" onclick="removeSelectedFile()">×</span>`; // 修改为正确的函数名
    fileMessage.innerHTML = message;
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
    // 获取选择的导出格式
    const format = document.getElementById('exportFormat').value;

    // 判断是否有选中的数据
    if (selectedData.length > 0) {
        // 如果有选中的数据，则为每个选中的数据生成一个独立的文件
        selectedData.forEach(data => {
            const dataToExport = {
                dataName: data.dataName,
                dataContent: data.dataContent,
                fileContent: data.fileContent,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            };

            const fileName = data.dataName || 'data'; // 使用选中数据的 dataName 作为文件名，如果没有则使用默认的 'data'

            if (format === 'json') {
                exportToJson(dataToExport, fileName);
            } else if (format === 'csv') {
                exportToCsv(dataToExport, fileName);
            }
        });
    } else {
        // 如果没有选中的数据，则不执行导出操作
        alert("请先选择要导出的数据");
    }
});

// 导出为 JSON
function exportToJson(data, fileName) {
    const jsonString = JSON.stringify(data, null, 2); // 转为格式化的JSON字符串
    const blob = new Blob([jsonString], { type: 'application/json' }); // 创建一个Blob对象
    const url = URL.createObjectURL(blob); // 创建一个URL来下载Blob数据
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.json`; // 使用传入的 fileName 作为下载文件名
    a.click(); // 触发下载
    URL.revokeObjectURL(url); // 释放URL对象
}

// 导出为 CSV
function exportToCsv(data, fileName) {
    const csvRows = [];
    const headers = Object.keys(data); // 获取数据的键作为CSV的表头
    csvRows.push(headers.join(',')); // 添加表头

    // 将单个对象转换为 CSV 格式
    csvRows.push(headers.map(field => JSON.stringify(data[field], replacer)).join(',')); // 转换每个字段为CSV格式

    const csvString = csvRows.join('\n'); // 用换行符连接每一行
    const blob = new Blob([csvString], { type: 'text/csv' }); // 创建Blob对象
    const url = URL.createObjectURL(blob); // 创建一个URL来下载CSV数据
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`; // 使用传入的 fileName 作为下载文件名
    a.click(); // 触发下载
    URL.revokeObjectURL(url); // 释放URL对象
}

// JSON.stringify 的自定义替换函数，用于处理CSV中字符串字段
function replacer(key, value) {
    if (typeof value === 'string') {
        return value.replace(/"/g, '""'); // 替换引号以便于CSV格式
    }
    return value;
}


// 初始化数据列表
//fetchData();
