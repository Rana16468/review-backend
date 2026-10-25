# 📚 Assignment Review & Management System (Backend)

A role-based backend for managing assignments and reviewing student submissions. **Mentors** create assignments, **students** submit their work, and mentors review each submission with marks and feedback. **Admins** manage the whole platform.

Built with **Node.js + Express**, **TypeScript**, **Prisma ORM** and **PostgreSQL**, following a **modular architecture** with **Zod** for request validation.

🔗 **Live:** https://review-backend-bay.vercel.app

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Database Design](#-database-design)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Run with Docker](#-run-with-docker)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧭 Overview

This system digitizes the full assignment lifecycle in a mentor-led learning program:

1. A **Mentor** publishes an assignment for a batch with a title, description and deadline.
2. A **Student** submits their work against that assignment (one submission per student per assignment).
3. The **Mentor** reviews the submission, gives **marks** and **feedback**, and updates the status.
4. An **Admin** oversees users and can block or manage accounts.

### Roles

| Role | Responsibilities |
| --- | --- |
| **ADMIN** | Manage all users, block/unblock accounts, full platform oversight |
| **MENTOR** | Create and manage assignments, review submissions, give marks and feedback |
| **STUDENT** | View assignments, submit work, see marks and feedback |

### Submission Lifecycle

```
PENDING ──► SUBMITTED ──► REVIEWED
                    └───► REJECTED
```

| Status | Meaning |
| --- | --- |
| `PENDING` | Assignment assigned, no work submitted yet |
| `SUBMITTED` | Student has submitted (default on creation) |
| `REVIEWED` | Mentor has reviewed and graded the submission |
| `REJECTED` | Mentor rejected the submission |

---

## ✨ Key Features

- 🔐 **Authentication & authorization** with JWT and role-based access control (Admin / Mentor / Student)
- 🔑 Secure password hashing with **bcrypt**
- 📝 **Assignment management**: create, update, delete (soft delete) assignments per batch with deadlines
- 📤 **Submission system**: students submit once per assignment (enforced by a database unique constraint)
- ✅ **Review workflow**: marks, feedback and status updates by mentors
- 🚫 **Account status control**: `ACTIVE` / `BLOCKED` users
- 🗑️ **Soft deletes** across users, assignments and submissions via `isDeleted`
- 🛡️ **Schema validation** of incoming requests using **Zod**
- 🖼️ Image upload handling with **Multer**, **Sharp** and **Cloudinary**
- 📧 Email support via **Nodemailer**
- ⚡ **Redis** (ioredis) support for caching / fast data access
- ⏰ Scheduled jobs with **node-cron**
- 🪵 Structured logging with **Pino**
- 🧹 Code quality with **ESLint** and **Prettier**
- 🐳 **Docker** and **Docker Compose** support
- ▲ Ready for **Vercel** deployment

---

## 🛠 Tech Stack

| Category | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Validation | Zod |
| Auth | JSON Web Token, bcrypt |
| Cache | Redis (ioredis) |
| File handling | Multer, Sharp, Cloudinary |
| Email | Nodemailer |
| Scheduling | node-cron |
| Logging | Pino, pino-pretty |
| Tooling | ts-node-dev, ESLint, Prettier |
| DevOps | Docker, Docker Compose, Vercel |

---

## 🏗 Architecture

The project follows a **modular architecture**: every feature lives in its own self-contained module, so the codebase stays easy to read, test and scale.

Each module typically contains:

```
module-name/
├── module.interface.ts     # TypeScript types
├── module.validation.ts    # Zod schemas
├── module.route.ts         # Express routes
├── module.controller.ts    # Request / response handling
└── module.service.ts       # Business logic & Prisma queries
```

**Request flow**

```
Client ─► Route ─► Auth middleware ─► Zod validation ─► Controller ─► Service ─► Prisma ─► PostgreSQL
```

---

## 📁 Project Structure

```
review-backend/
├── prisma/                 # Prisma schema and migrations
│   └── schema.prisma
├── src/
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server entry point
│   └── ...                 # Modules, middlewares, config, utils
├── Dockerfile
├── docker-compose.yml
├── vercel.json
├── tsconfig.json
├── .eslintrc.json
├── prettierrc.json
└── package.json
```

> The `src` folder is organized by feature modules (users, assignments, submissions, auth, etc.) alongside shared middlewares, configuration and utilities.

---

## 🗄 Database Design

PostgreSQL managed through Prisma. Core models:

### `User` (`users`)

| Field | Type | Notes |
| --- | --- | --- |
| id | String (UUID) | Primary key |
| name | String | |
| email | String? | Unique |
| password | String? | Hashed |
| role | `MENTOR` \| `STUDENT` \| `ADMIN` | Default `STUDENT` |
| status | `ACTIVE` \| `BLOCKED` | Default `ACTIVE` |
| os, browser, device | String? | Login device info |
| isVerify | Boolean | Default `false` |
| photo | String? | Profile photo URL |
| isDeleted | Boolean | Soft delete flag |

### `Assignment` (`assignmentsts`)

| Field | Type | Notes |
| --- | --- | --- |
| id | String (UUID) | Primary key |
| title | VarChar(255) | |
| description | VarChar(5000) | |
| batch | VarChar(255) | Target batch |
| deadline | DateTime | |
| userId | String | Mentor who created it (cascade delete) |
| isDeleted | Boolean | Soft delete flag |

### `Submission` (`submissions`)

| Field | Type | Notes |
| --- | --- | --- |
| id | String (UUID) | Primary key |
| assignmentId | String | FK → Assignment (cascade delete) |
| studentId | String | FK → User (cascade delete) |
| description | VarChar(5000)? | Student's submission content |
| notes | VarChar(1000)? | Extra notes from student |
| feedback | VarChar(2000)? | Mentor feedback |
| marks | Int? | Score given by mentor |
| status | `SubmissionStatus` | Default `SUBMITTED` |
| isDeleted | Boolean | Soft delete flag |

**Constraint:** `@@unique([assignmentId, studentId])`, so a student can submit only once per assignment.

### Relationships

```
User (Mentor) 1 ──── * Assignment 1 ──── * Submission * ──── 1 User (Student)
```

Full schema: [`prisma/schema.prisma`](./prisma/schema.prisma)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (local installation or a hosted one such as Neon / Supabase)
- [Redis](https://redis.io/) (optional, or run it with Docker)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Rana16468/review-backend.git
cd review-backend
```

**2. Install dependencies**

```bash
npm install
```

> `postinstall` automatically runs `prisma generate`, so the Prisma Client is generated for you.

**3. Set up environment variables**

Create a `.env` file in the project root (see [Environment Variables](#-environment-variables)).

**4. Set up the database**

Create the tables in your PostgreSQL database:

```bash
npx prisma migrate dev --name init
```

Or, to push the schema without creating migration files:

```bash
npx prisma db push
```

(Optional) Open Prisma Studio to browse your data:

```bash
npx prisma studio
```

**5. Start the development server**

```bash
npm run dev
```

The server starts with auto-reload (`ts-node-dev`). 🎉

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
NODE_ENV=development
PORT=5000

# Database (PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/review_db?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@localhost:5432/review_db?schema=public"

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Redis
REDIS_URL=redis://localhost:6379

# Cloudinary (image upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> ⚠️ The variable names above are examples. Match them with the names your `src/config` actually reads. Never commit your real `.env` file.

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Connection string Prisma uses at runtime (pooled connection if your host provides one) |
| `DIRECT_URL` | Direct connection string used for migrations |

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with auto-reload (`ts-node-dev`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled app (`node ./dist/server.js`) |
| `npm run prod` | Run the compiled app in production mode |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run prettier` | Format `src` files with Prettier |
| `npm run prettier:fix` | Format `src` with Prettier (alternative) |

**Production run**

```bash
npm run build
npm start
```

---

## 🐳 Run with Docker

The project ships with a `Dockerfile` and `docker-compose.yml`.

**Build and start all services**

```bash
docker-compose down
docker-compose up --build -d
```

**View backend logs**

```bash
docker-compose logs -f backend
```

**Redis container**

```bash
docker start ts_express_redis
docker stop ts_express_redis
```

---

## ☁️ Deployment

The repository includes a `vercel.json`, so it can be deployed to **Vercel**:

1. Push the code to GitHub.
2. Import the repository in [Vercel](https://vercel.com/).
3. Add all required environment variables in the Vercel project settings.
4. Deploy.

Live deployment: https://review-backend-bay.vercel.app

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please run `npm run lint` and `npm run prettier` before submitting.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

## 👤 Author

**Rana** · [@Rana16468](https://github.com/Rana16468)

⭐ If you find this project useful, consider giving it a star!