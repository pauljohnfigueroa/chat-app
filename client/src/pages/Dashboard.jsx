import ChatRoom from './ChatRoom'
import Users from '../components/Users'
import Chatrooms from '../components/Chatrooms'
import { useState } from 'react'

const DashboardPage = ({ socket, setMessages }) => {
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false)
  const [chatRoomId, setChatRoomId] = useState(null)

  return (
    <>
      <div className="main-container">
        <div className="sidebar">
          {/* Users */}
          <Users
            socket={socket}
            setChatRoomId={setChatRoomId}
            setIsMessageBoxOpen={setIsMessageBoxOpen}
            setMessages={setMessages}
          />
          {/* Chat rooms */}
          <Chatrooms socket={socket} />
        </div>
        <div className="message-box-container">
          {' '}
          {isMessageBoxOpen && <ChatRoom chatRoomId={chatRoomId} socket={socket} />}
        </div>
      </div>
    </>
  )
}

export default DashboardPage
