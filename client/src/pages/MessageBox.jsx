import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import makeToast from '../Toaster'

const Chat = ({ socket, chatRoomId }) => {
  //const { chatRoomId } = useParams() // chatroom id

  const [messages, setMessages] = useState([])
  const [chatName, setChatName] = useState('')
  const [userId, setUserId] = useState('')
  const messageRef = useRef()

  const navigate = useNavigate()

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
    socket.emit('leave-room', { chatRoomId })
    navigate('/dashboard')
  }

  useEffect(() => {
    // new message
    if (socket) {
      socket.on('private-message', message => setMessages([...messages, message]))
    }
    // eslint-disable-next-line
  }, [socket, messages, setMessages])

  useEffect(() => {
    const token = localStorage.getItem('chatapp_token')
    // get own id
    let myId = ''

    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]))
      //console.log('pl', payload)
      myId = payload
      setUserId(payload.id)
    }

    // get chat name
    axios
      .get(`http://localhost:8000/chat/${chatRoomId}/${myId.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('chatapp_token')}`
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
          Authorization: `Bearer ${localStorage.getItem('chatapp_token')}`
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

  useState(() => {
    if (socket) {
      socket.emit('setup', { chatRoomId })
    }

    //eslint-disable-next-line
  }, [])

  return (
    <div className="main-content">
      <div className="message-box">
        <div>
          <div className="message-box-header">{chatName && chatName[0].name}</div>
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
