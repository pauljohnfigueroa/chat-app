import { useRef } from 'react'
import axios from 'axios'
import makeToast from '../Toaster'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const navigate = useNavigate()

  const registerUser = async event => {
    event.preventDefault()

    const name = nameRef.current.value
    const email = emailRef.current.value
    const password = passwordRef.current.value

    await axios
      .post('http://localhost:8000/users/register', {
        name,
        email,
        password
      })
      .then(response => {
        console.log(response.data)
        makeToast('success', response.data.message)
        // redirect to login page
        navigate('/login')
      })
      .catch(error => {
        makeToast('error', error.response.data.message)
      })
  }

  return (
    <div className="form-outer-container">
      <div className="form-container">
        <div className="form-header">ChatApp</div>
        <form>
          <div className="form-row">
            <label htmlFor="name" className="form-item-label">
              Name
            </label>
            <input
              className="form-item form-input"
              type="text"
              name="name"
              id="name"
              ref={nameRef}
            />
          </div>
          <div className="form-row">
            <label htmlFor="email" className="form-item-label">
              Email
            </label>
            <input
              className="form-item form-input"
              type="email"
              name="email"
              id="email"
              ref={emailRef}
            />
          </div>
          <div className="form-row">
            <label htmlFor="password" className="form-item-label">
              Password
            </label>
            <input
              className="form-item form-input"
              type="password"
              name="password"
              id="password"
              ref={passwordRef}
            />
          </div>
          <div className="form-row form-button">
            <button onClick={registerUser}>Register</button>
          </div>
        </form>
        <a href="/login" className="register-link">
          Already have an account? Login here.
        </a>
      </div>
    </div>
  )
}

export default RegisterPage
