# CompCleared Production Deployment Guide

Complete step-by-step guide to deploy CompCleared with authentication and payments.

---

## 🎯 Prerequisites

Before starting, create accounts on:
1. **Stripe** (stripe.com) - For payments
2. **Railway** (railway.app) - For backend hosting
3. **Vercel** (vercel.com) - For frontend hosting
4. **GitHub** account connected to your repo

---

## Part 1: Stripe Setup (15 minutes)

### Step 1: Create Stripe Products

1. Go to **dashboard.stripe.com**
2. Click **Products** → **+ Add Product**
3. Create 3 products:

**Product 1: Starter**
- Name: `CompCleared Starter`
- Description: `For companies with 1-50 employees`
- Pricing: `$49.00 USD` - Recurring monthly
- Click **Save product**
- **Copy the Price ID** (starts with `price_...`) - you'll need this

**Product 2: Professional**
- Name: `CompCleared Professional`
- Description: `For companies with 51-200 employees`
- Pricing: `$99.00 USD` - Recurring monthly
- Click **Save product**
- **Copy the Price ID**

**Product 3: Enterprise**
- Name: `CompCleared Enterprise`
- Description: `For companies with 201+ employees`
- Pricing: `$199.00 USD` - Recurring monthly
- Click **Save product**
- **Copy the Price ID**

### Step 2: Get Stripe API Keys

1. Go to **Developers** → **API Keys**
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. Click **Reveal test key** and copy **Secret key** (starts with `sk_test_...`)
4. Save these keys - you'll need them for Railway and Vercel

### Step 3: Set Up Webhook (For Production)

1. Go to **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. Endpoint URL: `https://YOUR-RAILWAY-URL.railway.app/api/webhook` (you'll update this after Railway deployment)
4. Listen to events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. **Copy the Signing secret** (starts with `whsec_...`)

---

## Part 2: Deploy Backend to Railway (10 minutes)

### Step 1: Push Code to GitHub

```bash
cd /Users/connorimpey/Desktop/compcleared_app
git add .
git commit -m "Add authentication and Stripe integration"
git push origin main
```

### Step 2: Deploy to Railway

1. Go to **railway.app**
2. Click **New Project** → **Deploy from GitHub repo**
3. Select **jawstitcher/compcleared_app**
4. Railway auto-detects Python app
5. Click **Deploy**

### Step 3: Configure Environment Variables

1. In Railway project, go to **Variables** tab
2. Add these environment variables:

```
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
SECRET_KEY=your-random-secret-key-here
STRIPE_PRICE_STARTER=price_YOUR_STARTER_ID
STRIPE_PRICE_PROFESSIONAL=price_YOUR_PROFESSIONAL_ID
STRIPE_PRICE_ENTERPRISE=price_YOUR_ENTERPRISE_ID
FRONTEND_URL=https://compcleared-app.vercel.app
PORT=5000
```

**Generate SECRET_KEY**: Run this locally and copy the output:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

4. Click **Deploy** to redeploy with new variables

### Step 4: Get Railway URL

1. Go to **Settings** tab
2. Under **Domains**, click **Generate Domain**
3. **Copy your Railway URL** (e.g., `https://compcleared-production.up.railway.app`)
4. Save this - you'll need it for Vercel

### Step 5: Update Stripe Webhook URL

1. Go back to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click on your webhook
3. Update endpoint URL to: `https://YOUR-RAILWAY-URL.railway.app/api/webhook`
4. Save

---

## Part 3: Deploy Frontend to Vercel (10 minutes)

### Step 1: Update vercel.json

Edit `vercel.json` and replace the Railway URL:

```json
{
    "version": 2,
    "builds": [
        {
            "src": "package.json",
            "use": "@vercel/static-build",
            "config": {
                "distDir": "build"
            }
        }
    ],
    "routes": [
        {
            "src": "/api/(.*)",
            "dest": "https://YOUR-RAILWAY-URL.railway.app/api/$1"
        },
        {
            "src": "/(.*)",
            "dest": "/$1"
        }
    ]
}
```

### Step 2: Commit Changes

```bash
git add vercel.json
git commit -m "Update backend URL for production"
git push origin main
```

### Step 3: Deploy to Vercel

1. Go to **vercel.com**
2. Click **Add New** → **Project**
3. Import **jawstitcher/compcleared_app**
4. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

###Step 4: Add Environment Variables

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
REACT_APP_API_URL=https://YOUR-RAILWAY-URL.railway.app
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

3. Click **Deploy**

### Step 5: Get Vercel URL

After deployment completes:
- Your app will be live at `https://compcleared-app.vercel.app` (or similar)
- **Copy this URL**

---

## Part 4: Update CORS Settings

1. Go back to Railway
2. Update `FRONTEND_URL` environment variable to your Vercel URL
3. Redeploy

---

## Part 5: Connect Custom Domain (Optional)

### For Vercel (Frontend)

1. In Vercel project → **Settings** → **Domains**
2. Add `compcleared.com`
3. Follow DNS instructions to point domain to Vercel

---

## Part 6: Test Everything

### Test Signup Flow

1. Go to your Vercel URL
2. Click **Sign Up**
3. Fill in company info
4. Select a tier
5. Click **Continue to Payment**
6. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
7. Complete payment
8. Create your account
9. Verify you land on dashboard

### Test Login

1. Log out
2. Try logging in with your email/password
3. Verify you can see dashboard

### Test Incident Logging

1. Click **Log Incident**
2. Fill out form
3. Submit
4. Check dashboard for the incident

---

## 🎉 You're Live!

Your production URLs:
- **Frontend**: `https://compcleared-app.vercel.app` (or your custom domain)
- **Backend**: `https://your-app.railway.app`
- **Stripe Dashboard**: `https://dashboard.stripe.com`

---

## 💰 Costs

- **Railway**: $5/month (500 hours free, then pay-as-you-go)
- **Vercel**: FREE for this project
- **Stripe**: 2.9% + $0.30 per transaction

**Total fixed cost**: ~$5/month until you have paying customers

---

## 🔐 Going Live with Real Payments

When ready to accept real money:

1. **Activate Stripe Account**:
   - Complete business verification in Stripe
   - Switch from Test to Live mode
   
2. **Update API Keys**:
   - In Railway: Replace `sk_test_...` with `sk_live_...`
   - In Vercel: Replace `pk_test_...` with `pk_live_...`
   
3. **Recreate Products** in Live mode with same prices
4. **Update Price IDs** in Railway environment variables
5. **Test with real card** (or refund it immediately)

---

## 📊 Monitor Your App

- **Railway Logs**: Check backend errors/requests
- **Vercel Analytics**: See frontend traffic
- **Stripe Dashboard**: Track subscriptions and revenue

---

## Need Help?

Common issues:

**"Authentication required" error**
- Check CORS settings in backend
- Verify `FRONTEND_URL` matches Vercel URL

**Stripe checkout not working**
- Verify Price IDs are correct
- Check Railway logs for errors

**Can't log in**
- Clear browser cookies
- Check backend is running on Railway

---

## Next Steps

1. ✅ Test with colleagues
2. ✅ Get first paying customer
3. ✅ Activate Stripe account
4. ✅ Switch to live mode
5. ✅ Start marketing!
