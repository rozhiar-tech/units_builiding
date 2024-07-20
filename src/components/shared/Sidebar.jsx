import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { FcDepartment } from 'react-icons/fc'
import { HiOutlineLogout } from 'react-icons/hi'
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from '../../lib/constants'
import { auth, signOut, getDoc, doc, firestore } from '../../firebase/initFirebase'
import { useTranslation } from 'react-i18next'

const linkClass =
    'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'

export default function Sidebar() {
    const { t } = useTranslation()
    const [permissions, setPermissions] = useState([])

    useEffect(() => {
        const fetchUserRole = async () => {
            const currentUser = auth.currentUser
            if (currentUser) {
                const userDoc = await getDoc(doc(firestore, 'Users', currentUser.uid))
                const userData = userDoc.data()
                const roleDoc = await getDoc(doc(firestore, 'Roles', userData.roleId))
                const roleData = roleDoc.data()
                setPermissions(roleData.permissions)
            }
        }

        fetchUserRole()
    }, [])

    return (
        <div className="bg-neutral-900 w-60 p-3 flex flex-col">
            <div className="flex items-center gap-2 px-1 py-3">
                <FcDepartment fontSize={24} />
                <span className="text-neutral-200 text-lg"> {t('description.part2')}</span>
            </div>
            <div className="py-8 flex flex-1 flex-col gap-0.5">
                {DASHBOARD_SIDEBAR_LINKS.filter((link) => permissions.includes(link.key)).map((link) => (
                    <SidebarLink key={link.key} link={link} />
                ))}
            </div>
            <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
                {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
                    <SidebarLink key={link.key} link={link} />
                ))}

                <div className={classNames(linkClass, 'cursor-pointer text-red-500')}>
                    <button
                        className="text-xl"
                        onClick={() => {
                            signOut(auth)
                                .then(() => {
                                    console.log('Sign-out successful.')
                                })
                                .catch((error) => {
                                    console.log('// An error happened.', error.message)
                                })
                        }}
                    >
                        <HiOutlineLogout />
                    </button>
                    {t('log.logOut')}
                </div>
            </div>
        </div>
    )
}

function SidebarLink({ link }) {
    const { pathname } = useLocation()
    const { t } = useTranslation()

    return (
        <Link
            to={link.path}
            className={classNames(pathname === link.path ? 'bg-neutral-700 text-white' : 'text-neutral-400', linkClass)}
        >
            <span className="text-xl">{link.icon}</span>
            {t(link.labelKey)}
        </Link>
    )
}
