# Deploying to Vercel

This guide explains how to deploy your Portify application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your repository pushed to GitHub, GitLab, or Bitbucket
3. A Supabase database (or PostgreSQL database with connection string)
4. An OpenAI API key

## Environment Variables

You need to configure the following environment variables in Vercel:

### Required Variables

1. **DATABASE_URL**
   - Your PostgreSQL/Supabase connection string
   - Format: `postgresql://user:password@host:port/database`
   - Get this from your Supabase project settings or database provider

2. **OPENAI_API_KEY**
   - Your OpenAI API key for AI-powered portfolio generation
   - Get from: https://platform.openai.com/api-keys
   - Format: `sk-...`

3. **SESSION_SECRET**
   - A secure random string for session encryption
   - Generate with: `openssl rand -base64 32`
   - Important: Use a strong, unique value for production

### Optional Variables

4. **NODE_ENV**
   - Set to `production` (usually set automatically by Vercel)

## Deployment Steps

### Option 1: Via Vercel Dashboard (Recommended)

1. **Import Your Repository**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your Git repository
   - Click "Import"

2. **Configure Build Settings**
   - Vercel will auto-detect the Node.js project
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add each variable listed above with their values
   - Make sure to add them for Production, Preview, and Development environments

4. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete
   - Your app will be live at `your-project.vercel.app`

### Option 2: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add OPENAI_API_KEY
   vercel env add SESSION_SECRET
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

## Database Setup

### Using Supabase

1. Create a Supabase project at https://supabase.com
2. Go to Project Settings → Database
3. Copy the connection string (URI format)
4. Add it as `DATABASE_URL` in Vercel environment variables

### Push Database Schema

Before your first deployment, ensure your database schema is up to date:

```bash
# Run locally with your DATABASE_URL
npm run db:push
```

This will create all necessary tables in your Supabase database.

## Post-Deployment

1. **Test Your Deployment**
   - Visit your Vercel URL
   - Test user registration and login
   - Create a portfolio to verify AI integration works

2. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

3. **Monitor Logs**
   - Check Vercel dashboard for deployment logs
   - Monitor function logs for any errors

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure database accepts connections from Vercel IPs
- Check if database schema is pushed (`npm run db:push`)

### OpenAI API Errors
- Verify OPENAI_API_KEY is set correctly
- Check API key has sufficient credits
- Ensure key has access to gpt-5 model

### Session Issues
- Ensure SESSION_SECRET is set
- Verify database has the `sessions` table
- Check that cookies are allowed

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify TypeScript has no errors locally

## Important Notes

- Vercel runs Express as serverless functions
- Cold starts may cause slight delays on first request
- WebSocket connections require special configuration
- File uploads should use external storage (Supabase Storage)

## Support

For issues specific to:
- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs
- **OpenAI**: https://platform.openai.com/docs
