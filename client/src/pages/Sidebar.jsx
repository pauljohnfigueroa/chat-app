import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import makeToast from '../Toaster'

const Sidebar = ({ socket }) => {
  const [chatrooms, setChatrooms] = useState([])
  const [users, setUsers] = useState([])
  const chatroomNameRef = useRef()

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

  const getUsers = () => {
    axios
      .get('http://localhost:8000/users', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setUsers(response.data)
      })
      .catch(error => {
        setTimeout(getChatRooms, 3000)
      })
  }

  useEffect(() => {
    getChatRooms()
    getUsers()
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
      <div className="sidebar">
        <div className="container">
          <div className="card">
            <div className="header">Contacts</div>
            <div className="cardBody">
              <div className="inputGroup">
                <div className="chatrooms">
                  {/* Display chatrooms */}
                  {users.map(user => (
                    <div key={user._id} className="chatroom">
                      <div>{user.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="card">
            <div className="header">Chatrooms</div>
            <div className="cardBody">
              <div className="inputGroup">
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
                {/* <label htmlFor="name">Chatroom Name</label> */}
                <input type="text" name="name" id="name" ref={chatroomNameRef} />
                <button onClick={createChatroom}>Create Chatroom</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
