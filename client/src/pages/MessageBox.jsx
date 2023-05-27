import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import makeToast from '../Toaster'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import parse from 'html-react-parser'

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['image']
  ]
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image'
]

const Chat = ({ socket, chatRoomId, setIsMessageBoxOpen }) => {
  const [messages, setMessages] = useState([])
  const [chatName, setChatName] = useState('')
  const [userId, setUserId] = useState('')
  const [isPickerVisible, setIsPickerVisible] = useState(false)
  const [quillValue, setQuillValue] = useState('')

  const messageRef = useRef('')
  const messageEndRef = useRef(null)

  const sendMessage = () => {
    // console.log(messageRef.current.value)
    console.log(quillValue)
    if (socket) {
      socket.emit('private-message', {
        // message: messageRef.current.value,
        message: quillValue,
        to: chatRoomId
      })
      // clear the message input
      // messageRef.current.value = ''
      setQuillValue('')
    }
  }

  const handleLeaveRoom = () => {
    setIsMessageBoxOpen(false)

    // use this in handle log out
    if (socket) {
      // Notify others that you are going offline
      socket.emit('leave-room', chatRoomId)
    }
  }

  const rteChange = (content, delta, source, editor) => {
    console.log(editor.getHTML()) // rich text
    setQuillValue(editor.getHTML())
    // console.log(editor.getText()) // plain text
    // console.log(editor.getLength()) // number of characters
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
                <div className="message-text">{parse(message.message)}</div>
              </div>
            </div>
          ))}
          {/* show the latest message */}
          <div ref={messageEndRef} />
        </div>

        <div className="message-box-actions">
          <button className="select-emoji" onClick={() => setIsPickerVisible(!isPickerVisible)}>
            😀
          </button>
          <div className={isPickerVisible ? 'picker-visible' : 'picker-hidden'}>
            <Picker
              data={data}
              onEmojiSelect={e => {
                setIsPickerVisible(!isPickerVisible)
                // messageRef.current.value = `${messageRef.current.value}${e.native}`
                setQuillValue(`${messageRef.current.value}${e.native}`)
              }}
            />
          </div>
          {/* <input
            className="message-input"
            type="text"
            name="message"
            placeholder="Type your message here."
            ref={messageRef}
          /> */}
          <div className="react-quill-container">
            <ReactQuill
              className="react-quill"
              theme="snow"
              modules={modules}
              formats={formats}
              value={quillValue}
              ref={messageRef}
              onChange={rteChange}
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
