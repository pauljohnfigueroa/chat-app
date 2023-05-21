import { useRef } from 'react'
import axios from 'axios'
import makeToast from '../Toaster'

const LoginPage = props => {
  const emailRef = useRef()
  const passwordRef = useRef()

  const loginUser = () => {
    const email = emailRef.current.value
    const password = passwordRef.current.value

    axios
      .post('http://localhost:8000/users/login', {
        email,
        password
      })
      .then(response => {
        //console.log(response.data)
        makeToast('success', response.data.message)
      })
      .catch(error => {
        makeToast('error', error.response.data.message)
      })
  }

  return (
    <div className="card">
      <div className="cardHeader">Welcome to Chat App</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" ref={emailRef} />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" ref={passwordRef} />
          <button onClick={loginUser}>Sign In</button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
