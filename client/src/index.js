import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles/common.css'
import './styles/dashboard.css'
import './styles/messageBox.css'
import './styles/sidebar.css'

import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
