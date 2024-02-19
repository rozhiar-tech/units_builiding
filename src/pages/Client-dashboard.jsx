import React, { useState, useEffect } from 'react'
import {
    Stack,
    Step,
    Stepper,
    StepLabel,
    Typography,
    Paper,
    Box,
    LinearProgress,
    Badge,
    IconButton,
    Snackbar,
    Divider
} from '@mui/material'
import { collection, getDocs } from '../firebase/initFirebase'
import { format, addMonths, differenceInDays } from 'date-fns'
import { firestore } from '../firebase/initFirebase'
import { productData } from '../data/data'
import NotificationsIcon from '@mui/icons-material/Notifications'

const steps = ['January', 'February', 'April', 'July', 'October', 'December']

const ClientDashboard = ({ user }) => {
    // Define state variables
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [services, setServices] = useState([])
    const [propertyDetails, setPropertyDetails] = useState(null)
    const [constructionSteps, setConstructionSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [notificationCount, setNotificationCount] = useState(0)
    const [messages, setMessages] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState(false)

    // useEffect hook to fetch data

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user) {
                    const usersCollectionRef = collection(firestore, 'Users')
                    const usersSnapshot = await getDocs(usersCollectionRef)

                    if (!usersSnapshot.empty) {
                        usersSnapshot.forEach((doc) => {
                            const userData = doc.data()

                            if (userData.userId === user.uid) {
                                setUserData(userData)
                                setLoading(false)
                                fetchMessages(userData)
                                console.log('user is', userData)
                            }
                        })
                    } else {
                        console.error('No user documents found')
                        setLoading(false)
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
                setLoading(false)
            }
        }

        fetchUserData()
    }, [user])
    const fetchMessages = async (userData) => {
        try {
            if (userData) {
                const messagesCollectionRef = collection(firestore, 'Messages')
                const messagesSnapshot = await getDocs(messagesCollectionRef)

                if (!messagesSnapshot.empty) {
                    const messagesData = messagesSnapshot.docs.map((doc) => doc.data())

                    // Filter messages based on user's propertyCode
                    const userPropertyCode = userData ? userData.propertyCode : ''
                    const filteredMessages = messagesData.filter((message) => {
                        // Check if the user's propertyCode starts with 'A' and the message building is 'A'
                        if (userPropertyCode.startsWith('A') && message.building === 'A') {
                            return true
                        }
                        // Check if the user's propertyCode starts with 'B' and the message building is 'B'
                        if (userPropertyCode.startsWith('B') && message.building === 'B') {
                            return true
                        }
                        // Add additional conditions for other buildings if needed

                        // If no specific condition matches, consider it a message for other users
                        return false
                    })

                    setMessages(filteredMessages)

                    // Count unread messages
                    const unreadMessages = filteredMessages.filter((message) => !message.read)
                    setNotificationCount(unreadMessages.length)
                }
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }
    useEffect(() => {

        // Define async function to fetch services data
        const fetchServices = async () => {
            try {
                const servicesCollectionRef = collection(firestore, 'Services')
                const servicesSnapshot = await getDocs(servicesCollectionRef)

                if (!servicesSnapshot.empty) {
                    const servicesData = servicesSnapshot.docs.map((doc) => doc.data())
                    setServices(servicesData)
                } else {
                    console.error('No services found')
                }

                setLoading(false)
            } catch (error) {
                console.error('Error fetching services:', error)
                setLoading(false)
            }
        }

        // Define function to fetch property details
        const fetchPropertyDetails = () => {
            if (userData && userData.propertyCode) {
                const matchedProperty = productData.find((property) => property.رقم_شقه === userData.propertyCode)

                if (matchedProperty) {
                    setPropertyDetails(matchedProperty)
                }
            }
        }

        // Define async function to fetch construction steps
        const fetchConstructionSteps = async () => {
            try {
                if (userData && userData.propertyCode) {
                    const propertyCodePrefix = userData.propertyCode.charAt(0).toUpperCase()
                    const constructionStepsCollectionRef = collection(firestore, propertyCodePrefix)
                    const constructionStepsSnapshot = await getDocs(constructionStepsCollectionRef)

                    if (!constructionStepsSnapshot.empty) {
                        const stepsData = constructionStepsSnapshot.docs.map((doc) => doc.data())
                        // Sort the steps based on the date
                        const sortedStepsData = stepsData.sort((a, b) => new Date(a.date) - new Date(b.date))
                        setConstructionSteps(sortedStepsData)

                        // Find the first step with a date greater than the current date
                        const nextStepIndex = sortedStepsData.findIndex((step) => new Date(step.date) > new Date())
                        setCurrentStep(nextStepIndex >= 0 ? nextStepIndex : 0)
                    } else {
                        console.error(`No construction steps found for property code ${userData.propertyCode}`)
                    }
                }
            } catch (error) {
                console.error('Error fetching construction steps:', error)
            }
        }

        fetchServices()
        fetchPropertyDetails()
        fetchConstructionSteps()
        // fetchMessages()
        return () => {
        }
    }, [userData])

    const handleOpenSnackbar = () => {
        setOpenSnackbar(true)

        // Mark all messages as read when the Snackbar is opened
        const updatedMessages = messages.map((message) => ({ ...message, read: true }))
        setMessages(updatedMessages)
        setNotificationCount(0)
    }

    // Handle closing Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
    }
    // Define function to get progress
    const getProgress = (startDate, endDate) => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const progress = ((new Date() - start) / (end - start)) * 100

        return progress < 0 ? 0 : progress > 100 ? 100 : progress
    }

    // Define function to get the next payment date
    const getNextPaymentDate = () => {
        const currentDate = new Date()
        const currentDay = currentDate.getDate()

        // If today is the 5th or later, set the next payment for the 5th of the next month
        const nextPaymentDate = currentDay >= 5 ? addMonths(currentDate, 1) : currentDate

        return new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth(), 5)
    }

    // Define function to get the days until next payment
    const getDaysUntilNextPayment = () => {
        const currentDate = new Date()
        const nextPaymentDate = getNextPaymentDate()

        // Extract the day of the month from userData.dateOfPaymentMonthly
        const paymentDay = new Date(userData.dateOfPaymentMonthly.toDate()).getDate()

        // Set the next payment date to the specified day of the month
        nextPaymentDate.setDate(paymentDay)

        const daysRemaining = differenceInDays(nextPaymentDate, currentDate)
        return daysRemaining
    }

    return (
        <Paper
            elevation={3}
            sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <IconButton color="primary" onClick={handleOpenSnackbar}>
                    <Badge badgeContent={notificationCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Box>
            <Typography variant="h4" mb={4}>
                Client Dashboard - {userData ? userData.displayName : 'Guest'}
            </Typography>

            {loading ? (
                <Typography variant="h5">Loading...</Typography>
            ) : (
                <Stack sx={{ width: '100%' }} spacing={4}>
                    <Typography variant="h5" mb={2}>
                        Current Step: {steps[currentStep]}
                    </Typography>
                    <Stepper alternativeLabel activeStep={currentStep} sx={{ width: '100%', mb: 4 }}>
                        {constructionSteps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel>
                                    <Typography variant="body2">{step.label}</Typography>
                                    <Typography variant="caption">{step.date}</Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {constructionSteps.map((step, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <Typography variant="body2">{step.label}</Typography>
                            <Typography variant="caption">{step.date}</Typography>
                            {/* Check if the date has passed, then show progress */}
                            {new Date(step.date) < new Date() && (
                                <LinearProgress
                                    variant="determinate"
                                    value={getProgress(constructionSteps[0].date, step.date)}
                                />
                            )}
                        </div>
                    ))}

                    {userData && (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
                            <Box bgcolor="#f2f2f2" p={3} borderRadius={8}>
                                <Typography variant="h5" mb={2}>
                                    Down Payment
                                </Typography>
                                <Typography variant="body1" mb={2}>
                                    ${userData.downPayment || 0}
                                </Typography>
                            </Box>

                            <Box bgcolor="#e0f7fa" p={3} borderRadius={8}>
                                <Typography variant="h5" mb={2}>
                                    Monthly Payment
                                </Typography>
                                <Typography variant="body1" mb={2}>
                                    ${userData.monthlyPayment || 0}
                                </Typography>
                            </Box>

                            <Box bgcolor="#b2dfdb" p={3} borderRadius={8}>
                                <Typography variant="h5" mb={2}>
                                    Next Payment Date
                                </Typography>
                                <Typography variant="body1" mb={2}>
                                    {format(getNextPaymentDate(), 'MMMM d, yyyy')}
                                </Typography>
                            </Box>

                            <Box bgcolor="#ffcc80" p={3} borderRadius={8}>
                                <Typography variant="h5" mb={2}>
                                    Days until Next Payment
                                </Typography>
                                <Typography variant="body1" mb={2}>
                                    {getDaysUntilNextPayment()}
                                </Typography>
                            </Box>
                        </Stack>
                    )}
                    <Typography variant="h4" mb={4}>
                        Services Section
                    </Typography>

                    {loading ? (
                        <Typography variant="h5">Loading...</Typography>
                    ) : (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
                            {services.map((service, index) => (
                                <Box
                                    key={index}
                                    bgcolor="#e0e0e0"
                                    p={3}
                                    borderRadius={8}
                                    width={{ xs: '100%', sm: '30%' }}
                                >
                                    <Typography variant="h5" mb={2}>
                                        {service.serviceName}
                                    </Typography>
                                    <Typography variant="body1" mb={2}>
                                        {service.description}
                                    </Typography>
                                    {/* You can customize the image display as needed */}
                                    <img
                                        src={service.imgUrl}
                                        alt={service.serviceName}
                                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    )}
                    <Typography variant="h4" mb={4}>
                        Property Section
                    </Typography>

                    {propertyDetails ? (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
                            <Box bgcolor="#f2f2f2" p={3} borderRadius={8}>
                                <Typography variant="h5" mb={2}>
                                    Property View
                                </Typography>
                                <Typography variant="body1" mb={2}>
                                    {propertyDetails.Column1}
                                </Typography>
                            </Box>

                            <Box bgcolor="#e0f7fa" p={3} borderRadius={8}>
                                <Typography variant="h5" mb={2}>
                                    Floor
                                </Typography>
                                <Typography variant="body1" mb={2}>
                                    {propertyDetails.قات}
                                </Typography>
                            </Box>

                            <Box bgcolor="#b2dfdb" p={3} borderRadius={8}>
                                <Typography variant="h5" mb={2}>
                                    Apartment Number
                                </Typography>
                                <Typography variant="body1" mb={2}>
                                    {propertyDetails.رقم_شقه}
                                </Typography>
                            </Box>

                            <Box bgcolor="#ffcc80" p={3} borderRadius={8}>
                                <Typography variant="h5" mb={2}>
                                    Area (متر)
                                </Typography>
                                <Typography variant="body1" mb={2}>
                                    {propertyDetails.متر}
                                </Typography>
                            </Box>

                            <Box bgcolor="#f2f2f2" p={3} borderRadius={8}>
                                <Typography variant="h5" mb={2}>
                                    Price per Square Meter
                                </Typography>
                                <Typography variant="body1" mb={2}>
                                    {propertyDetails.سعر_متر}
                                </Typography>
                            </Box>

                            <Box bgcolor="#e0f7fa" p={3} borderRadius={8}>
                                <Typography variant="h5" mb={2}>
                                    Total Price
                                </Typography>
                                <Typography variant="body1" mb={2}>
                                    {propertyDetails.سعر_كلي}
                                </Typography>
                            </Box>
                        </Stack>
                    ) : (
                        <Typography variant="h5">No property details found</Typography>
                    )}
                </Stack>
            )}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                style={{ marginRight: '26px' }}
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Paper elevation={3} sx={{ p: 2, borderRadius: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        New Messages
                    </Typography>
                    {messages.map((message, index) => (
                        <div key={index}>
                            <Typography variant="body1" gutterBottom>
                                {message.header}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {message.body}
                            </Typography>
                            {index < messages.length - 1 && <Divider sx={{ my: 1 }} />}
                        </div>
                    ))}
                </Paper>
            </Snackbar>
        </Paper>
    )
}

export default ClientDashboard
