# TrialByte Deployment Guide

## Overview
This guide explains how to deploy both the frontend and backend of TrialByte to Vercel with a single domain.

## Project Structure
- `trialbyte-frontend-v1/` - Next.js frontend application
- `trialbyte-backend-v1/` - Express.js backend API
- Root `vercel.json` - Monorepo configuration

## Deployment Steps

### 1. Environment Variables Setup

Set the following environment variables in your Vercel project:

#### Required Variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NEXT_PUBLIC_API_BASE_URL` - Leave empty for production (will use same domain)

#### Optional Variables (for full functionality):
- `CLOUD_NAME` - Cloudinary cloud name
- `CLOUD_KEY` - Cloudinary API key
- `CLOUD_KEY_SECRET` - Cloudinary API secret
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number
- `FRONTEND_URL` - Your Vercel domain (auto-set by Vercel)

### 2. Database Setup
Ensure your PostgreSQL database is accessible from Vercel's servers and the connection string is properly formatted.

### 3. Deployment
1. Connect your GitHub repository to Vercel
2. Set the root directory as the project root
3. Vercel will automatically detect the monorepo configuration
4. Deploy!

## How It Works

### Routing Configuration
- `/api/*` routes → Backend API (Express.js)
- All other routes → Frontend (Next.js)

### API Endpoints
All backend API endpoints are available at:
- `/api/v1/users/*`
- `/api/v1/roles/*`
- `/api/v1/drugs/*`
- `/api/v1/therapeutic/*`
- `/api/v1/queries/*`
- `/api/v1/dropdown-management/*`
- And more...

### CORS Configuration
The backend automatically allows requests from:
- Localhost (development)
- Your Vercel domain (production)
- Any domain specified in `FRONTEND_URL`

## Testing
After deployment, test:
1. Frontend loads correctly
2. API endpoints respond (try `/api/v1/users` or similar)
3. Database connections work
4. Authentication flows function properly

## Troubleshooting
- Check Vercel function logs for backend errors
- Verify environment variables are set correctly
- Ensure database is accessible from Vercel
- Check CORS configuration if frontend can't reach backend
