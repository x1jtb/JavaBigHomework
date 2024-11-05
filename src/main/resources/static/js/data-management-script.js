const apiUrl = 'http://localhost:3000/data'; // 替换为实际的后端API URL
const fileDropArea = document.getElementById('fileDropArea');
const fileMessage = document.getElementById('fileMessage');
let selectedFile = null;

// 获取数据列表并渲染
function fetchData() {
    // 这里使用假数据测试
    const dummyData = [
        { id: 1, name: '示例文件1.txt', content: 'huamgjiaxi6666' },
        { id: 2, name: '示例文件2.txt', content: 'xljtb' },
    ];
    renderDataList(dummyData);
}

// 渲染数据列表
function renderDataList(data) {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';

    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name}: ${item.content}</span>
            <div class="actions">
                <button onclick="editData('${item.id}', '${item.name}', '${item.content}')">编辑</button>
                <button class="delete" onclick="deleteData('${item.id}')">删除</button>
            </div>
        `;
        dataList.appendChild(li);
    });
}

// 上传数据，包括可选的文件
document.getElementById('dataForm').addEventListener('submit', async event => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const content = document.getElementById('content').value;

    // 检查是否有内容或文件，确保至少满足一个条件
    if (!content && !selectedFile) {
        alert("请提供文字内容或选择文件进行上传");
        return;
    }

    let fileContent = null;
    if (selectedFile) {
        fileContent = await selectedFile.text();
    }

    const dataToSend = {
        name,
        content: content || fileContent,
        fileContent: fileContent || null
    };

    // 发送 POST 请求上传数据
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(() => {
        fetchData(); // 刷新数据列表
        document.getElementById('dataForm').reset(); // 重置表单
        resetFileUpload();  // 重置文件上传区域
    })
    .catch(error => console.error('Error uploading data:', error));
});

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
fetchData();
