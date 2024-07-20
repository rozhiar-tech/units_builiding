import React, { useEffect, useState } from 'react'
import {
    collection,
    getDocs,
    firestore,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    addDoc
} from '../firebase/initFirebase'
import {
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Grid,
    Box,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    TextField,
    Button,
    CircularProgress
} from '@mui/material'
import { Download as DownloadIcon, Visibility as VisibilityIcon } from '@mui/icons-material'

const ComplianceRequirements = () => {
    const [documents, setDocuments] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('')
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchDocuments = async () => {
        const docsCollection = collection(firestore, 'ComplianceRequirements')
        const docsSnapshot = await getDocs(docsCollection)
        const docsData = docsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setDocuments(docsData)
    }

    useEffect(() => {
        fetchDocuments()
    }, [])

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleUpload = async () => {
        if (!title || !description || !type || !file) {
            alert('Please fill in all fields and choose a file to upload.')
            return
        }

        setLoading(true)
        try {
            const storageRef = ref(storage, `compliance_requirements/${file.name}`)
            await uploadBytes(storageRef, file)
            const downloadURL = await getDownloadURL(storageRef)

            await addDoc(collection(firestore, 'ComplianceRequirements'), {
                title,
                description,
                type,
                uploadDate: new Date(),
                uploadedBy: 'Admin', // Replace with actual uploader's info if available
                downloadLink: downloadURL,
                viewLink: downloadURL
            })

            setTitle('')
            setDescription('')
            setType('')
            setFile(null)
            alert('Document uploaded successfully!')
            fetchDocuments()
        } catch (error) {
            console.error('Error uploading document:', error)
            alert('Failed to upload document.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Compliance Requirements
                </Typography>
                <Box component="form" sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                        <InputLabel>Type</InputLabel>
                        <Select value={type} onChange={(e) => setType(e.target.value)} label="Type">
                            <MenuItem value="Regulatory">Regulatory</MenuItem>
                            <MenuItem value="Safety">Safety</MenuItem>
                            <MenuItem value="Environmental">Environmental</MenuItem>
                        </Select>
                    </FormControl>
                    <input type="file" onChange={handleFileChange} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Upload Document'}
                    </Button>
                </Box>
                <List>
                    {documents.map((doc) => (
                        <React.Fragment key={doc.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={<Typography variant="h6">{doc.title}</Typography>}
                                    secondary={
                                        <React.Fragment>
                                            <Typography variant="body2" color="textSecondary">
                                                {doc.description}
                                            </Typography>
                                            <Box sx={{ mt: 1 }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            <strong>Type:</strong> {doc.type}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            <strong>Upload Date:</strong>{' '}
                                                            {new Date(
                                                                doc.uploadDate.seconds * 1000
                                                            ).toLocaleDateString()}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            <strong>Uploaded By:</strong> {doc.uploadedBy}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </React.Fragment>
                                    }
                                />
                                <Box sx={{ ml: 2 }}>
                                    <IconButton href={doc.downloadLink} target="_blank">
                                        <DownloadIcon />
                                    </IconButton>
                                    <IconButton href={doc.viewLink} target="_blank">
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

export default ComplianceRequirements
