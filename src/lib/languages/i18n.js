import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: {
                    description: {
                        part2: 'Dania city'
                    },
                    sales: {
                        tsales: 'Total Sales',
                        texpences: 'Total Expences',
                        tcustomers: 'Total Customers',
                        torders: 'Total Orders'
                    },
                    transaction: {
                        transactions: 'Transactions',
                        pcode: 'Property Code'
                    },
                    RecentOrders: {
                        title: 'Recent Orders',
                        id: 'Id',
                        uid: 'Unit ID',
                        cname: 'Client Name',
                        odate: 'Order Date',
                        ototal: 'Order Total',
                        ostatus: 'Order Status'
                    },
                    sidebar: {
                        dashboard: 'Dashboard',
                        products: 'Products',
                        orders: 'Orders',
                        customers: 'Customers',
                        transactions: 'Transactions',
                        expences: 'Expences',
                        services: 'Services',
                        broadcast: 'Broadcast',
                        timeline: 'Timeline',
                        offers: 'Offers'
                    },
                    log: {
                        logOut: 'Logout'
                    },
                    orders: {
                        admin: 'Admin',
                        client: 'Client',
                        email: 'Email Adrress',
                        password: 'Password',
                        phone: 'Phone Number',
                        fname: 'First Name',
                        lname: 'Last Name',
                        pcode: 'Property Code',
                        pplan: 'Payment Plan',
                        dpayment: 'Down Payment',
                        ovpayment: 'Overall Payment',
                        mpayment: 'Monthly Payment',
                        kpayment: 'Key Payment',
                        afkey: 'After Key Payment',
                        dopay: 'Date of the to pay',
                        utype: 'User Type',
                        propertycode: ' Filter by property code',
                        filtername: 'Filter Qualification'
                    },
                    customers: {
                        fname: 'First Name',
                        lname: 'Last Name',
                        email: 'Email',
                        pplan: 'Payment Plan',
                        dpayment: 'Down Payment',
                        pcode: 'Property Code',
                        phone: 'Phone Number',
                        action: 'Actions'
                    },
                    transactions: {
                        userId: 'User ID',
                        transactiondate: 'Transaction Date',
                        dpayment: 'Down Payment',
                        ovpayment: 'Overall Payment',
                        rpayment: 'Remaining Payment',
                        pcode: 'Property Code',
                        pmeter: 'Most Property Sold Based on the Area',
                        pplan: 'Payment Plan'
                    },
                    expences: {
                        description: 'Description',
                        amount: 'Amount',
                        add: 'Add Expense ',
                        list: 'Expense  List',
                        date: 'Date'
                    },
                    services: {
                        add: 'Add Service',
                        description: 'Service Description',
                        name: 'Service Name',
                        date: 'Availability Date'
                    },
                    messages: {
                        add: 'Add a Messages',
                        header: 'Message Header',
                        body: 'Message Body',
                        building: 'Building'
                    },
                    timeline: {
                        add: 'Add a Timeline',
                        building: 'Building',
                        date: 'Milestone Date',
                        description: 'Milestone Description'
                    },
                    offers: {
                        add: 'Add New Offer',
                        name: 'Offer Name',
                        description: 'Offer Description',
                        start: 'Start Date',
                        end: 'End Date'
                    },
                    client: {
                        welcome: 'Welcome',
                        dpayment: 'Down Payment',
                        mpayment: 'Monthly Payment',
                        npayment: 'Next Payment Date',
                        upayment: 'Days until Next Payment',
                        step: 'Current Step',
                        section: 'Service Section',
                        psection: 'Property Section',
                        pview: 'Property View',
                        floor: 'Floor',
                        anumber: 'Apartment Number',
                        area: 'Area (متر)',
                        pmeter: 'Price Per Square Meter',
                        total: 'Total Price',
                        of: 'of every Month',
                        new: 'New Messages',
                        offer: 'Offers',
                        map: ' Map Of your Apartment'
                    }
                }
            },
            ar: {
                translation: {
                    description: {
                        part2: 'دانیا سیتی'
                    },
                    sales: {
                        tsales: 'إجمالي المبيعات',
                        texpences: 'المصروفات الكلية',
                        tcustomers: 'إجمالي العملاء',
                        torders: 'إجمالي الطلبات'
                    },
                    transaction: {
                        transactions: 'المعاملات',
                        pcode: 'رمز الملكية'
                    },
                    RecentOrders: {
                        title: 'الطلبيات الأخيرة',
                        id: 'بطاقة تعريف',
                        uid: 'معرف الوحدة',
                        cname: 'اسم العميل',
                        odate: 'تاريخ الطلب',
                        ototal: 'الطلب الكلي',
                        ostatus: 'حالة الطلب'
                    },
                    sidebar: {
                        dashboard: 'لوحة القيادة',
                        products: 'منتجات',
                        orders: 'طلبات',
                        customers: 'عملاء',
                        transactions: 'المعاملات',
                        expences: 'النفقات',
                        services: 'خدمات',
                        broadcast: 'إذاعة',
                        timeline: 'الجدول الزمني',
                        offers: 'عروض'
                    },
                    log: {
                        logOut: 'خروج'
                    },

                    orders: {
                        admin: 'مسؤل',
                        client: 'عميل',
                        email: 'عنوان البريد الإلكتروني',
                        password: 'كلمة المرور',
                        phone: 'رقم التليفون',
                        fname: 'الاسم الأول',
                        lname: 'اسم العائلة',
                        pcode: 'رمز الملكية',
                        pplan: 'خطة الدفع',
                        dpayment: 'دفعة مبدئية',
                        ovpayment: 'الدفع الشامل',
                        mpayment: 'الدفع الشهري',
                        kpayment: 'عندما تلقى المفتاح الدفع',
                        afkey: 'بعد استلام المفتاح الدفع',
                        dopay: 'تاريخ السداد',
                        utype: 'نوع المستخدم',
                        propertycode: ' تصفية حسب رمز الملكية',
                        filtername: 'تصفية المؤهلات'
                    },
                    customers: {
                        fname: 'الاسم الأول',
                        lname: 'اسم العائلة',
                        email: 'عنوان البريد الإلكتروني',
                        pplan: 'خطة الدفع',
                        dpayment: 'دفعة مبدئية',
                        pcode: 'رمز الملكية',
                        phone: 'رقم التليفون',
                        action: 'أجراءات'
                    },
                    transactions: {
                        userId: 'معرف المستخدم',
                        transactiondate: 'تاريخ الصفقة',
                        dpayment: 'دفعة مبدئية',
                        ovpayment: 'الدفع الشامل',
                        rpayment: 'الدفع المتبقي',
                        pcode: 'رمز الملكية',
                        pplan: 'خطة الدفع',
                        pmeter: 'تم بيع معظم العقارات بناءً على المنطقة'
                    },
                    expences: {
                        description: 'وصف',
                        amount: 'كمية',
                        add: 'أضف النفقات',
                        list: 'قائمة النفقات',
                        date: 'تاريخ'
                    },
                    services: {
                        add: 'أضف الخدمة',
                        description: 'وصف الخدمة',
                        name: 'اسم الخدمة',
                        date: 'تاريخ التوفر'
                    },
                    messages: {
                        add: 'إضافة رسائل',
                        header: 'رأس الرسالة',
                        body: 'محتوى الرسالة',
                        building: 'مبنى'
                    },
                    timeline: {
                        add: 'أضف جدولًا زمنيًا',
                        building: 'مبنى',
                        date: 'تاريخ الحدث',
                        description: 'وصف الحدث'
                    },
                    offers: {
                        name: 'اسم العرض',
                        description: 'وصف العرض',
                        start: 'تاريخ البدء',
                        end: 'تاريخ الانتهاء',
                        add: 'إضافة عرض جديد'
                    },
                    client: {
                        welcome: 'مرحباً',
                        dpayment: 'دفعة مبدئية',
                        mpayment: 'الدفع الشهري',
                        npayment: 'تاريخ الدفع التالي',
                        upayment: 'أيام حتى الدفعة التالية',
                        step: 'الخطوة الحالية',
                        section: 'قسم الخدمة',
                        psection: 'قسم الممتلكات',
                        pview: 'عرض العقار',
                        floor: 'أرضية',
                        anumber: 'رقم الشقة',
                        area: 'المساحة (متر)',
                        pmeter: 'سعر المتر المربع',
                        total: 'السعر الكلي',
                        of: 'من كل شهر',
                        new: 'رسائل جديدة',
                        offer: 'عروض',
                        map: ' خريطة شقتك'
                    }
                }
            },
            ku: {
                translation: {
                    description: {
                        part2: 'دانیا سیتی'
                    },
                    sales: {
                        tsales: 'کۆی فرۆش',
                        texpences: 'کۆی خەرجیەکان',
                        tcustomers: 'کۆی کڕیارەکان',
                        torders: 'کۆی داواکاریەکان'
                    },
                    transaction: {
                        transactions: 'معامەلات',
                        pcode: 'ئامڕازی بەرهەم'
                    },
                    RecentOrders: {
                        title: 'داواکاریەکان',
                        id: 'ئایدی',
                        uid: 'ئایدی یەکە',
                        cname: 'ناوی کڕیار',
                        odate: 'بەرواری داواکاری',
                        ototal: 'کۆی داواکاریی',
                        ostatus: 'حاڵی داواکاری'
                    },
                    sidebar: {
                        dashboard: 'داشبۆرد',
                        products: 'بەرهەمەکان',
                        orders: 'داواکاریەکان',
                        customers: 'کڕیارەکان',
                        transactions: 'ئاڵوگۆڕیەکان',
                        expences: 'خەرجیەکان',
                        services: 'کارەکان',
                        broadcast: 'بڵاوکردنەوە',
                        timeline: 'کات',
                        offers: 'ئۆفەرکان'
                    },
                    log: {
                        logOut: 'چوونە دەرەوە'
                    },
                    orders: {
                        admin: 'ئادمین',
                        client: 'کڕیار',
                        email: 'ناونیشانی پۆستی ئەلیکترۆنی',
                        password: 'تێپەڕ وشە',
                        phone: 'ژمارەی تەلەفون',
                        fname: 'ناوی یەکەم',
                        lname: 'ناوی کۆتا',
                        pcode: 'کۆدی زەوی',
                        pplan: 'شێوازی پارەیان',
                        dpayment: 'پارەی سەرەتا',
                        ovpayment: 'کۆی پارە',
                        mpayment: 'پارەی مانگانە',
                        kpayment: 'پارەی کاتی کلیل',
                        afkey: 'پارەی مانگانەی دوای کلیل',
                        dopay: 'ڕۆژی پارەیانی مانگانە',
                        utype: 'جۆری بەکارهێنەر',
                        propertycode: 'فلتەر کردن بە کۆدی شوقە',
                        filtername: 'شێوازی فلتەرکردن'
                    },
                    customers: {
                        fname: 'ناوی یەکەم',
                        lname: 'ناوی کۆتا',
                        email: 'ناونیشانی پۆستی ئەلیکترۆنی',
                        pplan: 'شێوازی پارەیان',
                        dpayment: 'پارەی سەرەتا',
                        pcode: 'کۆدی زەوی',
                        phone: 'ژمارەی تەلەفون',
                        action: 'کردار'
                    },
                    transactions: {
                        userId: 'ناسەرەوە',
                        transactiondate: 'بەرواری کرین',
                        dpayment: 'پارەی سەرەتا',
                        ovpayment: 'کۆی پارە',
                        rpayment: 'پارەی ماوە',
                        pcode: 'کۆدی زەوی',
                        pplan: 'شێوازی پارەیان',
                        pmeter: 'زۆر ترین فرۆشی مۆڵک لەسەر بنەمای ڕووبەر'
                    },
                    expences: {
                        description: 'ناوڕۆک',
                        amount: 'بڕ',
                        add: 'زیاد کردنی خەرجی',
                        list: 'لیستی خەرجیەکان',
                        date: 'بەروار'
                    },
                    services: {
                        add: 'زیاد کردنی خزمەتگوزاری',
                        description: 'وردەکاری خزمەتگوزاری',
                        name: 'ناوی خزمەتگوزاری',
                        date: 'بەروار'
                    },
                    messages: {
                        add: 'ناردنی نامە',
                        header: 'بابەتی نامە',
                        body: 'ناوڕۆکی نامە',
                        building: 'بینا'
                    },
                    timeline: {
                        add: 'زیاد کردنی مەودا',
                        building: 'بینا',
                        date: 'بەرواری مەودا',
                        description: 'وەسفی مەودا'
                    },
                    offers: {
                        name: 'ناوی ئۆفەر',
                        description: 'وەسفی ئۆفەر',
                        start: 'بەرواری دەست پێکردن',
                        end: 'بەرواری کۆتایهاتن',
                        add: 'زیاد کردنی ئۆفەر'
                    },
                    client: {
                        welcome: 'بەخێر بێیت',
                        dpayment: 'پارەی سەرەتا',
                        mpayment: 'پارەی مانگانە',
                        npayment: 'پارەیانی داهاتووت',
                        upayment: 'رۆژ تا پارەیانی داهاتووت',
                        step: 'هەنگاوی ئێستا',
                        section: 'بەشی خزمەت گوزاری',
                        psection: 'دەربارەی موڵکەکەت',
                        pview: 'ڕووی موڵکەکەت',
                        floor: 'نهۆم',
                        anumber: 'ژمارەی موڵکەکەت',
                        area: 'ڕووبەر (متر)',
                        pmeter: 'نرخ بۆ هەر مەتر دووجایەک',
                        total: 'کۆی پارە',
                        of: 'هەموو مانگێک',
                        new: 'نامەی تازە',
                        offer: 'ئۆفەرەکان',
                        map: 'نەخشەی شوقەکەت'
                    }
                }
            }
        }
    })

export default i18n
