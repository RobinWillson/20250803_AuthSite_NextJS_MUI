I clicked login at homepage google login button.

It popup a window, I select the google account.

It run for a while, and go back to homepage, seems nothing happened.

I opened chrome develop tool, it shows :
inspector.js:7 POST http://localhost:5173/api/auth/google 404 (Not Found)
Then I test login by http://localhost:5000/api/auth/google.

It returns http://localhost:3000/auth/callback?token=....

And at mongodb I successfully add a new user.

Please analysis that why client site login has issue?

----------------


client:342 Cross-Origin-Opener-Policy policy would block the window.postMessage call.
client:342 Cross-Origin-Opener-Policy policy would block the window.postMessage call.
POST http://localhost:5173/api/auth/google 400 (Bad Request)