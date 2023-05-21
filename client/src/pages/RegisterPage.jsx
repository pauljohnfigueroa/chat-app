import { useRef } from 'react'
import axios from 'axios'
import makeToast from '../Toaster'

const RegisterPage = () => {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const registerUser = () => {
    const name = nameRef.current.value
    const email = emailRef.current.value
    const password = passwordRef.current.value

    axios
      .post('http://localhost:8000/users/register', {
        name,
        email,
        password
      })
      .then(response => {
        console.log(response.data)
        makeToast('success', response.data.message)
      })
      .catch(error => {
        makeToast('error', error.response.data.message)
      })
  }

  return (
    <div className="card">
      <div className="cardHeader">Registration</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" ref={nameRef} />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" ref={emailRef} />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" ref={passwordRef} />
          <button onClick={registerUser}>Register</button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
