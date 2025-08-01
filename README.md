# MoveXa

MoveXa is a parcel delivery system that enables users to seamlessly send and receive parcels across different locations. Users can register as a Sender or Receiver, with an Admin managing the overall system. MoveXa provides a structured way to manage parcels, track delivery stages, and maintain a history of parcel status changes through a clean, well-organized API.


#### Sender:
- **Register and log in**

- **Send parcels to registered receivers**

- **View all parcels sent**

- **Cancel parcels if needed**

#### Receiver:
- **View all parcels sent to them**

- **Confirm parcel delivery (mark as received)**

- **View their parcel delivery history**

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
    - **SUPER_ADMIN_EMAIL=super_admin_email**
    - **SUPER_ADMIN_PASSWORD=super_admin_password**
    - **FRONTEND_URL=front_end_url**
6. **After the installation is complete, start the application by typing <code>npm run dev</code> in terminal**

- **You should now be able interact with the application on your local machine!**


### Register User:
    POST -/api/v1/user/register

 > > Body Data:
 {
        "name": "user name",
        "email": "example@gmail.com",
        "password": "user password",
        "role": "Sender/Receiver"
}


## Sender API Routes:
### Send Parcel:
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

### Get All Parcels Sent By A Sender:
    GET -/api/v1/parcel/sender-parcels/sender_Id

### Cancel Parcel:
    PATCH -/api/v1/parcel/cancel/parcel_Id


## Receiver API Routes:
### Get All Parcels Sent For A Receiver:
    GET -/api/v1/parcel/receiver-parcels/receiver_Email

### Receive Parcel:
    PATCH -/api/v1/parcel/parcel-received/parcel_Id

> > Body Data:
{
    "receiveParcel": true/false
}

### Parcel Delivery History:
    GET -/api/v1/parcel/delivery-history/receiver_Email


## Admin API Routes:
### Get All Parcels:
    GET -/api/v1/parcel/all-parcels
    OR
    GET -/api/v1/parcel/all-parcels?parcelStatus=parcel_status (REQUESTED, CANCELLED, BLOCKED, DISPATCHED, IN_TRANSIT, DELIVERED)

### Get All Users:
    GET -/api/v1/user/all-users
    OR
    GET -/api/v1/user/all-users?role=user_role (Sender, Receiver)

### Change Parcel Status:
    PATCH -/api/v1/parcel/parcel-status/parcel_Id

> > Body Data:
{
  "parcelStatus": "REQUESTED/CANCELLED/BLOCKED/DISPATCHED/IN_TRANSIT/DELIVERED"
}

### Change User Status:
    PATCH -/api/v1/user/change-status/user_Id

> > Body Data:
{
  "userStatus": "Active/Blocked"
}

## Super Admin API Routes:
### Assign Admin:
    PATCH -/api/v1/user/assign-admin/user_Id

### Approve Parcel:
    PATCH -/api/v1/approve-parcel/parcel_Id

## Logged In Users API Route:
### Track Parcel:
    GET -/api/v1/track-parcel/tracking_Id



##  Live Link:
- **[MoveXa Server](https://movexa-server.vercel.app)**