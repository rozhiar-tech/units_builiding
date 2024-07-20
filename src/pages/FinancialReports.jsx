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

const FinancialReports = () => {
    const [loading, setLoading] = useState(true)
    const [reports, setReports] = useState([])

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const reportsCollection = collection(firestore, 'FinancialReports')
                const reportsSnapshot = await getDocs(reportsCollection)
                const reportsData = reportsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                setReports(reportsData)
            } catch (error) {
                console.error('Error fetching reports:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
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
                    Financial Reports
                </Typography>
                <List>
                    {reports.map((report) => (
                        <React.Fragment key={report.id}>
                            <ListItem>
                                <ListItemText primary={report.title} secondary={report.description} />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Container>
    )
}

export default FinancialReports
