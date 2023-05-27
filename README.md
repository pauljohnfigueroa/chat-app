# chat-app

A simple React/Node/Socket.io chat application

GUIDES

REQUIREMENTS

MongoDB 6.0.6
Node 18.4.0
React 18.2.0

INSTALLATION

1. Clone the repo
   git clone https://github.com/pauljohnfigueroa/chat-app

2. Server configuration

   cd server

   Install the dependencies
   npm install

3. Run the server in the development mode.
   npm run dev
   Deployed to http://localhost:8000

4. Client configuration

   cd client

   Install the dependencies
   npm install

5. Run the app in the development mode.
   npm run start

   Open http://localhost:3000 to view it in the browser.

6. You can create a production build.
   npm run build

LIMITATIONS

1. The app is not fully responsive yet.
2. The image dimensions in the message box is not being resized.
3. The rich text chat composer inserts the emojis in a new line.
4. There's a possibility of cross-talking between rooms when the user opens
   a new chat window wothout leaving the previous window.
5. Related to #4, the user needs to click the Leave room button before joining a new chat.
