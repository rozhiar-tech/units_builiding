import React, { useState, useEffect } from 'react'
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    FormControlLabel,
    Checkbox,
    Divider
} from '@mui/material'
import {
    collection,
    setDoc,
    getDocs,
    firestore,
    auth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    addDoc,
    doc
} from '../firebase/initFirebase'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const SuperAdmin = () => {
    const [roles, setRoles] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [permissions, setPermissions] = useState([
        'dashboard',
        'products',
        'orders',
        'customers',
        'transactions',
        'expences',
        'services',
        'broadcast',
        'timeline',
        'offers',
        'monthly-payment',
        'super-admin',
        'legal-documents',
        'compliance-requirements',
        'legal-contracts',
        'compliance-reports',
        'review-sales-contracts',
        'employment-law-compliance',
        'property-agreements',
        'tenant-disputes',
        'security-advisory',
        'finance-dashboard',
        'sales-revenue',
        'expense-reports',
        'payroll-data',
        'maintenance-costs',
        'financial-reports',
        'budgets',
        'payment-processing',
        'inventory-dashboard',
        'procurement-orders',
        'stock-levels',
        'inventory-reports',
        'stock-availability',
        "property-listings",
        "market-analysis",
        "property-evaluations",
        "sales-listings"
    ])

    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        roleId: ''
    })
    const [newRole, setNewRole] = useState({
        name: '',
        description: '',
        permissions: []
    })

    const { email: adminEmail, password: adminPassword } = useSelector((state) => state.auth)

    useEffect(() => {
        const fetchRoles = async () => {
            const rolesCollection = collection(firestore, 'Roles')
            const rolesSnapshot = await getDocs(rolesCollection)
            const rolesData = rolesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setRoles(rolesData)
        }

        fetchRoles()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }))
    }

    const handleRoleChange = (e) => {
        setNewUser((prevUser) => ({
            ...prevUser,
            roleId: e.target.value
        }))
    }

    const handleRoleInputChange = (e) => {
        const { name, value } = e.target
        setNewRole((prevRole) => ({
            ...prevRole,
            [name]: value
        }))
    }

    const handlePermissionChange = (permission) => {
        setNewRole((prevRole) => ({
            ...prevRole,
            permissions: prevRole.permissions.includes(permission)
                ? prevRole.permissions.filter((p) => p !== permission)
                : [...prevRole.permissions, permission]
        }))
    }

    const handleAddUser = async () => {
        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
            const userId = userCredential.user.uid

            // Add user data to Firestore with the same ID as auth.uid
            const { email, password, ...userData } = newUser
            await setDoc(doc(firestore, 'Users', userId), {
                ...userData,
                userId,
                userType: 'admin'
            })

            // Re-authenticate the current user
            await signOut(auth)
            await signInWithEmailAndPassword(auth, adminEmail, adminPassword)

            // Clear form data after submission
            setNewUser({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                roleId: ''
            })

            toast.success('User added successfully!', { position: 'top-right', autoClose: 3000 })
        } catch (error) {
            console.error('Error adding user:', error)
            toast.error('Failed to add user.', { position: 'top-right', autoClose: 3000 })
        }
    }

    const handleAddRole = async () => {
        try {
            const docRef = await addDoc(collection(firestore, 'Roles'), newRole)
            setRoles([...roles, { id: docRef.id, ...newRole }])
            setNewRole({ name: '', description: '', permissions: [] })
            toast.success('Role added successfully!', { position: 'top-right', autoClose: 3000 })
        } catch (error) {
            console.error('Error adding role:', error)
            toast.error('Failed to add role.', { position: 'top-right', autoClose: 3000 })
        }
    }

    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Super Admin Panel
                </Typography>

                {/* Add New User Section */}
                <Box sx={{ marginBottom: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Add New User
                    </Typography>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            name="firstName"
                            value={newUser.firstName}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            name="lastName"
                            value={newUser.lastName}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            name="email"
                            value={newUser.email}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            name="password"
                            type="password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select value={newUser.roleId} onChange={handleRoleChange} label="Role">
                                {roles.map((role) => (
                                    <MenuItem key={role.id} value={role.id}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" onClick={handleAddUser} fullWidth>
                            Add User
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Add New Role Section */}
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Add New Role
                    </Typography>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Role Name"
                            variant="outlined"
                            name="name"
                            value={newRole.name}
                            onChange={handleRoleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="Role Description"
                            variant="outlined"
                            name="description"
                            value={newRole.description}
                            onChange={handleRoleInputChange}
                            fullWidth
                        />
                        <Typography variant="h6">Permissions</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {permissions.map((permission) => (
                                <FormControlLabel
                                    key={permission}
                                    control={
                                        <Checkbox
                                            checked={newRole.permissions.includes(permission)}
                                            onChange={() => handlePermissionChange(permission)}
                                            color="primary"
                                        />
                                    }
                                    label={permission}
                                />
                            ))}
                        </Box>
                        <Button variant="contained" color="primary" onClick={handleAddRole} fullWidth>
                            Add Role
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}

export default SuperAdmin
