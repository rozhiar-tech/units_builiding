import React, { useEffect, useState } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import {
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
    Box
} from '@mui/material'

const ExpenseReports = () => {
    const [loading, setLoading] = useState(true)
    const [expenses, setExpenses] = useState([])

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const expensesCollection = collection(firestore, 'Expenses')
                const expensesSnapshot = await getDocs(expensesCollection)
                const expensesData = expensesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                setExpenses(expensesData)
            } catch (error) {
                console.error('Error fetching expenses:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchExpenses()
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
                    Expense Reports
                </Typography>
                <List>
                    {expenses.map((expense) => (
                        <React.Fragment key={expense.id}>
                            <ListItem>
                                <ListItemText
                                    primary={`Expense ID: ${expense.id}`}
                                    secondary={`Amount: $${expense.amount}, Description: ${expense.description}`}
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

export default ExpenseReports
