const DashboardPage = () => {
  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="name">Chatroom Name</label>
          <input type="text" name="name" id="name" />
          <button>Create Chatroom</button>
          <div className="chatrooms">
            <div className="chatroom">
              <div>Happy me.</div>
              <div className="join">Join</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
