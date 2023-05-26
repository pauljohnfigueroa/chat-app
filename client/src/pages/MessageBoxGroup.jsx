import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import makeToast from '../Toaster'

const ChatGroup = ({ socket, chatRoomId, setIsMessageBoxGroupOpen }) => {
  //const { chatRoomId } = useParams() // chatroom id

  const [messages, setMessages] = useState([])
  const [chatName, setChatName] = useState('')
  const [userId, setUserId] = useState('')

  const messageRef = useRef()
  const messageEndRef = useRef(null)

  const sendMessage = () => {
    if (socket) {
      socket.emit('group-message', {
        message: messageRef.current.value,
        to: chatRoomId
      })
      // clear the message input
      messageRef.current.value = ''
    }
  }

  const handleLeaveRoom = () => {
    setIsMessageBoxGroupOpen(false)

    // use this in handle log out
    if (socket) {
      // Notify others that you are going offline
      socket.emit('leave-room', chatRoomId)
    }
  }

  useEffect(() => {
    // new message
    if (socket) {
      socket.on('group-chat', message => setMessages([...messages, message]))
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
      .get(`http://localhost:8000/chatrooms/${chatRoomId}`, {
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

  // show latest message
  useEffect(() => {
    messageEndRef?.current.scrollIntoView()
  }, [messages])

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
              className={userId === message.userId ? 'my-message' : 'message'}
            >
              <div
                className={
                  userId === message.userId ? 'my-message-container' : 'other-message-container'
                }
              >
                <div className={userId === message.userId ? 'ownMessage' : 'otherMessage'}>
                  {userId === message.userId ? 'You' : message.name}
                </div>
                <div className="message-text">{message.message}</div>
              </div>
            </div>
          ))}
          {/* show the latest message */}
          <div ref={messageEndRef} />
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

export default ChatGroup
