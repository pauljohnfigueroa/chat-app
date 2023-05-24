import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Users = ({ socket }) => {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState('')
  const [chatRoomId, setChatRoomId] = useState('')

  console.log(users._id, userId)

  let navigate = useNavigate()

  const createPrivateChatRoom = async (roomId, userId) => {
    const response = await axios
      .post(
        'http://localhost:8000/chat',
        {
          name: roomId,
          users: [roomId, userId]
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('chatapp_token')}`
          }
        }
      )
      .then(response => {
        console.log('Create room')
        console.log(response.data)
        setChatRoomId(response.data._id)
        navigate(`/chat/${roomId}/${userId}/${response.data._id}`)
        //console.log('response.data._id', response.data._id)
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  const getUsers = async () => {
    await axios
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
            {/* Display User */}
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
                        <span
                          className="menu-items"
                          onClick={() => createPrivateChatRoom(user._id, userId)}
                        >
                          {user.name}
                        </span>
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
