# Backend Deployment Guide

## 🚀 Railway Deployment (Recommended)

### Why Railway?
- **Free tier**: $5/month credit (effectively free for small projects)
- **Low latency**: Global CDN and edge locations
- **Persistent storage**: Perfect for MongoDB
- **No cold starts**: Unlike serverless platforms
- **Easy deployment**: Git-based deployment

### Step-by-Step Deployment

#### 1. Prepare Your Repository
```bash
# Ensure your backend folder is in the root of your repository
# Your structure should look like:
# ├── backend/
# │   ├── src/
# │   ├── package.json
# │   ├── railway.json
# │   └── ...
# └── frontend/
```

#### 2. Set Up Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

#### 3. Deploy Your Backend
1. **Connect Repository**: Click "Deploy from GitHub repo"
2. **Select Repository**: Choose your repository
3. **Set Root Directory**: Set to `backend` (since your backend is in a subfolder)
4. **Deploy**: Railway will automatically detect Node.js and build your app

#### 4. Configure Environment Variables
In Railway dashboard, add these environment variables:

```env
# Database (Use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret (Generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
NODE_ENV=production
PORT=5000

# Client URLs (Update with your frontend URLs)
CLIENT_URL=https://your-frontend-domain.vercel.app

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI (if using AI features)
OPENAI_API_KEY=your-openai-api-key
```

#### 5. Set Up Custom Domain (Optional)
1. Go to your Railway project settings
2. Add custom domain
3. Update DNS records as instructed
4. Railway provides free SSL certificates

#### 6. Update Frontend API URL
Update your frontend's API configuration:

```typescript
// frontend/lib/api.ts
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-app.railway.app') + '/api';
```

### Database Setup

#### Option 1: MongoDB Atlas (Recommended)
1. Create free account at [mongodb.com](https://mongodb.com)
2. Create a cluster (free tier available)
3. Get connection string
4. Add to Railway environment variables

#### Option 2: Railway MongoDB Plugin
1. In Railway dashboard, add MongoDB plugin
2. Railway will automatically provide connection string
3. Add to environment variables

### Monitoring & Logs
- **Logs**: View real-time logs in Railway dashboard
- **Metrics**: Monitor CPU, memory, and network usage
- **Health Checks**: Railway automatically checks `/api/health` endpoint

### Scaling (When Needed)
- **Free tier**: $5/month credit
- **Paid plans**: Start at $5/month for additional resources
- **Auto-scaling**: Available on paid plans

## 🔄 Alternative: Render Deployment

### Why Render?
- **Free tier**: 750 hours/month (enough for 24/7)
- **Low latency**: Global edge network
- **PostgreSQL**: Free database included

### Render Setup
1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create new Web Service
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Add environment variables

## 🐳 Alternative: Fly.io Deployment

### Why Fly.io?
- **Free tier**: 3 shared-cpu VMs, 3GB storage
- **Global deployment**: Deploy close to users
- **Docker-based**: More control

### Fly.io Setup
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Deploy: `fly launch`
4. Scale: `fly scale count 1`

## 🚨 Important Notes

### Security
- Use strong JWT secrets
- Enable CORS properly
- Use HTTPS in production
- Secure your MongoDB connection

### Performance
- Railway provides good performance out of the box
- Monitor your app's resource usage
- Consider caching for heavy operations

### Cost Optimization
- Start with free tier
- Monitor usage in Railway dashboard
- Upgrade only when needed

## 🔧 Troubleshooting

### Common Issues
1. **Build fails**: Check `package.json` scripts
2. **Database connection**: Verify MongoDB URI
3. **CORS errors**: Update CLIENT_URL in environment
4. **Port issues**: Railway sets PORT automatically

### Debug Commands
```bash
# Check Railway logs
railway logs

# Check Railway status
railway status

# View environment variables
railway variables
```

## 📞 Support
- Railway: [docs.railway.app](https://docs.railway.app)
- Render: [render.com/docs](https://render.com/docs)
- Fly.io: [fly.io/docs](https://fly.io/docs) 