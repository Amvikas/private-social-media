# Deployment Checklist for Reset Password & OTP Functionality

## Issues Fixed in This Update:

1. ✅ **Hardcoded Localhost URL**: Replaced `http://192.168.1.10:3000` with dynamic URL based on environment
2. ✅ **Environment Variables**: Added `FRONTEND_URL` for production deployment
3. ✅ **CORS Configuration**: Added proper CORS setup for production
4. ✅ **Logging**: Added console logging for debugging email issues

## Deployment Steps:

### 1. Environment Configuration
- Copy `.env.production` to your hosting platform
- Set `NODE_ENV=production`
- **CRITICAL**: Update `FRONTEND_URL` with your actual deployed domain
  ```
  # Examples:
  FRONTEND_URL=https://your-app.vercel.app
  FRONTEND_URL=https://your-app.netlify.app  
  FRONTEND_URL=https://your-app.herokuapp.com
  ```

### 2. For Different Hosting Platforms:

#### Vercel:
```bash
# Add environment variables in Vercel dashboard
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
MONGO_URI=mongodb+srv://...
EMAIL_USER=amvikas18@gmail.com
EMAIL_PASS=dguy wnuw zntz eqfs
JWT_SECRET=+onzNwvPTUwKMnpPeVI5dDW5M6gjBpbfDNoVmTirl10=
CLOUDINARY_CLOUD_NAME=doa2jpemw
CLOUDINARY_API_KEY=126432979522259
CLOUDINARY_API_SECRET=eo3Nt68_lW24h1Avxjw-nqFDgqI
```

#### Netlify:
```bash
# Add in Netlify environment variables
NODE_ENV=production
FRONTEND_URL=https://your-app.netlify.app
# ... other variables
```

#### Railway/Render/Heroku:
```bash
# Use their respective environment variable setup
NODE_ENV=production  
FRONTEND_URL=https://your-app.railway.app
# ... other variables
```

### 3. Common Email Issues in Production:

#### Gmail Authentication:
- ✅ **App Password**: Make sure you're using Gmail App Password, not regular password
- ✅ **2FA**: Enable 2-Factor Authentication on Gmail account
- ✅ **Less Secure Apps**: This setting is deprecated, use App Password instead

#### Alternative Email Services:
If Gmail doesn't work in production, consider:
- **SendGrid**: More reliable for production
- **Nodemailer with AWS SES**
- **Resend**: Modern email API

### 4. Testing in Production:

1. **Test Reset Password Flow**:
   - Go to login page
   - Click "Forgot password?"
   - Enter email
   - Check email for reset link
   - Verify the link contains your production domain

2. **Test OTP Flow**:
   - Go to signup page
   - Enter email and click "Send OTP"
   - Check email for OTP code
   - Verify OTP works

3. **Check Logs**:
   - Monitor server logs for email sending confirmations
   - Look for "OTP email sent successfully" and "Password reset email sent successfully"

### 5. Debugging Production Issues:

If emails still don't work:

1. **Check Server Logs**:
   ```bash
   # Look for these log messages:
   # "OTP request for email: user@example.com"
   # "OTP email sent successfully to: user@example.com"
   # "Forgot password request for email: user@example.com"
   # "Password reset email sent successfully to: user@example.com"
   ```

2. **Verify Environment Variables**:
   ```bash
   # In your server console, temporarily log:
   console.log("EMAIL_USER:", process.env.EMAIL_USER);
   console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
   console.log("NODE_ENV:", process.env.NODE_ENV);
   ```

3. **Test Email Configuration**:
   ```javascript
   // Add this test endpoint temporarily:
   app.get('/test-email', async (req, res) => {
     try {
       const transporter = nodemailer.createTransporter({
         service: "gmail",
         auth: {
           user: process.env.EMAIL_USER,
           pass: process.env.EMAIL_PASS,
         },
       });
       
       await transporter.sendMail({
         to: "test@example.com",
         from: process.env.EMAIL_USER,
         subject: "Test Email",
         text: "This is a test email",
       });
       
       res.json({ message: "Test email sent successfully" });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```

## Quick Fix Summary:

The main issue was the hardcoded localhost URL in the reset password email. Now:

1. **Development**: Uses `http://localhost:3000`
2. **Production**: Uses `process.env.FRONTEND_URL`
3. **CORS**: Properly configured for both environments
4. **Logging**: Added for debugging

Make sure to update `FRONTEND_URL` with your actual deployed domain!