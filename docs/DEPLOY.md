# Quick Deployment

1. **Requirements**
   - Node.js 18+
   - MySQL 8.0+
   - Nginx

2. **Setup**
   ```bash
   # Copy env file
   cp .env.production .env
   # Edit .env with your values
   
   # Install deps
   npm ci --production
   
   # Build
   npm run build
   
   # Start
   npm start
   ```

3. **Nginx Config**
   ```
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **PM2 (Optional)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "otr-cable" -- start
   pm2 save
   pm2 startup
   ```

5. **SSL (Recommended)**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```
