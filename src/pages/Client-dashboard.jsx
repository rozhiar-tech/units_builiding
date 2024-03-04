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
    Divider,
    Grid,
    Avatar,
    Card,
    CardMedia,
    CardContent
} from '@mui/material'
import classNames from 'classnames'

import { collection, getDocs, signOut, auth } from '../firebase/initFirebase'
import { differenceInDays } from 'date-fns'
import { firestore } from '../firebase/initFirebase'
import { productData } from '../data/data'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { HiOutlineLogout } from 'react-icons/hi'
import Header from '../components/shared/Header'
import { useTranslation } from 'react-i18next'
import { Audio } from 'react-loader-spinner'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn' // Replace with your desired icons
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import image152 from '../assets/2.2.png'
import image203 from '../assets/01.png'
const steps = ['January', 'February', 'April', 'July', 'October', 'December']
const linkClass =
    'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'
const darkThemeBackground = '#070F2B'
const darkThemeText = '#FFFFFF'
const ClientDashboard = ({ user }) => {
    const { t } = useTranslation()

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
    const [offers, setOffers] = useState([])

    // useEffect hook to fetch data
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const offersCollection = collection(firestore, 'offers')
                const offersSnapshot = await getDocs(offersCollection)
                const currentDate = new Date()

                const offersData = offersSnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((offer) => {
                        const endDate = offer.endDate.toDate()

                        return currentDate <= endDate
                    })

                setOffers(offersData)
            } catch (error) {
                console.error('Error fetching offers data:', error.message)
            }
        }

        fetchOffers()
    }, [])

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
                        const sortedStepsData = stepsData.sort((a, b) => new Date(a.startDate) - new Date(b.endDate))
                        setConstructionSteps(sortedStepsData)

                        // Find the first step with a date greater than the current date
                        const nextStepIndex = sortedStepsData.findIndex((step) => new Date(step.startDate) > new Date())
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
        return () => {}
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

    const getDaysUntilNextPayment = () => {
        const currentDate = new Date()

        // Extract the day of the month from userData.dateOfPaymentMonthly
        const paymentDay = userData.dateOfPaymentMonthly

        // Set the next payment date to the specified day of the month
        const nextPaymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), paymentDay)

        // If today is the payment day or later in the month, set the next payment to the next month
        if (currentDate.getDate() >= paymentDay) {
            nextPaymentDate.setMonth(currentDate.getMonth() + 1)
        }

        // Calculate the difference in days between the next payment date and the current date
        const daysRemaining = differenceInDays(nextPaymentDate, currentDate)

        return daysRemaining
    }
    const calculateProgressPercentage = (startDate, endDate) => {
        const currentDate = new Date()
        const totalDuration = new Date(endDate) - new Date(startDate)
        const elapsedDuration = currentDate - new Date(startDate)
        const progressPercentage = (elapsedDuration / totalDuration) * 100
        console.log(Math.min(100, Math.max(0, progressPercentage)))

        return Math.min(100, Math.max(0, progressPercentage)) // Ensure the percentage is between 0 and 100
    }
    const gradientBackground = 'linear-gradient(135deg, #EA98DA, #D291DF, #BA89E4, #A382EA, #8B7BEF, #7373F4, #5B6CF9)'

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: darkThemeBackground, // Set dark theme background color
                color: darkThemeText // Set dark theme text color
            }}
        >
            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '16px' }}>
                <Header />

                <IconButton color="primary" onClick={handleOpenSnackbar}>
                    <Badge badgeContent={notificationCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>

                <div className={classNames(linkClass, 'cursor-pointer text-red-500')}>
                    <button
                        className="text-xl"
                        onClick={() => {
                            signOut(auth)
                                .then(() => {
                                    // Sign-out successful.
                                })
                                .catch((error) => {
                                    // An error happened.
                                    console.log('// An error happened.', error.message)
                                })
                        }}
                    >
                        <HiOutlineLogout />
                    </button>
                    {t('log.logOut')}
                </div>
            </Box>
            <Typography variant="h4" mb={4} mr={30}>
                {t('client.welcome')} - {userData ? userData.firstName : 'Guest'}
            </Typography>
            {loading ? (
                <div className="bg-black h-screen w-screen flex justify-center items-center">
                    <Audio
                        height="80"
                        width="80"
                        radius="9"
                        color="green"
                        ariaLabel="loading"
                        wrapperStyle
                        wrapperClass
                    />{' '}
                </div>
            ) : (
                <Stack sx={{ width: '100%' }} spacing={4}>
                    <Typography variant="h5" mb={2}>
                        {t('client.step')}: {steps[currentStep]}
                    </Typography>
                    <Stepper alternativeLabel activeStep={currentStep} sx={{ width: '100%', mb: 4 }}>
                        {constructionSteps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel>
                                    <Typography color={'white'} variant="body2">
                                        {step.label}
                                    </Typography>
                                    <Typography color={'white'} variant="caption">
                                        {step.startDate}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {constructionSteps.map((step, index) => {
                        const startDate = new Date(step.startDate)
                        const endDate = new Date(step.endDate)

                        return (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <Typography variant="body2">{step.description}</Typography>
                                <Typography variant="caption">
                                    {startDate.toDateString()} - {endDate.toDateString()}
                                </Typography>
                                {/* Calculate progress percentage */}
                                {startDate <= new Date() && (
                                    <LinearProgress
                                        variant="determinate"
                                        value={calculateProgressPercentage(startDate, endDate)}
                                    />
                                )}
                            </div>
                        )
                    })}

                    {userData && (
                        <Grid
                            container
                            spacing={2}
                            mt={4}
                            style={{
                                background: gradientBackground,

                                padding: '20px',
                                borderRadius: '12px',
                                height: 'auto',
                                display: 'flex',
                                alignItems: 'center', // Center items horizontally
                                justifyContent: 'space-around' // Add space around items
                            }}
                        >
                            <Grid item xs={12} sm={6} md={3}>
                                <Box
                                    sx={{
                                        bgcolor: '#1B1A55',
                                        color: '#FFFFFF',
                                        p: 3,
                                        borderRadius: 8,
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: '#FFFFFF', color: '#1B1A55' }}>
                                        <MonetizationOnIcon />
                                    </Avatar>
                                    <Typography variant="h5" mb={2}>
                                        {t('client.dpayment')}
                                    </Typography>
                                    <Typography variant="body1" mb={2}>
                                        ${userData.downPayment || 0}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Box
                                    sx={{
                                        bgcolor: '#535C91',
                                        color: '#FFFFFF',
                                        p: 3,
                                        borderRadius: 8,
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: '#FFFFFF', color: '#535C91' }}>
                                        <CalendarTodayIcon />
                                    </Avatar>
                                    <Typography variant="h5" mb={2}>
                                        {t('client.mpayment')}
                                    </Typography>
                                    <Typography variant="body1" mb={2}>
                                        ${userData.monthlyPayment || 0}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box
                                    sx={{
                                        bgcolor: '#9290C3',
                                        color: '#FFFFFF',
                                        p: 3,
                                        borderRadius: 8,
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: '#FFFFFF', color: '#9290C3' }}>
                                        <AccessTimeIcon />
                                    </Avatar>
                                    <Typography variant="h5" mb={2}>
                                        {t('client.npayment')}
                                    </Typography>
                                    <Typography variant="body1" mb={2}>
                                        {userData.dateOfPaymentMonthly} {t('client.of')}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Box
                                    sx={{
                                        bgcolor: '#070F2B',
                                        color: '#FFFFFF',
                                        p: 3,
                                        borderRadius: 8,
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: '#FFFFFF', color: '#070F2B' }}>
                                        <LoyaltyIcon />
                                    </Avatar>
                                    <Typography variant="h5" mb={2}>
                                        {t('client.upayment')}
                                    </Typography>
                                    <Typography variant="body1" mb={2}>
                                        {getDaysUntilNextPayment()}
                                    </Typography>
                                </Box>
                            </Grid>
                            {/* Add similar code for other items */}
                        </Grid>
                    )}

                    <Typography variant="h4" mb={4}>
                        {t('client.section')}
                    </Typography>

                    {loading ? (
                        <Typography variant="h5">Loading...</Typography>
                    ) : (
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            alignItems={'center'}
                            justifyContent={'center'}
                            spacing={2}
                            mt={4}
                        >
                            {services.map((service, index) => (
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        sx={{ height: 240, width: 400 }}
                                        image={service.imgUrl}
                                        title={service.serviceName}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {service.serviceName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {service.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
                    <Typography variant="h4" mb={3} mt={5}>
                        {t('client.offer')}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
                        {offers.map((offer) => (
                            <Box
                                key={offer.id}
                                bgcolor="#1B1A55"
                                p={3}
                                borderRadius={8}
                                width={{ xs: '100%', sm: '90%' }}
                                boxShadow={3}
                                color="#FFFFFF"
                            >
                                <Typography variant="h6">{offer.name}</Typography>
                                <Typography variant="h4">{offer.description}</Typography>
                                <Typography variant="body1">{`Start Date: ${offer.startDate
                                    .toDate()
                                    .toLocaleDateString()}`}</Typography>
                                <Typography variant="body1">{`End Date: ${offer.endDate
                                    .toDate()
                                    .toLocaleDateString()}`}</Typography>
                            </Box>
                        ))}
                    </Stack>

                    <Typography variant="h4" mb={4}>
                        {t('client.psection')}
                    </Typography>

                    {propertyDetails ? (
                        <Grid
                            container
                            spacing={2}
                            mt={4}
                            style={{
                                background: gradientBackground,

                                padding: '20px',
                                borderRadius: '12px',
                                height: 'auto',
                                display: 'flex',
                                alignItems: 'center', // Center items horizontally
                                justifyContent: 'space-around' // Add space around items
                            }}
                        >
                            {[
                                { label: t('client.pview'), value: propertyDetails.Column1, bgcolor: '#070F2B' },
                                { label: t('client.floor'), value: propertyDetails.قات, bgcolor: '#1B1A55' },
                                { label: t('client.anumber'), value: propertyDetails.رقم_شقه, bgcolor: '#535C91' },
                                { label: t('client.area'), value: propertyDetails.متر, bgcolor: '#9290C3' },
                                { label: t('client.pmeter'), value: propertyDetails.سعر_متر, bgcolor: '#070F2B' },
                                { label: t('client.total'), value: propertyDetails.سعر_كلي, bgcolor: '#1B1A55' }
                            ].map((item, index) => (
                                <Grid item key={index} xs={12} sm={6} md={4}>
                                    <Box
                                        bgcolor={item.bgcolor}
                                        p={3}
                                        borderRadius={8}
                                        color="#FFFFFF"
                                        boxShadow={3}
                                        textAlign="center"
                                    >
                                        <Typography variant="h5" mb={2}>
                                            {item.label}
                                        </Typography>
                                        <Typography variant="body1" mb={2}>
                                            {item.value}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                            <Typography variant="h5" mb={2}>
                                {t('client.map')}
                            </Typography>
                            {propertyDetails.متر === 152 && (
                                <img
                                    src={image152}
                                    alt="2.0"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        marginTop: '20px',
                                        borderRadius: '12px'
                                    }}
                                />
                            )}
                            {propertyDetails.متر === 203 && (
                                <img
                                    src={image203}
                                    alt="1.0"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        marginTop: '20px',
                                        borderRadius: '12px'
                                    }}
                                />
                            )}
                        </Grid>
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
                        {t('client.new')}
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
