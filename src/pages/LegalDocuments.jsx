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
    Button,
    CircularProgress
} from '@mui/material'
import { Download as DownloadIcon, Visibility as VisibilityIcon } from '@mui/icons-material'

const LegalDocuments = () => {
    const [documents, setDocuments] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState('')
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchDocuments = async () => {
        const docsCollection = collection(firestore, 'LegalDocuments')
        const docsSnapshot = await getDocs(docsCollection)
        const docsData = docsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setDocuments(docsData)
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(firestore, 'Users')
            const usersSnapshot = await getDocs(usersCollection)
            const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setUsers(usersData)
        }

        fetchUsers()
        fetchDocuments()
    }, [])

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files))
    }

    const handleUpload = async () => {
        if (!selectedUser || files.length === 0) {
            alert('Please select a user and choose files to upload.')
            return
        }

        setLoading(true)

        for (let file of files) {
            const storageRef = ref(storage, `legal_documents/${selectedUser}/${file.name}`)
            await uploadBytes(storageRef, file)
            const downloadURL = await getDownloadURL(storageRef)

            await addDoc(collection(firestore, 'LegalDocuments'), {
                userId: selectedUser,
                title: file.name,
                description: 'Uploaded legal document',
                type: 'Legal',
                uploadDate: new Date(),
                uploadedBy: selectedUser,
                downloadLink: downloadURL,
                viewLink: downloadURL
            })
        }

        setFiles([])
        alert('Documents uploaded successfully!')
        fetchDocuments()
        setLoading(false)
    }

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Legal Documents
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select User</InputLabel>
                    <Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} label="Select User">
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.firstName} {user.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <input type="file" multiple onChange={handleFileChange} />
                <Button variant="contained" color="primary" onClick={handleUpload} sx={{ mt: 2 }} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Upload Documents'}
                </Button>
                <List sx={{ mt: 4 }}>
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
                                                            <strong>Uploaded For:</strong>{' '}
                                                            {
                                                                users.find((user) => user.id === doc.uploadedBy)
                                                                    ?.firstName
                                                            }{' '}
                                                            {users.find((user) => user.id === doc.uploadedBy)?.lastName}
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

export default LegalDocuments
