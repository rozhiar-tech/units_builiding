import React, { useEffect, useState } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { Container, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material'

const InventoryReports = () => {
    const [reports, setReports] = useState([])

    useEffect(() => {
        const fetchReports = async () => {
            const reportsCollection = collection(firestore, 'InventoryReports')
            const reportsSnapshot = await getDocs(reportsCollection)
            const reportsData = reportsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setReports(reportsData)
        }

        fetchReports()
    }, [])

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Inventory Reports
                </Typography>
                <List>
                    {reports.map((report) => (
                        <React.Fragment key={report.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={<Typography variant="h6">{report.title}</Typography>}
                                    secondary={
                                        <React.Fragment>
                                            <Typography variant="body2" color="textSecondary">
                                                {report.description}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Date:</strong>{' '}
                                                {new Date(report.date.seconds * 1000).toLocaleDateString()}
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

export default InventoryReports
