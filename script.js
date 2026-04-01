const USE_BACKEND_TOGGLE = document.getElementById('useBackendToggle');
const STUDENT_FORM = document.getElementById('studentForm');
const STUDENTS_TABLE_BODY = document.querySelector('#studentsTable tbody');
const CLEAR_BUTTON = document.getElementById('clearBtn');
const SAVE_BUTTON = document.getElementById('saveBtn');
const EXPORT_BUTTON = document.getElementById('exportBtn');
const SEARCH_INPUT = document.getElementById('search');
const SORT_SELECT = document.getElementById('sortSelect');

let students = [];
let isEditing = false;
let currentStudentId = null;

const API_URL = 'api/';

async function apiCall(endpoint, method = 'GET', data = null) {
    if (!USE_BACKEND_TOGGLE.checked) {
        return { success: false, message: 'Backend disabled.' };
    }

    const url = API_URL + endpoint;
    const options = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            // محاولة قراءة رسالة الخطأ من الخادم حتى لو كان هناك HTTP 500
            const text = await response.text();
            let errorMessage = text || `HTTP error! status: ${response.status}`;
            try {
                const errorJson = JSON.parse(text);
                errorMessage = errorJson.message || errorMessage;
            } catch(e) {
                // ليس JSON، نستخدم النص العادي
            }
            throw new Error(errorMessage);
        }
        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };
    } catch (e) {
        alert('Backend Error: Could not connect or process request. Check XAMPP/WAMP, API path, or server logs. Message: ' + e.message);
        console.error('API Call Failed:', e);
        return { success: false, message: e.message || 'Backend connection failed.' };
    }
}

async function loadStudents() {
    if (USE_BACKEND_TOGGLE.checked) {
        const response = await apiCall('read.php', 'GET');
        if (response && response.success && Array.isArray(response.data)) {
            students = response.data;
        } else {
            // في حالة فشل الاتصال بالخلفية، نرجع للبيانات المحلية
            const stored = localStorage.getItem('studentsData');
            students = stored ? JSON.parse(stored) : [];
        }
    } else {
        const stored = localStorage.getItem('studentsData');
        students = stored ? JSON.parse(stored) : [];
    }
    renderStudents();
}

function saveLocalStudents() {
    if (!USE_BACKEND_TOGGLE.checked) {
        localStorage.setItem('studentsData', JSON.stringify(students));
    }
}

function resetForm() {
    STUDENT_FORM.reset();
    isEditing = false;
    currentStudentId = null;
    SAVE_BUTTON.textContent = 'Save';
    CLEAR_BUTTON.textContent = 'Clear';
}

STUDENT_FORM.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!STUDENT_FORM.checkValidity()) {
        STUDENT_FORM.reportValidity();
        return;
    }

    // تجميع البيانات الأساسية (بدون ID عند الإضافة)
    const newStudentData = {
        name: document.getElementById('name').value.trim(),
        roll: document.getElementById('roll').value.trim(),
        dept: document.getElementById('dept').value.trim(),
        gpa: parseFloat(document.getElementById('gpa').value) || 0,
    };

    let apiResponse = { success: true };

    if (isEditing) {
        // عند التعديل، يجب تمرير ID
        newStudentData.id = currentStudentId; 
        
        const index = students.findIndex(s => s.id == currentStudentId); 
        if (index > -1) {
            
            if (USE_BACKEND_TOGGLE.checked) {
                apiResponse = await apiCall('update.php', 'PUT', newStudentData);
            }
            // التحديث في المصفوفة المحلية يتم فقط إذا نجح اتصال الـ API أو كنا في الوضع المحلي
            if (apiResponse.success || !USE_BACKEND_TOGGLE.checked) {
                 students[index] = newStudentData;
            }
        }
    } else {
        // عند الإضافة (CREATE)
        if (USE_BACKEND_TOGGLE.checked) {
            // إرسال البيانات بدون ID
            apiResponse = await apiCall('create.php', 'POST', newStudentData);
            
            if (apiResponse.success && apiResponse.data && apiResponse.data.id) {
                // استخدام الـ ID الذي رجع من الخادم
                newStudentData.id = apiResponse.data.id; 
            } else if (!apiResponse.success) {
                // فشل في الـ API، لا يجب إضافة البيانات
                return;
            }
            
        } else {
            // الحالة المحلية تحتاج ID فريد (استخدام Date.now() للتخزين المحلي)
            newStudentData.id = Date.now(); 
        }
        
        // إذا نجحت عملية الإرسال أو كنا في الوضع المحلي، نُضيفها
        if (apiResponse.success || !USE_BACKEND_TOGGLE.checked) {
            students.push(newStudentData);
        }
    }

    if (apiResponse.success || !USE_BACKEND_TOGGLE.checked) {
        saveLocalStudents();
        resetForm();
        renderStudents();
    } else {
        alert(`Operation failed. Server message: ${apiResponse.message || 'Unknown Error'}. See console for details.`);
    }
});

function editStudent(studentId) {
    const studentToEdit = students.find(s => s.id == studentId);
    if (!studentToEdit) return;

    document.getElementById('name').value = studentToEdit.name;
    document.getElementById('roll').value = studentToEdit.roll;
    document.getElementById('dept').value = studentToEdit.dept;
    document.getElementById('gpa').value = studentToEdit.gpa;

    isEditing = true;
    currentStudentId = studentId;
    SAVE_BUTTON.textContent = 'Update';
    CLEAR_BUTTON.textContent = 'Cancel Edit';
}

async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    let apiResponse = { success: true };

    if (USE_BACKEND_TOGGLE.checked) {
        // نرسل ID الحذف فقط
        apiResponse = await apiCall('delete.php', 'DELETE', { id: studentId });
    }

    if (apiResponse.success || !USE_BACKEND_TOGGLE.checked) {
        students = students.filter(s => s.id != studentId);
        saveLocalStudents();
        renderStudents();
    } else {
        alert("Deletion failed. See console for details.");
    }
}

function renderStudents() {
    const searchQuery = SEARCH_INPUT.value.toLowerCase().trim();
    let filteredStudents = students.filter(student => {
        return String(student.name).toLowerCase().includes(searchQuery) ||
               String(student.roll).includes(searchQuery);
    });

    const sortBy = SORT_SELECT.value;
    if (sortBy) {
        filteredStudents.sort((a, b) => {
            const valA = isNaN(a[sortBy]) ? String(a[sortBy]).toLowerCase() : a[sortBy];
            const valB = isNaN(b[sortBy]) ? String(b[sortBy]).toLowerCase() : b[sortBy];
            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
        });
    }

    STUDENTS_TABLE_BODY.innerHTML = '';

    filteredStudents.forEach((student, index) => {
        // يجب تحويل الـ ID إلى String لأن البيانات القادمة من PHP تكون String أحياناً
        const studentId = String(student.id); 
        
        const row = STUDENTS_TABLE_BODY.insertRow();
        row.insertCell().textContent = index + 1;
        row.insertCell().textContent = student.name;
        row.insertCell().textContent = student.roll;
        row.insertCell().textContent = student.dept;
        row.insertCell().textContent = Number(student.gpa).toFixed(2);

        const actionsCell = row.insertCell();

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'small';
        // تمرير studentId
        editButton.onclick = () => editStudent(studentId); 

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'small';
        deleteButton.style.background = '#dc3545';
        // تمرير studentId
        deleteButton.onclick = () => deleteStudent(studentId); 

        actionsCell.append(editButton, deleteButton);
    });
}

document.addEventListener('DOMContentLoaded', loadStudents);

SEARCH_INPUT.addEventListener('input', renderStudents);
SORT_SELECT.addEventListener('change', renderStudents);

USE_BACKEND_TOGGLE.addEventListener('change', function() {
    loadStudents();
});

CLEAR_BUTTON.addEventListener('click', function() {
    if (isEditing) {
        resetForm();
    } else {
        STUDENT_FORM.reset();
    }
});

EXPORT_BUTTON.addEventListener('click', function() {
    let csvContent = "Name,ID,Department,GPA\n";
    students.forEach(student => {
        csvContent += `${student.name},${student.roll},${student.dept},${student.gpa}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "students_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// هذا الجزء يضمن وجود بيانات مبدئية في التخزين المحلي إذا لم تكن موجودة
if (!localStorage.getItem('studentsData')) {
    students = [
        { id: 1, name: 'Mohammed Ali', roll: '1001', dept: 'CS', gpa: 3.5 },
        { id: 2, name: 'Fatima Ahmed', roll: '1002', dept: 'IT', gpa: 3.8 }
    ];
    saveLocalStudents();
}