import React, { useState, useEffect } from 'react'
import {
    auth,
    createUserWithEmailAndPassword,
    firestore,
    collection,
    addDoc,
    Timestamp,
    updateDoc,
    signOut,
    signInWithEmailAndPassword,
    getDocs,
    serverTimestamp
} from '../firebase/initFirebase' // Update the path
import { toast } from 'react-toastify'
import Switch from 'react-switch'
import { FcFilledFilter } from 'react-icons/fc'
import Modal from 'react-modal'
import './custom.css'
import { productData } from '../data/data'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

export default function AddClient() {
    const { t } = useTranslation()

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        propertyCode: '',
        paymentPlan: '',
        downPayment: '',
        monthlyPayment: '',
        keyPayment: '',
        afterKeyPayment: '',
        email: '',
        password: '',
        phone: '',
        overallPayment: ''
    })
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }
    const [filterCriteria, setFilterCriteria] = useState({})
    const [filteredData, setFilteredData] = useState([])
    const [isUserTypeEnabled, setIsUserTypeEnabled] = useState(false)
    const [isUserPaymentPlan, setIsUserPaymentPlan] = useState(true)
    const [propertyCode, setPropertyCode] = useState('')
    const [selectedDate, handleDateChange] = useState(0)
    const [selectedApartments, setSelectedApartments] = useState([])
    const { email, password } = useSelector((state) => state.auth)

    useEffect(() => {
        const fetchSelectedApartments = async () => {
            try {
                const selectedApartmentsCollectionRef = collection(firestore, 'SelectedApartments')
                const selectedApartmentsSnapshot = await getDocs(selectedApartmentsCollectionRef)

                if (!selectedApartmentsSnapshot.empty) {
                    const selectedApartmentsData = selectedApartmentsSnapshot.docs.map((doc) => doc.data())
                    // Update selected apartments state with the loaded data
                    setSelectedApartments(selectedApartmentsData.map((apartment) => apartment.propertyCode))
                }
            } catch (error) {
                console.error('Error fetching selected apartments:', error)
            }
        }

        fetchSelectedApartments()
    }, []) // Adjust dependencies as needed

    const handleToggleChange = (checked) => {
        setIsUserTypeEnabled(checked)
        setFormData((prevData) => ({
            ...prevData,
            userType: checked ? 'client' : 'admin'
        }))
    }
    const handleToggleChangePayment = (checked) => {
        setIsUserPaymentPlan(checked)
        setFormData((prevData) => ({
            ...prevData,
            paymentPlan: checked ? 'true' : 'false' // Set userType to 'client' when enabled, empty otherwise
            // ... (other fields based on your requirements)
        }))
    }
    const addClientToFirestore = async (formData, userId) => {
        try {
            // Add user data to 'Users' collection
            let userDocRef
            if (isUserTypeEnabled) {
                userDocRef = await addDoc(collection(firestore, 'Users'), {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    userType: formData.userType,
                    email: formData.email,
                    phone: formData.phone,
                    propertyCode: propertyCode,
                    paymentPlan: isUserPaymentPlan,
                    downPayment: formData.downPayment,
                    monthlyPayment: formData.monthlyPayment,
                    keyPayment: formData.keyPayment,
                    afterKeyPayment: formData.afterKeyPayment,
                    overallPayment: formData.overallPayment,
                    dateOfPaymentMonthly: selectedDate,
                    userId: userId
                })
            } else {
                userDocRef = await addDoc(collection(firestore, 'Users'), {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    userType: formData.userType,
                    email: formData.email,
                    phone: formData.phone,
                    userId: userId
                })
            }
            // Extract userId from the DocumentReference

            // Update the document with the generated userId
            await updateDoc(userDocRef, { userId: userId })

            // Add transaction data to 'Transactions' collection
            const transactionDate = Timestamp.fromDate(new Date())
            const remainingPayment = formData.overallPayment - formData.downPayment

            await addDoc(collection(firestore, 'Transactions'), {
                userName: formData.firstName + ' ' + formData.lastName,
                userId: userDocRef.id,
                transactionDate: transactionDate,
                downPayment: formData.downPayment,
                overallPayment: formData.overallPayment,
                remainingPayment: remainingPayment,
                paymentPlan: isUserPaymentPlan,
                propertyCode: propertyCode
            })

            console.log('Document written with ID: ', userDocRef.id)
            return userDocRef.id
        } catch (error) {
            console.error('Error adding client to Firestore:', error.message)
            throw error
        }
    }
    const handlePropertyCodeSelection = async (propertyCode) => {
        if (!selectedApartments.includes(propertyCode)) {
            setSelectedApartments((prevSelected) => [...prevSelected, propertyCode])

            // Add the selected apartment to Firestore
            const selectedApartmentsRef = collection(firestore, 'SelectedApartments')
            await addDoc(selectedApartmentsRef, {
                propertyCode,
                timestamp: serverTimestamp()
            })

            // Close the modal and get the property code
            setPropertyCode(propertyCode)
            closeModal()
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
            const userId = userCredential.user.uid

            const { ...clientData } = formData // Exclude email and password
            await addClientToFirestore(clientData, userId)

            // Clear form data after submission
            setFormData({
                firstName: '',
                lastName: '',
                propertyCode: '',
                paymentPlan: '',
                userType: '',
                downPayment: '',
                monthlyPayment: '',
                keyPayment: '',
                afterKeyPayment: '',
                email: '',
                password: '',
                phone: ''
            })

            toast.success('Client added successfully!', { position: 'top-right', autoClose: 3000 })
            signOut(auth)
            signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            toast.error('Error adding client. Please try again.', { position: 'top-right', autoClose: 3000 })
        }
    }
    const applyFilters = () => {
        const result = productData.filter((item) => {
            // Check each column for filtering
            for (const [key, value] of Object.entries(filterCriteria)) {
                if (value && item[key] && !item[key].toString().includes(value)) {
                    return false // If any condition doesn't match, exclude the item
                }
            }

            // Check if the apartment has been selected before
            if (selectedApartments.includes(item['رقم_شقه'])) {
                return false // Exclude the item if it has been selected before
            }

            return true // Include the item if all conditions are met
        })

        setFilteredData(result)
    }

    return (
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
            <div className="mb-5">
                <label className="block text-sm text-gray-700">
                    {isUserTypeEnabled ? `${t('orders.client')}` : `${t('orders.admin')}`}
                </label>
                <div className="mt-1">
                    <Switch
                        onChange={handleToggleChange}
                        checked={isUserTypeEnabled}
                        onColor="#86d3ff"
                        onHandleColor="#2693e6"
                        handleDiameter={25}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.2)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.1)"
                        height={15}
                        width={40}
                        className="react-switch"
                        id="toggle"
                    />
                </div>
            </div>
            <div className="relative z-0 w-full mb-5 group">
                <input
                    type="email"
                    name="email"
                    id="floating_email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                />
                <label
                    htmlFor="floating_email"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    {`${t('orders.email')}`}
                </label>
            </div>

            <div className="relative z-0 w-full mb-5 group">
                <input
                    type="password"
                    name="password"
                    id="floating_password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                />
                <label
                    htmlFor="floating_password"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    {`${t('orders.password')}`}
                </label>
            </div>

            <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="firstName"
                        id="floating_first_name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                    />
                    <label
                        htmlFor="floating_first_name"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        {`${t('orders.fname')}`}
                    </label>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="lastName"
                        id="floating_last_name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                    />
                    <label
                        htmlFor="floating_last_name"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        {`${t('orders.lname')}`}
                    </label>
                </div>
            </div>

            <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="tel"
                        name="phone"
                        id="floating_phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                    />
                    <label
                        htmlFor="floating_phone"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        {`${t('orders.phone')}`} (07********)
                    </label>
                </div>

                {isUserTypeEnabled ? (
                    <div className="relative z-0 w-full mb-5 group">
                        <button
                            type="button"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            onClick={() => {
                                // Add your logic for the button click
                                openModal()
                            }}
                        >
                            <span className="peer-focus:font-medium duration-300 transform -translate-y-6 scale-75 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                {/* Replace the content inside the span with your desired label */}
                                {propertyCode === '' ? `${t('orders.pcode')}` : propertyCode}
                            </span>
                        </button>
                        <button
                            className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                            onClick={(e) => {
                                // Prevent the click event from propagating to the button
                                e.stopPropagation()

                                // Add your logic for the filter button click
                                openModal()
                            }}
                        >
                            {/* Replace the content inside the button with your desired filter icon */}
                            <FcFilledFilter fontSize={24} />
                        </button>
                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            contentLabel="Filter Modal"
                            className="custom-modal-styles"
                            overlayClassName="custom-overlay-styles"
                            style={{
                                content: {
                                    maxHeight: '80%', // Adjust this value to your preference
                                    margin: 'auto',
                                    overflow: 'auto'
                                }
                            }}
                            center
                        >
                            <h2 className="text-white">{t('orders.filtername')}</h2>

                            {/* Add filters for each column */}

                            <div className="mb-4">
                                <label htmlFor="filterرقم_شقه" className="text-white block mb-2">
                                    {t('orders.propertycode')}:
                                </label>
                                <input
                                    type="text"
                                    id="filterرقم_شقه"
                                    value={filterCriteria['رقم_شقه'] || ''}
                                    onChange={(e) => setFilterCriteria({ ...filterCriteria, رقم_شقه: e.target.value })}
                                    className="w-full p-2 border rounded-md text-black"
                                    placeholder="Enter filter criteria"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    applyFilters()

                                    // Add additional logic as needed...
                                    // closeModal()
                                }}
                                className="text-white bg-gray-800 px-4 py-2 rounded-md"
                            >
                                Apply Filter
                            </button>
                            <button
                                onClick={closeModal}
                                className="text-white bg-gray-800 px-4 py-2 rounded-md mt-4 mx-3"
                            >
                                Close Modal
                            </button>

                            {/* Display filtered data */}
                            {filteredData.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-white">Filtered Results:</h3>
                                    <table className="table-auto text-white w-full mt-2">
                                        <thead className="bg-gray-900">
                                            <tr>
                                                {/* Display headers for each column */}
                                                {Object.keys(filteredData[0]).map((header, index) => (
                                                    <th key={index} className="border p-2">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.map((item, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {/* Display data for each column */}
                                                    {Object.entries(item).map(([key, value], colIndex) => (
                                                        <td
                                                            key={colIndex}
                                                            className={`border p-2 ${
                                                                key === 'رقم_شقه' ? 'cursor-pointer text-blue-500' : '' // Change cursor style and color for رقم_شقه column
                                                            }`}
                                                            onClick={() => handlePropertyCodeSelection(value)}
                                                        >
                                                            {value}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Modal>
                    </div>
                ) : (
                    <div></div>
                )}
                {isUserTypeEnabled ? (
                    <div className="mb-5">
                        <label className="block text-sm text-gray-700">{`${t('orders.pplan')}`}</label>
                        <div className="mt-1">
                            <Switch
                                onChange={handleToggleChangePayment}
                                checked={isUserPaymentPlan}
                                onColor="#86d3ff"
                                onHandleColor="#2693e6"
                                handleDiameter={25}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.2)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.1)"
                                height={15}
                                width={40}
                                className="react-switch"
                                id="toggle"
                            />
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        type="text"
                        name="userType"
                        id="floating_userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        disabled
                    />
                    <label
                        htmlFor="floating_userType"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        {`${t('orders.utype')}`}
                    </label>
                </div>
                {isUserTypeEnabled && isUserPaymentPlan ? (
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            name="downPayment"
                            id="floating_downPayment"
                            value={formData.downPayment}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="floating_downPayment"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            {`${t('orders.dpayment')}`}
                        </label>
                    </div>
                ) : (
                    <div></div>
                )}
                {isUserTypeEnabled && isUserPaymentPlan ? (
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            name="overallPayment"
                            id="floating_overallPayment"
                            value={formData.overallPayment}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="floating_downPayment"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            {`${t('orders.ovpayment')}`}
                        </label>
                    </div>
                ) : (
                    <div></div>
                )}
                {isUserTypeEnabled && isUserPaymentPlan ? (
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            name="monthlyPayment"
                            id="floating_monthlyPayment"
                            value={formData.monthlyPayment}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="floating_monthlyPayment"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            {`${t('orders.mpayment')}`}
                        </label>
                    </div>
                ) : (
                    <div></div>
                )}
                {isUserTypeEnabled && isUserPaymentPlan ? (
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            name="keyPayment"
                            id="floating_keyPayment"
                            value={formData.keyPayment}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="floating_keyPayment"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            {`${t('orders.kpayment')}`}
                        </label>
                    </div>
                ) : (
                    <div></div>
                )}
                {isUserTypeEnabled && isUserPaymentPlan ? (
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            name="afterKeyPayment"
                            id="floating_afterKeyPayment"
                            value={formData.afterKeyPayment}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="floating_afterKeyPayment"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            {`${t('orders.afkey')}`}
                        </label>
                    </div>
                ) : (
                    <div></div>
                )}
                {isUserTypeEnabled && isUserPaymentPlan ? (
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            name="dateofmonth"
                            id="floating_dateofmonth"
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="floating_dateofmonth"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            {`${t('orders.dopay')}`}
                        </label>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>

            <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Submit
            </button>
        </form>
    )
}
