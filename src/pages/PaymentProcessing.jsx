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

const PaymentProcessing = () => {
    const [loading, setLoading] = useState(true)
    const [payments, setPayments] = useState([])

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const paymentsCollection = collection(firestore, 'Payments')
                const paymentsSnapshot = await getDocs(paymentsCollection)
                const paymentsData = paymentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                setPayments(paymentsData)
            } catch (error) {
                console.error('Error fetching payments:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPayments()
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
                    Payment Processing
                </Typography>
                <List>
                    {payments.map((payment) => (
                        <React.Fragment key={payment.id}>
                            <ListItem>
                                <ListItemText
                                    primary={`Payment ID: ${payment.id}`}
                                    secondary={`Amount: $${payment.amount}, User ID: ${
                                        payment.userId
                                    }, Date: ${new Date(payment.date.seconds * 1000).toLocaleDateString()}`}
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

export default PaymentProcessing
