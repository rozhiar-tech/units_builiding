import React, { useState, useEffect } from 'react'
import { Stack, Step, Stepper, StepLabel, Typography, Paper, Box, LinearProgress } from '@mui/material'
// import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai' // Import icons from react-icons
import { collection, getDocs } from '../firebase/initFirebase'
import { format, addMonths, differenceInDays } from 'date-fns'
import { firestore } from '../firebase/initFirebase'
import { productData } from '../data/data'

const steps = ['January', 'February', 'April', 'July', 'October', 'December']

const ClientDashboard = ({ user }) => {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [services, setServices] = useState([])
    const [propertyDetails, setPropertyDetails] = useState(null)

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
        const fetchPropertyDetails = () => {
            if (userData && userData.propertyCode) {
                const matchedProperty = productData.find((property) => property.رقم_شقه === userData.propertyCode)

                if (matchedProperty) {
                    setPropertyDetails(matchedProperty)
                }
            }
        }

        fetchUserData()
        fetchServices()
        fetchPropertyDetails()
    }, [user, userData])
    const currentDate = new Date()

    const getProgress = (startDate, endDate) => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const progress = ((currentDate - start) / (end - start)) * 100

        return progress < 0 ? 0 : progress > 100 ? 100 : progress
    }
    const constructionSteps = [
        { label: 'Construction Begins', date: 'February 2024' },
        { label: 'Foundation Completed', date: 'June 2024' },
        { label: 'Frame Construction', date: 'September 2024' },
        { label: 'Interior Work', date: 'January 2025' },
        { label: 'Keys Given to Tenants', date: 'April 2025' }
        // Add more steps as needed
    ]
    const getCurrentStep = () => {
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1 // Adding 1 to match the month index

        return currentMonth
    }

    // const getStepIcon = (index) => {
    //     const currentStep = getCurrentStep()
    //     return index < currentStep ? <AiOutlineCheckCircle /> : <AiOutlineCloseCircle />
    // }

    const getNextPaymentDate = () => {
        const currentDate = new Date()
        const currentDay = currentDate.getDate()

        // If today is the 5th or later, set the next payment for the 5th of the next month
        const nextPaymentDate = currentDay >= 5 ? addMonths(currentDate, 1) : currentDate

        return new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth(), 5)
    }

    const getDaysUntilNextPayment = () => {
        const currentDate = new Date()
        const nextPaymentDate = getNextPaymentDate()
        const daysRemaining = differenceInDays(nextPaymentDate, currentDate)
        return daysRemaining
    }

    return (
        <Paper
            elevation={3}
            sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
            <Typography variant="h4" mb={4}>
                Client Dashboard - {userData ? userData.displayName : 'Guest'}
            </Typography>

            {loading ? (
                <Typography variant="h5">Loading...</Typography>
            ) : (
                <Stack sx={{ width: '100%' }} spacing={4}>
                    <Typography variant="h5" mb={2}>
                        Current Step: {steps[getCurrentStep() - 1]}
                    </Typography>
                    <Stepper alternativeLabel activeStep={0} sx={{ width: '100%', mb: 4 }}>
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
                            <LinearProgress variant="determinate" value={getProgress('March 2024', step.date)} />
                        </div>
                    ))}

                    {/* {steps.map((content, index) => (
                        <div key={index}>
                            {getCurrentStep() - 1 === index && <Typography variant="h6">{content}</Typography>}
                        </div>
                    ))} */}

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
        </Paper>
    )
}

export default ClientDashboard
