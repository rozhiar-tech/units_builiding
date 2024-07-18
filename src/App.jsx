// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import { useEffect, useState } from 'react'
import { auth, onAuthStateChanged, collection, getDocs, where, query, firestore } from './firebase/initFirebase' // Update the path
import Login from './pages/Login'
import Orders from './pages/Orders'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Customers from './pages/Customers'
import Transaction from './pages/Transactions'
import Expences from './pages/Expences'
import Services from './pages/Services'
import Broadcast from './pages/Broadcast'
import ClientDashboard from './pages/Client-dashboard'
import Timeline from './pages/Timeline'
import { Audio } from 'react-loader-spinner'
import Offers from './pages/Offers'
import AdminMonthlyPayment from './pages/MonthlyPayment'

function App() {
    const [user, setUser] = useState(null)
    const [admin, setAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            setUser(authUser)

            if (authUser) {
                try {
                    const usersCollectionRef = collection(firestore, 'Users')
                    const q = query(usersCollectionRef, where('userId', '==', authUser.uid))
                    const querySnapshot = await getDocs(q)

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data()
                        const userType = userData.userType
                        // console.log('User type:', userType)

                        // Redirect based on user type
                        if (userType === 'admin') {
                            // console.log('Admin user')
                            setAdmin(true)
                        } else if (userType === 'client') {
                            // console.log('Client user')
                            setAdmin(false)
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error)
                } finally {
                    setLoading(false) // Set loading to false once user data is fetched
                }
            } else {
                setLoading(false) // Set loading to false if no authenticated user
            }
        })

        return () => unsubscribe()
    }, []) // Ensure to include navigate in the dependency array if using it inside the useEffect

    if (loading) {
        // You can render a loading spinner or any other loading indicator here
        return (
            <div className="bg-black h-screen w-screen flex justify-center items-center">
                <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" wrapperStyle wrapperClass />{' '}
            </div>
        )
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        user && admin ? (
                            <Layout user={user} />
                        ) : user && !admin ? (
                            <ClientDashboard user={user} />
                        ) : (
                            <Login />
                        )
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="transactions" element={<Transaction />} />
                    <Route path="expences" element={<Expences />} />
                    <Route path="services" element={<Services />} />
                    <Route path="broadcast" element={<Broadcast />} />
                    <Route path="timeline" element={<Timeline />} />
                    <Route path="offers" element={<Offers />} />
                    <Route path="monthly-payment" element={<AdminMonthlyPayment />} />
                </Route>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/client-dashboard"
                    element={user && !admin ? <ClientDashboard user={user} /> : <Login />}
                />
            </Routes>
            <ToastContainer position="top-center" autoClose={3000} showProgressBar={true} />
        </Router>
    )
}

export default App
