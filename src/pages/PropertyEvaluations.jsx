import React, { useEffect, useState } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { Container, Paper, Typography, List, ListItem, ListItemText, Divider, Box, IconButton } from '@mui/material'
import { Download as DownloadIcon, Visibility as VisibilityIcon } from '@mui/icons-material'

const PropertyEvaluations = () => {
    const [evaluations, setEvaluations] = useState([])

    useEffect(() => {
        const fetchEvaluations = async () => {
            const evaluationsCollection = collection(firestore, 'PropertyEvaluations')
            const evaluationsSnapshot = await getDocs(evaluationsCollection)
            const evaluationsData = evaluationsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setEvaluations(evaluationsData)
        }

        fetchEvaluations()
    }, [])

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Property Evaluations
                </Typography>
                <List>
                    {evaluations.map((evaluation) => (
                        <React.Fragment key={evaluation.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={<Typography variant="h6">{evaluation.title}</Typography>}
                                    secondary={
                                        <React.Fragment>
                                            <Typography variant="body2" color="textSecondary">
                                                {evaluation.description}
                                            </Typography>
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Date:</strong>{' '}
                                                    {new Date(evaluation.date.seconds * 1000).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </React.Fragment>
                                    }
                                />
                                <Box sx={{ ml: 2 }}>
                                    <IconButton href={evaluation.downloadLink} target="_blank">
                                        <DownloadIcon />
                                    </IconButton>
                                    <IconButton href={evaluation.viewLink} target="_blank">
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

export default PropertyEvaluations
