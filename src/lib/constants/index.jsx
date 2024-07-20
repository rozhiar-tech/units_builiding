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
    HiOutlineClipboard
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
