import React, { useEffect, useState } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { Container, Paper, Typography, List, ListItem, ListItemText, Divider, Box, IconButton } from '@mui/material'
import { Download as DownloadIcon, Visibility as VisibilityIcon } from '@mui/icons-material'

const MarketAnalysis = () => {
    const [reports, setReports] = useState([])

    useEffect(() => {
        const fetchReports = async () => {
            const reportsCollection = collection(firestore, 'MarketAnalysis')
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
                    Market Analysis
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
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Date:</strong>{' '}
                                                    {new Date(report.date.seconds * 1000).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </React.Fragment>
                                    }
                                />
                                <Box sx={{ ml: 2 }}>
                                    <IconButton href={report.downloadLink} target="_blank">
                                        <DownloadIcon />
                                    </IconButton>
                                    <IconButton href={report.viewLink} target="_blank">
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

export default MarketAnalysis
