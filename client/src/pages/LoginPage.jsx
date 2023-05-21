const LoginPage = () => {
  return (
    <div className="card">
      <div className="cardHeader">Welcome to Chat App</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
          <button>Sign In</button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
