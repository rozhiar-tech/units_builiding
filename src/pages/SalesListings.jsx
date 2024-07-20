import React, { useEffect, useState } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { Container, Paper, Typography, List, ListItem, ListItemText, Divider, Box, IconButton } from '@mui/material'
import { Download as DownloadIcon, Visibility as VisibilityIcon } from '@mui/icons-material'

const SalesListings = () => {
    const [listings, setListings] = useState([])

    useEffect(() => {
        const fetchListings = async () => {
            const listingsCollection = collection(firestore, 'SalesListings')
            const listingsSnapshot = await getDocs(listingsCollection)
            const listingsData = listingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setListings(listingsData)
        }

        fetchListings()
    }, [])

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Sales Listings
                </Typography>
                <List>
                    {listings.map((listing) => (
                        <React.Fragment key={listing.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={<Typography variant="h6">{listing.title}</Typography>}
                                    secondary={
                                        <React.Fragment>
                                            <Typography variant="body2" color="textSecondary">
                                                {listing.description}
                                            </Typography>
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Location:</strong> {listing.location}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Price:</strong> ${listing.price}
                                                </Typography>
                                            </Box>
                                        </React.Fragment>
                                    }
                                />
                                <Box sx={{ ml: 2 }}>
                                    <IconButton href={listing.downloadLink} target="_blank">
                                        <DownloadIcon />
                                    </IconButton>
                                    <IconButton href={listing.viewLink} target="_blank">
                                        <VisibilityIcon />
                                    </IconButton>
                                </Box>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Container>
    )
}

export default SalesListings
