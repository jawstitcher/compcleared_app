# CompCleared - Quick Start Guide

## 🚀 Ready to Deploy?

Your app now has:
- ✅ Stripe payment integration
- ✅ User authentication (signup/login)
- ✅ Subscription management
- ✅ Protected routes

---

## 📋 What You Need

1. **Stripe Account** (stripe.com)
   - Create 3 subscription products
   - Get API keys
   
2. **Railway Account** (railway.app)
   - For backend hosting
   
3. **Vercel Account** (vercel.com)
   - For frontend hosting

---

## ⚡ Quick Deploy Steps

### 1. Set Up Stripe (15 min)

Create products in Stripe Dashboard:
- **Starter**: $49/month
- **Professional**: $99/month
- **Enterprise**: $199/month

Copy the Price IDs (starts with `price_...`)

### 2. Deploy Backend (Railway)

```bash
# Push code
git add .
git commit -m "Production ready"
git push origin main
```

Then:
1. Connect GitHub repo to Railway
2. Add environment variables (see DEPLOYMENT.md)
3. Deploy
4. Copy your Railway URL

### 3. Deploy Frontend (Vercel)

1. Update `vercel.json` with Railway URL
2. Push to GitHub
3. Import repo in Vercel
4. Add environment variables
5. Deploy

### 4. Test

Use Stripe test card:
- Number: `4242 4242 4242 4242`
- Date: Any future date
- CVC: Any 3 digits

---

## 📖 Full Guide

See [DEPLOYMENT.md](file:///Users/connorimpey/Desktop/compcleared_app/DEPLOYMENT.md) for detailed step-by-step instructions.

---

## 💳 Pricing Tiers

| Tier | Price | Employees |
|------|-------|-----------|
| Starter | $49/mo | 1-50 |
| Professional | $99/mo | 51-200 |
| Enterprise | $199/mo | 201+ |

---

## 🔧 Local Development

The app is currently running locally with placeholders.

To test locally (optional):
1. Get Stripe test API keys
2. Update `.env` files with real test keys
3. Restart backend: `python3 app.py`
4. Restart frontend: `npm start`
5 Use test card to complete signup

**Note:** You can skip local testing and deploy directly!

---

## 📁 Important Files

- `DEPLOYMENT.md` - Complete deployment guide
- `backend/.env.example` - Backend environment template
- `.env.example` - Frontend environment template
- `backend/app.py` - Backend with auth + Stripe
- `src/components/Signup.js` - Signup flow
- `src/components/Login.js` - Login page

---

## 🆘 Need Help?

Common questions:

**Do I need a Stripe account before deploying?**
- Yes, you need Stripe API keys and Price IDs

**Can I test locally first?**
- Yes, but not required. You can deploy directly with test keys

**How long does deployment take?**
- ~30-40 minutes total (including Stripe setup)

**What if I don't have compcleared.com set up?**
- No problem! Vercel gives you a free subdomain

---

## ✅ Ready?

When you're ready to deploy, follow these docs in order:

1. Read [DEPLOYMENT.md](file:///Users/connorimpey/Desktop/compcleared_app/DEPLOYMENT.md)
2. Set up Stripe products
3. Deploy to Railway
4. Deploy to Vercel
5. Test with Stripe test card
6. Go live!
