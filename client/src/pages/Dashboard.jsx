import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import MessageBox from '../pages/MessageBox'
import Sidebar from '../components/Sidebar'

const DashboardPage = ({ socket, setMessages }) => {
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false)
  const [chatRoomId, setChatRoomId] = useState(null)

  return (
    <>
      <div className="dashboard">
        <div>
          <Sidebar
            chatRoomId={chatRoomId}
            setChatRoomId={setChatRoomId}
            setMessages={setMessages}
            setIsMessageBoxOpen={setIsMessageBoxOpen}
            socket={socket}
          />
        </div>
        <div className="main-content">{false && <MessageBox />}</div>
      </div>
    </>
  )
}

export default DashboardPage
