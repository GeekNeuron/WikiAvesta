# مستندات پروژه YasnaArchive: سفری به اعماق دانش زرتشتی

[![YasnaArchive Logo Placeholder](https://placehold.co/600x300/0f0f1e/c0cfff?text=YasnaArchive&font=lora)](https://geekneuron.github.io/YasnaArchive/) **YasnaArchive** یک دانشنامه دیجیتال پیشرو و کاوشی در ژرفای تاریخ، فرهنگ، و آموزه‌های آیین باستانی زرتشت است. این پروژه با هدف ارائه تجربه‌ای مدرن، جذاب، و "کهکشانی" برای علاقه‌مندان به یکی از کهن‌ترین ادیان جهان طراحی و توسعه داده شده است.

## 🌌 اهداف پروژه (Project Goals)

* **ایجاد یک مرجع دیجیتال جامع:** گردآوری و ارائه اطلاعات دقیق و مستند در مورد تاریخ، پیامبر، کتاب مقدس (اوستا)، خط و زبان، و شجره‌نامه شخصیت‌های کلیدی آیین زرتشت.
* **تجربه کاربری نوین و جذاب:** استفاده از طراحی مدرن، تم‌های بصری الهام‌گرفته از کیهان، و انیمیشن‌های ظریف برای ایجاد یک محیط مطالعه دلپذیر و غوطه‌ورکننده.
* **دسترسی‌پذیری و واکنش‌گرایی:** اطمینان از اینکه محتوا بر روی تمامی دستگاه‌ها (موبایل، تبلت، دسکتاپ) به بهترین شکل نمایش داده شود و برای همه کاربران، از جمله افراد با نیازهای خاص، قابل استفاده باشد.
* **شخصی‌سازی تجربه خواندن:** ارائه تنظیمات گسترده برای فونت، رنگ، چینش متن، و سایر جنبه‌های بصری برای راحتی کاربران.
* **ارائه محتوا به شکلی نوآورانه:** استفاده از المان‌های تعاملی مانند گاه‌شمار، نمایش دینامیک خطوط باستانی، و "گوی‌های دانش" برای درک بهتر مفاهیم.

## ✨ ویژگی‌های کلیدی (Key Features)

* **محتوای پویا:** بارگذاری تمام محتوای بخش‌ها از فایل‌های JSON ساختاریافته.
* **تم‌های چندگانه:**
    * تم روشن (پیش‌فرض)
    * تم تاریک "کیهانی" با پس‌زمینه ستاره‌ای متحرک.
    * تم خواندن "سپیا" برای مطالعه طولانی‌مدت.
* **طراحی کاملاً واکنش‌گرا (Responsive).**
* **تنظیمات پیشرفته مطالعه:**
    * کنترل اندازه فونت، نوع فونت، و فاصله بین خطوط.
    * انتخاب چینش متن (راست، چپ، وسط، تراز).
    * تنظیم عرض ناحیه محتوا.
    * حالت مطالعه تمام صفحه.
    * گزینه روشن نگه داشتن صفحه (با Wake Lock API).
    * حالت مطالعه غوطه‌ور برای تمرکز بیشتر.
* **ناوبری پیشرفته:**
    * منوی همبرگری برای موبایل.
    * (اختیاری) نمای ناوبری "صورت فلکی" برای صفحه اصلی.
* **جستجوی داخلی (Client-Side Search):** با قابلیت برجسته‌سازی کلمات کلیدی.
* **گاه‌شمار (Timeline) تعاملی:** برای نمایش رویدادهای تاریخی.
* **نمایش دینامیک خطوط باستانی:** با اطلاعات تکمیلی هنگام هاور.
* **المان‌های بصری "کهکشانی":** مانند "گوی‌های دانش" و افکت پارالاکس.
* **افکت‌های صوتی ظریف (اختیاری):** با قابلیت فعال/غیرفعال کردن.
* **دکمه بازگشت به بالا و مدیریت اسکرول.**

## 🚀 فناوری‌های استفاده شده (Technology Stack)

* **HTML5:** برای ساختار اصلی صفحات.
* **CSS3:** برای استایل‌دهی، انیمیشن‌ها، و طراحی واکنش‌گرا (شامل متغیرهای CSS، Flexbox، Grid).
* **JavaScript (Vanilla JS):** برای تمام منطق‌های تعاملی، بارگذاری محتوا، مدیریت تنظیمات، و API های مرورگر (مانند LocalStorage, Fullscreen API, Wake Lock API, Intersection Observer API).
* **JSON:** برای مدیریت و ذخیره‌سازی تمام محتوای دانشنامه به صورت ساختاریافته و جدا از کد.

## 📂 ساختار پروژه (Project Structure)

YasnaArchive/├── index.html                 # فایل اصلی HTML├── css/│   └── style.css              # تمام استایل‌های CSS├── js/│   └── main.js                # تمام کدهای JavaScript├── data/                      # پوشه برای فایل‌های JSON داده‌ها│   ├── general.json           # اطلاعات عمومی و ساختار منو/کاشی‌ها│   ├── history.json           # محتوای بخش تاریخ و گاه‌شمار│   ├── prophet.json           # محتوای بخش پیامبر│   ├── scripture.json         # محتوای بخش اوستا│   ├── script_language.json   # محتوای بخش خط و زبان│   └── genealogy.json         # محتوای بخش شجره‌نامه└── assets/                    # پوشه برای فایل‌های جانبی├── images/                # تصاویر (پس‌زمینه‌ها، آیکون‌ها، نمونه خطوط و ...)│   └── icons/├── fonts/                 # فایل‌های فونت سفارشی (مانند وزیرمتن)└── audio/                 # فایل‌های صوتی برای افکت‌ها و تلفظ‌ها
## 🛠️ راه‌اندازی و اجرا (Setup & Running)

این پروژه یک وب‌سایت ایستا (Static Website) است و نیازی به محیط سمت سرور خاصی ندارد.

1.  ریپازیتوری پروژه را از گیت‌هاب Clone کنید:
    ```bash
    git clone https://github.com/GeekNeuron/YasnaArchive.git
    ```
2.  پوشه `YasnaArchive` را در مرورگر خود باز کنید (با دوبار کلیک روی فایل `index.html`).
3.  برای انتشار آنلاین، می‌توانید از سرویس‌هایی مانند **GitHub Pages** استفاده کنید:
    * اطمینان حاصل کنید که پروژه شما در یک ریپازیتوری گیت‌هاب (مثلاً `GeekNeuron/YasnaArchive`) قرار دارد.
    * در تنظیمات ریپازیتوری، به بخش "Pages" بروید.
    * شاخه `main` (یا `master`) و پوشه `/ (root)` را به عنوان منبع انتخاب و ذخیره کنید.
    * سایت شما پس از چند دقیقه در آدرسی مانند `https://GeekNeuron.github.io/YasnaArchive/` در دسترس خواهد بود.

## 📜 مدیریت محتوا (Content Management)

تمام محتوای متنی و ساختاری دانشنامه در فایل‌های `.json` داخل پوشه `data/` ذخیره می‌شود. برای افزودن یا ویرایش محتوا:

* فایل JSON مربوط به بخش مورد نظر را باز کنید (مثلاً `history.json` برای بخش تاریخ).
* محتوا را با رعایت ساختار JSON موجود ویرایش یا اضافه کنید.
* تغییرات به طور خودکار پس از بارگذاری مجدد صفحه در سایت اعمال خواهند شد.

**نکته مهم:** دقت در حفظ ساختار صحیح JSON برای جلوگیری از خطا در بارگذاری محتوا ضروری است.

## 🤝 مشارکت (Contributing) - اختیاری

(USER: در صورت تمایل به دریافت مشارکت از دیگران، می‌توانید این بخش را تکمیل کنید. مثلاً با توضیح نحوه گزارش اشکال، پیشنهاد ویژگی جدید، یا ارسال Pull Request.)

* گزارش اشکالات (Bug Reports): از طریق بخش "Issues" در ریپازیتوری گیت‌هاب.
* پیشنهاد ویژگی‌ها (Feature Requests): همچنین از طریق بخش "Issues".
* ارسال تغییرات (Pull Requests): برای اصلاحات یا افزودن محتوا/ویژگی‌های جدید، پس از هماهنگی.

## 👤 سازنده (Author)

* **GeekNeuron**
    * GitHub: [https://github.com/GeekNeuron](https://github.com/GeekNeuron)

## 📄 مجوز (License) - اختیاری

(USER: یک مجوز برای پروژه خود انتخاب و اضافه کنید. مثلاً MIT License)

MIT LicenseCopyright (c) 2025 [GeekNeuron]Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the "Software"), to dealin the Software without restriction, including without limitation the rightsto use, copy, modify, merge, publish, distribute, sublicense, and/or sellcopies of the Software, and to permit persons to whom the Software isfurnished to do so, subject to the following conditions:The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS ORIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THEAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHERLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THESOFTWARE.
---

با سپاس از همراهی شما در این سفر کهکشانی به دنیای دانش زرتشتی!
