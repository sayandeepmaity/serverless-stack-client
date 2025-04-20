# Note-Making Application

This project is a *Note-Making Application* developed using the *Serverless Framework*, **AWS** services, *React*, and **Node.js**. The application allows users to create, update, delete, and manage notes in a serverless environment, leveraging AWS Lambda, API Gateway, DynamoDB, and other AWS services for the backend, and a React-based frontend to manage user interactions.

## Technologies Used

- *Serverless Framework*: A framework for building and deploying serverless applications. It simplifies the deployment of functions to AWS Lambda.
- *AWS*: Amazon Web Services for hosting serverless functions and APIs, using services like Lambda, API Gateway, and DynamoDB.
- *React*: A JavaScript library for building user interfaces, particularly for building the client-side of the note-making application.
- *Node.js*: JavaScript runtime used for developing the backend API using serverless functions.

## Project Structure

Here’s a breakdown of the folder structure:


### 📁 Project Structure

<pre>
```bash
SERVERLESS-INT/
├── serverless-stack-api/              # Backend (Serverless API)
│   ├── node_modules/                  # Backend dependencies
│   ├── notes-api/                     # Notes API functions
│   │   └── tests/                     # Unit tests for the API
│   ├── .gitignore                     # Ignore file for version control
│   ├── fenv.example                   # Sample environment variables
│   ├── handler.js                     # Lambda function handlers
│   ├── LICENSE                        # License file
│   ├── package.json                   # Node.js backend config
│   ├── package-lock.json              # Lock file for backend dependencies
│   └── serverless.yml                 # Serverless config for AWS resources

├── serverless-stack-client/          # Frontend (React app)
│   ├── node_modules/                  # Frontend dependencies
│   ├── public/                        # Static assets
│   │   ├── *.png, *.svg, favicon.ico  # Icons and favicons
│   │   ├── index.html                 # HTML entry point
│   │   ├── manifest.json              # PWA config
│   │   └── style.css                  # Global styles
│   ├── src/                           # Source code
│   │   ├── components/                # Reusable React components
│   │   │   ├── AuthenticatedRoute.js
│   │   │   ├── LoaderButton.{js,css}
│   │   │   ├── UnauthenticatedRoute.js
│   │   ├── containers/                # Page-level components
│   │   │   ├── ChangeEmail.{js,css}
│   │   │   ├── ChangePassword.{js,css}
│   │   │   ├── Home.{js,css}
│   │   │   ├── Login.{js,css}
│   │   │   ├── NewNote.{js,css}
│   │   │   ├── Notes.{js,css}
│   │   │   ├── NotFound.js
│   │   │   ├── ResetPassword.{js,css}
│   │   │   ├── Settings.{js,css}
│   │   │   ├── Signup.{js,css}
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── awsLib.js
│   │   │   ├── contextLib.js
│   │   │   ├── errorLib.js
│   │   │   └── hooksLib.js
│   │   ├── App.js                     # Main app component
│   │   ├── App.css                    # Global styles
│   │   ├── App.test.js                # App test file
│   │   ├── config.js                  # App configuration
│   │   ├── index.js                   # React entry point
│   │   ├── index.css                  # Global styles
│   │   ├── reportWebVitals.js         # Performance measurement
│   │   ├── Routes.js                  # Routing setup
│   │   └── setupTests.js              # Test environment config
│   ├── .gitignore                     # Ignore file for frontend
│   ├── package.json                   # React dependencies config
│   ├── package-lock.json              # Lock file for frontend
│   ├── serverless.yml                 # Serverless frontend config
│   └── README.md                      # Frontend documentation
```
</pre>
