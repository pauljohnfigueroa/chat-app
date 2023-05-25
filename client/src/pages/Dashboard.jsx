// import ChatRoom from './ChatRoom'
// import Users from '../components/Users'
// import Chatrooms from '../components/Chatrooms'
import Sidebar from '../components/Sidebar'

import { useState } from 'react'

const DashboardPage = ({ socket, setMessages }) => {
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false)
  const [chatRoomId, setChatRoomId] = useState(null)

  return (
    <>
      <Sidebar
        chatRoomId={chatRoomId}
        setChatRoomId={setChatRoomId}
        setMessages={setMessages}
        setIsMessageBoxOpen={setIsMessageBoxOpen}
        socket={socket}
      />
      {/* <div className="main-container">
        <div className="sidebar">
         
          <Users
            socket={socket}
            setChatRoomId={setChatRoomId}
            setIsMessageBoxOpen={setIsMessageBoxOpen}
            setMessages={setMessages}
          />
          
          <Chatrooms socket={socket} />
        </div>
        <div className="message-box-container">
          {' '}
          {isMessageBoxOpen && <ChatRoom chatRoomId={chatRoomId} socket={socket} />}
        </div>
      </div> */}
    </>
  )
}

export default DashboardPage
