import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import makeToast from '../Toaster'

const Chat = ({ socket }) => {
  const { chatId, uId } = useParams() // chatroom id

  const [messages, setMessages] = useState([])
  const [chatName, setChatName] = useState('')
  const [userId, setUserId] = useState('')
  const messageRef = useRef()

  console.log(chatId, uId)

  const sendMessage = () => {
    // console.log('sendMessage clicked')
    if (socket) {
      // console.log('sendMessage clicked If')
      socket.emit('private-message', {
        message: messageRef.current.value,
        to: chatId
      })
      messageRef.current.value = ''
    }
  }

  useEffect(() => {
    // new messages
    if (socket) {
      socket.on('private-message', message => setMessages([...messages, message]))
    }
    // eslint-disable-next-line
    console.log(messages)
  }, [messages, setMessages])

  useEffect(() => {
    const token = localStorage.getItem('chatapp_token')
    // get own id
    let pl = ''
    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]))
      console.log('pl', payload)
      pl = payload
      setUserId(payload.id)
    }

    // get chat name
    axios
      .get(`http://localhost:8000/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setChatName(response.data)
      })
      .catch(err => {
        // console.log(err);
        if (err && err.response && err.response.data && err.response.data.message)
          makeToast('error', err.response.data.message)
      })

    // fetch messages history
    axios
      .get(`http://localhost:8000/messages/${chatId}/${pl.id}`, {
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
      socket.emit('chatUser', socket.id)
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit('leaveChat', socket.id)
      }
    }
    //eslint-disable-next-line
  }, [])

  return (
    <div className="chatroomPage">
      <div className="chatroomSection">
        <div className="cardHeader">{chatName && chatName.name}</div>
        <div className="chatroomContent">
          {messages.map((message, idx) => (
            <div key={`${message}-${idx}`} className="message">
              <span className={userId === message.userId ? 'ownMessage' : 'otherMessage'}>
                {message.name}
                {'> '}
              </span>
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

export default Chat
