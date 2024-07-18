import React, { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Container,
    Divider,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material'
import { collection, getDocs, doc, updateDoc, addDoc, query, where, firestore } from '../firebase/initFirebase'
import { differenceInDays, parseISO } from 'date-fns'

const AdminMonthlyPayment = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [remainingPayment, setRemainingPayment] = useState(0)
    const [paymentAmount, setPaymentAmount] = useState('')
    const [paymentHistory, setPaymentHistory] = useState([])
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [open, setOpen] = useState(false)
    const [reminders, setReminders] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(firestore, 'Users')
            const usersSnapshot = await getDocs(usersCollection)
            const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setUsers(usersData)
            checkReminders(usersData)
        }

        fetchUsers()
    }, [])

    useEffect(() => {
        if (selectedUser) {
            fetchPaymentHistory()
        }
        // eslint-disable-next-line
    }, [selectedUser])

    const fetchPaymentHistory = async () => {
        const paymentsCollection = collection(firestore, 'Payments')
        const q = query(paymentsCollection, where('userId', '==', selectedUser.userId))
        const paymentsSnapshot = await getDocs(q)
        const paymentsData = paymentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setPaymentHistory(paymentsData)
    }

    const checkReminders = (usersData) => {
        const remindersList = usersData.filter((user) => {
            const nextPaymentDate = parseISO(user.nextPaymentDate)
            const daysToPayment = differenceInDays(nextPaymentDate, new Date())
            return daysToPayment <= 7 && daysToPayment >= 0 // Reminder for payments due within 7 days
        })
        setReminders(remindersList)
    }

    const handleUserSelect = (event) => {
        const userId = event.target.value
        const user = users.find((u) => u.userId === userId)
        setSelectedUser(user)
        const initialRemainingPayment = calculateRemainingPayment(user)
        setRemainingPayment(initialRemainingPayment)
    }

    const calculateRemainingPayment = (userData) => {
        let remaining = parseFloat(userData.overallPayment) - parseFloat(userData.downPayment)

        if (parseFloat(userData.keyPayment) > 0) {
            remaining -= parseFloat(userData.keyPayment)
        }

        return remaining
    }

    const handlePayment = async () => {
        if (!paymentAmount || isNaN(paymentAmount) || parseFloat(paymentAmount) <= 0) {
            alert('Please enter a valid payment amount.')
            return
        }

        const updatedRemaining = remainingPayment - parseFloat(paymentAmount)

        // Update the Firestore database
        if (selectedUser) {
            const userDocRef = doc(firestore, 'Users', selectedUser.id)
            await updateDoc(userDocRef, {
                remainingPayment: updatedRemaining.toString(),
                nextPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString() // Set next payment date to one month from now
            })

            // Add payment record to Payments collection
            await addDoc(collection(firestore, 'Payments'), {
                userId: selectedUser.userId,
                amount: parseFloat(paymentAmount),
                date: new Date()
            })

            // Update local state
            setRemainingPayment(updatedRemaining)
            setPaymentAmount('')
            fetchPaymentHistory()
            checkReminders(users) // Refresh reminders after payment
        }
    }

    const handleClickOpen = (payment) => {
        setSelectedPayment(payment)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSelectedPayment(null)
    }

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Admin - Make a Monthly Payment
                </Typography>
                <FormControl fullWidth>
                    <InputLabel>Select User</InputLabel>
                    <Select
                        value={selectedUser ? selectedUser.userId : ''}
                        onChange={handleUserSelect}
                        label="Select User"
                    >
                        {users.map((user) => (
                            <MenuItem key={user.userId} value={user.userId}>
                                {user.firstName} {user.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedUser && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body1">
                            <strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Email:</strong> {selectedUser.email}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Phone:</strong> {selectedUser.phone}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Property Code:</strong> {selectedUser.propertyCode}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Overall Payment:</strong> ${selectedUser.overallPayment}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Remaining Payment:</strong> ${remainingPayment}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Payment Amount"
                                variant="outlined"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                fullWidth
                            />
                            <Button variant="contained" color="primary" onClick={handlePayment} fullWidth>
                                Make Payment
                            </Button>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Payment History
                        </Typography>
                        {paymentHistory.length > 0 ? (
                            paymentHistory.map((payment, index) => (
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">
                                        {new Date(payment.date.seconds * 1000).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">${payment.amount}</Typography>
                                    <Button variant="outlined" size="small" onClick={() => handleClickOpen(payment)}>
                                        View Details
                                    </Button>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2">No payment history available.</Typography>
                        )}
                    </>
                )}
            </Paper>
            {selectedPayment && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Payment Details</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">
                            <strong>Payment Date:</strong>{' '}
                            {new Date(selectedPayment.date.seconds * 1000).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Amount:</strong> ${selectedPayment.amount}
                        </Typography>
                        <Typography variant="body1">
                            <strong>User ID:</strong> {selectedPayment.userId}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Payment Reminders
                </Typography>
                {reminders.length > 0 ? (
                    reminders.map((user, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">
                                {user.firstName} {user.lastName} - Payment due on{' '}
                                {new Date(user.nextPaymentDate).toLocaleDateString()}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2">No upcoming payment reminders.</Typography>
                )}
            </Paper>
        </Container>
    )
}

export default AdminMonthlyPayment
