# Gym Application

## Prerequisites
- Node.js (v18 or later)
- PostgreSQL

## Setup Instructions

### 1. Install Node.js
It appears Node.js is not installed on your system. Please install it from [nodejs.org](https://nodejs.org/).

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` with your PostgreSQL connection string:
   ```env
   DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_db
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
