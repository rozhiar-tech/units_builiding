import React, { useEffect, useState } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { Container, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material'

const StockLevels = () => {
    const [stocks, setStocks] = useState([])

    useEffect(() => {
        const fetchStocks = async () => {
            const stocksCollection = collection(firestore, 'StockLevels')
            const stocksSnapshot = await getDocs(stocksCollection)
            const stocksData = stocksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setStocks(stocksData)
        }

        fetchStocks()
    }, [])

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Stock Levels
                </Typography>
                <List>
                    {stocks.map((stock) => (
                        <React.Fragment key={stock.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={<Typography variant="h6">{stock.itemName}</Typography>}
                                    secondary={
                                        <React.Fragment>
                                            <Typography variant="body2" color="textSecondary">
                                                {stock.description}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Quantity:</strong> {stock.quantity}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Location:</strong> {stock.location}
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

export default StockLevels
