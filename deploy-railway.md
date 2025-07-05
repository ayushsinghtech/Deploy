# 🚀 Fast Railway Deployment (5 minutes)

## Step 1: Deploy to Railway (2 minutes)
1. Open [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Click "Deploy from GitHub repo"
5. Select your repository: `Masterly-deploy`
6. **Click "Deploy"** (don't worry about root directory yet)

## Step 2: Set Root Directory (1 minute)
After Railway creates the project:
1. Go to your project dashboard
2. Click **"Settings"** tab
3. Find **"Root Directory"** or **"Source Directory"**
4. Set it to: `backend`
5. Click "Save"

## Step 3: Add Environment Variables (2 minutes)
In Railway dashboard → Variables tab, add:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/masterly
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
```

## Step 4: Get Your API URL (30 seconds)
1. Railway will give you a URL like: `https://your-app-name.railway.app`
2. Copy this URL
3. Test it: `https://your-app-name.railway.app/api/health`

## Step 5: Update Frontend (30 seconds)
Run this command with your Railway URL:
```bash
node update-api-url.js https://your-app-name.railway.app
```

## ✅ Done! Your backend is live!

### If Root Directory Option is Missing:
The `railway.json` file in the root will handle this automatically.

### Database Setup (Optional - 2 minutes)
1. Go to [mongodb.com](https://mongodb.com)
2. Create free account
3. Create cluster
4. Get connection string
5. Add to Railway environment variables 