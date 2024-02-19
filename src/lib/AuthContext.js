// AuthContext.js
import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [emaill, setEmaill] = useState('')
    const [passwordd, setPasswordd] = useState('')

    const setCredentials = (newEmail, newPassword) => {
        setEmaill(newEmail)
        setPasswordd(newPassword)
    }

    return (
        <AuthContext.Provider value={{ emaill, passwordd, setCredentials, setEmaill, setPasswordd }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
