import React, { useState, useEffect } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import Modal from 'react-modal'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    TableSortLabel
} from '@mui/material'
import TextField from '@mui/material/TextField'

Modal.setAppElement('#root') // Set the root element for accessibility

const Customers = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
    const [searchInput, setSearchInput] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(firestore, 'Users')
            const usersSnapshot = await getDocs(usersCollection)
            const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setUsers(usersData)
        }

        fetchUsers()
    }, [])

    const openModal = (user) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const requestSort = (key) => {
        let direction = 'ascending'
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }

    const getSortedData = () => {
        let sortedData = [...users]

        // Sorting
        if (sortConfig.key) {
            sortedData.sort((a, b) => {
                const keyA = a[sortConfig.key]
                const keyB = b[sortConfig.key]
                if (keyA < keyB) return sortConfig.direction === 'ascending' ? -1 : 1
                if (keyA > keyB) return sortConfig.direction === 'ascending' ? 1 : -1
                return 0
            })
        }

        // Searching
        if (searchInput) {
            const lowerCaseSearch = searchInput.toLowerCase()
            sortedData = sortedData.filter(
                (user) =>
                    (user.firstName && user.firstName.toLowerCase().includes(lowerCaseSearch)) ||
                    (user.lastName && user.lastName.toLowerCase().includes(lowerCaseSearch)) ||
                    (user.email && user.email.toLowerCase().includes(lowerCaseSearch)) ||
                    (user.phone && user.phone.toLowerCase().includes(lowerCaseSearch)) ||
                    (user.propertyCode && user.propertyCode.toLowerCase().includes(lowerCaseSearch))
            )
        }

        return sortedData
    }

    const sortedData = getSortedData()

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <h1 className="my-3">Customer List</h1>
            <TextField
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                fullWidth
                label="Search"
                variant="outlined"
                sx={{ mb: 2 }}
            />

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'firstName'}
                                    direction={sortConfig.key === 'firstName' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('firstName')}
                                >
                                    First Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'lastName'}
                                    direction={sortConfig.key === 'lastName' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('lastName')}
                                >
                                    Last Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'email'}
                                    direction={sortConfig.key === 'email' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('email')}
                                >
                                    Email
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'paymentPlan'}
                                    direction={sortConfig.key === 'paymentPlan' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('paymentPlan')}
                                >
                                    Payment Plan
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'downPayment'}
                                    direction={sortConfig.key === 'downPayment' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('downPayment')}
                                >
                                    Down Payment
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'propertyCode'}
                                    direction={sortConfig.key === 'propertyCode' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('propertyCode')}
                                >
                                    Property Code
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'phone'}
                                    direction={sortConfig.key === 'phone' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('phone')}
                                >
                                    Phone
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((user) => (
                            <TableRow
                                key={user.id}
                                onClick={() => openModal(user)}
                                style={{ cursor: 'pointer' }}
                                className="odd:bg-white even:bg-gray-200 border-b dark:border-gray-700"
                            >
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.paymentPlan === 'true' ? 'Payment Plan' : 'Paid'}</TableCell>
                                <TableCell>{user.downPayment}</TableCell>
                                <TableCell>{user.propertyCode}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => openModal(user)}
                                        sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="User Information Modal"
                className="modal"
            >
                {selectedUser && (
                    <div className="modal-content">
                        <div className="modal-header">
                            <Typography variant="h4" sx={{ flexGrow: 1 }}>
                                User Profile
                            </Typography>
                            <Button color="secondary" onClick={closeModal}>
                                Close
                            </Button>
                        </div>
                        <div className="modal-body">
                            <div className="user-info">
                                <img
                                    src={selectedUser.profileImage}
                                    alt="User Profile"
                                    style={{ borderRadius: '50%', height: '100px', width: '100px', objectFit: 'cover' }}
                                />
                                <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                                    {`${selectedUser.firstName} ${selectedUser.lastName}`}
                                </Typography>
                                <Typography color="textSecondary">{selectedUser.email}</Typography>
                            
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Customers
