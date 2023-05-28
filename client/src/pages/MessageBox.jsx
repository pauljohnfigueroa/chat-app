import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import makeToast from '../Toaster'

import parse from 'html-react-parser'
import ReactQuillRte from '../components/ReactQuillRte'

const Chat = ({
  socket,
  chatRoomId,
  setIsMessageBoxOpen,
  setMessageNotifications,
  messageNotifications
}) => {
  const [messages, setMessages] = useState([])
  const [chatName, setChatName] = useState('')
  const [userId, setUserId] = useState('')
  const [quillValue, setQuillValue] = useState('')

  const messageRef = useRef('')
  const messageEndRef = useRef(null)

  const sendMessage = () => {
    if (socket) {
      socket.emit('private-message', {
        message: quillValue,
        to: chatRoomId,
        from: userId
      })
      // clear the message input
      setQuillValue('')
    }
  }

  const handleLeaveRoom = () => {
    // check for notifications
    const unread = messageNotifications.filter(item => item.room !== chatRoomId)
    console.log('Message box unread', unread)
    if (unread) {
      setMessageNotifications(unread)
    }

    setIsMessageBoxOpen(false)

    // use this in handle log out
    if (socket) {
      // Notify others that you are going offline
      socket.emit('leave-room', chatRoomId)
    }

    axios
      .post(
        'http://localhost:8000/users/closechat',
        {
          chatRoomId,
          userId
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
          }
        }
      )
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error.message)
      })
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

    // Repeated code
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
                <div
                  className={
                    userId === message.userId ? 'my-message-text message-text' : 'message-text'
                  }
                >
                  {parse(message.message)}
                </div>
              </div>
            </div>
          ))}
          {/* show the latest message */}
          <div ref={messageEndRef} />
        </div>
        <div className="message-box-actions">
          <div className="react-quill-container">
            <ReactQuillRte
              setQuillValue={setQuillValue}
              quillValue={quillValue}
              messageRef={messageRef}
            />
          </div>
          <button className="send-message-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
