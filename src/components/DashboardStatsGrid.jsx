import React, { useState, useEffect } from 'react'
import { IoBagHandle, IoPieChart, IoPeople, IoCart } from 'react-icons/io5'
import { collection, getDocs, firestore } from '../firebase/initFirebase'

export default function DashboardStatsGrid() {
    const [totalSales, setTotalSales] = useState(0)
    const [totalExpenses, setTotalExpenses] = useState(0)
    const [totalCustomers, setTotalCustomers] = useState(0)
    const [totalOrders, setTotalOrders] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            // Fetch total sales from the Transaction collection
            const transactionCollection = collection(firestore, 'Transactions')
            const transactionSnapshot = await getDocs(transactionCollection)
            const sales = transactionSnapshot.docs.reduce((acc, doc) => acc + parseFloat(doc.data().downPayment), 0)
            setTotalSales(sales.toFixed(2))

            // Fetch total expenses from the Expenses collection
            const expensesCollection = collection(firestore, 'Expenses')
            const expensesSnapshot = await getDocs(expensesCollection)
            const expenses = expensesSnapshot.docs.reduce((acc, doc) => acc + Number(doc.data().amount), 0)
            setTotalExpenses(expenses)

            // Fetch total customers from the Users collection where userType is 'client'
            const usersCollection = collection(firestore, 'Users')
            const usersSnapshot = await getDocs(usersCollection)
            const customers = usersSnapshot.docs.filter((doc) => doc.data().userType === 'client').length
            setTotalCustomers(customers)

            // Fetch total orders from the Transaction collection
            const orders = transactionSnapshot.docs.length
            setTotalOrders(orders)
        }

        fetchData()
    }, [])

    return (
        <div className="flex gap-4">
            <BoxWrapper>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
                    <IoBagHandle className="text-2xl text-white" />
                </div>
                <div className="pl-4">
                    <span className="text-sm text-gray-500 font-light">Total Sales</span>
                    <div className="flex items-center">
                        <strong className="text-xl text-gray-700 font-semibold">${totalSales}</strong>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
                    <IoPieChart className="text-2xl text-white" />
                </div>
                <div className="pl-4">
                    <span className="text-sm text-gray-500 font-light">Total Expenses</span>
                    <div className="flex items-center">
                        <strong className="text-xl text-gray-700 font-semibold">${totalExpenses}</strong>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
                    <IoPeople className="text-2xl text-white" />
                </div>
                <div className="pl-4">
                    <span className="text-sm text-gray-500 font-light">Total Customers</span>
                    <div className="flex items-center">
                        <strong className="text-xl text-gray-700 font-semibold">{totalCustomers}</strong>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
                    <IoCart className="text-2xl text-white" />
                </div>
                <div className="pl-4">
                    <span className="text-sm text-gray-500 font-light">Total Orders</span>
                    <div className="flex items-center">
                        <strong className="text-xl text-gray-700 font-semibold">{totalOrders}</strong>
                    </div>
                </div>
            </BoxWrapper>
        </div>
    )
}

function BoxWrapper({ children }) {
    return <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">{children}</div>
}
