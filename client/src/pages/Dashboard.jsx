import ChatRoom from './ChatRoom'
import Users from '../components/Users'
import Chatrooms from '../components/Chatrooms'

const DashboardPage = ({ socket }) => {
  //const [chatrooms, setChatrooms] = useState([])
  // const [users, setUsers] = useState([])
  //const chatroomNameRef = useRef()

  // const getChatRooms = () => {
  //   axios
  //     .get('http://localhost:8000/chatrooms', {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('chatapp_token')}`
  //       }
  //     })
  //     .then(response => {
  //       setChatrooms(response.data)
  //     })
  //     .catch(error => {
  //       setTimeout(getChatRooms, 3000)
  //     })
  // }

  // const getUsers = () => {
  //   axios
  //     .get('http://localhost:8000/users', {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('chatapp_token')}`
  //       }
  //     })
  //     .then(response => {
  //       setUsers(response.data)
  //     })
  //     .catch(error => {
  //       setTimeout(getUsers, 3000)
  //     })
  // }

  // useEffect(() => {
  //   //getChatRooms()
  //   // getUsers()
  //   // eslint-disable-next-line
  // }, [])

  // const createChatroom = () => {
  //   const chatroomName = chatroomNameRef.current.value

  //   axios
  //     .post(
  //       'http://localhost:8000/chatrooms',
  //       {
  //         name: chatroomName
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('chatapp_token')}`
  //         }
  //       }
  //     )
  //     .then(response => {
  //       makeToast('success', response.data.message)
  //       getChatRooms()
  //       chatroomNameRef.current.value = ''
  //     })
  //     .catch(err => {
  //       // console.log(err);
  //       if (err && err.response && err.response.data && err.response.data.message)
  //         makeToast('error', err.response.data.message)
  //     })
  // }

  return (
    <>
      <div className="sidebar">
        {/* Users */}
        <Users socket={socket} />
        {/* Chat rooms */}
        <Chatrooms socket={socket} />
      </div>
      <div className="chatroom"> {false && <ChatRoom socket={socket} />}</div>
    </>
  )
}

export default DashboardPage
