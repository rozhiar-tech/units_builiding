import React, { useState } from 'react'
import { TextField, Button, Stack, Typography, Container } from '@mui/material'
import { addDoc, collection, serverTimestamp } from '../firebase/initFirebase'
import { firestore } from '../firebase/initFirebase'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

export default function Offers() {
    const { t } = useTranslation()

    const [offerData, setOfferData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: ''
    })

    const handleInputChange = (e) => {
        setOfferData({ ...offerData, [e.target.name]: e.target.value })
    }

    const handleAddOffer = async () => {
        try {
            // Validate form data (add more validation as needed)
            if (!offerData.name || !offerData.description || !offerData.startDate || !offerData.endDate) {
                // Handle validation error
                console.error('Please fill in all fields')
                return
            }

            // Add offer to Firestore
            const offersCollection = collection(firestore, 'offers')
            await addDoc(offersCollection, {
                ...offerData,
                startDate: new Date(offerData.startDate),
                endDate: new Date(offerData.endDate),
                createdAt: serverTimestamp()
            })

            // Clear form after successful submission
            setOfferData({
                name: '',
                description: '',
                startDate: '',
                endDate: ''
            })

            toast.success('Offer added successfully!', { position: 'top-right', autoClose: 3000 })
        } catch (error) {
            toast.error('Error adding offer. Please try again.', { position: 'top-right', autoClose: 3000 })
        }
    }

    return (
        <Container>
            <Typography variant="h4" mb={4}>
                {t('offers.add')}
            </Typography>
            <Stack spacing={2} direction="column">
                <TextField
                    label={t('offers.name')}
                    name="name"
                    value={offerData.name}
                    onChange={handleInputChange}
                    variant="outlined"
                />
                <TextField
                    label={t('offers.description')}
                    name="description"
                    value={offerData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    variant="outlined"
                />
                <TextField
                    label={t('offers.start')}
                    name="startDate"
                    type="date"
                    value={offerData.startDate}
                    onChange={handleInputChange}
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true
                    }}
                />
                <TextField
                    label={t('offers.end')}
                    name="endDate"
                    type="date"
                    value={offerData.endDate}
                    onChange={handleInputChange}
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true
                    }}
                />
                <Button variant="contained" color="primary" onClick={handleAddOffer}>
                    {t('offers.add')}
                </Button>
            </Stack>
        </Container>
    )
}
