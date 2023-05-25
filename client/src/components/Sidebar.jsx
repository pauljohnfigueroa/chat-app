// import ChatRoom from '../pages/ChatRoom'
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
    </>
  )
}

export default Sidebar
