import React, { useState } from 'react'
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Paper,
    Stack,
    LinearProgress
} from '@mui/material'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { firestore, collection, addDoc, serverTimestamp, getDocs, deleteDoc } from '../firebase/initFirebase'

const Timeline = () => {
    const { t } = useTranslation()

    const [building, setBuilding] = useState('')
    const [milestones, setMilestones] = useState([])
    const [newMilestone, setNewMilestone] = useState({ label: '', date: '' })

    const handleBuildingChange = (event) => {
        setBuilding(event.target.value)
        setMilestones([]) // Reset milestones when building changes
    }

    const handleAddMilestone = async () => {
        if (newMilestone.label && newMilestone.date) {
            setMilestones([...milestones, newMilestone])
            setNewMilestone({ label: '', date: '' })

            try {
                const docRef = await addDoc(collection(firestore, building), {
                    label: newMilestone.label,
                    date: newMilestone.date,
                    timestamp: serverTimestamp()
                })
                console.log('Milestone added with ID: ', docRef.id)
                toast.success(' Milestone added secussfully!', { position: 'top-right', autoClose: 3000 })
            } catch (error) {
                console.error('Error adding milestone: ', error)
                toast.error('Error adding milestone. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000
                })
            }
        }
    }

    const handleRemoveMilestone = async (index) => {
        const updatedMilestones = [...milestones]
        const removedMilestone = updatedMilestones.splice(index, 1)[0]
        setMilestones(updatedMilestones)

        try {
            // Fetch the document ID of the milestone to be deleted
            const querySnapshot = await getDocs(collection(firestore, building))
            querySnapshot.forEach((doc) => {
                if (doc.data().label === removedMilestone.label && doc.data().date === removedMilestone.date) {
                    deleteDoc(doc.ref)
                    console.log('Milestone deleted:', doc.id)
                }
            })
        } catch (error) {
            console.error('Error deleting milestone:', error)
        }
    }
    // You can add logic here to save milestones to the corresponding building collection

    return (
        <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" mb={4}>
                {t('timeline.add')}
            </Typography>

            <FormControl sx={{ minWidth: 120, marginBottom: 3 }}>
                <InputLabel id="building-label">{t('timeline.building')}</InputLabel>
                <Select labelId="building-label" value={building} onChange={handleBuildingChange} label="Building">
                    <MenuItem value="A">Building A</MenuItem>
                    <MenuItem value="B">Building B</MenuItem>
                </Select>
            </FormControl>

            <Stack spacing={2} mb={3}>
                <TextField
                    label={t('timeline.date')}
                    variant="outlined"
                    value={newMilestone.label}
                    onChange={(e) => setNewMilestone({ ...newMilestone, label: e.target.value })}
                />
                <TextField
                    label="Milestone Date"
                    type="date"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={newMilestone.date}
                    onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                />
                <Button variant="contained" onClick={handleAddMilestone}>
                    {t('timeline.add')}
                </Button>
            </Stack>

            {milestones.length > 0 && (
                <Stack spacing={2} mb={3}>
                    {milestones.map((milestone, index) => (
                        <Stack key={index} spacing={1} alignItems="center" width="100%">
                            <Typography>{milestone.label}</Typography>
                            <Typography variant="caption">{milestone.date}</Typography>
                            <LinearProgress variant="determinate" value={(index / (milestones.length - 1)) * 100} />
                            <Button variant="outlined" onClick={() => handleRemoveMilestone(index)}>
                                Remove
                            </Button>
                        </Stack>
                    ))}
                </Stack>
            )}
        </Paper>
    )
}

export default Timeline
