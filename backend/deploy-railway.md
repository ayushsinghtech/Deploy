# 🚀 Fast Railway Deployment (5 minutes)

## Step 1: Go to Railway (1 minute)
1. Open [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"

## Step 2: Connect Repository (1 minute)
1. Click "Deploy from GitHub repo"
2. Select your repository: `Masterly-deploy`
3. Set **Root Directory** to: `backend`
4. Click "Deploy"

## Step 3: Add Environment Variables (2 minutes)
In Railway dashboard, add these variables:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/masterly
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
```

## Step 4: Get Your API URL (1 minute)
1. Railway will give you a URL like: `https://your-app-name.railway.app`
2. Copy this URL
3. Update your frontend: `frontend/lib/api.ts`

## Step 5: Update Frontend (30 seconds)
Replace in `frontend/lib/api.ts`:
```typescript
const API_BASE_URL = 'https://your-app-name.railway.app/api';
```

## ✅ Done! Your backend is live!

### Database Setup (Optional - 2 minutes)
1. Go to [mongodb.com](https://mongodb.com)
2. Create free account
3. Create cluster
4. Get connection string
5. Add to Railway environment variables

### Custom Domain (Optional - 1 minute)
1. In Railway dashboard → Settings
2. Add custom domain
3. Update DNS records 