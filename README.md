# JAIN University – Spot Counselling 2026
## Deployment Guide
**URL:** https://spotcounselling.jainuniversity.co.in

---

## 📁 File Structure

```
spotcounselling/
├── index.html           ← Main landing page
├── registration.html    ← Registration form
├── 404.html             ← Custom error page (create one)
├── .htaccess            ← Apache: SSL redirect + security headers
├── nginx.conf           ← Nginx: SSL + security config (if using Nginx)
├── assets/
│   └── Jain-logo.png    ← University logo
├── css/
│   └── style.css        ← All shared styles
└── js/
    ├── main.js           ← Shared JS (nav, FAQ, filters, WhatsApp, cookies)
    └── registration.js   ← Registration form logic + validation
```

---

## 🚀 Hosting Options

### Option A — cPanel Shared Hosting (most common)
1. Log in to cPanel → **File Manager**
2. Navigate to `public_html/` (or the subdomain folder)
3. Upload all files maintaining the folder structure above
4. SSL is usually **free** via cPanel → **Let's Encrypt SSL** (AutoSSL)
5. The `.htaccess` automatically handles HTTPS redirect

### Option B — Any Linux VPS (Apache)
```bash
# Upload files
scp -r spotcounselling/* user@yourserver:/var/www/spotcounselling/

# Apache virtual host
sudo nano /etc/apache2/sites-available/spotcounselling.conf
```
```apache
<VirtualHost *:80>
    ServerName spotcounselling.jainuniversity.co.in
    Redirect permanent / https://spotcounselling.jainuniversity.co.in/
</VirtualHost>
<VirtualHost *:443>
    ServerName spotcounselling.jainuniversity.co.in
    DocumentRoot /var/www/spotcounselling
    SSLEngine on
    SSLCertificateFile    /etc/ssl/spotcounselling/fullchain.pem
    SSLCertificateKeyFile /etc/ssl/spotcounselling/privkey.pem
    <Directory /var/www/spotcounselling>
        AllowOverride All
        Options -Indexes
        Require all granted
    </Directory>
</VirtualHost>
```
```bash
sudo a2ensite spotcounselling
sudo a2enmod rewrite ssl headers deflate expires
sudo systemctl reload apache2
```

### Option C — Nginx VPS
```bash
sudo cp nginx.conf /etc/nginx/sites-available/spotcounselling
sudo ln -s /etc/nginx/sites-available/spotcounselling /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Option D — Static Hosting (Netlify / Vercel / Cloudflare Pages)
1. Drag-and-drop the `spotcounselling/` folder into Netlify
2. Set custom domain: `spotcounselling.jainuniversity.co.in`
3. SSL is automatic and free
4. Add these headers in **netlify.toml**:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

---

## 🔒 SSL Certificate (Free via Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache   # For Apache
sudo apt install certbot python3-certbot-nginx    # For Nginx

# Get certificate
sudo certbot --apache -d spotcounselling.jainuniversity.co.in
# OR
sudo certbot --nginx  -d spotcounselling.jainuniversity.co.in

# Auto-renewal (cron)
sudo crontab -e
# Add: 0 3 * * * certbot renew --quiet
```

---

## 🔧 DNS Configuration
Add this DNS record in your domain registrar / DNS panel:

| Type  | Host                         | Value          | TTL  |
|-------|------------------------------|----------------|------|
| CNAME | spotcounselling              | @server-IP-or  | 300s |
|   A   | spotcounselling              | YOUR.SERVER.IP | 300s |

---

## ✅ Security Checklist (Post-Deploy)
- [ ] HTTPS working (green padlock)
- [ ] HTTP → HTTPS redirect working
- [ ] Run: https://securityheaders.com — target grade **A**
- [ ] Run: https://www.ssllabs.com/ssltest/ — target grade **A+**
- [ ] Enable HSTS header (uncomment in .htaccess / nginx.conf **only after** SSL confirmed)
- [ ] Test form validation works
- [ ] Test WhatsApp button links to correct number (+917337618222)
- [ ] Confirm city filter and course tabs work
- [ ] Mobile responsive test on iOS + Android

---

## 📞 Support Contacts
- Admissions: +91 73376 18222
- Email: admissions@jainuniversity.ac.in
- Main site: https://www.jainuniversity.ac.in
