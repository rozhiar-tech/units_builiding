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
    TableSortLabel,
    Box,
    Divider
} from '@mui/material'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import './styles.css'

Modal.setAppElement('#root') // Set the root element for accessibility

const Customers = () => {
    const { t } = useTranslation()

    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
    const [searchInput, setSearchInput] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(firestore, 'Users')
            const usersSnapshot = await getDocs(usersCollection)
            const usersData = usersSnapshot.docs
                .filter((doc) => doc.data().userType === 'client')
                .map((doc) => ({ id: doc.id, ...doc.data() }))

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
                                    {t('customers.fname')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'lastName'}
                                    direction={sortConfig.key === 'lastName' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('lastName')}
                                >
                                    {t('customers.lname')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'email'}
                                    direction={sortConfig.key === 'email' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('email')}
                                >
                                    {t('customers.email')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'paymentPlan'}
                                    direction={sortConfig.key === 'paymentPlan' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('paymentPlan')}
                                >
                                    {t('customers.pplan')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'downPayment'}
                                    direction={sortConfig.key === 'downPayment' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('downPayment')}
                                >
                                    {t('customers.dpayment')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'propertyCode'}
                                    direction={sortConfig.key === 'propertyCode' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('propertyCode')}
                                >
                                    {t('customers.pcode')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'phone'}
                                    direction={sortConfig.key === 'phone' ? sortConfig.direction : 'asc'}
                                    onClick={() => requestSort('phone')}
                                >
                                    {t('customers.phone')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>{t('customers.action')}</TableCell>
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
                                <TableCell>{user.paymentPlan === true ? 'Payment Plan' : 'Paid'}</TableCell>
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
                style={{
                    content: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        borderRadius: '8px',
                        padding: '20px',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }
                }}
            >
                {selectedUser && (
                    <div className="modal-content">
                        <div className="modal-header">
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                                User Profile
                            </Typography>
                            <Button color="secondary" onClick={closeModal} style={{ marginLeft: 'auto' }}>
                                Close
                            </Button>
                        </div>
                        <Divider sx={{ my: 2 }} />
                        <div className="modal-body">
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                    textAlign: 'center'
                                }}
                            >
                                <img
                                    src={selectedUser.profileImage}
                                    alt="User Profile"
                                    style={{
                                        borderRadius: '50%',
                                        height: '100px',
                                        width: '100px',
                                        objectFit: 'cover'
                                    }}
                                />
                                <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                                    {`${selectedUser.firstName} ${selectedUser.lastName}`}
                                </Typography>
                                <Typography color="textSecondary">{selectedUser.email}</Typography>
                                <Typography variant="body1">
                                    <strong>Phone:</strong> {selectedUser.phone}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Property Code:</strong> {selectedUser.propertyCode}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Payment Plan:</strong>{' '}
                                    {selectedUser.paymentPlan === true ? 'Payment Plan' : 'Paid'}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Down Payment:</strong> ${selectedUser.downPayment}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Monthly Payment:</strong> ${selectedUser.monthlyPayment}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Overall Payment:</strong> ${selectedUser.overallPayment}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Key Payment:</strong> ${selectedUser.keyPayment}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>After Key Payment:</strong> ${selectedUser.afterKeyPayment}
                                </Typography>
                            </Box>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Customers
