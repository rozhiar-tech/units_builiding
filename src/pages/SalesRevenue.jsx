import React, { useEffect, useState } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { Container, Paper, Typography, List, ListItem, ListItemText, Divider, CircularProgress,Box } from '@mui/material'

const SalesRevenue = () => {
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const transactionsCollection = collection(firestore, 'Transactions')
                const transactionsSnapshot = await getDocs(transactionsCollection)
                const transactionsData = transactionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                setTransactions(transactionsData)
            } catch (error) {
                console.error('Error fetching transactions:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [])

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Sales Revenue
                </Typography>
                <List>
                    {transactions.map((transaction) => (
                        <React.Fragment key={transaction.id}>
                            <ListItem>
                                <ListItemText
                                    primary={`Transaction ID: ${transaction.id}`}
                                    secondary={`User: ${transaction.userName}, Property Code: ${transaction.propertyCode}, Overall Payment: $${transaction.overallPayment}`}
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Container>
    )
}

export default SalesRevenue
