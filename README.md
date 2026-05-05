# 📘 คู่มือระบบยืมคืนคอมพิวเตอร์ (ใช้แค่ 2 Templates)

## ✅ แก้ปัญหา Limit Template แล้ว!

EmailJS ฟรีมีแค่ 2 Templates แต่เราต้องการ 3 อีเมล:
1. อีเมลยืนยันคำขอ (ผู้ยืม)
2. อีเมลแจ้งผู้อนุมัติ (ผู้อนุมัติ)
3. อีเมลแจ้งผล (ผู้ยืม + ผู้ดูแลระบบ)

**วิธีแก้:** ใช้ Template 1 ส่งทั้งอีเมลยืนยัน และอีเมลแจ้งผล (ส่ง HTML ผ่าน field `purpose`)

---

## 🚀 ขั้นตอนการติดตั้ง

### **ขั้นตอนที่ 1: สมัคร EmailJS**

1. ไปที่ https://www.emailjs.com/
2. Sign Up ด้วย Google
3. ยืนยันอีเมล

---

### **ขั้นตอนที่ 2: เชื่อมต่อ Gmail**

1. Add New Service → Gmail
2. Connect Account
3. ตั้งชื่อ: "PSU Laptop System"
4. 📝 จด **Service ID**

---

### **ขั้นตอนที่ 3: สร้าง Template แค่ 2 ตัว**

#### **Template 1: Borrower (สำหรับผู้ยืม - รองรับทั้งยืนยันและแจ้งผล)**

**Settings:**
```
Subject: ระบบยืมคอมพิวเตอร์ PSU
From Name: ระบบยืมคอมพิวเตอร์ PSU
To Email: {{to_email}}   👈 สำคัญ!
Reply To: suttipong.p@psu.ac.th
```

**⚠️ Content (HTML) - สำคัญมาก!**

ลบ HTML ทั้งหมดออก แล้วใส่แค่บรรทัดเดียว:

```html
{{{purpose}}}
```

**หมายเหตุ:** ต้องใช้วงเล็บปีกกา 3 ชั้น `{{{purpose}}}` ไม่ใช่ 2 ชั้น!

📝 จด **Template ID**

---

#### **Template 2: Approver (สำหรับผู้อนุมัติ)**

**Settings:**
```
Subject: 🔔 มีคำขอยืมคอมพิวเตอร์รอการอนุมัติ
From Name: ระบบยืมคอมพิวเตอร์ PSU
To Email: {{to_email}}   👈 สำคัญ!
Reply To: {{borrower_email}}
```

**Content (HTML):**
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
        
        <div style="text-align: center; margin: 30px 0; background: #e0e7ff; padding: 25px; border-radius: 8px;">
            <p style="margin-bottom: 20px; font-weight: bold; font-size: 18px; color: #4c51bf;">
                👉 คลิกลิงก์ด้านล่างเพื่อพิจารณาคำขอ
            </p>
            
            <a href="{{approval_link}}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                🔗 เข้าสู่ระบบเพื่ออนุมัติ
            </a>
            
            <p style="margin-top: 20px; font-size: 14px; color: #718096;">
                💡 หลัง Login แล้วไปที่หน้า "Log การยืม"<br>
                จะพบปุ่มอนุมัติ/ไม่อนุมัติให้คลิกได้เลย
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

📝 จด **Template ID**

---

### **ขั้นตอนที่ 4: ดู Public Key**

1. Account → General
2. หา Public Key
3. 📝 จด **Public Key**

---

### **ขั้นตอนที่ 5: แก้ไข app.js**

แก้บรรทัดที่ 2-5:

```javascript
const EMAILJS_PUBLIC_KEY = 'ใส่ Public Key';
const EMAILJS_SERVICE_ID = 'ใส่ Service ID';
const EMAILJS_TEMPLATE_BORROWER = 'ใส่ Template ID ที่ 1 (Borrower)';
const EMAILJS_TEMPLATE_APPROVER = 'ใส่ Template ID ที่ 2 (Approver)';
```

แก้บรรทัดที่ 8:

```javascript
const SYSTEM_URL = 'https://arryalonche13.github.io/laptop-borrowing-system/';
```

**ตัวอย่างหลังแก้:**
```javascript
const EMAILJS_PUBLIC_KEY = 'xYz123AbC456';
const EMAILJS_SERVICE_ID = 'service_abc123';
const EMAILJS_TEMPLATE_BORROWER = 'template_xyz789';
const EMAILJS_TEMPLATE_APPROVER = 'template_uvw456';

const SYSTEM_URL = 'https://arryalonche13.github.io/laptop-borrowing-system/';
```

---

### **ขั้นตอนที่ 6: Upload ไป GitHub**

1. ไปที่ Repository
2. Upload files (เขียนทับ):
   - **index.html** (เดิม ไม่ต้องเปลี่ยน)
   - **app.js** (ไฟล์ใหม่)
3. Commit changes

---

### **ขั้นตอนที่ 7: ทดสอบระบบ**

1. **ตั้งค่าผู้อนุมัติ:**
   - Login: suttipong.p@psu.ac.th / 123456789
   - ไปหน้าการจัดการสิทธิ์
   - ใส่อีเมลผู้อนุมัติ
   - Save

2. **ส่งคำขอยืม:**
   - กรอกข้อมูลครบ
   - ใส่อีเมลของคุณ
   - ส่งคำขอ

3. **ตรวจอีเมล:**
   - ✅ ผู้ยืมได้อีเมลยืนยันคำขอ
   - ✅ ผู้อนุมัติได้อีเมลแจ้งเตือน

4. **ผู้อนุมัติพิจารณา:**
   - คลิกลิงก์ในอีเมล
   - Login
   - ไปหน้า Log การยืม
   - คลิกปุ่มอนุมัติ/ไม่อนุมัติ

5. **ตรวจอีเมลอีกครั้ง:**
   - ✅ ผู้ยืมได้อีเมลแจ้งผล (อนุมัติ/ไม่อนุมัติ)
   - ✅ ผู้ดูแลระบบได้สำเนา

---

## 🎯 วิธีการทำงาน

### **Template 1 (Borrower) ใช้ส่ง 2 แบบ:**

**1. อีเมลยืนยันคำขอ:**
- ส่ง HTML ยืนยันคำขอผ่าน field `purpose`
- หัวข้อ: ✅ ยืนยันการส่งคำขอยืมคอมพิวเตอร์

**2. อีเมลแจ้งผลการอนุมัติ:**
- ส่ง HTML แจ้งผลผ่าน field `purpose`
- หัวข้อ: ✅ อนุมัติคำขอยืมคอมพิวเตอร์

**Template 2 (Approver) ใช้แค่:**
- ส่งแจ้งผู้อนุมัติให้พิจารณา

---

## ✅ ข้อดี

- ใช้แค่ 2 Templates (ไม่เกิน Limit ของ EmailJS ฟรี)
- ส่งอีเมลได้ครบทั้ง 3 แบบ
- ไม่ต้องเสียเงิน Upgrade

---

## 🔧 แก้ปัญหา

### **อีเมลแสดง {{{purpose}}} แทน HTML:**
- ต้องใช้วงเล็บปีกกา 3 ชั้น `{{{purpose}}}`
- **ไม่ใช่** 2 ชั้น `{{purpose}}`

### **อีเมลยังส่งผิดคน:**
- ตรวจสอบ To Email = `{{to_email}}`
- ไม่ใช่อีเมลตายตัว

### **อีเมลแจ้งผลไม่มา:**
- ตรวจสอบว่าแก้ Template 1 เป็น `{{{purpose}}}` แล้ว
- ตรวจสอบ Spam

---

## 📊 สรุป Templates

| Template | ชื่อ | Content | ใช้ส่ง |
|----------|------|---------|--------|
| 1 | Borrower | `{{{purpose}}}` | อีเมลยืนยัน + แจ้งผล |
| 2 | Approver | HTML แบบเต็ม | แจ้งผู้อนุมัติ |

---

## 📞 ติดต่อ

suttipong.p@psu.ac.th | 9608

---

## 🎉 พร้อมใช้งาน!

ระบบใช้แค่ 2 Templates แต่ส่งอีเมลได้ครบทุกแบบ! 🚀
