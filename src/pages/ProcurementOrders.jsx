import React, { useEffect, useState } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { Container, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material'

const ProcurementOrders = () => {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchOrders = async () => {
            const ordersCollection = collection(firestore, 'ProcurementOrders')
            const ordersSnapshot = await getDocs(ordersCollection)
            const ordersData = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setOrders(ordersData)
        }

        fetchOrders()
    }, [])

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Procurement Orders
                </Typography>
                <List>
                    {orders.map((order) => (
                        <React.Fragment key={order.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={<Typography variant="h6">{order.title}</Typography>}
                                    secondary={
                                        <React.Fragment>
                                            <Typography variant="body2" color="textSecondary">
                                                {order.description}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Date:</strong>{' '}
                                                {new Date(order.date.seconds * 1000).toLocaleDateString()}
                                            </Typography>
                                        </React.Fragment>
                                    }
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

export default ProcurementOrders
