# Netlify Deployment Guide

Your project is now ready to deploy to Netlify! Follow these steps:

## Prerequisites
- A GitHub account (or GitLab/Bitbucket)
- A Netlify account (free at https://netlify.com)

## Step 1: Push to Git Repository

1. Make sure all your changes are committed:
```bash
git add .
git commit -m "Prepare for Netlify deployment"
```

2. Push to your remote repository:
```bash
git push origin main
```

## Step 2: Deploy on Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your `lan-bag` repository
5. Configure build settings:
   - **Build command:** (leave empty or use `echo "No build needed"`)
   - **Publish directory:** `public`
   - **Functions directory:** `netlify/functions` (should auto-detect)
6. Click "Deploy site"

### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize and deploy:
```bash
netlify init
```

Follow the prompts to link your site.

4. Deploy:
```bash
netlify deploy --prod
```

## What Was Changed

1. **Created Netlify Function** (`netlify/functions/send.js`):
   - Converted Express `/api/send` endpoint to a serverless function
   - Handles form submissions and forwards to your Make.com webhook

2. **Created `netlify.toml`**:
   - Configures Netlify to serve files from the `public` directory
   - Redirects `/api/*` requests to serverless functions

3. **Updated `.gitignore`**:
   - Added Netlify-specific entries

## How It Works

- Static files (HTML, CSS, images) are served directly from the `public` folder
- API requests to `/api/send` are automatically routed to `/.netlify/functions/send`
- The Netlify function handles the webhook integration with Make.com

## Testing Locally with Netlify Dev

You can test the Netlify environment locally:

```bash
npm install -g netlify-cli
netlify dev
```

This will start a local development server that mimics the Netlify environment.

## Your Site URL

After deployment, Netlify will provide a URL like:
`https://your-site-name.netlify.app`

You can customize this in the Netlify dashboard under Site settings → Domain management.

## Troubleshooting

- If the form doesn't work, check the Netlify Functions logs in the dashboard
- Make sure the webhook URL in `netlify/functions/send.js` is correct
- Check that your site is deployed from the correct branch (usually `main`)
