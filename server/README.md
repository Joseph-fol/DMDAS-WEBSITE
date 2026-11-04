# DMDAS

Digital Manual Distribution and Accountability System (DMDAS) is a full-stack web application built to help students purchase academic course manuals and help course representatives manage and distribute manuals efficiently. The platform uses secure authentication, department-based access control, and Paystack for secure payment processing.

The project is split into three major parts:

- `server/` — Express API + MongoDB backend
- `client/dmdas-app/` — Student-facing Next.js dashboard and portal
- `client/dmdas-website/` — Public marketing/landing website for DMDAS

---

## 1. Project Overview

DMDAS solves a common challenge in academic environments: students often need course manuals, but acquisition and accountability are scattered across manual processes. This system centralizes that process by:

- letting students browse available manuals by department and level
- allowing representatives to upload and manage manuals
- enabling students to pay securely with Paystack
- issuing a unique keycode after successful payment
- tracking transaction history, manual collection status, and payout details
- keeping role-based access separate between students and reps

The system is designed around academic roles:

- Student: signs in, buys manuals, views paid manuals, tracks payment and keycode status
- Rep (Course Representative): adds/edit/deletes manuals, manages settlement account info
- SuperRep: represented in the data model for more advanced department-level management

---

## 2. Architecture

### 2.1 Server-side architecture

The backend is an Express application using MongoDB through Mongoose.

Key responsibilities:

- user registration and login
- JWT-based authentication
- role-based authorization (`student`, `rep`)
- manual CRUD APIs for reps
- search and filtering for manuals
- Paystack integration for payment initialization and verification
- transaction status tracking
- email and OTP-based PIN reset workflow

### 2.2 Client-side architecture

The frontend is a Next.js app with a student dashboard experience located in `client/dmdas-app`.

Main areas include:

- authentication pages for sign up and sign in
- dashboard overview
- manual purchase flow
- transaction history
- profile/account settings
- rep-related manual management screens and flows

The marketing website in `client/dmdas-website` is a public-facing landing page for the product and may be used for branding, onboarding, and product marketing.

---

## 3. Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Paystack API
- Resend (email)
- Twilio (optional/legacy WhatsApp OTP messaging path)
- Cors and dotenv

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- Formik + Yup
- Lucide React icons

---

## 4. Repository Structure

```bash
DMDAS/
├── client/
│   ├── dmdas-app/
│   │   ├── app/
│   │   ├── components/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── README.md
│   │   └── ...
│   └── dmdas-website/
│       ├── src/
│       ├── package.json
│       ├── README.md
│       └── ...
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── util/
│   ├── index.js
│   ├── package.json
│   └── ...
├── README.md
└── .git/
```

---

## 5. Core Modules and Responsibilities

### 5.1 Server models

#### User model (`server/models/user.model.js`)

Represents all users in the system.

Primary fields:

- `fullName`
- `email`
- `matricNumber`
- `department`
- `phoneNumber`
- `level`
- `pin`
- `role` (`student`, `rep`, `superRep`)
- `settlementAccount`
- `pinResetOTP`
- `pinResetExpires`

Important notes:

- `matricNumber` is unique
- `email` is unique
- department + level + role have a unique index for `superRep` entries
- PIN is hashed before storage

#### Manual model (`server/models/manual.model.js`)

Represents an uploaded academic manual.

Primary fields:

- `courseTitle`
- `courseCode`
- `price`
- `semester`
- `printedStock`
- `claimedCount`
- `isAvailable`
- `addedBy` (reference to the rep who uploaded it)

The schema includes:

- a text index on `courseCode`, `courseTitle`, and `semester`
- a virtual property `availableStock`
- a virtual property `stockStatus`

#### Transaction model (`server/models/transaction.model.js`)

Tracks each payment and keycode lifecycle.

Primary fields:

- `student`
- `matricNumber`
- `manual`
- `courseCode`
- `status` (`PENDING`, `PAID`, `FAILED`)
- `reference`
- `keycode`
- `channel`
- `amount`
- `dispatchStatus` (`UNCLAIMED`, `CLAIMED`)
- `claimToken`
- `date`, `paymentDate`, `collectedAt`

This model is central to the purchase and pickup flow.

---

## 6. Backend Routes

All routes are mounted under `/api` in `server/index.js`.

### 6.1 Authentication routes (`server/routes/auth.route.js`)

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/signup` | Register a new user |
| POST | `/api/signin` | Log in a user and receive JWT |
| POST | `/api/requestPin` | Request OTP-based PIN reset using matric number + email |
| POST | `/api/requestPinByEmail` | Request PIN reset by email |
| POST | `/api/resetPin` | Reset PIN with OTP |
| GET | `/api/profile` | Get authenticated user profile |
| GET | `/api/notifications` | Get authenticated user notifications |
| PATCH | `/api/notifications/read` | Mark authenticated user notifications as read |
| PUT | `/api/updatePinSetting` | Update authenticated user's PIN |
| PUT | `/api/updateProfileSetting` | Update authenticated user profile info |

### 6.2 Student routes (`server/routes/student.route.js`)

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/student/initializeTransaction` | Start Paystack payment |
| GET | `/api/student/verifyPayment` | Verify a transaction against Paystack |
| GET | `/api/student/transactionHistory` | Get paginated transaction history (`page`, `limit` up to 50, optional `status=PAID|FAILED`) |
| GET | `/api/student/purchasedManuals` | Get manuals already paid for |
| POST | `/api/student/searchManuals` | Search manuals in the student’s context |
| GET | `/api/student/availableManuals` | Get department-level manuals available for purchase |
| POST | `/api/student/paystack/webhook` | Process Paystack webhook events |

### 6.3 Representative routes (`server/routes/rep.route.js`)

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/admin/dashboard` | Welcome route for reps |
| POST | `/api/rep/addManual` | Add a new manual |
| GET | `/api/rep/getManual` | Fetch rep-owned manuals |
| PUT | `/api/rep/editManual/:id` | Update manual details |
| DELETE | `/api/rep/deleteManual/:id` | Delete a manual |
| POST | `/api/rep/resolveAccount` | Resolve bank account details via Paystack |
| POST | `/api/rep/saveAccount` | Save settlement details |
| POST | `/api/rep/editBankDetails` | Update saved bank account details |

### 6.4 General routes (`server/routes/general.route.js`)

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/banks` | Fetch Nigerian banks from Paystack |
| POST | `/api/avatar/upload` | Upload profile avatar (protected) |

---

## 7. Authentication and Authorization

Authentication is handled in `server/middleware/auth.js`.

### JWT verification

Every protected route uses a Bearer token:

```http
Authorization: Bearer <token>
```

The middleware:

- checks for the token
- verifies the JWT against `jwtSecretKey`
- loads the corresponding user from MongoDB
- attaches it to `req.user`
- rejects expired, invalid, or missing authorization tokens

### Role protection

- `isRep` allows only accounts with `role === 'rep'`
- `isStudent` allows only accounts with `role === 'student'`

This prevents unauthorized access to manual management and student-only features.

---

## 8. User Flows

### 8.1 Student sign up

A student creates an account with:

- full name
- email
- matric number
- department
- phone number
- level
- pin
- role

The system:

- validates required fields
- hashes the PIN using bcrypt
- creates a MongoDB user record
- sends a Welcome email
- returns a JWT for immediate access

### 8.2 Student sign in

The student signs in using:

- matric number
- PIN

The API compares the supplied PIN with the hashed value in the database and returns user info plus a JWT.

### 8.3 Password/PIN reset

There are two reset paths:

1. Request by matric number + email
2. Request by email only

Then the user receives:

- a 6-digit OTP via email (preferred flow)
- or via WhatsApp in the older/alternative flow

The OTP is stored with expiry time in the user document and validated before the new PIN is saved.

### 8.4 Rep manual management

A representative can:

- add a course manual with `courseCode`, `courseTitle`, `price`, `semester`, `printedStock`
- edit existing manual data
- delete their own uploaded manuals
- fetch all manuals uploaded by their own account

They are restricted to the content they created.

### 8.5 Student manual purchase

The transaction lifecycle works like this:

1. Student selects a manual and clicks purchase
2. API calls Paystack to initialize a transaction
3. Backend stores a pending transaction record with:
   - Paystack reference
   - generated unique keycode
   - generated claim token
4. Student is redirected to Paystack payment page
5. Paystack sends a webhook to the backend after successful charge
6. Backend verifies the transaction and updates the transaction status to `PAID`
7. Student receives the keycode and can claim their manual from the rep

---

## 9. Payment Integration

This project integrates with Paystack for secure payments.

### Initialization flow

The initialization endpoint uses:

```js
POST /api/student/initializeTransaction
```

It performs:

- validation of `amount` and `manualId`
- lookup of the selected manual
- call to Paystack transaction initialization API
- creation of a pending DB transaction record

### Webhook handling

The webhook route is:

```js
POST /api/student/paystack/webhook
```

This is a critical server-side validation step. It verifies the Paystack request signature before processing. If the charge is successful, it marks the transaction as `PAID` and stores metadata such as payment channel and payment date.

### Transaction verification

```js
GET /api/student/verifyPayment?reference=...
```

This endpoint confirms payment status with Paystack and returns summary data including:

- paystack reference
- amount paid
- keycode
- course code and title
- rep name
- pickup status

---

## 10. Manual Search and Filtering

The search logic in `server/controllers/manual.controller.js` allows students to discover manuals from their department and level.

It does the following:

- excludes manuals already purchased by that student
- finds reps in the same department and level
- searches by course code or title
- optionally filters by semester
- falls back to broader results if department-specific results are empty

This gives students a useful experience while maintaining academic context boundaries.

---

## 11. Important API Behavior and Notes

### 11.1 App initialization

In `server/index.js`, the backend:

- configures express JSON parsing and URL encoding
- enables CORS
- establishes MongoDB connection using `MONGO_URI`
- starts the Express server on `PORT` or `5000`
- mounts all route groups under `/api`
- adds a 404 handler

### 11.2 Error handling

The API includes:

- JSON parse error handling for malformed payloads
- route not found handling
- permission-related errors for unauthorized users
- authentication failures with clear messages

### 11.3 Data validation

The app validates:

- required fields for sign up, sign in, manual creation, and transfers
- amount positivity for transactions
- valid object IDs for manual references
- duplicate course codes
- correct bank account data before saving

---

## 12. Frontend Flow Overview

### Student portal (`client/dmdas-app`)

The student portal is built using modular Next.js App Router pages.

Important pages include:

- `app/signin/page.tsx` — student login
- `app/signup/page.tsx` — registration page
- `app/(student)/dashboard/page.tsx` — dashboard overview
- `app/(student)/purchase-manual/page.tsx` — manual selection and purchase page
- `app/(student)/transaction-history/page.tsx` — transaction history
- `app/(student)/available-manuals/page.tsx` — manual list and discovery page
- `app/(student)/my-profile-settings/page.tsx` — account settings

Students access protected areas through a session token stored in `sessionStorage` and validated by the backend.

### Marketing website (`client/dmdas-website`)

This site is used to market DMDAS publicly and may be deployed independently for branding and product positioning. It includes pages like:

- home
- about
- features
- how it works
- FAQ
- contact

---

## 13. Environment Variables

The backend reads values from environment variables. A typical setup should include:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
jwtSecretKey=your_jwt_secret_key
PAYSTACK_SECRET_KEY=your_paystack_secret
RESEND_API_KEY=your_resend_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

Note:

- `jwtSecretKey` is required for token issuance and validation
- `PAYSTACK_SECRET_KEY` is required for Paystack API calls and webhook verification
- `RESEND_API_KEY` is required for email notifications

The frontend may also rely on environment variables for API base URL configuration, especially if deployed in different environments.

---

## 14. Local Development Setup

### 14.1 Install backend dependencies

```bash
cd server
npm install
```

### 14.2 Install frontend dependencies

```bash
cd client/dmdas-app
npm install
```

And/or the marketing site:

```bash
cd client/dmdas-website
npm install
```

### 14.3 Run backend

```bash
cd server
npm start
```

### 14.4 Run student portal

```bash
cd client/dmdas-app
npm run dev
```

### 14.5 Run marketing website

```bash
cd client/dmdas-website
npm run dev
```

---

## 15. Production and Deployment Notes

This project is designed for deployment in a full-stack environment, with:

- backend hosted as an Express service
- frontend deployed as a Next.js app
- MongoDB hosted remotely
- Paystack configured with a live secret key
- email provider configured in production

Important deployment considerations:

- ensure the backend’s `MONGO_URI` points to the production database
- configure proper CORS rules for client domains
- set app URL callbacks to production payment pages
- verify webhook URL and signature handling on deployment
- use secure environment variables instead of hardcoded secrets

---

## 16. Business Logic Summary

DMDAS essentially follows this lifecycle:

1. A rep uploads course manuals
2. Students browse manuals by department/level
3. Student selects a manual and pays through Paystack
4. System records transaction and keycode
5. Student receives a claim keycode
6. Rep confirms manual collection and updates status
7. Transaction and payment history remain visible to the student
8. The system supports accountability and auditability of manual sales

---

## 17. Security Considerations

The project already includes important protections, but production hardening should still include:

- securing all environment variables
- validating all incoming request bodies
- limiting route access with middleware
- protecting webhook endpoints from spoofed requests
- avoiding logging sensitive payment or personal data unnecessarily
- using HTTPS for all production routes
- applying rate limiting and request validation in production if needed

---

## 18. Potential Improvements

A production-ready version of this project could benefit from:

- Admin dashboard for managing users and reps
- manual claim confirmation flow for reps
- automated payout processing to reps
- better analytics and sales reporting
- stronger role-based dashboards
- email/phone verification at signup
- transaction refund handling
- QR-code based manual pickup verification
- unit and integration testing coverage

---

## 19. Summary

DMDAS is a practical academic marketplace and accountability system that combines:

- student purchasing workflows
- rep manual management
- secure payment processing with Paystack
- role-based access control
- database-backed tracking of manual distribution and collection

It is built using modern JavaScript technologies and is structured to support both student usability and institutional accountability.

---

## 20. Quick Start Checklist

```bash
# 1. Install backend dependencies
cd server && npm install

# 2. Install student app dependencies
cd ../client/dmdas-app && npm install

# 3. Install marketing app dependencies
cd ../dmdas-website && npm install

# 4. Configure environment variables
# Add .env values as described above

# 5. Start backend
cd ../../server && npm start

# 6. Start student app
cd ../client/dmdas-app && npm run dev

# 7. Start marketing site
cd ../dmdas-website && npm run dev
```

For any future extension or enhancement, the backend logic and data models are the right place to begin, followed by the relevant Next.js page updates for the user-facing experience.
