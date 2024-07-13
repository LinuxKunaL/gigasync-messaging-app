# gigaSync

gigaSync is a real-time messaging application inspired by WhatsApp, built with a modern tech stack to provide a seamless and responsive user experience. It includes features such as real-time messaging, user authentication, and Google login.

## Features

- Real-time messaging using Socket.io
- User authentication with JWT (JSON Web Tokens)
- Google login integration
- Responsive design with Tailwind CSS
- State management with Redux
- MongoDB for data storage

## Screenshot



## Tech Stack

- **Frontend:** React.js, Redux, Tailwind CSS
- **Backend:** Node.js, Express
- **Authentication:** JWT, Google OAuth
- **Real-time Communication:** Socket.io
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

3. **Create a .env file in the root of the server directory and add the following variables**

```bash
PORT=1000
HOST=localhost
JWT_KEY=secret
JWT_EXPIRES_IN=5d
MONGODB_URL= .......
MONGODB_NAME=gigasync
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

```

3. **Start the development servers**

```bash
# For the client
cd client
npm start

# For the server
cd ../server
npm start

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
│   │   ├── styles/     # Tailwind CSS styles
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

