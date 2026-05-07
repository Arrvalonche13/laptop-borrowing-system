// =========================================
// Firebase Configuration
// =========================================
// แทนค่าเหล่านี้ด้วยค่าจาก Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAdsomgEimu1y34eu_ubPd0fOYW5F1lzYg",
  authDomain: "laptop-borrowing-system-e8a4e.firebaseapp.com",
  databaseURL: "https://laptop-borrowing-system-e8a4e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "laptop-borrowing-system-e8a4e",
  storageBucket: "laptop-borrowing-system-e8a4e.firebasestorage.app",
  messagingSenderId: "794986308404",
  appId: "1:794986308404:web:2f32d61c85cd920034bb61",
  measurementId: "G-ZRBDR0DN8L"
};

// =========================================
// EmailJS Configuration
// =========================================
const EMAILJS_PUBLIC_KEY = 'mwvgufG3CgQA-lI8T';
const EMAILJS_SERVICE_ID = 'service_vr051ds';
const EMAILJS_TEMPLATE_BORROWER = 'template_kmslfjd';
const EMAILJS_TEMPLATE_APPROVER = 'template_bbdq96i';

// URL ของระบบ
const SYSTEM_URL = 'https://arrvalonche13.github.io/laptop-borrowing-system/';

// =========================================
// Initialize Firebase
// =========================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, push, onValue, update, remove } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// เริ่มต้น EmailJS
(function() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

// =========================================
// Global Variables
// =========================================
let computers = [];
let permissions = {
    approver: '',
    admin: 'suttipong.p@psu.ac.th',
    assistantAdmin: ''
};
let logs = [];
let currentUser = null;

// =========================================
// Firebase Real-time Listeners
// =========================================

// Listen to computers changes
const computersRef = ref(database, 'computers');
onValue(computersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        computers = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));
    } else {
        // Initialize default computers if none exist
        initializeComputers();
    }
    displayComputers();
    updateComputerDropdown();
    updateManagementGrid();
});

// Listen to permissions changes
const permissionsRef = ref(database, 'permissions');
onValue(permissionsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        permissions = data;
        if (document.getElementById('approverEmail')) {
            document.getElementById('approverEmail').value = permissions.approver || '';
        }
        if (document.getElementById('assistantAdminEmail')) {
            document.getElementById('assistantAdminEmail').value = permissions.assistantAdmin || '';
        }
    }
});

// Listen to logs changes
const logsRef = ref(database, 'logs');
onValue(logsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        logs = Object.keys(data).map(key => ({
            logId: key,
            ...data[key]
        }));
    } else {
        logs = [];
    }
    updateLogsTable();
});

// =========================================
// Initialization Functions
// =========================================

function initializeSystem() {
    setMinDates();
    checkLogin();
}

async function initializeComputers() {
    const defaultComputers = {};
    for (let i = 1; i <= 15; i++) {
        const id = `VET ${i.toString().padStart(2, '0')}`;
        defaultComputers[id] = {
            status: 'available',
            dueDate: null,
            borrower: null,
            note: ''
        };
    }
    
    try {
        await set(computersRef, defaultComputers);
    } catch (error) {
        console.error('Error initializing computers:', error);
    }
}

// =========================================
// Display Functions
// =========================================

function displayComputers() {
    const grid = document.getElementById('computers-grid');
    if (!grid) return;
    
    grid.innerHTML = '';

    let availableCount = 0;
    let borrowedCount = 0;
    let maintenanceCount = 0;

    computers.forEach((computer) => {
        const card = document.createElement('div');
        card.className = `computer-card ${computer.status}`;

        let statusText = '';
        let statusClass = '';

        if (computer.status === 'available') {
            statusText = 'ว่าง';
            statusClass = 'available';
            availableCount++;
        } else if (computer.status === 'borrowed') {
            statusText = 'ไม่ว่าง';
            statusClass = 'borrowed';
            borrowedCount++;
        } else {
            statusText = 'ชำรุด/รอซ่อม';
            statusClass = 'maintenance';
            maintenanceCount++;
        }

        let dueDateHTML = '';
        if (computer.status === 'borrowed' && computer.dueDate) {
            const dueDate = new Date(computer.dueDate);
            const thaiDate = dueDate.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            dueDateHTML = `
                <div class="due-date">
                    <strong>📅 วันสิ้นสุดการยืม:</strong>
                    <div class="date">${thaiDate}</div>
                </div>
            `;

            if (computer.borrower) {
                dueDateHTML += `<div class="borrower-info">👤 ${computer.borrower}</div>`;
            }
        }

        card.innerHTML = `
            <div class="computer-id">
                <span class="icon">💻</span>
                <span>${computer.id}</span>
            </div>
            <span class="status-badge ${statusClass}">${statusText}</span>
            ${dueDateHTML}
        `;

        if (computer.status === 'available') {
            card.onclick = () => selectComputerForBooking(computer.id);
        }

        grid.appendChild(card);
    });

    document.getElementById('count-available').textContent = availableCount;
    document.getElementById('count-borrowed').textContent = borrowedCount;
    document.getElementById('count-maintenance').textContent = maintenanceCount;
}

function selectComputerForBooking(computerId) {
    showPage('booking');
    document.getElementById('computerId').value = computerId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateComputerDropdown() {
    const select = document.getElementById('computerId');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- เลือกคอมพิวเตอร์ --</option>';

    computers.forEach(computer => {
        if (computer.status === 'available') {
            const option = document.createElement('option');
            option.value = computer.id;
            option.textContent = computer.id;
            select.appendChild(option);
        }
    });
}

function updateManagementGrid() {
    const grid = document.getElementById('management-grid');
    if (!grid) return;
    
    grid.innerHTML = '';

    computers.forEach((computer) => {
        const card = document.createElement('div');
        card.className = 'management-card';
        card.innerHTML = `
            <h4>💻 ${computer.id}</h4>
            <div class="inline-form">
                <div class="form-group">
                    <label>สถานะ</label>
                    <select id="status-${computer.id}" onchange="updateComputerStatus('${computer.id}')">
                        <option value="available" ${computer.status === 'available' ? 'selected' : ''}>ว่าง</option>
                        <option value="borrowed" ${computer.status === 'borrowed' ? 'selected' : ''}>ไม่ว่าง</option>
                        <option value="maintenance" ${computer.status === 'maintenance' ? 'selected' : ''}>ชำรุด/รอซ่อม</option>
                    </select>
                </div>
                <div class="form-group" id="duedate-group-${computer.id}" style="display: ${computer.status === 'borrowed' ? 'block' : 'none'};">
                    <label>วันสิ้นสุดการยืม</label>
                    <input type="date" id="duedate-${computer.id}" value="${computer.dueDate || ''}">
                </div>
            </div>
            <div class="form-group">
                <label>ชื่อผู้ยืม</label>
                <input type="text" id="borrower-${computer.id}" value="${computer.borrower || ''}" ${computer.status !== 'borrowed' ? 'disabled' : ''}>
            </div>
            <div class="form-group">
                <label>หมายเหตุ</label>
                <textarea id="note-${computer.id}" style="min-height: 60px;">${computer.note || ''}</textarea>
            </div>
            <button class="btn-save" onclick="saveComputerChanges('${computer.id}')">💾 บันทึก</button>
        `;
        grid.appendChild(card);
    });
}

window.updateComputerStatus = function(computerId) {
    const status = document.getElementById(`status-${computerId}`).value;
    const duedateGroup = document.getElementById(`duedate-group-${computerId}`);
    const borrowerInput = document.getElementById(`borrower-${computerId}`);
    
    if (status === 'borrowed') {
        duedateGroup.style.display = 'block';
        borrowerInput.disabled = false;
    } else {
        duedateGroup.style.display = 'none';
        borrowerInput.disabled = true;
    }
};

window.saveComputerChanges = async function(computerId) {
    const status = document.getElementById(`status-${computerId}`).value;
    const dueDate = document.getElementById(`duedate-${computerId}`).value;
    const borrower = document.getElementById(`borrower-${computerId}`).value;
    const note = document.getElementById(`note-${computerId}`).value;

    const computerRef = ref(database, `computers/${computerId}`);
    
    try {
        await update(computerRef, {
            status: status,
            dueDate: status === 'borrowed' ? dueDate : null,
            borrower: status === 'borrowed' ? borrower : null,
            note: note
        });
        
        alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
        console.error('Error updating computer:', error);
        alert('❌ เกิดข้อผิดพลาดในการบันทึก');
    }
};

function updateLogsTable() {
    const tbody = document.getElementById('logs-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 30px; color: #a0aec0;">ยังไม่มีข้อมูล Log</td></tr>';
        return;
    }

    const sortedLogs = [...logs].sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

    sortedLogs.forEach((log) => {
        const tr = document.createElement('tr');
        
        const requestDate = new Date(log.requestDate).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let statusClass = 'status-pending';
        let statusText = 'รอการอนุมัติ';
        let actionButtons = '';
        
        if (log.status === 'approved') {
            statusClass = 'status-approved';
            statusText = 'อนุมัติ';
        } else if (log.status === 'rejected') {
            statusClass = 'status-rejected';
            statusText = 'ไม่อนุมัติ';
        } else if (log.status === 'pending' && currentUser) {
            actionButtons = `
                <button class="btn-save" onclick="approveRequest('${log.logId}')" style="background: #10b981; margin-right: 5px;">✅ อนุมัติ</button>
                <button class="btn-save" onclick="rejectRequest('${log.logId}')" style="background: #ef4444;">❌ ไม่อนุมัติ</button>
            `;
        }

        tr.innerHTML = `
            <td>${requestDate}</td>
            <td>${log.borrowerName}</td>
            <td>${log.computerId}</td>
            <td>${new Date(log.startDate).toLocaleDateString('th-TH')}</td>
            <td>${new Date(log.endDate).toLocaleDateString('th-TH')}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>${log.approverName || '-'}</td>
            <td>${log.approvalDate ? new Date(log.approvalDate).toLocaleDateString('th-TH') : '-'}</td>
            <td>${actionButtons}</td>
        `;
        tbody.appendChild(tr);
    });
}

// =========================================
// Form Functions
// =========================================

window.updateBorrowerTypeField = function() {
    const type = document.getElementById('borrowerType').value;
    const studentIdGroup = document.getElementById('studentIdGroup');
    const departmentGroup = document.getElementById('departmentGroup');
    const studentIdInput = document.getElementById('studentId');
    const departmentInput = document.getElementById('department');

    if (type === 'student') {
        studentIdGroup.style.display = 'block';
        departmentGroup.style.display = 'none';
        studentIdInput.required = true;
        departmentInput.required = false;
    } else if (type === 'staff' || type === 'teacher') {
        studentIdGroup.style.display = 'none';
        departmentGroup.style.display = 'block';
        studentIdInput.required = false;
        departmentInput.required = true;
    } else {
        studentIdGroup.style.display = 'none';
        departmentGroup.style.display = 'none';
        studentIdInput.required = false;
        departmentInput.required = false;
    }
};

window.validateDates = function() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) return true;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minStart = new Date(today);
    minStart.setDate(minStart.getDate() + 3);

    if (start < minStart) {
        showAlert('bookingAlert', 'error', '❌ กรุณายืมล่วงหน้าอย่างน้อย 3 วัน');
        document.getElementById('startDate').value = '';
        return false;
    }

    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (daysDiff > 14 || daysDiff < 0) {
        showAlert('bookingAlert', 'error', '❌ ระยะเวลายืมต้องไม่เกิน 14 วัน และวันคืนต้องหลังวันเริ่มยืม');
        document.getElementById('endDate').value = '';
        return false;
    }

    return true;
};

window.submitBooking = async function(event) {
    event.preventDefault();

    if (!validateDates()) {
        return;
    }

    if (!permissions.approver) {
        showAlert('bookingAlert', 'error', '❌ กรุณาตั้งค่าอีเมลผู้อนุมัติในหน้าการจัดการสิทธิ์ก่อน');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner"></div> กำลังส่งคำขอ...';

    const formData = {
        borrowerName: document.getElementById('borrowerName').value,
        computerId: document.getElementById('computerId').value,
        borrowerType: document.getElementById('borrowerType').value,
        studentId: document.getElementById('studentId').value,
        department: document.getElementById('department').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        borrowerEmail: document.getElementById('borrowerEmail').value,
        purpose: document.getElementById('purpose').value,
        requestDate: new Date().toISOString(),
        status: 'pending'
    };

    try {
        // บันทึกลง Firebase
        await push(logsRef, formData);
        
        // ส่งอีเมล
        await sendEmailToBorrower(formData);
        await sendEmailToApprover(formData);

        showAlert('bookingAlert', 'success', '✅ ส่งคำขอยืมคอมพิวเตอร์เรียบร้อยแล้ว! ระบบได้ส่งอีเมลยืนยันไปที่ ' + formData.borrowerEmail);

        document.getElementById('bookingForm').reset();
        updateBorrowerTypeField();
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error submitting booking:', error);
        showAlert('bookingAlert', 'error', '❌ เกิดข้อผิดพลาด: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '✅ ยืนยันส่งคำขอยืมคอมพิวเตอร์';
    }
};

window.approveRequest = async function(logId) {
    const log = logs.find(l => l.logId === logId);
    if (!log) return;
    
    const logRef = ref(database, `logs/${logId}`);
    const computerRef = ref(database, `computers/${log.computerId}`);
    
    try {
        await update(logRef, {
            status: 'approved',
            approverName: currentUser,
            approvalDate: new Date().toISOString()
        });
        
        await update(computerRef, {
            status: 'borrowed',
            dueDate: log.endDate,
            borrower: log.borrowerName
        });
        
        await sendApprovalResultEmail({...log, status: 'approved', approverName: currentUser, approvalDate: new Date().toISOString()}, true);
        
        alert('✅ อนุมัติคำขอเรียบร้อยแล้ว!');
    } catch (error) {
        console.error('Error approving request:', error);
        alert('❌ เกิดข้อผิดพลาด');
    }
};

window.rejectRequest = async function(logId) {
    const log = logs.find(l => l.logId === logId);
    if (!log) return;
    
    const reason = prompt('กรุณาระบุเหตุผลที่ไม่อนุมัติ (ถ้ามี):');
    
    const logRef = ref(database, `logs/${logId}`);
    
    try {
        await update(logRef, {
            status: 'rejected',
            approverName: currentUser,
            approvalDate: new Date().toISOString(),
            rejectionReason: reason || ''
        });
        
        await sendApprovalResultEmail({...log, status: 'rejected', approverName: currentUser, approvalDate: new Date().toISOString(), rejectionReason: reason}, false);
        
        alert('❌ ไม่อนุมัติคำขอเรียบร้อยแล้ว!');
    } catch (error) {
        console.error('Error rejecting request:', error);
        alert('❌ เกิดข้อผิดพลาด');
    }
};

window.savePermissions = async function() {
    permissions.approver = document.getElementById('approverEmail').value;
    permissions.assistantAdmin = document.getElementById('assistantAdminEmail').value;
    
    try {
        await set(permissionsRef, permissions);
        alert('✅ บันทึกการตั้งค่าสิทธิ์เรียบร้อยแล้ว');
    } catch (error) {
        console.error('Error saving permissions:', error);
        alert('❌ เกิดข้อผิดพลาดในการบันทึก');
    }
};

// =========================================
// Email Functions
// =========================================

async function sendEmailToBorrower(formData) {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7fafc;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #667eea; text-align: center;">✅ ยืนยันการส่งคำขอยืมคอมพิวเตอร์</h2>
            <p>เรียน คุณ${formData.borrowerName}</p>
            <p>ระบบได้รับคำขอยืมคอมพิวเตอร์ของท่านเรียบร้อยแล้ว</p>
            <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>📋 รายละเอียดการยืม</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0;"><strong>รหัสคอมพิวเตอร์:</strong> ${formData.computerId}</li>
                    <li style="padding: 8px 0;"><strong>วันที่เริ่มยืม:</strong> ${formatDateThai(formData.startDate)}</li>
                    <li style="padding: 8px 0;"><strong>วันที่คืน:</strong> ${formatDateThai(formData.endDate)}</li>
                </ul>
            </div>
        </div>
    </div>
    `;
    
    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_BORROWER, {
        to_email: formData.borrowerEmail,
        borrower_name: formData.borrowerName,
        computer_id: formData.computerId,
        purpose: htmlContent
    });
}

async function sendEmailToApprover(formData) {
    const approvalLink = `${SYSTEM_URL}#approve`;
    
    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_APPROVER, {
        to_email: permissions.approver,
        borrower_name: formData.borrowerName,
        borrower_email: formData.borrowerEmail,
        computer_id: formData.computerId,
        start_date: formatDateThai(formData.startDate),
        end_date: formatDateThai(formData.endDate),
        purpose: formData.purpose,
        borrower_type: getStatusText(formData.borrowerType),
        student_id: formData.studentId || '-',
        department: formData.department || '-',
        request_date: formatDateTimeThai(formData.requestDate),
        approval_link: approvalLink
    });
}

async function sendApprovalResultEmail(log, isApproved) {
    const statusColor = isApproved ? '#10b981' : '#ef4444';
    const bgColor = isApproved ? '#d1fae5' : '#fee2e2';
    
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7fafc;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: ${statusColor}; text-align: center;">
                ${isApproved ? '✅' : '❌'} ผลการพิจารณาคำขอยืมคอมพิวเตอร์
            </h2>
            <div style="background: ${bgColor}; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="font-size: 18px; font-weight: bold; text-align: center; margin: 0;">
                    คำขอของคุณได้รับการ${isApproved ? 'อนุมัติ' : 'ไม่อนุมัติ'}
                </p>
            </div>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px;">
                <h3>📋 รายละเอียดคำขอ</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0;"><strong>ผู้ยืม:</strong> ${log.borrowerName}</li>
                    <li style="padding: 8px 0;"><strong>รหัสคอมพิวเตอร์:</strong> ${log.computerId}</li>
                    <li style="padding: 8px 0;"><strong>ผู้พิจารณา:</strong> ${log.approverName}</li>
                </ul>
            </div>
        </div>
    </div>
    `;
    
    // ส่งให้ผู้ยืม
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_BORROWER, {
        to_email: log.borrowerEmail,
        borrower_name: log.borrowerName,
        computer_id: log.computerId,
        purpose: htmlContent
    });
    
    // ส่งสำเนาให้ผู้ดูแลระบบ
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_BORROWER, {
        to_email: permissions.admin,
        borrower_name: log.borrowerName,
        computer_id: log.computerId,
        purpose: htmlContent
    });
}

// =========================================
// Utility Functions
// =========================================

function formatDateThai(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTimeThai(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showAlert(elementId, type, message) {
    const alertDiv = document.getElementById(elementId);
    if (alertDiv) {
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        alertDiv.style.display = 'block';
        
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

function getStatusText(type) {
    const statusMap = {
        'student': 'นักศึกษา',
        'teacher': 'อาจารย์',
        'staff': 'บุคลากร',
        'available': 'ว่าง',
        'borrowed': 'ไม่ว่าง',
        'maintenance': 'ชำรุด/รอซ่อม',
        'pending': 'รอการอนุมัติ',
        'approved': 'อนุมัติ',
        'rejected': 'ไม่อนุมัติ'
    };
    return statusMap[type] || type;
}

function setMinDates() {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 3);

    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        startDateInput.min = minDate.toISOString().split('T')[0];
    }
}

// =========================================
// Navigation Functions
// =========================================

window.showPage = function(pageName) {
    if ((pageName === 'permission' || pageName === 'management' || pageName === 'logs') && !currentUser) {
        showLoginModal();
        return;
    }

    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    document.getElementById(`page-${pageName}`).classList.add('active');

    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
};

// =========================================
// Login Functions
// =========================================

function showLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

window.closeLoginModal = function() {
    document.getElementById('loginModal').classList.remove('show');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
};

window.login = function(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (password !== '123456789') {
        alert('❌ รหัสผ่านไม่ถูกต้อง');
        return;
    }

    const allowedEmails = [permissions.admin, permissions.approver, permissions.assistantAdmin].filter(e => e);

    if (allowedEmails.includes(email)) {
        currentUser = email;
        checkLogin();
        closeLoginModal();
        updateLogsTable();
        alert('✅ เข้าสู่ระบบสำเร็จ!');
    } else {
        alert('❌ คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
    }
};

window.logout = function() {
    currentUser = null;
    checkLogin();
    showPage('status');
    alert('✅ ออกจากระบบเรียบร้อยแล้ว');
};

function checkLogin() {
    const tabPermission = document.getElementById('tabPermission');
    const tabManagement = document.getElementById('tabManagement');
    const tabLogs = document.getElementById('tabLogs');
    const userInfo = document.getElementById('userInfo');

    if (currentUser) {
        tabPermission.classList.remove('disabled');
        tabManagement.classList.remove('disabled');
        tabLogs.classList.remove('disabled');
        userInfo.style.display = 'block';
        document.getElementById('userEmail').textContent = currentUser;
    } else {
        tabPermission.classList.add('disabled');
        tabManagement.classList.add('disabled');
        tabLogs.classList.add('disabled');
        userInfo.style.display = 'none';
    }
}

// =========================================
// Initialize on Page Load
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
});