# Render Deployment Configuration

## Environment Variables to Set in Render Dashboard:

```bash
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://amvikas18_db_user:PNLjGJT4XETA369W@cluster0.phkbyop.mongodb.net/twitter-clone?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=+onzNwvPTUwKMnpPeVI5dDW5M6gjBpbfDNoVmTirl10=
EMAIL_USER=amvikas18@gmail.com
EMAIL_PASS=dguy wnuw zntz eqfs
CLOUDINARY_CLOUD_NAME=doa2jpemw
CLOUDINARY_API_KEY=126432979522259
CLOUDINARY_API_SECRET=eo3Nt68_lW24h1Avxjw-nqFDgqI
FRONTEND_URL=https://private-social-media.onrender.com
```

## Important Notes:

1. **PORT**: Render typically uses port 10000, but your app should use `process.env.PORT`
2. **FRONTEND_URL**: Must match your actual Render URL
3. **Build Command**: `npm run build`
4. **Start Command**: `npm start`

## Debugging Steps:

1. Check Render logs for any startup errors
2. Verify all environment variables are set
3. Test the health endpoint: `https://private-social-media.onrender.com/api/health`
4. Check that the frontend build files are being served

## Common Render Issues:

1. **Build timeout**: Increase build timeout in Render settings
2. **Memory issues**: Upgrade to a paid plan if needed
3. **Environment variables**: Double-check all are set correctly
4. **Port binding**: Make sure app listens on `process.env.PORT`