![logo](/images/Logo.svg)<br>
gigaSync is a real-time messaging application inspired by WhatsApp, built with a modern tech stack to provide a seamless and responsive user experience. It includes features such as real-time messaging, user authentication, and Google login.

## Features

- Real-time messaging using Socket.io
- User authentication with JWT (JSON Web Tokens)
- Real-time video call with WebRTC
- Google login integration
- Responsive design with Tailwind CSS
- State management with Redux
- MongoDB for data storage
- Manage user storage ex. media and files 

## Screenshot
![Demo screenshot](/images/Screenshot-1.png)

![Demo screenshot](/images/Screenshot-2.png)

![Demo screenshot](/images/Screenshot-3.png)

![Demo screenshot](/images/Screenshot-4.png)

![Demo screenshot](/images/Screenshot-5.png)
## Tech Stack

- **Frontend:** React.js, Redux, Tailwind CSS
- **Backend:** Node.js, Express
- **Authentication:** JWT, Google OAuth
- **Real-time Communication:** Socket.io
- **Real-time videoCall** WebRTC
- **Database:** MongoDB

## Installation

1. **Clone the repository**

```bash
git clone [https://github.com/LinuxKunaL/gigasync.git](https://github.com/yourusername/gigasync.git)
cd gigasync
```

2. **Install dependencies for both client and server**

```bash
# For the client
cd client
npm install

# For the server
cd ../server
npm install

```

3. **SERVER .env , Create a .env file in the root of the server directory and add the following variables**

```bash
PORT=1000
HOST=localhost
JWT_KEY=secret
JWT_EXPIRES_IN=5d
MONGODB_URL= .......
MONGODB_NAME=gigasync
GOOGLE_SMTP_HOST=smtp.gmail.com
GOOGLE_SMTP_PORT=465
GOOGLE_SMTP_USER=abcd@gmail.com
GOOGLE_SMTP_PASS=xxxx xxxx xxxx xxxx
```

4. **CLIENT .env , Create a .env file in the root of the client directory and add the following variables**

```bash
REACT_APP_BACKEND_HOST = http://localhost:1000 
```

5. **Start the development servers**

```bash
# For the client
cd client
npm run start

# For the server
cd ../server
npm run start

```

## Usage

Once the servers are running, you can access the application at http://localhost:3000 (or the port specified in your .env file). Register or login using Google to start using the messaging features.

```bash

gigasync/
├── client/             # Frontend React application
│   ├── public/         # Public assets
│   ├── src/            # Source code
│   │   ├── components/ # React components
│   │   ├── app/
│   │   │     ├── redux # Redux setup
│   │   ├── components  # Components
│   │   │     ├───── interface # contains input,button,tooltip and more.
│   │   ├── util        # Utility functions .ts
│   │   ├── views       # Main views here
│   │   ├── App.js      # Main App component
│   │   └── index.js    # Entry point
│   └── package.json    # Client dependencies
├── server/             # Backend Node.js application
│   ├── controllers/    # Controllers for handling requests
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── utils/          # Utility functions
│   └── server.js       # Server entry point
└── README.md           # This file

```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the existing code style and include tests for any new features or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
