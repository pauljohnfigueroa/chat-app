import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import makeToast from '../Toaster'

const Chat = ({ socket }) => {
  const { chatId, uId, chatRoomId } = useParams() // chatroom id

  const [messages, setMessages] = useState([])
  const [chatName, setChatName] = useState('')
  const [userId, setUserId] = useState('')
  //const [socketConnected, setSocketConnected] = useState(false)
  const messageRef = useRef()

  //console.log(chatId, uId, chatRoomId)

  const sendMessage = () => {
    // console.log('sendMessage clicked')
    if (socket) {
      // console.log('sendMessage clicked If')
      socket.emit('private-message', {
        message: messageRef.current.value,
        to: chatRoomId
      })
      messageRef.current.value = ''
    }
  }

  useEffect(() => {
    //socket.emit('setup', chatId)
  })

  useEffect(() => {
    // new messages
    if (socket) {
      socket.on('private-message', message => setMessages([...messages, message]))
    }
    // eslint-disable-next-line
    //console.log(messages)
  }, [socket, messages, setMessages])

  useEffect(() => {
    const token = localStorage.getItem('chatapp_token')
    // get own id
    let pl = ''

    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]))
      //console.log('pl', payload)
      pl = payload
      setUserId(payload.id)
    }

    // get chat name
    axios
      .get(`http://localhost:8000/chat/${chatRoomId}/${pl.id}`, {
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
      .get(`http://localhost:8000/messages/${chatRoomId}/${pl.id}`, {
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

    //eslint-disable-next-line
  }, [])

  useState(() => {
    if (socket) {
      socket.emit('setup', { chatRoomId })
      // socket.on('connection', () => {
      //   setSocketConnected(true)
      // })
    }

    return () => {
      if (socket) {
        socket.emit('leaveChat', { chatId })
      }
    }
    //eslint-disable-next-line
  }, [])

  return (
    <div className="chatroomPage">
      <div className="chatroom-section">
        <div className="card-header">{chatName && chatName[0].name}</div>
        {/* <div className="card-header">Headera sdfasdf asdfasfasd</div> */}
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
