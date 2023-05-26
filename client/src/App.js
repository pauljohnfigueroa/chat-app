import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
// import ChatRoom from './pages/xChatRoom'
// import ChatUser from './pages/ChatUser'
import { io } from 'socket.io-client'
import makeToast from './Toaster'

function App() {
  const [socket, setSocket] = useState(null)

  const setupSocket = () => {
    const token = sessionStorage.getItem('chatapp_token')
    if (token && !socket) {
      const newSocket = io('http://localhost:8000', {
        query: {
          token: sessionStorage.getItem('chatapp_token')
        },
        cors: {
          origin: 'http://localhost:3000',
          methods: ['GET', 'POST']
        }
      })

      newSocket.on('disconnect', () => {
        setSocket(null)
        setTimeout(setupSocket, 3000)
        //console.log('Socket disconnected!')
        makeToast('error', 'Socket disconnected!')
      })

      newSocket.on('connect', () => {
        console.log('Socket connected!')
        //makeToast('success', 'Socket connected!')
      })

      setSocket(newSocket)
    }
  }

  useEffect(() => {
    setupSocket()

    // eslint-disable-next-line
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setupSocket={setupSocket} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard socket={socket} />} />
          {/* <Route path="/chatrooms/:chatRoomId" element={<ChatRoom socket={socket} />} /> */}
          {/* <Route path="/chat/:chatId/:uId/:chatRoomId" element={<ChatUser socket={socket} />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
