import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import makeToast from '../Toaster'

const Chatrooms = ({ socket, setChatRoomId, setIsMessageBoxGroupOpen }) => {
  const [chatrooms, setChatrooms] = useState([])
  const chatroomNameRef = useRef()

  const getChatRooms = () => {
    axios
      .get('http://localhost:8000/chatrooms', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setChatrooms(response.data)
      })
      .catch(error => {
        setTimeout(getChatRooms, 3000)
      })
  }

  const joinChatRoom = async roomId => {
    console.log('joinChatRoom roomId', roomId)
    const resp = await axios
      .get(`http://localhost:8000/chatrooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setChatRoomId(response.data[0]._id)
        return response.data
      })
      .catch(error => {
        console.log(error.message)
      })

    if (socket) {
      socket.emit('group-chat', resp[0]._id)
    }

    // Open message box
    await axios
      .get(`http://localhost:8000/chatrooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setIsMessageBoxGroupOpen(true)
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  useEffect(() => {
    getChatRooms()
    // eslint-disable-next-line
  }, [])

  const createChatroom = () => {
    const chatroomName = chatroomNameRef.current.value
    axios
      .post(
        'http://localhost:8000/chatrooms',
        {
          name: chatroomName
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
          }
        }
      )
      .then(response => {
        makeToast('success', response.data.message)
        getChatRooms()
        chatroomNameRef.current.value = ''
      })
      .catch(error => {
        console.log(error.message)
        if (error && error.response && error.response.data && error.response.data.message)
          makeToast('error', error.response.data.message)
      })
  }

  return (
    <>
      <div className="container">
        <div className="header">Rooms</div>
        <div className="room-actions">
          <input
            className="message-input"
            type="text"
            name="name"
            id="name"
            ref={chatroomNameRef}
          />
          <button className="create-room-button" onClick={createChatroom}>
            Create
          </button>
        </div>

        <div className="list-group">
          {/* Display chatrooms */}
          {chatrooms.map(chatroom => (
            <div className="list-item-container" key={chatroom._id}>
              <div className="list-item" onClick={() => joinChatRoom(chatroom._id)}>
                {chatroom.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Chatrooms
