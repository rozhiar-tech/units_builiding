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

const MaintenanceCosts = () => {
    const [loading, setLoading] = useState(true)
    const [maintenanceCosts, setMaintenanceCosts] = useState([])

    useEffect(() => {
        const fetchMaintenanceCosts = async () => {
            try {
                const maintenanceCostsCollection = collection(firestore, 'MaintenanceCosts')
                const maintenanceCostsSnapshot = await getDocs(maintenanceCostsCollection)
                const maintenanceCostsData = maintenanceCostsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                setMaintenanceCosts(maintenanceCostsData)
            } catch (error) {
                console.error('Error fetching maintenance costs:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMaintenanceCosts()
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
                    Maintenance Costs
                </Typography>
                <List>
                    {maintenanceCosts.map((cost) => (
                        <React.Fragment key={cost.id}>
                            <ListItem>
                                <ListItemText
                                    primary={`Maintenance Cost ID: ${cost.id}`}
                                    secondary={`Amount: $${cost.amount}, Description: ${cost.description}`}
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

export default MaintenanceCosts
