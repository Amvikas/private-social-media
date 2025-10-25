# Free Tier Email Solutions for Render

## The Problem
Render's free tier blocks SMTP connections (ports 25, 587, 465), which prevents Gmail and other SMTP services from working.

## Solutions

### Option 1: Upgrade to Render Paid Plan ($7/month)
- **Pros:** Immediate fix, full SMTP support
- **Cons:** Costs money
- Go to Render dashboard → Billing → Upgrade plan

### Option 2: Use Free Email API Services

#### A. Resend (Recommended)
**Free Tier:** 100 emails/month, 3,000 emails/month for first year

1. **Sign up:** https://resend.com
2. **Get API key:** Dashboard → API Keys → Create
3. **Add to Render environment variables:**
   ```
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=noreply@resend.dev
   ```

#### B. EmailJS 
**Free Tier:** 200 emails/month

1. **Sign up:** https://www.emailjs.com
2. **Create service:** Dashboard → Email Services → Add Service
3. **Create template:** Dashboard → Email Templates → Create Template
4. **Add to Render environment variables:**
   ```
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id  
   EMAILJS_PUBLIC_KEY=your_public_key
   ```

### Option 3: Use Development Mode
For testing, the app will show the OTP/reset token in the console when emails fail.

## Current Implementation
The app now tries multiple email services in order:
1. **Resend API** (if `RESEND_API_KEY` is set)
2. **EmailJS API** (if `EMAILJS_SERVICE_ID` is set)  
3. **Gmail SMTP** (will fail on Render free tier)
4. **Graceful fallback** (saves to database, shows in development console)

## Quick Setup Instructions

### For Resend (Easiest):
1. Go to https://resend.com
2. Sign up with your email
3. Go to API Keys → Create API Key
4. Copy the key (starts with `re_`)
5. Add to Render environment variables:
   - `RESEND_API_KEY=re_your_key_here`
   - `RESEND_FROM_EMAIL=onboarding@resend.dev`

### Test Your Setup:
1. Deploy to Render with new environment variables
2. Try password reset or OTP
3. Check Render logs for success/failure messages

## Benefits of API-based Email:
✅ Works on all free hosting tiers  
✅ Better deliverability than SMTP  
✅ Built-in analytics and tracking  
✅ No firewall issues  
✅ Faster sending  

Your app will work perfectly once you set up one of these free email services!