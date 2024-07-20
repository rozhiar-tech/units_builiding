import React, { useEffect, useState } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { Container, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material'

const StockAvailability = () => {
    const [availability, setAvailability] = useState([])

    useEffect(() => {
        const fetchAvailability = async () => {
            const availabilityCollection = collection(firestore, 'StockAvailability')
            const availabilitySnapshot = await getDocs(availabilityCollection)
            const availabilityData = availabilitySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setAvailability(availabilityData)
        }

        fetchAvailability()
    }, [])

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Stock Availability
                </Typography>
                <List>
                    {availability.map((item) => (
                        <React.Fragment key={item.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={<Typography variant="h6">{item.itemName}</Typography>}
                                    secondary={
                                        <React.Fragment>
                                            <Typography variant="body2" color="textSecondary">
                                                {item.description}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Quantity:</strong> {item.quantity}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Location:</strong> {item.location}
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

export default StockAvailability
