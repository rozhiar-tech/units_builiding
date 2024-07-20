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

const Budgets = () => {
    const [loading, setLoading] = useState(true)
    const [budgets, setBudgets] = useState([])

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const budgetsCollection = collection(firestore, 'Budgets')
                const budgetsSnapshot = await getDocs(budgetsCollection)
                const budgetsData = budgetsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                setBudgets(budgetsData)
            } catch (error) {
                console.error('Error fetching budgets:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchBudgets()
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
                    Budgets
                </Typography>
                <List>
                    {budgets.map((budget) => (
                        <React.Fragment key={budget.id}>
                            <ListItem>
                                <ListItemText primary={budget.title} secondary={budget.description} />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Container>
    )
}

export default Budgets
