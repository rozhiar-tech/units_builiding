import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, onAuthStateChanged } from '.././firebase/initFirebase' // Update the path
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAuth } from '../lib/AuthContext'
export default function Login() {
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { emaill, passwordd, setEmaill, setPasswordd } = useAuth()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // If the user is already logged in, redirect to the home page
                navigate('/')
            }
        })

        // Clean up the subscription when the component unmounts
        return () => unsubscribe()
    }, [navigate])

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            await signInWithEmailAndPassword(auth, emaill, passwordd)
            // The onAuthStateChanged hook will handle redirection if needed
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <>
            <section className="bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <p className="flex items-center mb-6 text-2xl font-semibold text-white">Dania City</p>
                    <div className="w-full  rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl text-white">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">
                                        Your email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={emaill}
                                        onChange={(e) => setEmaill(e.target.value)}
                                        className=" border   sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="name@company.com"
                                        required=""
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        onChange={(e) => setPasswordd(e.target.value)}
                                        placeholder="••••••••"
                                        className=" border  sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                        required=""
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="remember"
                                                aria-describedby="remember"
                                                type="checkbox"
                                                className="w-4 h-4 border  rounded focus:ring-3 focus:ring-primary-300 bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800"
                                                required=""
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-gray-300">
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                    <button className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                                        Forgot password?
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Sign in
                                </button>

                                <p className="text-sm font-light text-gray-400">
                                    Don’t have an account yet?{' '}
                                    <button className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                        Sign up
                                    </button>
                                </p>
                            </form>
                            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
