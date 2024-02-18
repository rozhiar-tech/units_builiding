// useUserRole.js
import { useEffect, useState } from 'react'

const useUserRole = (user) => {
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        if (user && user.role === 'admin') {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
    }, [user])

    return isAdmin
}

export default useUserRole
