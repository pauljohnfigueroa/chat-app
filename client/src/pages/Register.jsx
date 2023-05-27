import { useRef, useState } from 'react'
import axios from 'axios'
import makeToast from '../Toaster'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const [avatar, setAvatar] = useState()
  const [isFilePicked, setIsFilePicked] = useState(false)

  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  //const avatarRef = useRef()

  const navigate = useNavigate()

  const fileUploadHandler = event => {
    setAvatar(event.target.files[0])
    setIsFilePicked(true)
    console.log(event.target.files)
  }

  const registerUser = async event => {
    event.preventDefault()

    const name = nameRef.current.value
    const email = emailRef.current.value
    const password = passwordRef.current.value
    //const avatar = avatarRef.current.value

    // upload avatar to get path
    const formData = new FormData()
    formData.append('avatar', avatar)

    const uploadedFile = await axios
      .post('http://localhost:8000/upload', formData)
      .then(response => response.data)
      .catch(error => {
        makeToast('error', error.message)
      })

    // Register user in the database
    axios
      .post('http://localhost:8000/users/register', {
        name,
        email,
        password,
        avatar: `http://localhost:8000/${uploadedFile.file.destination}/${uploadedFile.file.filename}`
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
        <div className="form-header">FrankensChat</div>
        <form encType="multipart/form-data">
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
          <div className="form-row">
            <label htmlFor="avatar" className="form-item-label">
              Avatar
            </label>
            <input
              className="form-item form-input"
              type="file"
              name="avatar"
              id="avatar"
              onChange={fileUploadHandler}
              // ref={avatarRef}
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
