# 🔧 Update CORS for Frontend Connection

## Current CORS Configuration:
```javascript
app.use(cors({
    origin: [
        process.env.CLIENT_URL || 'http://localhost:3000',
        'https://masterly-deploy-frontend.vercel.app',
        'https://masterly-deploy.vercel.app'
    ],
    credentials: true,
}));
```

## 🚀 Steps to Fix Connection:

### Step 1: Get Your Frontend URL
After deploying to Vercel, you'll get a URL like:
- `https://your-app-name.vercel.app`
- `https://masterly-deploy.vercel.app`
- Or your custom domain

### Step 2: Update Railway Environment Variables
In Railway dashboard → Variables, add/update:
```env
CLIENT_URL=https://your-actual-frontend-url.vercel.app
```

### Step 3: Alternative - Update CORS in Code
If you want to hardcode it, update `backend/src/app.ts`:
```javascript
app.use(cors({
    origin: [
        'https://your-actual-frontend-url.vercel.app',
        'http://localhost:3000' // for local development
    ],
    credentials: true,
}));
```

### Step 4: Redeploy Backend
Railway will auto-redeploy when you update environment variables.

## ✅ Test Connection:
1. Open browser console on your frontend
2. Try to register/login
3. Check for CORS errors in console
4. Should see successful API calls

## 🔍 Debug Steps:
1. Check browser console for CORS errors
2. Check Railway logs for connection attempts
3. Verify frontend URL is correct
4. Test backend directly: `https://masterly-deploy-production.up.railway.app/api/health` 