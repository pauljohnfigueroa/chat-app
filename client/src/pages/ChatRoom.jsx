import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import makeToast from '../Toaster'

const ChatRoom = ({ socket }) => {
  const { chatRoomId } = useParams() // chatroom id

  const [messages, setMessages] = useState([])
  const [userId, setUserId] = useState('')
  const messageRef = useRef()

  // fetch the chatroom name

  const sendMessage = () => {
    console.log('sendMessage clicked')

    if (socket) {
      console.log('sendMessage clicked If')
      socket.emit('chatroomMessage', {
        chatRoomId,
        message: messageRef.current.value
      })
      messageRef.current.value = ''
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('chatapp_token')

    // get own id
    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]))
      setUserId(payload.id)
    }
    // new messages
    if (socket) {
      socket.on('newMessage', message => {
        const newMessages = [...messages, message]
        setMessages(newMessages)
      })
    }
    // eslint-disable-next-line
  }, [messages])

  useEffect(() => {
    // message history
    axios
      .get(`http://localhost:8000/messages/${chatRoomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setMessages(response.data)
      })
      .catch(err => {
        // console.log(err);
        if (err && err.response && err.response.data && err.response.data.message)
          makeToast('error', err.response.data.message)
      })

    if (socket) {
      socket.emit('joinRoom', {
        chatRoomId
      })
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit('leaveRoom', {
          chatRoomId
        })
      }
    }
    //eslint-disable-next-line
  }, [])

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">Chatroom ID: {chatRoomId}</div>
        <div className="chatroomContent">
          {messages.map((message, idx) => (
            <div key={idx} className="message">
              <span className={userId === message.userId ? 'ownMessage' : 'otherMessage'}>
                {message.name}:
              </span>{' '}
              {message.message}
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Type your message here."
              ref={messageRef}
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatRoom
