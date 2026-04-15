# Quick Deployment

## HostGator (static site, same account as Rawls / Cresium)

After clone, add remotes (same URL pattern as your other `~/repos/*.git` projects):

```bash
git remote add hostgator ssh://agmsxxte@50.6.160.176:2222/home2/agmsxxte/repos/otrcable.git
git remote add production ssh://agmsxxte@otrcable.com/home2/agmsxxte/repos/otrcable.git
```

Deploy from Git Bash / WSL: `./deploy.sh` (pushes `origin`, `hostgator`, `production`, then checks out into `~/otrcable.com`). Point **otrcable.com** document root at `/home2/agmsxxte/otrcable.com` in cPanel.

---

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
