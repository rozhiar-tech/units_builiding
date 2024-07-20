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
import { collection, addDoc, getDocs, firestore } from '../firebase/initFirebase'

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
        'security-advisory'
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
            await addDoc(collection(firestore, 'Users'), {
                ...newUser,
                userType: 'admin'
            })
            alert('User added successfully!')
        } catch (error) {
            console.error('Error adding user:', error)
            alert('Failed to add user.')
        }
    }

    const handleAddRole = async () => {
        try {
            const docRef = await addDoc(collection(firestore, 'Roles'), newRole)
            setRoles([...roles, { id: docRef.id, ...newRole }])
            setNewRole({ name: '', description: '', permissions: [] })
            alert('Role added successfully!')
        } catch (error) {
            console.error('Error adding role:', error)
            alert('Failed to add role.')
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
