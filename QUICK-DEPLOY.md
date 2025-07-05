# 🚀 Quick Railway Deployment (Fixed)

## ✅ Fixed Configuration Files Created:

1. **`railway.json`** - Railway configuration
2. **`build.sh`** - Build and start script
3. **`Procfile`** - Alternative start command
4. **`.railwayignore`** - Exclude unnecessary files

## 🎯 Simple Steps:

### Step 1: Deploy (2 minutes)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository: `Masterly-deploy`
5. Click "Deploy"

### Step 2: Add Environment Variables (2 minutes)
In Railway dashboard → Variables tab, add:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/masterly
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Step 3: Get Your URL (30 seconds)
1. Railway will give you: `https://your-app.railway.app`
2. Test: `https://your-app.railway.app/api/health`

### Step 4: Update Frontend (30 seconds)
```bash
node update-api-url.js https://your-app.railway.app
```

## ✅ Done! Your backend is live!

### What the Build Script Does:
1. Navigates to `backend/` directory
2. Installs dependencies with `npm install`
3. Builds TypeScript with `npm run build`
4. Starts the server with `npm start`

### If You Still Get Errors:
1. Check Railway logs for specific error messages
2. Make sure all environment variables are set
3. Verify MongoDB connection string is correct 