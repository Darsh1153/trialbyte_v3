# Vercel Deployment Configuration for TrialByte

## Environment Variables Required

Set these in your Vercel project dashboard under Settings > Environment Variables:

### Required Variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Optional Variables (for full functionality):
- `CLOUD_NAME` - Cloudinary cloud name
- `CLOUD_KEY` - Cloudinary API key  
- `CLOUD_KEY_SECRET` - Cloudinary API secret
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number
- `FRONTEND_URL` - Leave empty (will use same domain)
- `NEXT_PUBLIC_API_BASE_URL` - Leave empty (will use same domain)

### Production Settings:
- `NODE_ENV=production`
- `PORT=5000` (optional, Vercel sets this automatically)

## Deployment Steps:

1. **Connect Repository**: Import your GitHub repository in Vercel
2. **Set Environment Variables**: Add all required variables in Vercel dashboard
3. **Deploy**: Vercel will automatically detect the monorepo configuration and deploy both frontend and backend

## How It Works:

- **Frontend**: Served from `https://your-app.vercel.app/`
- **Backend API**: Available at `https://your-app.vercel.app/api/v1/*`
- **Single Domain**: Both frontend and backend use the same domain
- **CORS**: Automatically configured for production

## Testing After Deployment:

1. Visit your Vercel URL to see the frontend
2. Test API endpoints: `https://your-app.vercel.app/api/v1/users`
3. Verify database connections work
4. Test authentication flows
