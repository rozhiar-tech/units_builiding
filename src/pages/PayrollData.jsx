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

const PayrollData = () => {
    const [loading, setLoading] = useState(true)
    const [payrolls, setPayrolls] = useState([])

    useEffect(() => {
        const fetchPayrolls = async () => {
            try {
                const payrollsCollection = collection(firestore, 'Payrolls')
                const payrollsSnapshot = await getDocs(payrollsCollection)
                const payrollsData = payrollsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                setPayrolls(payrollsData)
            } catch (error) {
                console.error('Error fetching payrolls:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPayrolls()
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
                    Payroll Data
                </Typography>
                <List>
                    {payrolls.map((payroll) => (
                        <React.Fragment key={payroll.id}>
                            <ListItem>
                                <ListItemText
                                    primary={`Payroll ID: ${payroll.id}`}
                                    secondary={`Amount: $${payroll.amount}, Employee: ${payroll.employeeName}`}
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

export default PayrollData
