# 📘 คู่มือการติดตั้งระบบยืมคืนคอมพิวเตอร์พกพา

ระบบนี้พร้อม Deploy แล้ว! ใช้งานได้ฟรี 100%

---

## 🚀 ขั้นตอนการติดตั้ง (ใช้เวลาประมาณ 15-20 นาที)

### **ขั้นตอนที่ 1: สมัคร EmailJS (ฟรี)**

1. ไปที่ https://www.emailjs.com/
2. คลิก **Sign Up** สมัครด้วย Google Account
3. ยืนยันอีเมล

---

### **ขั้นตอนที่ 2: เชื่อมต่อ Gmail**

1. ใน Dashboard ของ EmailJS คลิก **Add New Service**
2. เลือก **Gmail**
3. คลิก **Connect Account** และเลือก Gmail ที่ต้องการใช้ส่งอีเมล
4. ตั้งชื่อ Service (เช่น "PSU Laptop System")
5. คลิก **Create Service**
6. **📝 จดบันทึก Service ID** (เช่น service_abc123)

---

### **ขั้นตอนที่ 3: สร้าง Email Template 2 ตัว**

#### **Template 1: สำหรับผู้ยืม**

1. คลิก **Email Templates** → **Create New Template**
2. ตั้งชื่อ: "Borrower Confirmation"
3. กรอกข้อมูล:
   - **From Name**: ระบบยืมคอมพิวเตอร์ PSU
   - **From Email**: อีเมลของคุณ
   - **Subject**: ยืนยันการส่งคำขอยืมคอมพิวเตอร์
   - **Content (HTML)**: คัดลอกโค้ดด้านล่างนี้

```html
<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7fafc;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #667eea; text-align: center;">✅ ยืนยันการส่งคำขอยืมคอมพิวเตอร์</h2>
        
        <p>เรียน คุณ{{borrower_name}}</p>
        
        <p>ระบบได้รับคำขอยืมคอมพิวเตอร์ของท่านเรียบร้อยแล้ว</p>
        
        <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">📋 รายละเอียดการยืม</h3>
            <ul style="list-style: none; padding: 0;">
                <li style="padding: 8px 0;"><strong>รหัสคอมพิวเตอร์:</strong> {{computer_id}}</li>
                <li style="padding: 8px 0;"><strong>สถานะผู้ยืม:</strong> {{borrower_type}}</li>
                <li style="padding: 8px 0;"><strong>รหัสนักศึกษา/สังกัด:</strong> {{student_id}} {{department}}</li>
                <li style="padding: 8px 0;"><strong>วันที่เริ่มยืม:</strong> {{start_date}}</li>
                <li style="padding: 8px 0;"><strong>วันที่คืน:</strong> {{end_date}}</li>
                <li style="padding: 8px 0;"><strong>วัตถุประสงค์:</strong> {{purpose}}</li>
            </ul>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p style="margin: 0;">⏳ <strong>กรุณารอการอนุมัติจากผู้อนุมัติ</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">ท่านจะได้รับอีเมลแจ้งผลการพิจารณาอีกครั้ง</p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        
        <p style="font-size: 14px; color: #718096; text-align: center;">
            หากมีข้อสงสัยกรุณาติดต่อ<br>
            นายสุทธิพงศ์ ปริญญาศิริ<br>
            📧 suttipong.p@psu.ac.th | ☎️ 9608
        </p>
    </div>
</div>
```

4. คลิก **Save**
5. **📝 จดบันทึก Template ID** (เช่น template_xyz789)

#### **Template 2: สำหรับผู้อนุมัติ**

1. สร้าง Template ใหม่อีกครั้ง
2. ตั้งชื่อ: "Approval Request"
3. กรอกข้อมูล:
   - **From Name**: ระบบยืมคอมพิวเตอร์ PSU
   - **From Email**: อีเมลของคุณ
   - **Subject**: 🔔 มีคำขอยืมคอมพิวเตอร์รอการอนุมัติ
   - **Content (HTML)**: คัดลอกโค้ดด้านล่างนี้

```html
<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7fafc;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #f59e0b; text-align: center;">🔔 คำขอยืมคอมพิวเตอร์รอการอนุมัติ</h2>
        
        <p>เรียน ผู้อนุมัติ</p>
        
        <p>มีคำขอยืมคอมพิวเตอร์พกพาใหม่ รอการพิจารณาจากท่าน</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">👤 ข้อมูลผู้ยืม</h3>
            <ul style="list-style: none; padding: 0;">
                <li style="padding: 8px 0;"><strong>ชื่อ-นามสกุล:</strong> {{borrower_name}}</li>
                <li style="padding: 8px 0;"><strong>อีเมล:</strong> {{borrower_email}}</li>
                <li style="padding: 8px 0;"><strong>สถานะ:</strong> {{borrower_type}}</li>
                <li style="padding: 8px 0;"><strong>รหัสนักศึกษา/สังกัด:</strong> {{student_id}} {{department}}</li>
            </ul>
        </div>
        
        <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">💻 รายละเอียดการยืม</h3>
            <ul style="list-style: none; padding: 0;">
                <li style="padding: 8px 0;"><strong>รหัสคอมพิวเตอร์:</strong> {{computer_id}}</li>
                <li style="padding: 8px 0;"><strong>วันที่เริ่มยืม:</strong> {{start_date}}</li>
                <li style="padding: 8px 0;"><strong>วันที่คืน:</strong> {{end_date}}</li>
                <li style="padding: 8px 0;"><strong>วัตถุประสงค์:</strong> {{purpose}}</li>
                <li style="padding: 8px 0;"><strong>วันที่ยื่นคำขอ:</strong> {{request_date}}</li>
            </ul>
        </div>
        
        <div style="background: #dcfce7; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 15px 0; font-weight: bold;">กรุณาเข้าสู่ระบบเพื่ออนุมัติหรือไม่อนุมัติ</p>
            <p style="margin: 0; font-size: 14px; color: #059669;">
                📌 หมายเหตุ: ในการใช้งานจริง ท่านสามารถเข้าสู่ระบบเพื่อพิจารณาคำขอได้ที่เว็บไซต์
            </p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        
        <p style="font-size: 14px; color: #718096; text-align: center;">
            ระบบยืมคืนคอมพิวเตอร์พกพา<br>
            มหาวิทยาลัยสงขลานครินทร์
        </p>
    </div>
</div>
```

4. คลิก **Save**
5. **📝 จดบันทึก Template ID** (เช่น template_uvw456)

---

### **ขั้นตอนที่ 4: ดู Public Key**

1. ไปที่ **Account** → **General**
2. หา **Public Key** ในส่วน **API Keys**
3. **📝 จดบันทึก Public Key** (เช่น xYz123AbC456)

---

### **ขั้นตอนที่ 5: แก้ไขไฟล์ app.js**

1. เปิดไฟล์ **app.js**
2. แก้ไขบรรทัดที่ 3-6 ด้วยข้อมูลที่จดไว้:

```javascript
const EMAILJS_PUBLIC_KEY = 'ใส่ Public Key ของคุณ';
const EMAILJS_SERVICE_ID = 'ใส่ Service ID ของคุณ';
const EMAILJS_TEMPLATE_BORROWER = 'ใส่ Template ID สำหรับผู้ยืม';
const EMAILJS_TEMPLATE_APPROVER = 'ใส่ Template ID สำหรับผู้อนุมัติ';
```

**ตัวอย่าง:**
```javascript
const EMAILJS_PUBLIC_KEY = 'xYz123AbC456';
const EMAILJS_SERVICE_ID = 'service_abc123';
const EMAILJS_TEMPLATE_BORROWER = 'template_xyz789';
const EMAILJS_TEMPLATE_APPROVER = 'template_uvw456';
```

3. บันทึกไฟล์

---

### **ขั้นตอนที่ 6: Upload ไป GitHub**

1. ไปที่ https://github.com และ Login
2. คลิก **New Repository** (ปุ่มสีเขียว)
3. ตั้งชื่อ Repository เช่น `laptop-borrowing-system`
4. เลือก **Public**
5. คลิก **Create Repository**
6. Upload ไฟล์ทั้ง 3 ไฟล์:
   - index.html
   - app.js
   - README.md

---

### **ขั้นตอนที่ 7: เปิด GitHub Pages (ทำให้เว็บออนไลน์)**

1. ใน Repository คลิก **Settings**
2. คลิก **Pages** (เมนูด้านซ้าย)
3. ใน **Source** เลือก **Deploy from a branch**
4. เลือก Branch: **main** และ Folder: **/ (root)**
5. คลิก **Save**
6. รอประมาณ 1-2 นาที
7. รีเฟรชหน้า จะเห็น URL เว็บไซต์ของคุณ เช่น:
   ```
   https://your-username.github.io/laptop-borrowing-system/
   ```

---

## ✅ เสร็จสิ้น! ระบบพร้อมใช้งาน

เปิดเว็บไซต์ตาม URL ที่ได้ แล้วทดสอบส่งอีเมล!

---

## 🔧 การตั้งค่าเพิ่มเติม

### **ตั้งค่าผู้อนุมัติ**

1. เข้าสู่ระบบด้วย:
   - **Username**: suttipong.p@psu.ac.th
   - **Password**: 123456789
2. ไปที่หน้า **การจัดการสิทธิ์**
3. ใส่อีเมลผู้อนุมัติ
4. กด Save

### **เปลี่ยนรหัสผ่าน**

แก้ไขในไฟล์ `app.js` บรรทัดที่ประมาณ 430:

```javascript
if (password !== '123456789') {  // เปลี่ยนรหัสผ่านตรงนี้
```

---

## 📊 ข้อจำกัดของแผนฟรี

- **EmailJS**: ส่งได้ 200 อีเมล/เดือน (เพียงพอสำหรับองค์กรขนาดเล็ก)
- **GitHub Pages**: ไม่จำกัด Traffic (ใช้ได้ไม่จำกัด)

---

## 🆘 แก้ปัญหา

### **อีเมลไม่ถูกส่ง**
1. ตรวจสอบ API Keys ใน app.js
2. ตรวจสอบว่า Gmail อนุญาตการเข้าถึงจาก EmailJS แล้ว
3. เปิด Console (F12) เพื่อดู Error

### **เว็บไม่แสดง**
1. ตรวจสอบว่าไฟล์ชื่อ index.html (ตัวพิมพ์เล็กทั้งหมด)
2. รอ 2-3 นาทีหลัง Deploy
3. ลอง Hard Refresh (Ctrl + Shift + R)

---

## 📞 ติดต่อ

หากมีปัญหาหรือต้องการความช่วยเหลือ:
- อีเมล: suttipong.p@psu.ac.th
- โทร: 9608

---

## 🎉 ขอให้ใช้งานระบบอย่างมีความสุข!
