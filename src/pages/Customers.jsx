import React, { useState, useEffect } from 'react'
import { collection, getDocs, firestore } from '../firebase/initFirebase'

import Modal from 'react-modal'

Modal.setAppElement('#root') // Set the root element for accessibility

export default function Customers() {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
            <h1>Customer List</h1>
            <table className="w-full text-sm text-left rtl:text-right text-gray-900 ">
                <thead className='"text-xs text-gray-700 uppercase bg-gray-50  dark:text-gray-400"'>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Payment Plan</th>
                        <th>Down Payment</th>
                        <th>Property Code</th>
                        <th>phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            onClick={() => openModal(user)}
                            style={{ cursor: 'pointer' }}
                            className='"odd:bg-white  even:bg-gray-200  border-b dark:border-gray-700 "'
                        >
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.paymentPlan === 'true' ? 'Payment Plan' : 'Payed'}</td>
                            <td>{user.downPayment}</td>
                            <td>{user.propertyCode}</td>
                            <td>{user.phone}</td>
                            <td>
                                <button
                                    type="button"
                                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="User Information Modal"
                className="modal"
            >
                {selectedUser && (
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="text-2xl font-bold">User Profile</h2>
                            <button className="close-button" onClick={closeModal}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="user-info">
                                <img
                                    src={selectedUser.profileImage}
                                    alt="User Profile"
                                    className="rounded-full h-20 w-20 object-cover"
                                />
                                <p className="text-xl font-semibold mt-2">{`${selectedUser.firstName} ${selectedUser.lastName}`}</p>
                                <p className="text-gray-600">{selectedUser.email}</p>
                                {/* Add other user details */}
                            </div>
                            <div className="actions">
                                <button className="button" onClick={closeModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
