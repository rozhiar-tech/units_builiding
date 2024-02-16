import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { format } from 'date-fns'

export default function TransactionChart() {
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch expenses from the Expenses collection
                const expensesCollection = collection(firestore, 'Expenses')
                const expensesSnapshot = await getDocs(expensesCollection)
                const expensesData = expensesSnapshot.docs.map((doc) => ({
                    identifierField: doc.id, // Use the appropriate field from the 'Expenses' collection
                    Expense: Number(doc.data().amount),
                    date: doc.data().timestamp.toDate()
                }))
                console.log(expensesData)

                // Fetch income from the Transaction collection
                const transactionCollection = collection(firestore, 'Transactions')
                const transactionSnapshot = await getDocs(transactionCollection)
                const incomeData = transactionSnapshot.docs.map((doc) => ({
                    identifierField: doc.id, // Use the appropriate field from the 'Transactions' collection
                    Income: Number(doc.data().downPayment),
                    date: doc.data().transactionDate.toDate() // Assuming 'transactionDate' is a Firebase timestamp field
                }))
                console.log(incomeData)

                // Merge the two datasets based on the 'name' field
                const mergedData = expensesData.map((expenseItem) => {
                    const correspondingIncomeItem = incomeData.find(
                        (incomeItem) => incomeItem.name === expenseItem.name
                    )
                    return {
                        ...expenseItem,
                        Income: correspondingIncomeItem ? correspondingIncomeItem.Income : 0
                    }
                })
                const formattedData = mergedData.map((item) => ({
                    ...item,
                    date: format(item.date, 'MMM d, yyyy HH:mm:ss')
                }))

                setChartData(formattedData)
            } catch (error) {
                console.error('Error fetching data for TransactionChart:', error.message)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
            <strong className="text-gray-700 font-medium">Transactions</strong>
            <div className="mt-3 w-full flex-1 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 10,
                            left: -10,
                            bottom: 0
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Income" fill="#0ea5e9" />
                        <Bar dataKey="Expense" fill="#ea580c" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
