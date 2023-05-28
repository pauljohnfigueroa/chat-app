import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import makeToast from '../Toaster'

const LoginPage = ({ setupSocket }) => {
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigate = useNavigate()

  const loginUser = event => {
    event.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value

    axios
      .post('http://localhost:8000/users/login', {
        email,
        password
      })
      .then(response => {
        makeToast('success', response.data.message)
        // save to sessionStorage
        sessionStorage.setItem('chatapp_token', response.data.token)
        setupSocket()
        // redirect logged in user
        navigate('/dashboard')
      })
      .catch(error => {
        makeToast('error', error.response.data.message)
      })
  }

  return (
    <div className="form-outer-container">
      <div className="form-container">
        <div className="form-header">FrankensChat</div>

        <form>
          <div className="form-row">
            <label className="form-item-label" htmlFor="email">
              Email
            </label>
            <input
              className="form-item  form-input"
              type="email"
              name="email"
              id="email"
              ref={emailRef}
            />
          </div>
          <div className="form-row">
            <label className="form-item-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-item  form-input"
              type="password"
              name="password"
              id="password"
              ref={passwordRef}
            />
          </div>
          <div className="form-row form-button">
            <button onClick={loginUser}>Sign In</button>
          </div>
        </form>
        <a href="/register" className="register-link">
          Don't have an account? Register here.
        </a>
      </div>
    </div>
  )
}

export default LoginPage
