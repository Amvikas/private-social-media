# Email Troubleshooting Guide for Production Deployment

## Issue: Email/OTP works locally but fails after deployment

### Common Causes & Solutions:

## 1. **Gmail SMTP Blocked by Hosting Provider**

Many hosting platforms (Vercel, Netlify, Railway, etc.) block SMTP ports for security reasons.

### Solution A: Use SendGrid (Recommended)
```bash
# Add to your production environment variables:
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
```

**Setup SendGrid:**
1. Sign up at https://sendgrid.com (free tier available)
2. Create an API key
3. Use `apikey` as EMAIL_USER and your API key as EMAIL_PASS

### Solution B: Use Other Email Services
- **AWS SES**: For AWS deployments
- **Mailgun**: Good alternative to SendGrid
- **Resend**: Modern email API
- **Postmark**: Reliable transactional emails

## 2. **Environment Variables Not Set Correctly**

### Debug Steps:
1. Add temporary logging to check environment variables:
```javascript
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("NODE_ENV:", process.env.NODE_ENV);
```

2. Make sure all environment variables are set in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Railway: Variables tab
   - Heroku: Config Vars

## 3. **Gmail App Password Issues**

### Verify Gmail Setup:
1. **2-Factor Authentication**: Must be enabled
2. **App Password**: Generate a new one if needed
3. **Less Secure Apps**: This setting is deprecated, use App Password

### Generate New App Password:
1. Go to Google Account settings
2. Security → 2-Step Verification
3. App passwords → Generate new password
4. Use this 16-character password (no spaces)

## 4. **CORS and Network Issues**

### Check if your hosting platform allows SMTP:
- **Vercel**: Blocks SMTP on hobby plan
- **Netlify**: Functions can send emails
- **Railway**: Usually allows SMTP
- **Heroku**: Allows SMTP

## 5. **Frontend URL Configuration**

Make sure `FRONTEND_URL` matches your actual deployed domain:
```bash
# Wrong:
FRONTEND_URL=https://your-deployed-app.com

# Correct (examples):
FRONTEND_URL=https://my-app.vercel.app
FRONTEND_URL=https://my-app.netlify.app
FRONTEND_URL=https://my-app.railway.app
```

## 6. **Testing Email in Production**

### Method 1: Check Server Logs
Look for these messages in your deployment logs:
- "OTP email sent successfully"
- "Password reset email sent successfully" 
- "Email sending failed: [error message]"

### Method 2: Add Test Endpoint
Temporarily add this to your server for testing:
```javascript
app.get('/test-email', async (req, res) => {
  try {
    const { sendEmail } = await import('./lib/utils/emailService.js');
    const result = await sendEmail({
      to: "test@example.com",
      from: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "This is a test email from production"
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 7. **Platform-Specific Solutions**

### Vercel:
- Use API routes instead of server-side email sending
- Consider using Vercel's Edge Functions
- Use SendGrid or similar service

### Netlify:
- Use Netlify Functions for email sending
- Configure function environment variables separately

### Railway:
- Usually works with Gmail SMTP
- Check if port 587 is allowed

### Heroku:
- Works with most email services
- Consider using Heroku add-ons like SendGrid

## 8. **Alternative: Email-as-a-Service**

Consider using services like:
- **EmailJS**: Client-side email sending
- **Formspree**: Form handling with email
- **Zapier**: Email automation

## Quick Fix Checklist:

1. ✅ Verify environment variables are set correctly
2. ✅ Check server logs for specific error messages
3. ✅ Try SendGrid instead of Gmail
4. ✅ Ensure FRONTEND_URL is correct
5. ✅ Test with the `/test-email` endpoint
6. ✅ Check if hosting platform allows SMTP
7. ✅ Generate new Gmail App Password if using Gmail
8. ✅ Consider using platform-specific email solutions

## Emergency Workaround:

If email still doesn't work, you can:
1. Skip email verification for now
2. Use manual verification process
3. Implement email-free password reset (security questions, etc.)
4. Use SMS instead of email (services like Twilio)

The enhanced email configuration in the code should help resolve most common issues!