# Environment Setup Guide

I've created the missing environment files for your TrialByte project. Here's what you need to do:

## Files Created

### Backend (`trialbyte-backend-v1/`)
- `.env` - Your actual environment file (ready to use)
- `.env.example` - Template for sharing with team

### Frontend (`trialbyte-frontend-v1/`)
- `.env.local` - Your actual environment file (ready to use)  
- `env.example` - Template for reference

## Required Configuration

### 1. Database Setup (REQUIRED)
Update the `DATABASE_URL` in `trialbyte-backend-v1/.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/trailbyte_db
```

### 2. JWT Secret (REQUIRED)
Replace the JWT_SECRET with a secure random string:
```
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
```

### 3. Optional Services
Configure these if your app uses them:

**Cloudinary (for file uploads):**
- Sign up at https://cloudinary.com
- Get your cloud name, API key, and secret

**Twilio (for SMS/OTP):**
- Sign up at https://twilio.com
- Get account SID, auth token, and phone number

**MSG91 (alternative SMS service):**
- Already configured in `src/services/sendOTP.js`
- Update API key if needed

## Quick Start

1. **Backend:**
   ```bash
   cd trialbyte-backend-v1
   npm install
   # Update .env with your database URL
   npm start
   ```

2. **Frontend:**
   ```bash
   cd trialbyte-frontend-v1
   npm install
   npm run dev
   ```

## Notes
- The frontend is already configured to connect to `http://localhost:5000` (backend)
- Environment files are gitignored for security
- Update production URLs before deployment
- Keep your `.env` files secure and never commit them to git

## Need Help?
- Check if PostgreSQL is running
- Verify database connection string format
- Ensure ports 3000 (frontend) and 5000 (backend) are available
