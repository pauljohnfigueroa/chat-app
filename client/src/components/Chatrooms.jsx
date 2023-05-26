import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import makeToast from '../Toaster'

const Chatrooms = ({ socket }) => {
  const [chatrooms, setChatrooms] = useState([])
  const chatroomNameRef = useRef()

  const navigate = useNavigate()

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

  const createGroupChatRoom = room => {
    navigate(`/chatrooms/${room}`)
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
      .catch(err => {
        // console.log(err);
        if (err && err.response && err.response.data && err.response.data.message)
          makeToast('error', err.response.data.message)
      })
  }

  return (
    <>
      <div className="container">
        <div className="header">Rooms</div>
        {/* <label htmlFor="name">Chatroom Name</label> */}
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
              <div>
                <img src="assets/jazz.png" alt="Avatar" className="avatar" />
              </div>
              {/* <Link to={`/chatrooms/${chatroom._id}`}> */}
              <div className="list-item" onClick={() => createGroupChatRoom(chatroom._id)}>
                {chatroom.name}
              </div>
              {/* </Link> */}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Chatrooms
