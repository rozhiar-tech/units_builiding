import React, { useState, useEffect } from 'react'
import {
    Button,
    TextField,
    Typography,
    Paper,
    Container,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material'
import { addDoc, collection, firestore, serverTimestamp, getDocs } from '../firebase/initFirebase'
import { toast } from 'react-toastify'
import SendIcon from '@mui/icons-material/Send'
import { useTranslation } from 'react-i18next'

const Expenses = () => {
    const { t } = useTranslation()

    const [expense, setExpense] = useState({
        description: '',
        amount: ''
    })

    const [expensesList, setExpensesList] = useState([])

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const expensesCollection = collection(firestore, 'Expenses')
                const expensesSnapshot = await getDocs(expensesCollection)
                const expensesData = expensesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                setExpensesList(expensesData)
            } catch (error) {
                console.error('Error fetching expenses:', error.message)
            }
        }

        fetchExpenses()
    }, []) // Fetch expenses on component mount

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setExpense((prevExpense) => ({ ...prevExpense, [name]: value }))
    }

    const handleAddExpense = async () => {
        try {
            if (expense.description && expense.amount) {
                await addDoc(collection(firestore, 'Expenses'), {
                    ...expense,
                    timestamp: serverTimestamp()
                })
                setExpense({
                    description: '',
                    amount: ''
                })
                // You can add a success message or redirect the user after adding an expense
                toast.success('Expense added successfully!', { position: 'top-right', autoClose: 3000 })
            } else {
                // Handle validation or show an error message
                console.error('Description and amount are required.')
                toast.error('Something went wrong, please try again', { position: 'top-right', autoClose: 3000 })
            }
        } catch (error) {
            console.error('Error adding expense:', error.message)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h5" align="center">
                    Add Expense
                </Typography>
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t('expences.description')}
                                name="description"
                                value={expense.description}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t('expences.amount')}
                                name="amount"
                                type="number"
                                value={expense.amount}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleAddExpense}
                        endIcon={<SendIcon />}
                    >
                        {t('expences.add')}
                    </Button>
                </form>

                {/* Display Expenses Table */}
                <Typography variant="h5" align="center" style={{ marginTop: '20px' }}>
                    {t('expences.list')}
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('expences.description')}</TableCell>
                                <TableCell>{t('expences.amount')}</TableCell>
                                <TableCell>{t('expences.date')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expensesList.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{expense.description}</TableCell>
                                    <TableCell>{expense.amount}</TableCell>
                                    <TableCell>
                                        {new Date(expense.timestamp?.seconds * 1000).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    )
}

export default Expenses
