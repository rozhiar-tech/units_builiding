import React, { useState, useEffect } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'

const Transaction = () => {
    const { t } = useTranslation()

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
                        <TableCell>{t('transactions.userId')}</TableCell>
                        <TableCell>{t('transactions.transactiondate')}</TableCell>
                        <TableCell>{t('transactions.dpayment')}</TableCell>
                        <TableCell>{t('transactions.ovpayment')}</TableCell>
                        <TableCell>{t('transactions.rpayment')}</TableCell>
                        <TableCell>{t('transactions.pplan')}</TableCell>
                        <TableCell>{t('transactions.pcode')}</TableCell>
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
