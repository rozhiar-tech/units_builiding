import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { LocalizationProvider } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { AuthProvider } from './lib/AuthContext'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </LocalizationProvider>
    </React.StrictMode>
)
