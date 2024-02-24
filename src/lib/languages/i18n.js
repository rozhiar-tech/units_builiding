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
                        timeline: 'Timeline'
                    },
                    log: {
                        logOut: 'Logout'
                    },
                    orders:{
                        
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
                        timeline: 'الجدول الزمني'
                    },
                    log: {
                        logOut: 'خروج'
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
                        timeline: 'کات'
                    },
                    log: {
                        logOut: 'چوونە دەرەوە'
                    }
                }
            }
        }
    })

export default i18n
