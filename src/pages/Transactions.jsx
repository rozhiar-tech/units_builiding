import React, { useState, useEffect } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const Transaction = () => {
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const transactionsCollection = collection(firestore, 'Transactions')
                const transactionsSnapshot = await getDocs(transactionsCollection)
                const transactionsData = transactionsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setTransactions(transactionsData)
            } catch (error) {
                console.error('Error fetching transactions:', error.message)
            }
        }

        fetchTransactions()
    }, [])

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User ID</TableCell>
                        <TableCell>Transaction Date</TableCell>
                        <TableCell>Down Payment</TableCell>
                        <TableCell>Overall Payment</TableCell>
                        <TableCell>Remaining Payment</TableCell>
                        <TableCell>Payment Plan</TableCell>
                        <TableCell>Property Code</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{transaction.userId}</TableCell>
                            <TableCell>{transaction.transactionDate.toDate().toLocaleString()}</TableCell>
                            <TableCell>{transaction.downPayment}</TableCell>
                            <TableCell>{transaction.overallPayment}</TableCell>
                            <TableCell>{transaction.remainingPayment}</TableCell>
                            <TableCell>{transaction.paymentPlan}</TableCell>
                            <TableCell>{transaction.propertyCode}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Transaction
