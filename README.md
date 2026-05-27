# 🎓 منصة د. رحمة مرسي — محاضرات بيولوجيا

**منصة تعليمية محمية لمحاضرات الدكتورة رحمة مرسي — جامعة الإسكندرية · كلية التربية**

---

## 📁 هيكل المشروع

```
dr-rahma-platform/
├── index.html          ← الصفحة الرئيسية (entry point)
├── css/
│   ├── main.css        ← الأنماط العامة (تسجيل دخول، هيدر، بطاقات، الفوتر)
│   ├── player.css      ← مشغل الفيديو وعناصره
│   └── admin.css       ← لوحة تحكم المشرف
├── js/
│   ├── data.js         ← بيانات الفيديوهات والأكواد والطلاب
│   ├── security.js     ← نظام الحماية المتعدد الطبقات
│   ├── player.js       ← منطق مشغل الفيديو
│   └── app.js          ← التطبيق الرئيسي (login, render, navigation)
└── README.md
```

---

## 🚀 تشغيل المشروع

```bash
# افتح الملف مباشرة في المتصفح
open index.html

# أو عبر VS Code Live Server
# أو أي خادم ثابت
```

---

## 🔑 أكواد الدخول (للاختبار)

| الكود | الدور | المادة |
|-------|-------|--------|
| `admin2025` | مشرف | كل الصلاحيات |
| `bio2025`   | طالب | أحياء خلوية |
| `gen2025`   | طالب | علم الوراثة |
| `chem2025`  | طالب | كيمياء حيوية |
| `phys2025`  | طالب | فسيولوجيا النبات |
| `anat2025`  | طالب | أناتومي |

> ⚠️ في الإنتاج: لا تُخزَّن الأكواد في الـ Frontend — يجب نقلها لـ Backend API.

---

## 🛡 طبقات الحماية

| الطبقة | الوصف | الحالة |
|--------|-------|--------|
| Right-click disabled | منع النقر اليميني | ✅ مفعّل |
| DevTools detection | رصد أدوات المطور | ✅ مفعّل |
| Keyboard shortcuts blocked | حظر F12, Ctrl+Shift+I, Ctrl+U | ✅ مفعّل |
| PrintScreen detection | رصد محاولات لقطة الشاشة | ✅ مفعّل |
| Dynamic Watermark | اسم الطالب + وقت المشاهدة | ✅ مفعّل |
| Anti-copy | منع Copy/Paste | ✅ مفعّل |
| Anti-drag | منع سحب العناصر | ✅ مفعّل |
| Session timeout | انتهاء الجلسة بعد ساعتين | ✅ مفعّل |
| Anti-iframe | منع تضمين المنصة في إطار خارجي | ✅ مفعّل |
| Violation counter | تسجيل خروج تلقائي بعد 3 انتهاكات | ✅ مفعّل |

---

## 🔧 التخصيص

### تغيير بيانات الفيديوهات
عدّل `js/data.js` — مصفوفة `VIDEOS`

### تغيير الأكواد
عدّل `js/data.js` — كائن `ACCESS_CODES`  
> للإنتاج: انقلها لقاعدة بيانات مع تشفير bcrypt

### نشر على GitHub Pages
```bash
git init
git add .
git commit -m "🚀 Initial commit — Dr. Rahma Mersi Platform"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```
ثم فعّل GitHub Pages من Settings → Pages → Source: main branch

---

## 📌 ملاحظات تقنية

- **لا يوجد backend** — كل شيء Frontend (مناسب للعرض التوضيحي)
- للمنصة الكاملة الآمنة: يلزم Node.js/PHP backend + قاعدة بيانات + JWT
- الحماية الكاملة للفيديو (DRM حقيقي) تحتاج: **Cloudflare Stream** أو **Bunny.net** مع HLS Encryption

---

## 🎨 التقنيات المستخدمة

- HTML5 + CSS3 + Vanilla JavaScript
- Google Fonts: Cairo + IBM Plex Mono
- بدون مكتبات خارجية (zero dependencies)
- RTL Arabic support

---

**جامعة الإسكندرية · كلية التربية · جميع الحقوق محفوظة 2025**
