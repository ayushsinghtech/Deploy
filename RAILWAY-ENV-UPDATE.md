# Railway Environment Variables Update

## Current Issue
Your frontend and backend are not connecting properly due to CORS and environment variable mismatches.

## Required Environment Variables for Railway Backend

Update these environment variables in your Railway dashboard:

### 1. CLIENT_URL
**Current:** `https://masterly-frontend-2icay86mb-ayushs-projects-c85cc04b.vercel.app`
**Should be:** `https://masterly-frontend.vercel.app` or `https://masterly-frontend.vercel.app/`

### 2. MONGODB_URI
**Current:** `mongodb+srv://AyushSingh:Ayush1234@cluster0.uuq6vjh.mongodb.net/personalized_learning?retryWrites=true&w=majority&appName=Cluster0`
**Status:** ✅ Correct

### 3. JWT_SECRET
**Current:** `your-super-secret-jwt-key-here`
**Status:** ✅ Correct

### 4. NODE_ENV
**Current:** `production`
**Status:** ✅ Correct

## How to Update in Railway

1. Go to your Railway dashboard
2. Select your backend project (`masterly-deploy-production`)
3. Go to the "Variables" tab
4. Update the `CLIENT_URL` variable to: `https://masterly-frontend.vercel.app` or `https://masterly-frontend.vercel.app/`
5. Save the changes
6. Railway will automatically redeploy your backend

## Frontend Environment Variables (Vercel)

Your frontend environment variables are already correct:
- `NEXT_PUBLIC_API_URL`: `https://masterly-deploy-production.up.railway.app`

## Expected Result

After updating the `CLIENT_URL` in Railway:
1. CORS errors should be resolved
2. Login and signup should work properly
3. Cookies should be set correctly
4. Authentication flow should work end-to-end

## Testing

After the update, test the connection by:
1. Going to your frontend: https://masterly-frontend.vercel.app
2. Try to sign up with a new account
3. Try to log in with existing credentials
4. Check browser console for any remaining errors

## Troubleshooting

If issues persist:
1. Check Railway logs for any deployment errors
2. Verify the environment variable was saved correctly
3. Wait 2-3 minutes for the deployment to complete
4. Clear browser cookies and try again 