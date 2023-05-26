import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import makeToast from '../Toaster'

const ChatRoom = ({ socket }) => {
  const [messages, setMessages] = useState([])
  const [chatRoomName, setChatRoomName] = useState('')
  const [userId, setUserId] = useState('')

  const { chatRoomId } = useParams()
  const messageRef = useRef()
  const navigate = useNavigate()

  const sendMessage = () => {
    if (socket) {
      socket.emit('chatroomMessage', {
        chatRoomId,
        message: messageRef.current.value
      })
      messageRef.current.value = ''
    }
  }

  const handleLeaveRoom = () => {
    socket.emit('leave-room', { chatRoomId })
    navigate('/dashboard')
  }

  useEffect(() => {
    const token = sessionStorage.getItem('chatapp_token')

    // get own id
    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]))
      setUserId(payload.id)
    }
    // new messages
    if (socket) {
      socket.on('newGroupMessage', message => {
        const newMessages = [...messages, message]
        setMessages(newMessages)
      })
    }
    // eslint-disable-next-line
  }, [messages])

  useEffect(() => {
    // get chatroom name
    axios
      .get(`http://localhost:8000/chatrooms/${chatRoomId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setChatRoomName(response.data)
      })
      .catch(err => {
        if (err && err.response && err.response.data && err.response.data.message)
          makeToast('error', err.response.data.message)
      })

    // fetch messages history
    axios
      .get(`http://localhost:8000/messages/${chatRoomId}/${userId}`, {
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

    if (socket) {
      socket.emit('joinRoom', chatRoomId, message => message)
    }

    return () => {
      if (socket) {
        socket.emit('leaveRoom', { chatRoomId })
      }
    }
    //eslint-disable-next-line
  }, [])

  return (
    <div className="chatroomPage">
      <div className="chatroom-section">
        <div className="">
          <div className="card-header">{chatRoomName && chatRoomName[0].name}</div>
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

export default ChatRoom
