# 📘 คู่มือการติดตั้งระบบยืมคืนคอมพิวเตอร์พกพา (ฉบับสมบูรณ์)

## 🎯 สิ่งที่แก้ไขแล้ว:

✅ แก้ปัญหาอีเมลส่งสลับกัน  
✅ เพิ่มปุ่มอนุมัติ/ไม่อนุมัติในอีเมล  
✅ ส่งอีเมลแจ้งผลกลับผู้ยืมอัตโนมัติ  
✅ ส่งสำเนาให้ผู้ดูแลระบบ (suttipong.p@psu.ac.th)  

---

## 🚀 ขั้นตอนการติดตั้ง

### **ขั้นตอนที่ 1: สมัคร EmailJS**

1. ไปที่ https://www.emailjs.com/
2. คลิก **Sign Up** (สมัครด้วย Google)
3. ยืนยันอีเมล

---

### **ขั้นตอนที่ 2: เชื่อมต่อ Gmail**

1. คลิก **Add New Service**
2. เลือก **Gmail**
3. คลิก **Connect Account**
4. ตั้งชื่อ Service: "PSU Laptop System"
5. **📝 จด Service ID** (เช่น service_abc123)

---

### **ขั้นตอนที่ 3: สร้าง Email Template ทั้งหมด 2 ตัว**

#### **Template 1: สำหรับผู้ยืม (Borrower Confirmation)**

1. คลิก **Email Templates** → **Create New Template**
2. ตั้งชื่อ: **Borrower Confirmation**
3. กรอกข้อมูล:

```
Subject: ✅ ยืนยันการส่งคำขอยืมคอมพิวเตอร์
From Name: ระบบยืมคอมพิวเตอร์ PSU
From Email: อีเมลของคุณ
To Email: {{to_email}}   👈 สำคัญมาก!
Reply To: {{to_email}}
```

4. **Content (HTML)**:

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

5. คลิก **Save**
6. **📝 จด Template ID** (เช่น template_xyz789)

---

#### **Template 2: สำหรับผู้อนุมัติ (Approval Request)**

1. สร้าง Template ใหม่
2. ตั้งชื่อ: **Approval Request**
3. กรอกข้อมูล:

```
Subject: 🔔 มีคำขอยืมคอมพิวเตอร์รอการอนุมัติ
From Name: ระบบยืมคอมพิวเตอร์ PSU
From Email: อีเมลของคุณ
To Email: {{to_email}}   👈 สำคัญมาก!
Reply To: {{borrower_email}}
```

4. **Content (HTML)**:

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
        
        <div style="text-align: center; margin: 30px 0;">
            <p style="margin-bottom: 20px; font-weight: bold; font-size: 16px;">กรุณาพิจารณาคำขอ:</p>
            
            <a href="{{approval_link}}" style="display: inline-block; padding: 15px 40px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px;">
                ✅ อนุมัติ
            </a>
            
            <a href="{{rejection_link}}" style="display: inline-block; padding: 15px 40px; background: #ef4444; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px;">
                ❌ ไม่อนุมัติ
            </a>
        </div>
        
        <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; text-align: center;">
                💡 <strong>คำแนะนำ:</strong> คลิกปุ่มด้านบนเพื่ออนุมัติหรือไม่อนุมัติทันที<br>
                ระบบจะแจ้งผลไปยังผู้ยืมและผู้ดูแลระบบอัตโนมัติ
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

5. คลิก **Save**
6. **📝 จด Template ID** (เช่น template_uvw456)

---

### **ขั้นตอนที่ 4: ดู Public Key**

1. ไปที่ **Account** → **General**
2. หา **Public Key**
3. **📝 จด Public Key** (เช่น xYz123AbC456)

---

### **ขั้นตอนที่ 5: แก้ไขไฟล์ app.js**

1. เปิดไฟล์ **app.js** ที่ได้รับ
2. แก้บรรทัดที่ 2-4:

```javascript
const EMAILJS_PUBLIC_KEY = 'ใส่ Public Key ของคุณ';
const EMAILJS_SERVICE_ID = 'ใส่ Service ID ของคุณ';
const EMAILJS_TEMPLATE_BORROWER = 'ใส่ Template ID สำหรับผู้ยืม';
const EMAILJS_TEMPLATE_APPROVER = 'ใส่ Template ID สำหรับผู้อนุมัติ';
```

3. แก้บรรทัดที่ 9 (URL ของเว็บไซต์):

```javascript
const SYSTEM_URL = 'https://your-username.github.io/laptop-borrowing-system/';
```

**ตัวอย่างหลังแก้:**
```javascript
const EMAILJS_PUBLIC_KEY = 'xYz123AbC456';
const EMAILJS_SERVICE_ID = 'service_abc123';
const EMAILJS_TEMPLATE_BORROWER = 'template_xyz789';
const EMAILJS_TEMPLATE_APPROVER = 'template_uvw456';

const SYSTEM_URL = 'https://arryalonche13.github.io/laptop-borrowing-system/';
```

4. **บันทึกไฟล์**

---

### **ขั้นตอนที่ 6: Upload ไป GitHub**

1. ไปที่ Repository: https://github.com/Arryalonche13/laptop-borrowing-system
2. คลิก **Upload files**
3. ลาก 2 ไฟล์:
   - **index.html** (ไฟล์เดิม ไม่ต้องเปลี่ยน)
   - **app.js** (ไฟล์ใหม่ที่แก้แล้ว - ให้เขียนทับไฟล์เดิม)
4. คลิก **Commit changes**

---

### **ขั้นตอนที่ 7: ทดสอบระบบ**

1. เปิดเว็บไซต์: https://arryalonche13.github.io/laptop-borrowing-system/
2. ไปที่หน้า **การจัดการสิทธิ์**:
   - Login ด้วย: suttipong.p@psu.ac.th / 123456789
   - ใส่อีเมลผู้อนุมัติ (เช่น parinyasiris@gmail.com)
   - กด Save
3. ทดสอบส่งคำขอยืม:
   - กรอกข้อมูลครบ
   - ใส่อีเมลของคุณ
   - กดส่งคำขอ
4. ตรวจสอบอีเมล:
   - ✅ ผู้ยืมได้อีเมล "ยืนยันการส่งคำขอ"
   - ✅ ผู้อนุมัติได้อีเมล "มีคำขอยืม" พร้อมปุ่มอนุมัติ/ไม่อนุมัติ
5. คลิกปุ่มอนุมัติ/ไม่อนุมัติในอีเมล
6. ตรวจสอบอีเมลอีกครั้ง:
   - ✅ ผู้ยืมได้อีเมลแจ้งผล
   - ✅ ผู้ดูแลระบบ (suttipong.p@psu.ac.th) ได้สำเนา

---

## 🎯 สิ่งที่ระบบทำได้ตอนนี้:

1. ✅ ส่งอีเมลถูกต้อง (ไม่สลับกัน)
2. ✅ มีปุ่มอนุมัติ/ไม่อนุมัติในอีเมล
3. ✅ คลิกปุ่มแล้วอัพเดทสถานะอัตโนมัติ
4. ✅ ส่งอีเมลแจ้งผลกลับผู้ยืม
5. ✅ ส่งสำเนาให้ผู้ดูแลระบบ
6. ✅ อัพเดทสถานะคอมพิวเตอร์อัตโนมัติ (เมื่ออนุมัติ)

---

## 🔧 การแก้ปัญหา

### **อีเมลยังส่งผิดอยู่:**
- ตรวจสอบ To Email ใน Template ต้องเป็น `{{to_email}}`
- ไม่ใช่อีเมลตายตัว

### **ปุ่มอนุมัติ/ไม่อนุมัติไม่ทำงาน:**
- ตรวจสอบ SYSTEM_URL ใน app.js ต้องถูกต้อง
- ต้องมี `/` ท้ายสุด

### **ไม่ได้รับอีเมลแจ้งผล:**
- ตรวจสอบว่าใช้ Template เดียวกัน (EMAILJS_TEMPLATE_BORROWER)
- ตรวจสอบ Spam/Junk Mail

---

## 📞 ติดต่อ

หากมีปัญหา:
- อีเมล: suttipong.p@psu.ac.th
- โทร: 9608

---

## 🎉 สรุป

ระบบใหม่นี้แก้ปัญหาทั้งหมดแล้ว:
- ✅ อีเมลส่งถูกคน
- ✅ มีปุ่มอนุมัติ/ไม่อนุมัติ
- ✅ แจ้งผลกลับอัตโนมัติ
- ✅ ส่งสำเนาให้ผู้ดูแลระบบ

**ขอให้ใช้งานอย่างมีความสุข!** 🎊
