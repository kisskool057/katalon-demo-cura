# Quick Start Guide

## Get Started in 3 Steps

### Step 1: Start Docker Container

```bash
docker-compose up -d
```

### Step 2: Open Your Browser

Navigate to: **https://localhost:8443**

**Note**: You'll see a security warning about the self-signed certificate - this is normal. Click "Advanced" → "Proceed to localhost" (Chrome/Edge) or "Accept the Risk and Continue" (Firefox).

### Step 3: Test the Theme Feature

1. Click the **hamburger menu** (≡) in the top-right corner
2. Scroll down to the **Theme** section
3. Select between:
   - **Light** - Bright interface
   - **Dark** - Dark mode
   - **System** - Follows your OS dark mode setting

---

## What's New

### 🎨 Theme Switching
- Three theme options: Light, Dark, System
- Smooth transitions between themes
- Automatic persistence during your session
- Respects system dark mode preference

### 🐳 Docker Support
- One-command deployment
- Development-ready with live code reloading
- HTTPS support with self-signed certificate
- Port 8090 (HTTP, auto-redirects to HTTPS)
- Port 8443 (HTTPS, secure connection)
- Apache with mod_rewrite enabled

---

## Common Tasks

### Stop the Application
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f web
```

### Rebuild the Container
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Access Container Shell
```bash
docker-compose exec web bash
```

---

## File Structure

```
katalon-demo-cura/
├── Dockerfile                    # Docker image definition (with SSL)
├── docker-compose.yml            # Docker Compose setup
├── .dockerignore                 # Files to exclude from Docker
├── apache-ssl.conf               # Apache HTTPS configuration
├── apache-http.conf              # Apache HTTP configuration
├── set-theme.php                 # Theme preference API
├── functions.php                 # (Modified) Added ThemeManager
├── css/theme.css                 # (Modified) CSS with variables
├── js/theme.js                   # (Modified) Theme management
├── views/page_template.php       # (Modified) Added selector UI
└── README.md                     # (Modified) Updated docs
```

---

## Troubleshooting

### Browser Shows Security Warning?
This is expected with self-signed certificates. The browser is warning you because the certificate was created locally, not signed by a certificate authority. This is safe for development.

**Chrome/Edge**: Click "Advanced" → "Proceed to localhost"
**Firefox**: Click "Accept the Risk and Continue"

### Port 8090 or 8443 Already in Use?
Edit `docker-compose.yml` and change the ports:
```yaml
ports:
  - "8091:80"   # Use 8091 instead of 8090
  - "8444:443"  # Use 8444 instead of 8443
```

Then access: `https://localhost:8444`

### Container won't start?
Check logs:
```bash
docker-compose logs web
```

### Changes not showing up?
The volume is auto-synced, but refresh your browser (Ctrl+R or Cmd+R)

---

## Testing Checklist

- [ ] Docker container starts: `docker-compose up -d`
- [ ] Application loads: http://localhost:8080
- [ ] Hamburger menu opens
- [ ] Theme selector visible in sidebar
- [ ] Light theme works
- [ ] Dark theme works
- [ ] System theme works
- [ ] Theme persists on page reload

---

## Documentation Files

- **README.md** - Features and Docker overview
- **DOCKER_GUIDE.md** - Detailed Docker documentation
- **CHANGES.md** - Technical details of modifications
- **QUICKSTART.md** - This file

---

## Need Help?

Check these files for more information:
1. [README.md](README.md) - Feature overview
2. [DOCKER_GUIDE.md](DOCKER_GUIDE.md) - Docker troubleshooting
3. [CHANGES.md](CHANGES.md) - Technical implementation details

---

**Happy coding!** 🚀
