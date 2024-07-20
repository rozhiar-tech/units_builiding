import React, { useEffect, useState } from 'react'
import { collection, getDocs, addDoc, firestore } from '../firebase/initFirebase'
import {
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    TextField,
    Button,
    Box
} from '@mui/material'

const LegalContracts = () => {
    const [documents, setDocuments] = useState([])
    const [newContract, setNewContract] = useState({
        title: '',
        description: '',
        contractDate: '',
        expiryDate: '',
        parties: ''
    })

    useEffect(() => {
        const fetchDocuments = async () => {
            const docsCollection = collection(firestore, 'LegalContracts')
            const docsSnapshot = await getDocs(docsCollection)
            const docsData = docsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setDocuments(docsData)
        }

        fetchDocuments()
    }, [])

    const handleChange = (e) => {
        setNewContract({
            ...newContract,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const docRef = await addDoc(collection(firestore, 'LegalContracts'), {
            ...newContract,
            contractDate: new Date(newContract.contractDate),
            expiryDate: new Date(newContract.expiryDate),
            parties: newContract.parties.split(',').map((party) => party.trim())
        })
        setDocuments([...documents, { id: docRef.id, ...newContract }])
        setNewContract({
            title: '',
            description: '',
            contractDate: '',
            expiryDate: '',
            parties: ''
        })
    }

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Legal Contracts
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Add New Contract
                    </Typography>
                    <TextField
                        label="Title"
                        name="title"
                        value={newContract.title}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={newContract.description}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Contract Date"
                        name="contractDate"
                        type="date"
                        value={newContract.contractDate}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        label="Expiry Date"
                        name="expiryDate"
                        type="date"
                        value={newContract.expiryDate}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        label="Parties (comma separated)"
                        name="parties"
                        value={newContract.parties}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Add Contract
                    </Button>
                </Box>
                <List>
                    {documents.map((doc) => (
                        <React.Fragment key={doc.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" component="div">
                                            {doc.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            <Typography variant="body2" color="textSecondary">
                                                {doc.description}
                                            </Typography>
                                            {doc.contractDate && (
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Contract Date:</strong>{' '}
                                                    {new Date(doc.contractDate.seconds * 1000).toLocaleDateString()}
                                                </Typography>
                                            )}
                                            {doc.expiryDate && (
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Expiry Date:</strong>{' '}
                                                    {new Date(doc.expiryDate.seconds * 1000).toLocaleDateString()}
                                                </Typography>
                                            )}
                                            {doc.parties && (
                                                <Box mt={1}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Parties Involved:</strong>
                                                    </Typography>
                                                    <List>
                                                        {doc.parties.map((party, index) => (
                                                            <ListItem key={index} sx={{ paddingLeft: 0 }}>
                                                                <ListItemText primary={party} />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            )}
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

export default LegalContracts
