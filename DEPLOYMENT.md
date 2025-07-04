# Vercel Deployment Guide

This guide will help you deploy both the frontend and backend of the Masterly learning platform to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **MongoDB Atlas**: Set up a MongoDB database (free tier available)
4. **Environment Variables**: Prepare your environment variables

## Environment Variables Setup

### Backend Environment Variables (Set in Vercel Dashboard)

Navigate to your backend project in Vercel Dashboard → Settings → Environment Variables

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

### Frontend Environment Variables (Set in Vercel Dashboard)

Navigate to your frontend project in Vercel Dashboard → Settings → Environment Variables

```
NEXT_PUBLIC_API_URL=https://your-backend-domain.vercel.app
```

## Deployment Steps

### Step 1: Deploy Backend

1. **Push your code to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set the root directory to `backend`
   - Set the build command to: `npm run build`
   - Set the output directory to: `dist`
   - Set the install command to: `npm install`

3. **Configure Environment Variables**:
   - Add all backend environment variables listed above
   - Make sure to use your actual MongoDB URI and JWT secret

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Note your backend URL (e.g., `https://your-backend.vercel.app`)

### Step 2: Deploy Frontend

1. **Create a new Vercel project for frontend**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import the same GitHub repository
   - Set the root directory to `frontend`
   - Set the build command to: `npm run build`
   - Set the output directory to: `.next`
   - Set the install command to: `npm install`

2. **Configure Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL` with your backend URL from Step 1

3. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Note your frontend URL (e.g., `https://your-frontend.vercel.app`)

### Step 3: Update CORS Configuration

After both deployments are complete, update the backend CORS configuration:

1. Go to your backend Vercel project
2. Navigate to Settings → Environment Variables
3. Update `CLIENT_URL` to your frontend URL
4. Redeploy the backend

## Verification

1. **Test Backend Health**: Visit `https://your-backend.vercel.app/api/health`
2. **Test Frontend**: Visit your frontend URL and try to log in
3. **Test API Connection**: Check browser console for any CORS errors

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `CLIENT_URL` is set correctly in backend environment variables
   - Check that the frontend URL is included in the CORS origins array

2. **Database Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Ensure IP whitelist includes Vercel's IP ranges (or set to 0.0.0.0/0 for testing)

3. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation succeeds locally

4. **Environment Variables**:
   - Verify all required environment variables are set in Vercel
   - Check that variable names match exactly (case-sensitive)

### Useful Commands

```bash
# Test backend locally
cd backend
npm install
npm run build
npm start

# Test frontend locally
cd frontend
npm install
npm run build
npm start
```

## Production Considerations

1. **Security**:
   - Use strong JWT secrets
   - Enable MongoDB Atlas security features
   - Consider using Vercel's edge functions for better performance

2. **Performance**:
   - Enable Vercel's caching features
   - Consider using CDN for static assets
   - Monitor performance with Vercel Analytics

3. **Monitoring**:
   - Set up Vercel Analytics
   - Monitor error logs in Vercel Dashboard
   - Set up alerts for critical issues

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Check MongoDB Atlas connection
5. Review CORS configuration 