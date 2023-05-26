import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const IndexPage = props => {
  const navigate = useNavigate()

  useEffect(() => {
    // check if user already logged in
    const token = sessionStorage.getItem('chatapp_token')
    if (!token) {
      navigate('/login')
    } else {
      navigate('/dashboard')
    }
  }, [navigate])

  return <div>IndexPage</div>
}

export default IndexPage
