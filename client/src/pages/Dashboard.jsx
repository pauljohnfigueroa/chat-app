import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const DashboardPage = ({ socket }) => {
  const [chatrooms, setChatrooms] = useState([])

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

  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="name">Chatroom Name</label>
          <input type="text" name="name" id="name" />
          <button>Create Chatroom</button>
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
