import { useEffect, useRef, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import makeToast from '../Toaster'

const Chat = ({ socket, chatRoomId, setIsMessageBoxOpen }) => {
  //const { chatRoomId } = useParams() // chatroom id

  const [messages, setMessages] = useState([])
  const [chatName, setChatName] = useState('')
  const [userId, setUserId] = useState('')
  const messageRef = useRef()

  // const navigate = useNavigate()

  const sendMessage = () => {
    if (socket) {
      socket.emit('private-message', {
        message: messageRef.current.value,
        to: chatRoomId
      })
      // clear the message input
      messageRef.current.value = ''
    }
  }

  const handleLeaveRoom = () => {
    setIsMessageBoxOpen(false)
    // console.log('setUserOffline useEffect')

    // use this in handle log out
    if (socket) {
      socket.emit('leave-room', chatRoomId)
      // Inform other that you are going offline
      socket.emit('offline-status', {
        userId
      })

      // Must be put in logout user logic
      // Set isOnline to false in users collection
      // const setUserOffline = async () => {
      //   await axios
      //     .post(
      //       `http://localhost:8000/users/offline`,
      //       {
      //         userId
      //       },
      //       {
      //         headers: {
      //           Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
      //         }
      //       }
      //     )
      //     .catch(error => {
      //       console.log(error.message)
      //     })
      // }
      // setUserOffline()
    }
  }

  useEffect(() => {
    // new message
    if (socket) {
      socket.on('private-message', message => setMessages([...messages, message]))
    }
    // eslint-disable-next-line
  }, [socket, messages, setMessages])

  useEffect(() => {
    const token = sessionStorage.getItem('chatapp_token')

    // get own id
    let myId = ''

    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]))
      myId = payload
      setUserId(payload.id)
    }

    // get chat name
    axios
      .get(`http://localhost:8000/chat/${chatRoomId}/${myId.id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setChatName(response.data)
      })
      .catch(error => {
        if (error && error.response && error.response.data && error.response.data.message)
          makeToast('error', error.response.data.message)
      })

    // fetch messages history
    axios
      .get(`http://localhost:8000/messages/${chatRoomId}/${myId.id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setMessages(response.data)
      })
      .catch(error => {
        if (error && error.response && error.response.data && error.response.data.message)
          makeToast('error', error.response.data.message)
      })

    //eslint-disable-next-line
  }, [])

  // useState(() => {
  //   if (socket) {
  //     socket.emit('private-chat', chatRoomId)
  //   }
  //   // eslint-disable-next-line
  // }, [])

  return (
    <div className="main-content">
      <div className="message-box">
        <div className="message-box-header-container">
          <div className="message-box-header">
            <h3 className="message-box-header-text">{chatName && chatName[0].name}</h3>
          </div>
          <button className="leave-room-button" onClick={handleLeaveRoom}>
            Leave
          </button>
        </div>

        <div className="message-box-content">
          {messages.map((message, idx) => (
            <div
              key={`${message}-${idx}`}
              className={userId === message.userId ? 'myMessage' : 'message'}
            >
              <span className={userId === message.userId ? 'ownMessage' : 'otherMessage'}>
                {userId === message.userId ? 'You' : message.name}
                {'> '}
              </span>
              {message.message}
            </div>
          ))}
        </div>
        <div className="message-box-actions">
          <input
            className="message-input"
            type="text"
            name="message"
            placeholder="Type your message here."
            ref={messageRef}
          />
          <button className="send-message-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
