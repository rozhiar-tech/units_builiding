import React, { useEffect, useState } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { Container, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material'

const ComplianceReports = () => {
    const [documents, setDocuments] = useState([])

    useEffect(() => {
        const fetchDocuments = async () => {
            const docsCollection = collection(firestore, 'ComplianceReports')
            const docsSnapshot = await getDocs(docsCollection)
            const docsData = docsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setDocuments(docsData)
        }

        fetchDocuments()
    }, [])

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Legal Documents
                </Typography>
                <List>
                    {documents.map((doc) => (
                        <React.Fragment key={doc.id}>
                            <ListItem>
                                <ListItemText primary={doc.title} secondary={doc.description} />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Container>
    )
}

export default ComplianceReports
