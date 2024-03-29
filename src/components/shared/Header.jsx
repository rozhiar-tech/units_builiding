import React, { Fragment, useState } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
// import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import backgroundImage from '../../assets/account.jpg'
import i18n from '../../lib/languages/i18n'

const LanguageMenu = ({ onSelectLanguage }) => {
    const languages = [
        { code: 'en', label: 'English' },
        { code: 'ar', label: 'Arabic' },
        { code: 'ku', label: 'Kurdish' }
    ]

    return (
        <div className="flex items-center">
            {languages.map((language) => (
                <div
                    key={language.code}
                    onClick={() => {
                        onSelectLanguage(language.code)
                        i18n.changeLanguage(language.code)
                    }}
                    className="cursor-pointer p-1 hover:bg-gray-200 rounded-md hover:text-black"
                >
                    {language.label}
                </div>
            ))}
        </div>
    )
}

export default function Header() {
    // const navigate = useNavigate()
    // eslint-disable-next-line no-unused-vars
    const [selectedLanguage, setSelectedLanguage] = useState('en')
    // console.log(selectedLanguage)
    return (
        <div className="bg-darkThemeBackground h-16 px-4 flex items-center border-b border-gray-200 justify-end">
            <div className="flex items-center gap-2 mr-2">
                {/* <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={classNames(
                                    open && 'bg-gray-100',
                                    'group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100'
                                )}
                            >
                                <HiOutlineChatAlt fontSize={24} />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
                                    <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                                        <strong className="text-gray-700 font-medium">Messages</strong>
                                        <div className="mt-2 py-1 text-sm">This is messages panel.</div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover> */}
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={classNames(
                                    open && 'bg-darkThemeBackground',
                                    'group inline-flex items-center rounded-sm p-1.5 text-white hover:text-opacity-100 focus:outline-none active:bg-darkThemeBackground'
                                )}
                            >
                                <LanguageMenu onSelectLanguage={setSelectedLanguage} />
                            </Popover.Button>
                        </>
                    )}
                </Popover>

                <Menu as="div" className="relative">
                    <div>
                        <Menu.Button className="ml-2 bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
                            <span className="sr-only">Open user menu</span>
                            <div
                                className="h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center"
                                style={{ backgroundImage: `url(${backgroundImage})` }}
                            >
                                <span className="sr-only">Marc Backes</span>
                            </div>
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {/* <Menu.Item>
                                {({ active }) => (
                                    <div
                                        onClick={() => navigate('/profile')}
                                        className={classNames(
                                            active && 'bg-gray-100',
                                            'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                                        )}
                                    >
                                        Your Profile
                                    </div>
                                )}
                            </Menu.Item> */}
                            {/* <Menu.Item>
                                {({ active }) => (
                                    <div
                                        onClick={() => navigate('/settings')}
                                        className={classNames(
                                            active && 'bg-gray-100',
                                            'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                                        )}
                                    >
                                        Settings
                                    </div>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <div
                                        className={classNames(
                                            active && 'bg-gray-100',
                                            'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                                        )}
                                    >
                                        Sign out
                                    </div>
                                )}
                            </Menu.Item> */}
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    )
}
