// ตั้งค่า EmailJS
// คุณต้องสมัคร EmailJS ที่ https://www.emailjs.com/
// และแทนค่าเหล่านี้ด้วยค่าจริงของคุณ
const EMAILJS_PUBLIC_KEY = 'mwvgufG3CgQA-lI8T'; // แทนด้วย Public Key ของคุณ
const EMAILJS_SERVICE_ID = 'service_vr051ds'; // แทนด้วย Service ID ของคุณ
const EMAILJS_TEMPLATE_BORROWER = 'template_kmslfjd'; // Template สำหรับผู้ยืม
const EMAILJS_TEMPLATE_APPROVER = 'template_bbdq96i'; // Template สำหรับผู้อนุมัติ

// เริ่มต้น EmailJS
(function() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

// ข้อมูลระบบ
let computers = [];
let permissions = {
    approver: '',
    admin: 'suttipong.p@psu.ac.th',
    assistantAdmin: ''
};
let logs = [];
let currentUser = null;

// เริ่มต้นระบบ
function initializeSystem() {
    loadData();
    initializeComputers();
    displayComputers();
    updateComputerDropdown();
    updateManagementGrid();
    updateLogsTable();
    checkLogin();
}

// โหลดข้อมูลจาก localStorage
function loadData() {
    const storedComputers = localStorage.getItem('computers');
    const storedPermissions = localStorage.getItem('permissions');
    const storedLogs = localStorage.getItem('logs');

    if (storedComputers) {
        computers = JSON.parse(storedComputers);
    }

    if (storedPermissions) {
        permissions = JSON.parse(storedPermissions);
        document.getElementById('approverEmail').value = permissions.approver || '';
        document.getElementById('assistantAdminEmail').value = permissions.assistantAdmin || '';
    }

    if (storedLogs) {
        logs = JSON.parse(storedLogs);
    }
}

// สร้างข้อมูลคอมพิวเตอร์เริ่มต้น
function initializeComputers() {
    if (computers.length === 0) {
        for (let i = 1; i <= 15; i++) {
            const id = i.toString().padStart(2, '0');
            computers.push({
                id: `VET ${id}`,
                status: 'available',
                dueDate: null,
                borrower: null,
                note: ''
            });
        }
        saveComputers();
    }
}

// บันทึกข้อมูล
function saveComputers() {
    localStorage.setItem('computers', JSON.stringify(computers));
}

function savePermissions() {
    permissions.approver = document.getElementById('approverEmail').value;
    permissions.assistantAdmin = document.getElementById('assistantAdminEmail').value;
    localStorage.setItem('permissions', JSON.stringify(permissions));
    showAlert('bookingAlert', 'success', '✅ บันทึกการตั้งค่าสิทธิ์เรียบร้อยแล้ว');
}

function saveLogs() {
    localStorage.setItem('logs', JSON.stringify(logs));
}

// แสดงคอมพิวเตอร์ (หน้าที่ 1)
function displayComputers() {
    const grid = document.getElementById('computers-grid');
    grid.innerHTML = '';

    let availableCount = 0;
    let borrowedCount = 0;
    let maintenanceCount = 0;

    computers.forEach((computer, index) => {
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

// เลือกคอมพิวเตอร์เพื่อจอง
function selectComputerForBooking(computerId) {
    showPage('booking');
    document.getElementById('computerId').value = computerId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// อัพเดท dropdown ของคอมพิวเตอร์
function updateComputerDropdown() {
    const select = document.getElementById('computerId');
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

// อัพเดทช่องตามสถานะผู้ยืม
function updateBorrowerTypeField() {
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
}

// ตรวจสอบวันที่
function validateDates() {
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
}

// ส่งคำขอยืม
async function submitBooking(event) {
    event.preventDefault();

    if (!validateDates()) {
        return;
    }

    // ตรวจสอบว่ามีผู้อนุมัติหรือยัง
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
        // ส่งอีเมลไปยังผู้ยืม
        await sendEmailToBorrower(formData);
        
        // ส่งอีเมลไปยังผู้อนุมัติ
        await sendEmailToApprover(formData);

        // เพิ่มลง logs
        logs.push(formData);
        saveLogs();

        showAlert('bookingAlert', 'success', '✅ ส่งคำขอยืมคอมพิวเตอร์เรียบร้อยแล้ว! ระบบได้ส่งอีเมลยืนยันไปที่ ' + formData.borrowerEmail + ' และอีเมลขออนุมัติไปที่ผู้อนุมัติแล้ว');

        // รีเซ็ตฟอร์ม
        document.getElementById('bookingForm').reset();
        updateBorrowerTypeField();

        // เลื่อนไปด้านบน
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error sending email:', error);
        showAlert('bookingAlert', 'error', '❌ เกิดข้อผิดพลาดในการส่งอีเมล กรุณาตรวจสอบการตั้งค่า EmailJS');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '✅ ยืนยันส่งคำขอยืมคอมพิวเตอร์';
    }
}

// ส่งอีเมลไปยังผู้ยืม
async function sendEmailToBorrower(formData) {
    const templateParams = {
        to_email: formData.borrowerEmail,
        borrower_name: formData.borrowerName,
        computer_id: formData.computerId,
        start_date: formatDateThai(formData.startDate),
        end_date: formatDateThai(formData.endDate),
        purpose: formData.purpose,
        borrower_type: getStatusText(formData.borrowerType),
        student_id: formData.studentId || '-',
        department: formData.department || '-'
    };

    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_BORROWER, templateParams);
}

// ส่งอีเมลไปยังผู้อนุมัติ
async function sendEmailToApprover(formData) {
    const templateParams = {
        to_email: permissions.approver,
        borrower_name: formData.borrowerName,
        computer_id: formData.computerId,
        start_date: formatDateThai(formData.startDate),
        end_date: formatDateThai(formData.endDate),
        purpose: formData.purpose,
        borrower_type: getStatusText(formData.borrowerType),
        student_id: formData.studentId || '-',
        department: formData.department || '-',
        borrower_email: formData.borrowerEmail,
        request_date: formatDateTimeThai(formData.requestDate)
    };

    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_APPROVER, templateParams);
}

// แปลงวันที่เป็นภาษาไทย
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

// แสดง Alert
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

// แปลงสถานะเป็นข้อความไทย
function getStatusText(type) {
    switch(type) {
        case 'student': return 'นักศึกษา';
        case 'teacher': return 'อาจารย์';
        case 'staff': return 'บุคลากร';
        case 'available': return 'ว่าง';
        case 'borrowed': return 'ไม่ว่าง';
        case 'maintenance': return 'ชำรุด/รอซ่อม';
        case 'pending': return 'รอการอนุมัติ';
        case 'approved': return 'อนุมัติ';
        case 'rejected': return 'ไม่อนุมัติ';
        default: return type;
    }
}

// อัพเดท Management Grid (หน้าที่ 4)
function updateManagementGrid() {
    const grid = document.getElementById('management-grid');
    grid.innerHTML = '';

    computers.forEach((computer, index) => {
        const card = document.createElement('div');
        card.className = 'management-card';
        card.innerHTML = `
            <h4>💻 ${computer.id}</h4>
            <div class="inline-form">
                <div class="form-group">
                    <label>สถานะ</label>
                    <select id="status-${index}" onchange="updateComputerStatus(${index})">
                        <option value="available" ${computer.status === 'available' ? 'selected' : ''}>ว่าง</option>
                        <option value="borrowed" ${computer.status === 'borrowed' ? 'selected' : ''}>ไม่ว่าง</option>
                        <option value="maintenance" ${computer.status === 'maintenance' ? 'selected' : ''}>ชำรุด/รอซ่อม</option>
                    </select>
                </div>
                <div class="form-group" id="duedate-group-${index}" style="display: ${computer.status === 'borrowed' ? 'block' : 'none'};">
                    <label>วันสิ้นสุดการยืม</label>
                    <input type="date" id="duedate-${index}" value="${computer.dueDate || ''}" onchange="updateComputerDueDate(${index})">
                </div>
            </div>
            <div class="form-group">
                <label>ชื่อผู้ยืม</label>
                <input type="text" id="borrower-${index}" value="${computer.borrower || ''}" ${computer.status !== 'borrowed' ? 'disabled' : ''}>
            </div>
            <div class="form-group">
                <label>หมายเหตุ</label>
                <textarea id="note-${index}" onchange="updateComputerNote(${index})" style="min-height: 60px;">${computer.note || ''}</textarea>
            </div>
            <button class="btn-save" onclick="saveComputerChanges(${index})">💾 บันทึก</button>
        `;
        grid.appendChild(card);
    });
}

// อัพเดทสถานะคอมพิวเตอร์
function updateComputerStatus(index) {
    const status = document.getElementById(`status-${index}`).value;
    const duedateGroup = document.getElementById(`duedate-group-${index}`);
    const borrowerInput = document.getElementById(`borrower-${index}`);
    
    if (status === 'borrowed') {
        duedateGroup.style.display = 'block';
        borrowerInput.disabled = false;
    } else {
        duedateGroup.style.display = 'none';
        borrowerInput.disabled = true;
    }
}

// อัพเดทวันสิ้นสุดการยืม
function updateComputerDueDate(index) {
    // ฟังก์ชันนี้จะถูกเรียกเมื่อมีการเปลี่ยนวันที่
}

// อัพเดทหมายเหตุ
function updateComputerNote(index) {
    // ฟังก์ชันนี้จะถูกเรียกเมื่อมีการเปลี่ยนหมายเหตุ
}

// บันทึกการเปลี่ยนแปลงคอมพิวเตอร์
function saveComputerChanges(index) {
    const status = document.getElementById(`status-${index}`).value;
    const dueDate = document.getElementById(`duedate-${index}`).value;
    const borrower = document.getElementById(`borrower-${index}`).value;
    const note = document.getElementById(`note-${index}`).value;

    computers[index].status = status;
    computers[index].dueDate = status === 'borrowed' ? dueDate : null;
    computers[index].borrower = status === 'borrowed' ? borrower : null;
    computers[index].note = note;

    saveComputers();
    displayComputers();
    updateComputerDropdown();

    alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
}

// อัพเดทตาราง Logs (หน้าที่ 5)
function updateLogsTable() {
    const tbody = document.getElementById('logs-tbody');
    tbody.innerHTML = '';

    if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 30px; color: #a0aec0;">ยังไม่มีข้อมูล Log</td></tr>';
        return;
    }

    const sortedLogs = [...logs].reverse();

    sortedLogs.forEach(log => {
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
        if (log.status === 'approved') {
            statusClass = 'status-approved';
            statusText = 'อนุมัติ';
        } else if (log.status === 'rejected') {
            statusClass = 'status-rejected';
            statusText = 'ไม่อนุมัติ';
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
        `;
        tbody.appendChild(tr);
    });
}

// เปลี่ยนหน้า
function showPage(pageName) {
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

    if (pageName === 'status') {
        displayComputers();
    } else if (pageName === 'booking') {
        updateComputerDropdown();
    } else if (pageName === 'management') {
        updateManagementGrid();
    } else if (pageName === 'logs') {
        updateLogsTable();
    }
}

// Login Modal
function showLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function login(event) {
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
        alert('✅ เข้าสู่ระบบสำเร็จ!');
    } else {
        alert('❌ คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
    }
}

function logout() {
    currentUser = null;
    checkLogin();
    showPage('status');
    alert('✅ ออกจากระบบเรียบร้อยแล้ว');
}

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

// ตั้งค่าวันที่ขั้นต่ำ
function setMinDates() {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 3);

    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        startDateInput.min = minDate.toISOString().split('T')[0];
    }
}

// เริ่มต้นระบบเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    setMinDates();
});