GUIDES

REQUIREMENTS
MongoDB 6.0.6
Node 18.4.0
React 18.2.0

INSTALLATION

1. Clone the repo
   git clone https://github.com/pauljohnfigueroa/chat-app
2. Server
   cd server
   Install the dependencies
   npm install

create and .env file in server/ directory with the following values.
ENV=dev
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/your-preferred-db-name
JWT_SECRET='YOUR_SERCRET_KEY’

3. Run the server in the development mode.
   npm run start
   Server is deployed in http://localhost:8000
4. Client
   cd client
   Install the dependencies
   npm install
5. Run the app.
   npm run start
6. Open http://localhost:3000 in the browser.

USING THE APP

1. Create users
   Go to http://localhost:8000/register
2. Log in
   http://localhost:8000/login
   In the dashboard, you will see the other users and groups. You can also create groups.
3. Messaging
   Click on the user's name to open a private chat.
   Click on the rooms/groups name to join a group chat.

LIMITATIONS AND KNOWN BUGS FOR THIS VERSION

1. The app is not fully responsive yet.
2. The image dimensions in the message box are not being resized when displayed in the message box.
3. The rich text chat composer emojis window from the toolbar overflows.
4. There's a possibility of cross-talking between rooms when the user opens a new chat window without leaving the previous window.
5. Related to #4, the user needs to click the Leave room button before joining another new chat.
6. Offline messages are not saved in the database.
