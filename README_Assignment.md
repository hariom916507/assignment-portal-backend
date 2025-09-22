
# Assignment Workflow Portal - Backend

**Project:** Assignment Workflow Portal (Backend)  
**Author:** Hariom  
**Tech stack:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt

---

## 1. Project Overview
This repository contains the backend for the Assignment Workflow Portal (mandatory part of the assignment). It implements:
- Single login for Teacher and Student (JWT-based)
- Role-based access (teacher / student)
- Assignment lifecycle: Draft → Published → Completed
- Student submissions: one submission per student per assignment, blocked after due date
- Teacher can view submissions and mark them reviewed
- Pagination & filtering for assignment lists
- Proper auth middleware, password hashing and basic validation

> Frontend is optional (not included).

---

## 2. Quick Setup (local)

**Prerequisites:**
- Node.js (v16+ recommended)
- MongoDB running locally or accessible via connection string
- Git

**Commands:**
```bash
# 1. Clone repo
git clone https://github.com/hariom916507/assignment-portal-backend.git
cd assignment-portal-backend

# 2. Install dependencies
npm install

# 3. Copy example env and edit .env
cp .env.example .env
# Open .env and set MONGO_URI and JWT_SECRET etc.

# 4. (Optional) Seed test users
node src/seed/seedUsers.js

# 5. Start server (dev)
npm run dev
# or start production
npm start
```

**.env.example** 
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/assignment_portal
JWT_SECRET=hgguijhhvuhnuyut67798igvhfy
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

---

## 3. NPM scripts (package.json)
- `npm run dev` -> `nodemon src/server.js` (development)
- `npm start` -> `node src/server.js` (production)
- `node src/seed/seedUsers.js` -> seeds sample teacher/student users

---

## 4. Key API Endpoints (summary)
Base URL: `http://localhost:5000/api`

**Auth**
- `POST /auth/register` - Register user (name, email, password, role: teacher|student)  
  Example body: `{ "name":"Teacher","email":"t@example.com","password":"pass","role":"teacher" }`

- `POST /auth/login` - Login and get JWT + role  
  Example body: `{ "email":"t@example.com","password":"pass" }`

**Assignments (teacher)**
- `POST /assignments` - Create assignment (teacher only)  
- `PUT /assignments/:id` - Update assignment (only Draft and owner)
- `DELETE /assignments/:id` - Delete assignment (only Draft and owner)
- `POST /assignments/:id/publish` - Publish assignment (Draft->Published)
- `POST /assignments/:id/complete` - Mark Completed (teacher)
- `GET /assignments` - List assignments (teacher: all own; student: only Published) supports `?page=` and `?limit=` and `?status=`

**Submissions**
- `POST /submissions/:assignmentId/submit` - Student submits (one per assignment)
- `GET /submissions/:assignmentId` - Teacher views submissions for an assignment
- `POST /submissions/review/:submissionId` - Teacher mark reviewed

> All protected routes require header `Authorization: Bearer <token>`

---
