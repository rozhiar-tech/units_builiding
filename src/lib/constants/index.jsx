import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiLibrary,
    HiChartPie,
    HiChatAlt2,
    HiClock,
    HiCurrencyDollar,
    HiOutlineUserGroup,
    HiOutlineDocumentSearch,
    HiOutlineClipboardList,
    HiOutlineClipboardCheck,
    HiOutlineClipboard,
    HiOutlineChartSquareBar,
    HiOutlineCash,
    HiOutlineCalculator,
    HiOutlineCreditCard,
    HiOutlineCurrencyDollar,
    HiAcademicCap,
    HiOutlineTruck,
    HiOutlineDatabase,
    HiOutlinePresentationChartBar,
    HiOutlineCheckCircle,
    HiOutlineBriefcase,
    HiOutlineHome
} from 'react-icons/hi'
import { AiOutlineCoffee } from 'react-icons/ai'

export const DASHBOARD_SIDEBAR_LINKS = [
    { key: 'dashboard', labelKey: 'sidebar.dashboard', path: '/', icon: <HiOutlineViewGrid /> },
    { key: 'super-admin', labelKey: 'Super Admin', path: '/super-admin', icon: <HiOutlineUserGroup /> },
    { key: 'products', labelKey: 'sidebar.products', path: '/products', icon: <HiOutlineCube /> },
    { key: 'orders', labelKey: 'sidebar.orders', path: '/orders', icon: <HiOutlineShoppingCart /> },
    { key: 'customers', labelKey: 'sidebar.customers', path: '/customers', icon: <HiOutlineUsers /> },
    { key: 'transactions', labelKey: 'sidebar.transactions', path: '/transactions', icon: <HiOutlineDocumentText /> },
    { key: 'expences', labelKey: 'sidebar.expences', path: '/expences', icon: <HiChartPie /> },
    { key: 'services', labelKey: 'sidebar.services', path: '/services', icon: <HiLibrary /> },
    { key: 'broadcast', labelKey: 'sidebar.broadcast', path: '/broadcast', icon: <HiChatAlt2 /> },
    { key: 'timeline', labelKey: 'sidebar.timeline', path: '/timeline', icon: <HiClock /> },
    { key: 'offers', labelKey: 'sidebar.offers', path: '/offers', icon: <AiOutlineCoffee /> },
    { key: 'monthly-payment', labelKey: 'Monthly Payment', path: '/monthly-payment', icon: <HiCurrencyDollar /> },
    {
        key: 'legal-documents',
        labelKey: 'Legal Documents',
        path: '/legal-documents',
        icon: <HiOutlineDocumentSearch />
    },
    {
        key: 'compliance-requirements',
        labelKey: 'Compliance Requirements',
        path: '/compliance-requirements',
        icon: <HiOutlineClipboardList />
    },
    {
        key: 'legal-contracts',
        labelKey: 'Legal Contracts',
        path: '/legal-contracts',
        icon: <HiOutlineClipboardCheck />
    },
    {
        key: 'compliance-reports',
        labelKey: 'Compliance Reports',
        path: '/compliance-reports',
        icon: <HiOutlineClipboard />
    },
    {
        key: 'finance-dashboard',
        labelKey: 'Finance Dashboard',
        path: '/finance-dashboard',
        icon: <HiOutlineChartSquareBar />
    },
    { key: 'sales-revenue', labelKey: 'Sales Revenue', path: '/sales-revenue', icon: <HiOutlineCash /> },
    { key: 'expense-reports', labelKey: 'Expense Reports', path: '/expense-reports', icon: <HiOutlineCalculator /> },
    { key: 'payroll-data', labelKey: 'Payroll Data', path: '/payroll-data', icon: <HiOutlineCreditCard /> },
    {
        key: 'maintenance-costs',
        labelKey: 'Maintenance Costs',
        path: '/maintenance-costs',
        icon: <HiOutlineCurrencyDollar />
    },
    {
        key: 'financial-reports',
        labelKey: 'Financial Reports',
        path: '/financial-reports',
        icon: <HiCurrencyDollar />
    },
    { key: 'budgets', labelKey: 'Budgets', path: '/budgets', icon: <HiOutlineCreditCard /> },
    {
        key: 'payment-processing',
        labelKey: 'Payment Processing',
        path: '/payment-processing',
        icon: <HiOutlineCurrencyDollar />
    },
    {
        key: 'inventory-dashboard',
        labelKey: 'Inventory Dashboard',
        path: '/inventory-dashboard',
        icon: <HiAcademicCap />
    },
    {
        key: 'procurement-orders',
        labelKey: 'Procurement Orders',
        path: '/procurement-orders',
        icon: <HiOutlineTruck />
    },
    {
        key: 'stock-levels',
        labelKey: 'Stock Levels',
        path: '/stock-levels',
        icon: <HiOutlineDatabase />
    },
    {
        key: 'inventory-reports',
        labelKey: 'Inventory Reports',
        path: '/inventory-reports',
        icon: <HiOutlinePresentationChartBar />
    },
    {
        key: 'stock-availability',
        labelKey: 'Stock Availability',
        path: '/stock-availability',
        icon: <HiOutlineCheckCircle />
    },
    {
        key: 'inventory-dashboard',
        labelKey: 'Inventory Dashboard',
        path: '/inventory-dashboard',
        icon: <HiOutlineChartSquareBar />
    },
    {
        key: 'procurement-orders',
        labelKey: 'Procurement Orders',
        path: '/procurement-orders',
        icon: <HiOutlineBriefcase />
    },
    {
        key: 'stock-levels',
        labelKey: 'Stock Levels',
        path: '/stock-levels',
        icon: <HiOutlineBriefcase />
    },
    {
        key: 'inventory-reports',
        labelKey: 'Inventory Reports',
        path: '/inventory-reports',
        icon: <HiOutlineBriefcase />
    },
    {
        key: 'stock-availability',
        labelKey: 'Stock Availability',
        path: '/stock-availability',
        icon: <HiOutlineBriefcase />
    },
    {
        key: 'property-listings',
        labelKey: 'Property Listings',
        path: '/property-listings',
        icon: <HiOutlineHome />
    },
    {
        key: 'market-analysis',
        labelKey: 'Market Analysis',
        path: '/market-analysis',
        icon: <HiOutlineChartSquareBar />
    },
    {
        key: 'property-evaluations',
        labelKey: 'Property Evaluations',
        path: '/property-evaluations',
        icon: <HiOutlineClipboardCheck />
    },
    {
        key: 'sales-listings',
        labelKey: 'Sales Listings',
        path: '/sales-listings',
        icon: <HiOutlineClipboardList />
    }
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
    // {
    //     key: 'settings',
    //     label: 'Settings',
    //     path: '/settings',
    //     icon: <HiOutlineCog />
    // },
    // {
    //     key: 'support',
    //     label: 'Help & Support',
    //     path: '/support',
    //     icon: <HiOutlineQuestionMarkCircle />
    // }
]
