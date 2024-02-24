import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { getOrderStatus } from '../lib/helpers'
import { useTranslation } from 'react-i18next'

export default function RecentOrders() {
    const [recentOrderData, setRecentOrderData] = useState([])
    const { t } = useTranslation()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactionsCollection = collection(firestore, 'Transactions')
                const transactionsSnapshot = await getDocs(transactionsCollection)
                const transactionsData = transactionsSnapshot.docs.map((doc) => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        unit_id: data.propertyCode,
                        client_id: data.userId,
                        order_date: data.transactionDate.toDate(),
                        order_total: `$${data.downPayment}`,
                        current_order_status: data.paymentPlan === true ? 'Payment Plan' : 'Payed',
                        client_name: data.userName
                    }
                })

                setRecentOrderData(transactionsData)
            } catch (error) {
                console.error('Error fetching data for RecentOrders:', error.message)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
            <strong className="text-gray-700 font-medium">{t('RecentOrders.title')}</strong>
            <div className="border-x border-gray-200 rounded-sm mt-3">
                <table className="w-full text-gray-700">
                    <thead>
                        <tr>
                            <th>{t('RecentOrders.id')}</th>
                            <th>{t('RecentOrders.uid')}</th>
                            <th>{t('RecentOrders.cname')}</th>
                            <th>{t('RecentOrders.odate')}</th>
                            <th>{t('RecentOrders.ototal')}</th>
                            <th>{t('RecentOrders.ostatus')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrderData.map((order) => (
                            <tr key={order.id}>
                                <td>
                                    <Link to={`/order/${order.id}`}>#{order.id}</Link>
                                </td>
                                <td>
                                    <Link to={`/product/${order.unit_id}`}>#{order.unit_id}</Link>
                                </td>
                                <td>
                                    <Link to={`/customer/${order.client_id}`}>{order.client_name}</Link>
                                </td>
                                <td>{format(new Date(order.order_date), 'dd MMM yyyy')}</td>
                                <td>{order.order_total}</td>
                                <td>{getOrderStatus(order.current_order_status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
