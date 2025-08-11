# 20250625 Authenticate Site with MUI
We have a site template for register/login with email or google account,
Now, let us design some UI for more friendly.


# Getting Start
*   From your `server` directory, run the command:
    ```bash
    cd server
    npm start
    ```
*   From your `client` directory, run the command:
    ```bash
    cd client
    npm run dev
    ```
* visit `http://localhost:5173/`

# Clear port process
`netstat -ano | findstr :3001`
`taskkill /F /PID 28488`  