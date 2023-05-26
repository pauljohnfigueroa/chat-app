import Chatrooms from './Chatrooms'
import Users from './Users'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'

const Sidebar = ({
  chatRoomId,
  setChatRoomId,
  setMessages,
  setIsMessageBoxOpen,
  setIsMessageBoxGroupOpen,
  socket
}) => {
  const navigate = useNavigate()

  const logOut = async () => {
    console.log('Logout')

    const token = sessionStorage.getItem('chatapp_token')

    // repeated code
    // get own id
    let myId = ''

    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]))
      myId = payload
    }

    // use this in handle log out
    if (socket) {
      socket.emit('leave-room', chatRoomId)
      // Inform other that you are going offline
      socket.emit('offline-status', {
        userId: myId._id
      })

      // Set isOnline to false in users collection
      // const setUserOffline = async () => {
      await axios
        .post(
          `http://localhost:8000/users/offline`,
          {
            userId: myId._id
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
            }
          }
        )
        .catch(error => {
          console.log(error.message)
        })
    }

    sessionStorage.removeItem('chatapp_token')
    navigate('/login')
  }

  return (
    <div className="sidebar">
      {/* App name */}
      <div className="app-name">FrankensChat</div>
      {/* Users */}
      <Users
        socket={socket}
        setChatRoomId={setChatRoomId}
        setIsMessageBoxOpen={setIsMessageBoxOpen}
        setMessages={setMessages}
      />
      {/* Chat rooms */}
      <Chatrooms
        socket={socket}
        setChatRoomId={setChatRoomId}
        setIsMessageBoxGroupOpen={setIsMessageBoxGroupOpen}
      />
      <div className="logout-button-container">
        <button onClick={logOut}>Log out</button>
      </div>
    </div>
  )
}

export default Sidebar
