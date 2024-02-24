import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { LocalizationProvider } from '@mui/x-date-pickers'
import './lib/languages/i18n'
import { Provider } from 'react-redux'
import store from './lib/helpers/store'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <App />
            </LocalizationProvider>
        </Provider>
    </React.StrictMode>
)
