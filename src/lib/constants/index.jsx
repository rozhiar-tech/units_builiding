import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiLibrary,
    HiChartPie,
    HiChatAlt2,
    HiClock
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'products',
        label: 'Products',
        path: '/products',
        icon: <HiOutlineCube />
    },
    {
        key: 'orders',
        label: 'Orders',
        path: '/orders',
        icon: <HiOutlineShoppingCart />
    },
    {
        key: 'customers',
        label: 'Customers',
        path: '/customers',
        icon: <HiOutlineUsers />
    },
    {
        key: 'transactions',
        label: 'Transactions',
        path: '/transactions',
        icon: <HiOutlineDocumentText />
    },
    {
        key: 'expences',
        label: 'Expences',
        path: '/expences',
        icon: <HiChartPie />
    },
    {
        key: 'services',
        label: 'Services',
        path: '/services',
        icon: <HiLibrary />
    },
    {
        key: 'broadcast',
        label: 'Broadcast',
        path: '/broadcast',
        icon: <HiChatAlt2 />
    },
    {
        key: 'timeline',
        label: 'Timeline',
        path: '/timeline',
        icon: <HiClock />
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
