# Twitter/X Clone MERN App

A Twitter/X clone application built with the MERN (MongoDB, Express, React, Node.js) stack. This project replicates core Twitter features and adds a few personal touches.

### Frontend

- **React (Vite)** - JavaScript library for building user interfaces
- **Tailwind CSS & DaisyUI** - Styling framework for responsive design and component styling
- **Axios** - HTTP client for making API requests

### Backend

- **Node.js & Express** - Server-side and REST API development
- **MongoDB & Mongoose** - Database and object data modeling
- **ImageKit** - Image storage and optimization
- **JWT** - JSON Web Tokens for secure authentication

## Getting Started

### Installation

1. Clone the repository from GitHub: `git clone https://github.com/nikolakenjic/twitter-clone-mern.git`
2. Navigate to the project directory: `cd your-repo-name`
3. Open the project in your code editor.

### Running the App

1. Start install dependencies: In the project root directory you should open the terminal and type:
   `npm run build`

2. Start the server: In the project root directory: `npm run start:prod`
   This will start both the frontend and backend.

### Environment Variables

Make sure to set up the following environment variables for your backend (in a `.env` file) in root folder:

```.env

NODE_ENV=development
PORT=your-port

MONGODB_URL=your-mongodb-uri
DATABASE_PASSWORD=your-password

JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90


IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=your-image-kit-url-endpoint

```
