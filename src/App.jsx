// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import { useEffect, useState } from 'react'
import { auth, onAuthStateChanged, firestore, getDoc, doc } from './firebase/initFirebase'
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
import SuperAdmin from './components/SuperAdmin'
import LegalDocuments from './pages/LegalDocuments'
import ComplianceRequirements from './pages/ComplianceRequirements'
import LegalContracts from './pages/LegalContracts'
import ComplianceReports from './pages/ComplianceReports'

function App() {
    const [user, setUser] = useState(null)
    const [permissions, setPermissions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            setUser(authUser)

            if (authUser) {
                try {
                    const userDoc = await getDoc(doc(firestore, 'Users', authUser.uid))
                    const userData = userDoc.data()
                    const roleDoc = await getDoc(doc(firestore, 'Roles', userData.roleId))
                    const roleData = roleDoc.data()
                    console.log(userData.roleId)
                    setPermissions(roleData.permissions)
                } catch (error) {
                    console.error('Error fetching user data:', error)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        })

        return () => unsubscribe()
    }, [])

    if (loading) {
        return (
            <div className="bg-black h-screen w-screen flex justify-center items-center">
                <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" wrapperStyle wrapperClass />
            </div>
        )
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Layout user={user} permissions={permissions} /> : <Login />}>
                    {permissions.includes('super-admin') && <Route path="super-admin" element={<SuperAdmin />} />}
                    {permissions.includes('dashboard') && <Route index element={<Dashboard />} />}
                    {permissions.includes('products') && <Route path="products" element={<Products />} />}
                    {permissions.includes('orders') && <Route path="orders" element={<Orders />} />}
                    {permissions.includes('customers') && <Route path="customers" element={<Customers />} />}
                    {permissions.includes('transactions') && <Route path="transactions" element={<Transaction />} />}
                    {permissions.includes('expences') && <Route path="expences" element={<Expences />} />}
                    {permissions.includes('services') && <Route path="services" element={<Services />} />}
                    {permissions.includes('broadcast') && <Route path="broadcast" element={<Broadcast />} />}
                    {permissions.includes('timeline') && <Route path="timeline" element={<Timeline />} />}
                    {permissions.includes('offers') && <Route path="offers" element={<Offers />} />}
                    {permissions.includes('monthly-payment') && (
                        <Route path="monthly-payment" element={<AdminMonthlyPayment />} />
                    )}
                    {permissions.includes('legal-documents') && (
                        <Route path="legal-documents" element={<LegalDocuments />} />
                    )}
                    {permissions.includes('compliance-requirements') && (
                        <Route path="compliance-requirements" element={<ComplianceRequirements />} />
                    )}
                    {permissions.includes('legal-contracts') && (
                        <Route path="legal-contracts" element={<LegalContracts />} />
                    )}
                    {permissions.includes('compliance-reports') && (
                        <Route path="compliance-reports" element={<ComplianceReports />} />
                    )}
                </Route>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/client-dashboard" element={user ? <ClientDashboard user={user} /> : <Login />} />
            </Routes>
            <ToastContainer position="top-center" autoClose={3000} showProgressBar={true} />
        </Router>
    )
}

export default App
