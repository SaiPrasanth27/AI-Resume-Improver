# AI Resume Improver - Complete Deployment Guide

## Overview
This guide will help you deploy your AI Resume Improver application using:
- **Render** for the backend (Node.js/Express server)
- **Vercel** for the frontend (React application)
- **MongoDB Atlas** for the database

## Prerequisites
- GitHub account with your code pushed to a repository
- Render account (free tier available)
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)
- Groq API key (get yours free at [Groq Console](https://console.groq.com/))

## Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in or create a free account
3. Click "Create a New Cluster"
4. Choose the **FREE** tier (M0 Sandbox)
5. Select a cloud provider and region (choose closest to your users)
6. Name your cluster: `ai-resume-cluster`
7. Click "Create Cluster" (takes 1-3 minutes)

### 1.2 Configure Database Access
1. In the Atlas dashboard, click "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `ai_resume_user`
5. Generate a secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.3 Configure Network Access
1. Click "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development/testing: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's IP (Render will provide this)
5. Click "Confirm"

### 1.4 Get Connection String
1. Click "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (looks like: `mongodb+srv://ai_resume_user:<password>@ai-resume-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
6. Replace `<password>` with your actual password
7. Save this connection string - you'll need it for Render

## Step 2: Deploy Backend to Render

### 2.1 Prepare Your Repository
1. Make sure your code is pushed to GitHub
2. Ensure your `render.yaml` file is in the root directory (already created)
3. Ensure your `package.json` has the correct start script (already configured)

### 2.2 Create Render Account and Deploy
1. Go to [Render](https://render.com/)
2. Sign up/sign in with your GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select your AI Resume Improver repository
6. Configure the service:
   - **Name**: `ai-resume-improver-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.3 Set Environment Variables
In the Render dashboard, go to your service → Environment tab and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://ai_resume_user:YOUR_PASSWORD@ai-resume-cluster.xxxxx.mongodb.net/ai_resume_improver?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
GROQ_API_KEY=your-groq-api-key-here
```

**Important**: 
- Replace `YOUR_PASSWORD` with your MongoDB user password
- Replace `your-super-secret-jwt-key-here-make-it-long-and-random` with a secure random string
- The `PORT=10000` is required by Render

### 2.4 Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your backend
3. Wait for deployment to complete (5-10 minutes)
4. Your backend URL will be: `https://ai-resume-improver-backend.onrender.com`

## Step 3: Deploy Frontend to Vercel

### 3.1 Update Production Environment
1. Update `client/.env.production` with your actual Render backend URL:
```
REACT_APP_API_URL=https://ai-resume-improver-backend.onrender.com
```

### 3.2 Create Vercel Account and Deploy
1. Go to [Vercel](https://vercel.com/)
2. Sign up/sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Create React App (should auto-detect)
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.3 Set Environment Variables
In Vercel project settings → Environment Variables, add:
```
REACT_APP_API_URL=https://ai-resume-improver-backend.onrender.com
```

### 3.4 Deploy
1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Your frontend URL will be: `https://your-project-name.vercel.app`

## Step 4: Test Your Deployment

### 4.1 Test Backend
1. Visit: `https://ai-resume-improver-backend.onrender.com/api/health`
2. You should see: `{"status":"ok","mongodb":"connected","timestamp":"..."}`

### 4.2 Test Frontend
1. Visit your Vercel URL
2. Try to register a new account
3. Try to log in
4. Upload a PDF resume and test the AI improvement feature

## Step 5: Custom Domain (Optional)

### 5.1 For Frontend (Vercel)
1. In Vercel project settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

### 5.2 For Backend (Render)
1. In Render service settings → Custom Domains
2. Add your custom domain
3. Follow Render's DNS configuration instructions

## Troubleshooting

### Common Issues

**Backend not connecting to MongoDB:**
- Check your MongoDB Atlas IP whitelist
- Verify your connection string and password
- Check Render logs for specific error messages

**Frontend can't reach backend:**
- Verify `REACT_APP_API_URL` environment variable
- Check browser network tab for CORS errors
- Ensure backend is deployed and running

**Groq API errors:**
- Verify your API key is correct
- Check Groq API usage limits
- Monitor backend logs for API response errors

### Checking Logs

**Render Backend Logs:**
1. Go to your Render service dashboard
2. Click "Logs" tab
3. Monitor real-time logs for errors

**Vercel Frontend Logs:**
1. Go to your Vercel project dashboard
2. Click "Functions" tab for serverless function logs
3. Check browser console for client-side errors

## Production Considerations

### Security
- Use strong JWT secrets
- Implement rate limiting (already configured)
- Use HTTPS only (automatically handled by Render/Vercel)
- Regularly rotate API keys

### Performance
- Monitor Render service metrics
- Consider upgrading to paid plans for better performance
- Implement caching strategies if needed

### Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor API usage and costs
- Set up error tracking (Sentry)

## Cost Breakdown (Free Tiers)

- **MongoDB Atlas**: Free (M0 cluster, 512MB storage)
- **Render**: Free (750 hours/month, sleeps after 15min inactivity)
- **Vercel**: Free (100GB bandwidth, unlimited static sites)
- **Groq API**: Free tier available (check current limits)

**Total Monthly Cost**: $0 (within free tier limits)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review service logs for specific error messages
3. Verify all environment variables are set correctly
4. Test each component individually (database, backend, frontend)

Your AI Resume Improver is now deployed and ready for production use! 🚀