import React, { useState } from 'react'
import {
    Button,
    Container,
    Typography,
    Paper,
    Grid,
    TextField,
    CssBaseline,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material'
import { collection, addDoc, Timestamp, firestore } from '../firebase/initFirebase'
import { toast } from 'react-toastify'

export default function Broadcast() {
    const [messageHeader, setMessageHeader] = useState('')
    const [messageBody, setMessageBody] = useState('')
    const [building, setBuilding] = useState('A') // Default to 'A', you can change it as needed

    const handleAddMessage = async () => {
        try {
            // Add message to Firestore
            await addDoc(collection(firestore, 'Messages'), {
                header: messageHeader,
                body: messageBody,
                timestamp: Timestamp.now(),
                building: building
            })

            // Reset form
            setMessageHeader('')
            setMessageBody('')
            setBuilding('A') // Reset building to default
            toast.success(' Message added successfully!', { position: 'top-right', autoClose: 3000 })
        } catch (error) {
            console.error('Error adding message:', error.message)
            toast.error('Error adding Message. Please try again.', {
                position: 'top-right',
                autoClose: 3000
            })
        }
    }

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5">Add Message</Typography>
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Message Header"
                                variant="outlined"
                                value={messageHeader}
                                onChange={(e) => setMessageHeader(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Message Body"
                                variant="outlined"
                                multiline
                                rows={4}
                                value={messageBody}
                                onChange={(e) => setMessageBody(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="building-label">Building</InputLabel>
                                <Select
                                    labelId="building-label"
                                    id="building"
                                    value={building}
                                    onChange={(e) => setBuilding(e.target.value)}
                                >
                                    <MenuItem value="A">Building A</MenuItem>
                                    <MenuItem value="B">Building B</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button variant="contained" color="primary" onClick={handleAddMessage}>
                        Add Message
                    </Button>
                </form>
            </Paper>
        </Container>
    )
}
