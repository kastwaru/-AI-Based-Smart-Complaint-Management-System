# AI-Based Smart Complaint Management System

## Overview
This is a MERN Stack application that allows users to register complaints online. The system uses AI to classify complaint priority, suggest departments, and generate automated responses.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js, Express.js
- Database: MongoDB
- AI: Google Gemini AI (or Mock Logic fallback)
- Authentication: JWT & bcrypt

## Features
- **Complaint Registration:** Form to submit complaints.
- **Complaint Tracking:** Dashboard to view, filter, and search complaints.
- **AI Analysis:** Auto-categorization, priority detection, and response generation.
- **Authentication:** Secure login and signup using JWT.

## Installation & Setup

1. **Clone the repository**
2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/complaints_db
   JWT_SECRET=supersecret123
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Run the backend:
   ```bash
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/signup` - Register a user
- `POST /api/auth/login` - Login user
- `POST /api/complaints` - Add a complaint
- `GET /api/complaints` - Get all complaints
- `PUT /api/complaints/:id` - Update status
- `GET /api/complaints/search?location=...` - Search by location
- `POST /api/ai/analyze` - Analyze complaint via AI
