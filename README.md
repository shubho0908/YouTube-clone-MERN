# MERN YouTube Clone


A feature-rich YouTube clone built using the MERN stack, JWT for authentication, and Firebase Storage for video and file storage. This project aims to replicate the core functionalities of YouTube, allowing users to upload, view, like, comment, and interact with videos.


## Demo


https://github.com/shubho0908/YouTube-clone-MERN/assets/81776711/72a75a7e-e20b-4639-ac14-13c490329dbf

Or watch the demo [here.](https://youtu.be/CJEoNpLgRRw?si=8F2vfGwuBO03jRsH)


## Features

- User Authentication using JWT.
- User Registration and Login.
- Uploading and viewing videos.
- Create a channel and upload content.
- Like, comment, save, and share videos.
- Create playlists and share them with others.
- Video storage using Firebase Storage.
- YouTube studio to manage channel and content.
- Responsive design for mobile and desktop.
- And much more...

## Technologies Used

- **M**ongoDB: Database for storing user data and video metadata.
- **E**xpress.js: Server framework for handling API requests.
- **R**eact.js: Frontend library for building the user interface.
- **N**ode.js: JavaScript runtime for the server.
- **Firebase Storage**: Cloud storage for video uploads.
- **JSON Web Tokens (JWT)**: For user authentication.
- **React Icons & MUI**: For icons.


## Configuration
1. Create a `.env` file in the root directory of your project.
2. Add necessary environment variables to the `.env` file, such as database connection URLs, API keys, or other sensitive data.
3. Add your own MongoDB Atlas URI in the datbase file inside the backend folder.

```bash
SECRET_KEY=your-secret-key
EMAIL=email-to-use-as-nodemailer-service
PASSWORD=google-app-password
```

## Running the Application
### Server
Install server dependencies:

``npm install``

Start the server:

``npm start``


### Client
Install client dependencies:

``npm install``

Start the client application:

``npm run dev``

Open your web browser and visit `http://localhost:5173` to access the application.
