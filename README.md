# MoveXa

MoveXa is a parcel delivery system that enables users to seamlessly send and receive parcels across different locations. Users can register as a Sender or Receiver, with an Admin managing the overall system. MoveXa provides a structured way to manage parcels, track delivery stages, and maintain a history of parcel status changes through a clean, well-organized API.


#### Sender:
- **Register as a Sender and Login**

- **Send parcels to registered receivers**

- **View all parcels sent by a sender**

- **Cancel parcels if needed**

#### Receiver:
- **Register as a Receiver and Login**

- **View all parcels sent to a receiver**

- **Confirm parcel delivery or return parcel (mark as received or returned)**

- **View receiver parcel delivery history**

#### Admin:
- **Manage user status (e.g., block/unblock users)**

- **Update parcel status through different delivery stages**

- **Access and control all system operations via protected admin routes**


Security & Access Control
All routes are protected based on user roles (Sender, Receiver, Admin), ensuring secure access to authorized actions only.


## Tech Stack:
- **Node**
- **Express**
- **TypeScript**
- **Mongoose**
- **MongoDB**

## Key features:
1. **User registration as sender/receiver.**
1. **Send parcel to receiver.**
3. **Update parcel status(dispatch, in transit, cancel, etc.).**
2. **Retrieve all users and parcels data for admin.**
5. **User role based protected routes**
6. **Generate summaries of delivery history.**


## Dev Dependencies:
    -@eslint/js: ^9.32.0,
    -@types/cookie-parser: ^1.4.9,
    -@types/cors: ^2.8.19,
    -@types/dotenv: ^6.1.1,
    -@types/express: ^5.0.3,
    -@types/express-session: ^1.18.2,
    -@types/jsonwebtoken: ^9.0.10,
    -@types/mongodb: ^4.0.6,
    -@types/node: ^24.1.0,
    -@types/passport: ^1.0.17,
    -@types/passport-google-oauth20: ^2.0.16,
    -@types/passport-local: ^1.0.38,
    -@eslint: ^9.32.0,
    -@rimraf: ^6.0.1,
    -ts-node-dev: ^2.0.0,
    -typescript: ^5.8.3,
    -@typescript-eslint: ^8.38.0


## Dependencies:
    -bcryptjs: ^3.0.2,
    -cookie-parser: ^1.4.7,
    -cors: ^2.8.5,
    -dayjs: ^1.11.13,
    -dotenv: ^17.2.1,
    -express: ^5.1.0,
    -express-session: ^1.18.2,
    -http-status-codes: ^2.3.0,
    -jsonwebtoken: ^9.0.2,
    -mongodb: ^6.18.0,
    -mongoose: ^8.16.5,
    -passport: ^0.7.0,
    -passport-google-oauth20: ^2.0.0,
    -passport-local: ^1.0.0,
    -zod: ^4.0.13


## Installation:
1. **First, clone the repository to your local machine. you can do this by downloading the zip file or by cloning it using the web URL**
2. **Navigate to the project folder and open it with cmd terminal**
3. **Write <code>npm i</code> in the terminal. This will install all the necessary packages on your system**
4. **Create a file name <code>.env</code>, inside the project root folder**
5. **Save these properties in the <code>.env</code> file as environment variables:**
    - **PORT=local-port-number**
    - **DB_URL=your-mongoDb-uri**
    - **NODE_ENV=development or production**
    - **JWT_ACCESS_SECRET=jwt_access_token_secret**
    - **JWT_ACCESS_EXPIRES=jwt_access_token_expire_time**
    - **JWT_REFRESH_SECRET=jwt_refresh_token_secret**
    - **JWT_REFRESH_EXPIRES=jwt_refresh_token_expire_time**
    - **EXPRESS_SESSION_SECRET=express_session_secret**
    - **BCRYPT_SALT_ROUND=salt_round_number**
    - **SSL_STORE_ID=ssl_store_id**
    - **SSL_STORE_PASS=ssl_store_password**
    - **SSL_PAYMENT_API=ssl_session_api**
    - **SSL_VALIDATION_API=ssl_web_service_validation_api**
    - **SSL_IPN_URL=ssl_ipn_url**
    - **SSL_SUCCESS_BACKEND_URL=ssl_success_backend_url**
    - **SSL_FAIL_BACKEND_URL=ssl_fail_backend_url**
    - **SSL_CANCEL_BACKEND_URL=ssl_cancel_backend_url**
    - **SSL_SUCCESS_FRONTEND_URL=ssl_success_frontend_url**
    - **SSL_FAIL_FRONTEND_URL=ssl_fail_frontend_url**
    - **SSL_CANCEL_FRONTEND_URL=ssl_cancel_frontend_url**
    - **SUPER_ADMIN_EMAIL=super_admin_email**
    - **SUPER_ADMIN_PASSWORD=super_admin_password**
    - **FRONTEND_URL=front_end_url**
    
6. **After the installation is complete, start the application by typing <code>npm run dev</code> in terminal**

- **You should now be able interact with the application on your local machine!**


## Public API Routes:
### Register User:

A user can register as a "Sender" or as a "Receiver", but a user cannot set the role as an "Admin". Only Super Admin can Assign Admin role to a user.

    POST -/api/v1/user/register

 > > Body Data:
 {
        "name": "user name",
        "email": "example@gmail.com",
        "password": "user password",
        "role": "Sender/Receiver"
}

### Log In User:

User can log in to the application using their registration credentials.

    POST -/api/v1/auth/login

 > > Body Data:
 {
        "email": "example@gmail.com",
        "password": "user password",
}

### Get Refresh Token:## Description

With this endpoint, a new access token will be generated for the user if the refresh token is valid.

    POST -/api/v1/auth/refresh-token

### Log Out User:## Description

Log out a user and remove the tokens from the cookie.

    POST -/api/v1/auth/logout

### Track Parcel:

See the parcel status.

    POST -/api/v1/parcel/track-parcel/Tracking_Id

### User data:

A logged in user can see his data with this endpoint.

    POST -/api/v1/user/me

## Sender API Routes:


### Send Parcel:

Only the "Sender" user can send parcel using this endpoint.

    POST -/api/v1/parcel/send-parcel

 > > Body Data:
{
  "senderID": "688ba53e35ee36be43ca933b",
  "receiverEmail": "example@gmail.com",
  "senderAddress": "sender, address",
  "receiverAddress": "receiver, address",
  "weight": 45,
  "insideDhaka": true/false,
  "type": "DOCUMENT/FRAGILE/CLOTHING/OTHER"
}

### Get All The Parcels Sent By A User (i,e: Sender):

The "Sender" user can see all his parcels using this endpoint.

    GET -/api/v1/parcel/sender-parcels/sender_Id

### Get payment Url: 

The "Sender" user can get the payment URL for his parcel using this endpoint.


    GET -/api/v1/payment/init-payment/parcel_Id

### Cancel Parcel:

The "Sender" user can cancel his parcel, if it's not already dispatched.

    PATCH -/api/v1/parcel/cancel/parcel_Id


## Receiver API Routes:
### Get All Parcels Sent For A Receiver:

The "Receiver " user can see all his parcels using this endpoint.

    GET -/api/v1/parcel/receiver-parcels/receiver_Email

### Receive Parcel:

The "Receiver " user can receive his parcel if parcel status is delivered.

    PATCH -/api/v1/parcel/parcel-received/parcel_Id

> > Body Data:
{
    "receiveParcel": true/false
}

### Parcel Delivery History:

The "Receiver " user can see all his parcel delivery history using this endpoint.

    GET -/api/v1/parcel/delivery-history/receiver_Email


## Admin API Routes:
### Get All Parcels:

The "Super Admin" and the "Admin"  can see all parcels using this endpoint with filter option.

    GET -/api/v1/parcel/all-parcels
    OR
    GET -/api/v1/parcel/all-parcels?parcelStatus=parcel_status (REQUESTED, CANCELLED, BLOCKED, DISPATCHED, IN_TRANSIT, DELIVERED)

### Get All Users:

The "Super Admin" and the "Admin"  can see all users using this endpoint with filter option.

    GET -/api/v1/user/all-users
    OR
    GET -/api/v1/user/all-users?role=user_role (Sender, Receiver)

### Change Parcel Status:

The "Super Admin" and the "Admin"  can change a parcel's status using this endpoint.

    PATCH -/api/v1/parcel/parcel-status/parcel_Id

> > Body Data:
{
  "parcelStatus": "REQUESTED/CANCELLED/BLOCKED/DISPATCHED/IN_TRANSIT/DELIVERED"
}

### Change User Status:

The "Super Admin" and the "Admin"  can change a user's status using this endpoint.

    PATCH -/api/v1/user/change-status/user_Id

> > Body Data:
{
  "userStatus": "Active/Blocked"
}

## Super Admin API Routes:

Only the "Super Admin"  can assign a user an Admin" role using this endpoint.
### Assign Admin:
    PATCH -/api/v1/user/assign-admin/user_Id

### Approve Parcel:

Only the "Super Admin"  can approve a parcel if it's payment is complete.

    PATCH -/api/v1/approve-parcel/parcel_Id

## Logged In Users API Route:
### Track Parcel:
    GET -/api/v1/track-parcel/tracking_Id



##  Live Link:
- **[MoveXa Server](https://movexa-server.vercel.app)**