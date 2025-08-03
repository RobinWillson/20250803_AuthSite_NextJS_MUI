### **Guide: How to Build This Authentication Server from Scratch**

This guide outlines the major steps to create the server, focusing on the "what" and "why" rather than the detailed code.

#### **Phase 1: Project Initialization**

1.  **Create Project Folder**:
    *   Create a new directory named `server`.
    *   Navigate into it: `cd server`

2.  **Initialize Node.js Project**:
    *   Run `npm init -y` to create a `package.json` file.

3.  **Install Dependencies**:
    *   Install all necessary packages with a single command:
        ```bash
        npm install express mongoose dotenv cors passport passport-google-oauth20 jsonwebtoken bcrypt validator
        ```

#### **Phase 2: Folder and File Structure**

1.  **Create Source Directory**:
    *   Inside the `server` folder, create a `src` directory.

2.  **Create Subdirectories**:
    *   Inside `src`, create the following folders to organize your code:
        *   `controllers`
        *   `middleware`
        *   `models`
        *   `routes`
        *   `utils`

#### **Phase 3: Configuration and Core Logic**

1.  **Environment Variables (`.env`)**:
    *   In the root of the `server` folder, create a `.env` file.
    *   Add the following keys. These will store your secrets and configuration securely.
        *   `MONGODB_CONNECTION_STRING`
        *   `JWT_SECRET`
        *   `GOOGLE_CLIENT_ID`
        *   `GOOGLE_CLIENT_SECRET`
        *   `CLIENT_URL` (e.g., `http://localhost:3000`)
    * we will get google API at [Google_API_Console](https://console.developers.google.com/?hl=zh-tw)
2.  **Database Connection (`src/utils/db.js`)**:
    *   Create a file to handle the MongoDB connection logic. This isolates the database connection code, making it reusable and easy to manage.

3.  **User Model (`src/models/User.js`)**:
    *   Define the Mongoose schema for your `User` collection. This acts as a blueprint for your user data, enforcing structure and data types. Remember to make the `googleId` a **sparse unique index** to allow multiple users without a Google ID.

4.  **Token Utility (`src/utils/tokenUtils.js`)**:
    *   Create a helper function `generateToken` that takes a user object and returns a signed JSON Web Token (JWT).

5.  **Passport Configuration (`src/utils/passport.js`)**:
    *   Set up the Google OAuth2 strategy. This file should export a configuration function that takes the `passport` object as an argument. This function defines how to find or create a user after a successful Google login.

#### **Phase 4: Application Logic (Controllers and Routes)**

1.  **Authentication Middleware (`src/middleware/authMiddleware.js`)**:
    *   Create the `authMiddleware` function. This is the gatekeeper for your protected routes. It checks for a valid JWT in the request header and attaches the authenticated user to the request object.

2.  **Controllers (`src/controllers/authController.js`)**:
    *   Create the functions that handle the logic for each route:
        *   `registerUser`: Handles user registration, including input validation and password hashing.
        *   `loginUser`: Handles user login and password comparison.
        *   `googleCallback`: Handles the redirect from Google and sends a token back to the client.
        *   `logoutUser`: A simple handler for logout requests.
    *   You will also need a `userController.js` for user-specific routes like fetching the current user's profile.

3.  **Routes (`src/routes/`)**:
    *   Create `authRoutes.js` to define all authentication-related endpoints (`/register`, `/login`, `/google`, `/google/callback`).
    *   Create `userRoutes.js` to define user-related endpoints (`/me`, `/users`), protecting them with your `authMiddleware`.

#### **Phase 5: Tying It All Together**

1.  **Server Entry Point (`index.js`)**:
    *   In the root of the `server` folder, create `index.js`. This file orchestrates the entire application:
        *   Loads environment variables using `dotenv.config()`.
        *   Imports `express`, `cors`, and `passport`.
        *   Imports your `connectDB` function, `configurePassport` function, and all your route files.
        *   Calls `connectDB()` to connect to the database.
        *   Calls `configurePassport(passport)` to initialize the Google strategy *after* environment variables are loaded.
        *   Sets up middleware (`cors`, `express.json`, `passport.initialize`).
        *   Mounts your route handlers to their respective paths (e.g., `/api/auth`).
        *   Starts the Express server.

2.  **Add `start` Script**:
    *   In your `package.json`, add a `start` script to easily run the server with auto-restarting on file changes:
        ```json
        "scripts": {
          "start": "node --watch index.js"
        }
        ```

#### **Final Step: Run the Server**

*   From your `server` directory, run the command:
    ```bash
    npm start
    ```

Your authentication server is now fully functional and ready to be connected to a frontend!