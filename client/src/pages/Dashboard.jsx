import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import makeToast from '../Toaster'

const DashboardPage = ({ socket }) => {
  const [chatrooms, setChatrooms] = useState([])
  const chatroomNameRef = useRef()

  const getChatRooms = () => {
    axios
      .get('http://localhost:8000/chatrooms', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setChatrooms(response.data)
      })
      .catch(error => {
        setTimeout(getChatRooms, 3000)
      })
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
            Authorization: `Bearer ${localStorage.getItem('chatapp_token')}`
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
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="name">Chatroom Name</label>
          <input type="text" name="name" id="name" ref={chatroomNameRef} />
          <button onClick={createChatroom}>Create Chatroom</button>
          <div className="chatrooms">
            {/* Display chatrooms */}
            {chatrooms.map(chatroom => (
              <div key={chatroom._id} className="chatroom">
                <div>{chatroom.name}</div>
                <Link to={`/chatrooms/${chatroom._id}`}>
                  <div className="join">Join</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
