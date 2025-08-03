### **Test Plan: AuthSite Application**

#### **1. Test Objectives**

*   Verify all authentication mechanisms (email/password registration, login, Google OAuth).
*   Ensure user profile management features work correctly.
*   Validate password management flows (change, forgot, reset).
*   Confirm that role-based access control (Admin vs. User) is properly enforced.
*   Check for correct UI feedback, error handling, and navigation on the client side.

#### **2. Test Users**

For these tests, we'll assume the existence or creation of two types of users:

*   **Admin User:** An account with `role: 'admin'` (e.g., `admin@test.com`).
*   **Regular User:** A standard account with `role: 'user'` (e.g., `user@test.com`).

---

### **Part A: Backend API Testing**

These tests target the server endpoints directly. You can use an API client like Postman or Insomnia.

| Test ID | Feature | Endpoint & Method | Description | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **TC-API-01** | Registration | `POST /api/auth/register` | Register a completely new user with valid name, email, and password. | **Status `201 Created`**. Response contains a JWT token. |
| **TC-API-02** | Registration | `POST /api/auth/register` | Attempt to register with an email that already exists. | **Status `400 Bad Request`**. Error message: "Email already in use". |
| **TC-API-03** | Login | `POST /api/auth/login` | Log in with correct credentials for an existing user. | **Status `200 OK`**. Response contains a JWT token. |
| **TC-API-04** | Login | `POST /api/auth/login` | Attempt to log in with a correct email but an incorrect password. | **Status `401 Unauthorized`**. Error message: "Invalid credentials". |
| **TC-API-05** | Forgot Password | `POST /api/auth/forgot-password` | Submit a request with a valid, existing user's email. | **Status `200 OK`**. Success message about a reset link being sent. |
| **TC-API-06** | Reset Password | `PUT /api/auth/reset-password/:token` | Use a valid reset token (from the previous step) to set a new password. | **Status `200 OK`**. Success message. The user can now log in with the new password. |
| **TC-API-07** | Get Users (Admin) | `GET /api/users` | An **Admin User** requests the list of all users. (Requires `Authorization` header). | **Status `200 OK`**. Response contains a paginated list of user objects. |
| **TC-API-08** | Get Users (User) | `GET /api/users` | A **Regular User** attempts to request the list of all users. | **Status `403 Forbidden`**. Error indicating insufficient permissions. |
| **TC-API-09** | Update Role (Admin) | `PUT /api/users/:id/role` | An **Admin User** changes the role of a **Regular User**. | **Status `200 OK`**. Response contains the updated user object with the new role. |
| **TC-API-10** | Delete User (Admin) | `DELETE /api/users/:id` | An **Admin User** deletes a **Regular User's** account. | **Status `200 OK`**. Success message: "User removed". |
| **TC-API-11**| Self-Action (Admin)| `DELETE /api/users/:id` | An **Admin User** attempts to delete their own account. | **Status `400 Bad Request`**. Error message: "Admins cannot delete their own account." |

---

### **Part B: Frontend End-to-End (E2E) Testing**

These tests simulate a real user interacting with the application in a browser.

| Test ID | User Flow | Steps | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **TC-E2E-01** | Successful Registration | 1. Navigate to `/register`. <br> 2. Fill in name, a new email, and password. <br> 3. Click "Register". | User is redirected to `/dashboard` and sees a welcome message. |
| **TC-E2E-02** | Successful Login | 1. Navigate to `/login`. <br> 2. Enter credentials for an existing user. <br> 3. Click "Sign in". | User is redirected to `/dashboard`. |
| **TC-E2E-03** | Failed Login | 1. Navigate to `/login`. <br> 2. Enter a valid email but an incorrect password. <br> 3. Click "Sign in". | An error message "Failed to login..." or "Invalid credentials" is displayed on the page. |
| **TC-E2E-04** | Logout | 1. Log in to the application. <br> 2. On the `/dashboard`, click the "Logout" button. | User is redirected to the `HomePage` (`/`). |
| **TC-E2E-05** | Profile Update | 1. Log in and navigate to `/profile`. <br> 2. Change the "Full Name" field. <br> 3. Click "Save Changes". | A success toast appears. The name on the dashboard should be updated. |
| **TC-E2E-06** | Password Change | 1. Log in with an email/password user. <br> 2. Navigate to `/profile`. <br> 3. Fill "Current Password", "New Password", and "Confirm New Password" correctly. <br> 4. Click "Update Password". | A success toast appears. The user can log out and log back in with the new password. |
| **TC-E2E-07** | Password Change (Google User) | 1. Log in with a **Google account**. <br> 2. Navigate to `/profile`. | The "Change Password" form section should **not** be visible. |
| **TC-E2E-08** | Forgot Password | 1. Navigate to `/forgot-password`. <br> 2. Enter a valid user's email and submit. | A success toast appears, and the form indicates the request was sent. |
| **TC-E2E-09** | Admin Panel Access | 1. Log in as an **Admin User**. <br> 2. On the dashboard, the "Go to Admin Panel" button is visible. <br> 3. Click it. | User is navigated to the `/admin` page. |
| **TC-E2E-10** | Admin Panel Restriction | 1. Log in as a **Regular User**. <br> 2. On the dashboard, the "Go to Admin Panel" button is **not** visible. <br> 3. Manually type `/admin` into the browser's address bar. | User is redirected away from `/admin` (e.g., back to `/dashboard`). |