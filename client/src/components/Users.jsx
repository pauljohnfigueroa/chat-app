import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Users = ({ socket, isMessageBoxOpen, setIsMessageBoxOpen, setChatRoomId }) => {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState('')
  const [onlineUsers, setOnlineUsers] = useState([])
  // const [opennedChat, setOpennedChat] = useState([])
  const [messageNotifications, setMessageNotifications] = useState([])

  const joinPrivateChatRoom = async (roomId, userId) => {
    // check for notifications
    const unread = messageNotifications.filter(item => item.room !== roomId)
    console.log('unread', unread)
    if (unread) {
      setMessageNotifications(unread)
    }

    const chatroom = await axios
      .post(
        'http://localhost:8000/chat',
        {
          name: roomId,
          users: [roomId, userId],
          userId
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
          }
        }
      )
      .then(response => {
        setChatRoomId(response.data._id)
        return response.data
      })
      .catch(error => {
        console.log(error.message)
      })

    if (socket) {
      socket.emit('open-private-chat', chatroom._id)
    }

    // Open message box
    await axios
      .get(`http://localhost:8000/chat/${roomId}/${userId}/${chatroom._id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setIsMessageBoxOpen(true)
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  const getUsers = async () => {
    await axios
      .get('http://localhost:8000/users', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
        }
      })
      .then(response => {
        setUsers(response.data)
      })
      .catch(error => {
        setTimeout(getUsers, 3000)
      })
  }

  useEffect(() => {
    getUsers()
    const token = sessionStorage.getItem('chatapp_token')

    // get own id
    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]))
      setUserId(payload.id)
    }

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    console.log('on login, notify others if online/offline')
    // on login, notify others if online/offline
    if (socket) {
      socket.emit('online-status', {
        userId
      })
    }

    // then look for  online users in the database
    const getOnlineUsers = async () => {
      await axios
        .post(`http://localhost:8000/users/online`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('chatapp_token')}`
          }
        })
        .then(response => {
          // convert to array of values
          const ids = response.data.map(object => object._id)
          // update the state
          setOnlineUsers([...onlineUsers, ...ids])
        })
        .catch(error => {
          setTimeout(getOnlineUsers, 3000)
          console.log(error.message)
        })
    }
    getOnlineUsers()

    // get message notifications

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('online-broadcast', id => {
        setOnlineUsers([...onlineUsers, id])
      })
    }
  }, [socket, onlineUsers])

  useEffect(() => {
    if (socket) {
      socket.on('offline-broadcast', uid => {
        const filtered = onlineUsers.filter(id => id !== uid)
        setOnlineUsers(filtered)
      })
    }
  }, [socket, onlineUsers])

  // Message notifications
  useEffect(() => {
    if (socket) {
      socket.on('private-message-notification', ({ to, from, message, room }) => {
        // console.log('private-message-notification')
        // only put notifications when the chat window is not open
        if (!isMessageBoxOpen) {
          console.log('isMessageBoxOpen is not open')
          setMessageNotifications([...messageNotifications, { to, from, message, room }])
          console.log(messageNotifications)
        }
      })
    }
    //console.log('messageNotifications', messageNotifications)
  }, [socket, isMessageBoxOpen, messageNotifications, setMessageNotifications])

  // if (messageNotifications.length > 0) {
  //   var note = messageNotifications.filter(obj => obj.from === '64721cf6373b8594eb99fd82')
  //   console.log('noteObject', note[0].from)
  // }

  return (
    <>
      <div className="container">
        <div className="account-header">
          {/* Display User */}
          {users.map(
            user =>
              user._id === userId && (
                <>
                  <img src={user.avatar} alt="Avatar" className="avatar" />

                  <div key={user._id} className="chatroom">
                    <h3>{user.name}</h3>
                  </div>
                </>
              )
          )}
        </div>

        <div className="header">Contacts</div>

        <div className="list-group">
          {/* Display Users */}
          {users.map(user => {
            // if (messageNotifications.length > 0) {
            //   //var note = messageNotifications.filter(obj => obj.from === user._id)
            //   // console.log('noteObject', note[0]?.from)
            //   // console.log('noteObject', note[0]?.from === user._id)
            //   //console.log('user._id', user._id)
            // }

            return (
              user._id !== userId && (
                <div key={user._id} className="list-item-container">
                  <div>
                    <img src={user.avatar} alt="Avatar" className="avatar" />
                  </div>

                  <div className="list-item" onClick={() => joinPrivateChatRoom(user._id, userId)}>
                    {user.name}
                  </div>
                  {/* <div className="message-notif-indicator">&#128490;</div> */}
                  <div
                    className={
                      // messageNotifications.length > 0 && messageNotifications[0].from === user._id
                      messageNotifications.length > 0 &&
                      messageNotifications.filter(obj => obj.from === user._id)[0]?.from ===
                        user._id
                        ? 'message-notif-indicator message-notif-indicator-on'
                        : 'message-notif-indicator message-notif-indicator-off'
                    }
                  >
                    &#128490;
                  </div>
                  <div
                    className={
                      onlineUsers.includes(user._id)
                        ? 'user-status-indicator user-status-indicator-online'
                        : 'user-status-indicator user-status-indicator-offline'
                    }
                  >
                    &#11044;
                  </div>
                </div>
              )
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Users
