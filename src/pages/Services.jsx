import React, { useState } from 'react'
import { Button, TextField, Container, Typography, Paper, Grid } from '@mui/material'
import {
    storage,
    firestore,
    Timestamp,
    ref,
    uploadBytesResumable,
    collection,
    addDoc,
    getDownloadURL
} from '../firebase/initFirebase'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

export default function Services() {
    const { t } = useTranslation()

    const [serviceName, setServiceName] = useState('')
    const [description, setDescription] = useState('')
    const [availabilityDate, setAvailabilityDate] = useState('')
    const [image, setImage] = useState(null)
    const [progresspercent, setProgresspercent] = useState(0)

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleAddService = async () => {
        try {
            // Upload image to Firebase Storage
            const storageRef = ref(storage, `files/${image.name}`)
            const uploadTask = uploadBytesResumable(storageRef, image)

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    setProgresspercent(progress)
                },
                (error) => {
                    alert(error)
                },
                async () => {
                    try {
                        // Get image URL
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

                        // Add service to Firestore
                        await addDoc(collection(firestore, 'Services'), {
                            serviceName,
                            description,
                            availabilityDate: Timestamp.fromDate(new Date(availabilityDate)),
                            imgUrl: downloadURL
                        })

                        // Reset form
                        setServiceName('')
                        setDescription('')
                        setAvailabilityDate('')
                        setImage(null)
                        toast.success(' Service added secussfully!', { position: 'top-right', autoClose: 3000 })
                    } catch (error) {
                        console.error('Error adding service to Firestore:', error.message)
                        toast.error('Error adding Service. Please try again.', {
                            position: 'top-right',
                            autoClose: 3000
                        })
                    }
                }
            )
        } catch (error) {
            console.error('Error adding service:', error.message)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5">{t('services.add')}</Typography>
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t('services.name')}
                                variant="outlined"
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={t('services.description')}
                                variant="outlined"
                                multiline
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="date"
                                label={t('services.date')}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={availabilityDate}
                                onChange={(e) => setAvailabilityDate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <input type="file" onChange={handleImageChange} />
                        </Grid>
                        <div className="outerbar">
                            <div className="innerbar" style={{ width: `${progresspercent}%` }}>
                                {progresspercent}%
                            </div>
                        </div>
                    </Grid>
                    <Button variant="contained" color="primary" onClick={handleAddService}>
                        {t('services.add')}
                    </Button>
                </form>
            </Paper>
        </Container>
    )
}
