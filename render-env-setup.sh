#!/bin/bash
# Render Environment Variables Setup
# Copy each line and paste as KEY=VALUE in Render dashboard

echo "=== RENDER ENVIRONMENT VARIABLES ==="
echo ""
echo "NODE_ENV=production"
echo "PORT=10000"
echo "MONGO_URI=mongodb+srv://amvikas18_db_user:PNLjGJT4XETA369W@cluster0.phkbyop.mongodb.net/twitter-clone?retryWrites=true&w=majority&appName=Cluster0"
echo "JWT_SECRET=+onzNwvPTUwKMnpPeVI5dDW5M6gjBpbfDNoVmTirl10="
echo "EMAIL_USER=amvikas18@gmail.com"
echo "EMAIL_PASS=dguy wnuw zntz eqfs"
echo "CLOUDINARY_CLOUD_NAME=doa2jpemw"
echo "CLOUDINARY_API_KEY=126432979522259"
echo "CLOUDINARY_API_SECRET=eo3Nt68_lW24h1Avxjw-nqFDgqI"
echo "FRONTEND_URL=https://private-social-media.onrender.com"
echo ""
echo "=== INSTRUCTIONS ==="
echo "1. Go to https://render.com"
echo "2. Select your private-social-media service"
echo "3. Click 'Environment' tab"
echo "4. Add each variable above as Key=Value"
echo "5. Click 'Save Changes'"
echo "6. Redeploy your service"