import ChatRoom from '../pages/ChatRoom'
import Chatrooms from './Chatrooms'
import Users from './Users'

const Sidebar = ({
  chatRoomId,
  setChatRoomId,
  setMessages,
  setIsMessageBoxOpen,
  isMessageBoxOpen,
  socket
}) => {
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

export default Sidebar
