import { useRef } from 'react'
import axios from 'axios'

const RegisterPage = () => {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

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
          <button>Register</button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
