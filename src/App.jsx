// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import { useEffect, useState } from 'react'
import { auth, onAuthStateChanged } from './firebase/initFirebase' // Update the path
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

function App() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
        })

        return () => unsubscribe()
    }, [])

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Layout user={user} /> : <Navigate to="/login" />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="transactions" element={<Transaction />} />
                    <Route path="expences" element={<Expences />} />
                    <Route path="services" element={<Services />} />
                    <Route path="broadcast" element={<Broadcast />} />
                </Route>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/client-dashboard" element={<ClientDashboard user={user} />} />
            </Routes>
            <ToastContainer position="top-center" autoClose={3000} showProgressBar={true} />
        </Router>
    )
}

export default App
