import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import MessageBox from '../pages/MessageBox'
import MessageBoxGroup from '../pages/MessageBoxGroup'

import Sidebar from '../components/Sidebar'

const DashboardPage = ({ socket, setMessages }) => {
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false)
  const [isMessageBoxGroupOpen, setIsMessageBoxGroupOpen] = useState(false)
  const [chatRoomId, setChatRoomId] = useState(null)
  const [messageNotifications, setMessageNotifications] = useState([])

  const navigate = useNavigate()

  // Repeated code, put in a separate auth method
  useEffect(() => {
    // check if user already logged in
    const token = sessionStorage.getItem('chatapp_token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  return (
    <>
      <div className="dashboard">
        <div>
          <Sidebar
            chatRoomId={chatRoomId}
            setChatRoomId={setChatRoomId}
            setMessages={setMessages}
            setMessageNotifications={setMessageNotifications}
            messageNotifications={messageNotifications}
            setIsMessageBoxOpen={setIsMessageBoxOpen}
            isMessageBoxOpen={isMessageBoxOpen}
            setIsMessageBoxGroupOpen={setIsMessageBoxGroupOpen}
            socket={socket}
          />
        </div>
        <div className="main-content">
          <Outlet />
          {isMessageBoxOpen && (
            <MessageBox
              setMessageNotifications={setMessageNotifications}
              messageNotifications={messageNotifications}
              setIsMessageBoxOpen={setIsMessageBoxOpen}
              chatRoomId={chatRoomId}
              socket={socket}
            />
          )}
          {isMessageBoxGroupOpen && (
            <MessageBoxGroup
              setMessageNotifications={setMessageNotifications}
              messageNotifications={messageNotifications}
              setIsMessageBoxGroupOpen={setIsMessageBoxGroupOpen}
              chatRoomId={chatRoomId}
              socket={socket}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default DashboardPage
