import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
// import makeToast from '../Toaster'

const Users = ({ socket }) => {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState('')

  const getUsers = () => {
    axios
      .get('http://localhost:8000/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setUsers(response.data)
      })
      .catch(error => {
        setTimeout(getUsers, 3000)
      })
  }

  // const handleOpenChatWindow = id => {
  //   console.log('handleOpenChatWindow', id)
  //   setChatRoomId(id)
  //   setIsMessageBoxOpen(true)
  //   setMessages([])
  // }

  useEffect(() => {
    getUsers()
    const token = localStorage.getItem('chatapp_token')

    // get own id
    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]))
      setUserId(payload.id)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <div className="container">
        <div className="card">
          <div className="chatrooms">
            {/* Display Users */}
            {users.map(
              user =>
                user._id === userId && (
                  <div key={user._id} className="chatroom">
                    <h3>{user.name}</h3>
                  </div>
                )
            )}
          </div>
          <div className="header">Contacts</div>
          <div className="cardBody">
            <div className="inputGroup">
              <div className="chatrooms">
                {/* Display Users */}
                {users.map(
                  user =>
                    user._id !== userId && (
                      <div key={user._id} className="chatroom">
                        <Link to={`/chat/${user._id}/${userId}`}>
                          <div>{user.name}</div>
                        </Link>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Users
