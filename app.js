// ตั้งค่า EmailJS - แทนด้วยค่าจริงของคุณ
const EMAILJS_PUBLIC_KEY = 'mwvgufG3CgQA-lI8T'; // แทนด้วย Public Key
const EMAILJS_SERVICE_ID = 'service_vr051ds'; // แทนด้วย Service ID
const EMAILJS_TEMPLATE_BORROWER = 'YOUR_TEMPLATE_ID_BORROWER'; // Template สำหรับผู้ยืม
const EMAILJS_TEMPLATE_APPROVER = 'template_bbdq96i'; // Template สำหรับผู้อนุมัติ

// URL ของระบบ - แก้เป็น URL จริงของคุณ
const SYSTEM_URL = 'https://arrvalonche13.github.io/laptop-borrowing-system/';

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
    checkApprovalAction();
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
        if (document.getElementById('approverEmail')) {
            document.getElementById('approverEmail').value = permissions.approver || '';
        }
        if (document.getElementById('assistantAdminEmail')) {
            document.getElementById('assistantAdminEmail').value = permissions.assistantAdmin || '';
        }
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
    alert('✅ บันทึกการตั้งค่าสิทธิ์เรียบร้อยแล้ว');
}

function saveLogs() {
    localStorage.setItem('logs', JSON.stringify(logs));
}

// แสดงคอมพิวเตอร์ (หน้าที่ 1)
function displayComputers() {
    const grid = document.getElementById('computers-grid');
    if (!grid) return;
    
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

    if (!permissions.approver) {
        showAlert('bookingAlert', 'error', '❌ กรุณาตั้งค่าอีเมลผู้อนุมัติในหน้าการจัดการสิทธิ์ก่อน');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner"></div> กำลังส่งคำขอ...';

    const requestId = Date.now().toString();
    
    const formData = {
        requestId: requestId,
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

        showAlert('bookingAlert', 'success', '✅ ส่งคำขอยืมคอมพิวเตอร์เรียบร้อยแล้ว!\n\nระบบได้ส่งอีเมลยืนยันไปที่ ' + formData.borrowerEmail + ' และอีเมลขออนุมัติไปที่ผู้อนุมัติแล้ว');

        document.getElementById('bookingForm').reset();
        updateBorrowerTypeField();
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error sending email:', error);
        showAlert('bookingAlert', 'error', '❌ เกิดข้อผิดพลาดในการส่งอีเมล: ' + error.text);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '✅ ยืนยันส่งคำขอยืมคอมพิวเตอร์';
    }
}

// ส่งอีเมลไปยังผู้ยืม
async function sendEmailToBorrower(formData) {
    const templateParams = {
        to_email: formData.borrowerEmail, // ส่งถึงผู้ยืม
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
    const approvalLink = `${SYSTEM_URL}?action=approve&id=${formData.requestId}`;
    const rejectionLink = `${SYSTEM_URL}?action=reject&id=${formData.requestId}`;
    
    const templateParams = {
        to_email: permissions.approver, // ส่งถึงผู้อนุมัติ
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
        approval_link: approvalLink,
        rejection_link: rejectionLink
    };

    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_APPROVER, templateParams);
}

// ตรวจสอบการอนุมัติ/ไม่อนุมัติจาก URL
function checkApprovalAction() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const requestId = urlParams.get('id');

    if (action && requestId) {
        const logIndex = logs.findIndex(log => log.requestId === requestId);
        
        if (logIndex !== -1 && logs[logIndex].status === 'pending') {
            if (action === 'approve') {
                approveRequest(logIndex);
            } else if (action === 'reject') {
                rejectRequest(logIndex);
            }
        }
        
        // ลบ query string จาก URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// อนุมัติคำขอ
async function approveRequest(logIndex) {
    const log = logs[logIndex];
    
    log.status = 'approved';
    log.approverName = permissions.approver;
    log.approvalDate = new Date().toISOString();
    
    // อัพเดทสถานะคอมพิวเตอร์
    const computerIndex = computers.findIndex(c => c.id === log.computerId);
    if (computerIndex !== -1) {
        computers[computerIndex].status = 'borrowed';
        computers[computerIndex].dueDate = log.endDate;
        computers[computerIndex].borrower = log.borrowerName;
        saveComputers();
    }
    
    saveLogs();
    
    // ส่งอีเมลแจ้งผลการอนุมัติ
    await sendApprovalResultEmail(log, true);
    
    alert('✅ อนุมัติคำขอเรียบร้อยแล้ว!\n\nระบบได้ส่งอีเมลแจ้งผู้ยืมและผู้ดูแลระบบแล้ว');
    
    displayComputers();
    updateLogsTable();
}

// ไม่อนุมัติคำขอ
async function rejectRequest(logIndex) {
    const log = logs[logIndex];
    
    log.status = 'rejected';
    log.approverName = permissions.approver;
    log.approvalDate = new Date().toISOString();
    
    saveLogs();
    
    // ส่งอีเมลแจ้งผลไม่อนุมัติ
    await sendApprovalResultEmail(log, false);
    
    alert('❌ ไม่อนุมัติคำขอเรียบร้อยแล้ว!\n\nระบบได้ส่งอีเมลแจ้งผู้ยืมและผู้ดูแลระบบแล้ว');
    
    updateLogsTable();
}

// ส่งอีเมลแจ้งผลการพิจารณา
async function sendApprovalResultEmail(log, isApproved) {
    const status = isApproved ? 'อนุมัติ' : 'ไม่อนุมัติ';
    const statusColor = isApproved ? '#10b981' : '#ef4444';
    
    const emailContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7fafc;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: ${statusColor}; text-align: center;">
                ${isApproved ? '✅' : '❌'} ผลการพิจารณาคำขอยืมคอมพิวเตอร์
            </h2>
            
            <div style="background: ${isApproved ? '#d1fae5' : '#fee2e2'}; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="font-size: 18px; font-weight: bold; text-align: center; margin: 0;">
                    คำขอของคุณได้รับการ${status}
                </p>
            </div>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>📋 รายละเอียดคำขอ</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0;"><strong>ผู้ยืม:</strong> ${log.borrowerName}</li>
                    <li style="padding: 8px 0;"><strong>รหัสคอมพิวเตอร์:</strong> ${log.computerId}</li>
                    <li style="padding: 8px 0;"><strong>วันที่เริ่มยืม:</strong> ${formatDateThai(log.startDate)}</li>
                    <li style="padding: 8px 0;"><strong>วันที่คืน:</strong> ${formatDateThai(log.endDate)}</li>
                    <li style="padding: 8px 0;"><strong>ผู้พิจารณา:</strong> ${log.approverName}</li>
                    <li style="padding: 8px 0;"><strong>วันที่พิจารณา:</strong> ${formatDateTimeThai(log.approvalDate)}</li>
                </ul>
            </div>
            
            ${isApproved ? `
            <div style="background: #dcfce7; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                <p style="margin: 0;"><strong>✅ กรุณามารับคอมพิวเตอร์ตามวันที่กำหนด</strong></p>
                <p style="margin: 10px 0 0 0;">อย่าลืมนำบัตรประชาชนหรือบัตรนักศึกษามาด้วย</p>
            </div>
            ` : `
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
                <p style="margin: 0;"><strong>❌ คำขอของท่านไม่ได้รับการอนุมัติ</strong></p>
                <p style="margin: 10px 0 0 0;">หากมีข้อสงสัย กรุณาติดต่อผู้อนุมัติ</p>
            </div>
            `}
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            
            <p style="font-size: 14px; color: #718096; text-align: center;">
                ระบบยืมคืนคอมพิวเตอร์พกพา<br>
                มหาวิทยาลัยสงขลานครินทร์<br>
                ติดต่อ: suttipong.p@psu.ac.th | 9608
            </p>
        </div>
    </div>
    `;
    
    // ส่งให้ผู้ยืม
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_BORROWER, {
        to_email: log.borrowerEmail,
        subject: `${isApproved ? '✅ อนุมัติ' : '❌ ไม่อนุมัติ'}คำขอยืมคอมพิวเตอร์`,
        html_content: emailContent
    });
    
    // ส่งสำเนาให้ผู้ดูแลระบบ
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_BORROWER, {
        to_email: permissions.admin,
        subject: `[สำเนา] ${isApproved ? '✅ อนุมัติ' : '❌ ไม่อนุมัติ'}คำขอยืม - ${log.borrowerName}`,
        html_content: emailContent
    });
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
    if (!grid) return;
    
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
    if (!tbody) return;
    
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