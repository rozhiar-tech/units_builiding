import React, { useEffect, useState } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { Container, Paper, Typography, Grid, Box, CircularProgress } from '@mui/material'
import { Bar } from 'react-chartjs-2'

const FinancialDashboard = () => {
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState([])
    const [payments, setPayments] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactionsCollection = collection(firestore, 'Transactions')
                const transactionsSnapshot = await getDocs(transactionsCollection)
                const transactionsData = transactionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

                const paymentsCollection = collection(firestore, 'Payments')
                const paymentsSnapshot = await getDocs(paymentsCollection)
                const paymentsData = paymentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

                setTransactions(transactionsData)
                setPayments(paymentsData)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const calculateTotalSalesRevenue = () => {
        return transactions.reduce((total, transaction) => total + parseFloat(transaction.overallPayment || 0), 0)
    }

    const calculateTotalPayments = () => {
        return payments.reduce((total, payment) => total + parseFloat(payment.amount || 0), 0)
    }

    const salesRevenueData = {
        labels: transactions.map((transaction) =>
            new Date(transaction.transactionDate.seconds * 1000).toLocaleDateString()
        ),
        datasets: [
            {
                label: 'Sales Revenue',
                data: transactions.map((transaction) => transaction.overallPayment),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Container component="main" maxWidth="lg">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Financial Dashboard
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Total Sales Revenue</Typography>
                        <Typography variant="h4">${calculateTotalSalesRevenue()}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Total Payments</Typography>
                        <Typography variant="h4">${calculateTotalPayments()}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Bar data={salesRevenueData} />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default FinancialDashboard
