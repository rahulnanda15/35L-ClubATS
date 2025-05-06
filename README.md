# Club ATS

This is a fullstack web application built for our CS 35L final project. It serves as an Applicant Tracking System (ATS) for student clubs to manage their application and recruitment processes.

## Tech Stack

- **Frontend**: React (with Vite)
- **Backend**: Express.js
- **ORM**: Prisma
- **Database**: Supabase (PostgreSQL)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rahulnanda15/35L-ClubATS.git
cd club-ats
```

### 2. Install dependencies

Install frontend and backend dependencies:

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Set up database access

All team members have been added to the Supabase organization — check your email for an invitation to join. Once you've accepted, you'll be able to access the database.

To connect to the databse with Prisma, create a `.env` file in the `server/` directory and add a `DATABASE_URL` entry. You can find this in the Supabase dashboard. It should look something like: 

```env
DATABASE_URL="postgresql://postgres:<your-password>@<your-db-host>.supabase.co:5432/postgres"
```

### 4. Generate Prisma client

This step generates the Prisma client which allows you to query your database in a type-safe way. It reads your `schema.prisma` file and creates a client tailored to your data models in the `node_modules/@prisma/client` folder.

You need to run this every time the database schema changes (e.g., you add or modify a model in `schema.prisma`) to ensure the client reflects the current structure of the database.

```bash
cd server
npx prisma generate
```

To push your local schema to Supabase (if you make changes to schema.prisma):

```bash
npx prisma db push
```

## Testing  
### 1. Start the backend server

```bash
cd server
npm run dev
```

### 2. Start the frontend

```bash
cd client
npm run dev
```
