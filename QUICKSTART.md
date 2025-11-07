# Quick Start Guide

## Get Started in 3 Steps

### Step 1: Start Docker Container

```bash
docker-compose up -d
```

### Step 2: Open Your Browser

Navigate to: **http://localhost:8080**

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
- Port 8080 for local access
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
├── Dockerfile                    # Docker image definition
├── docker-compose.yml            # Docker Compose setup
├── .dockerignore                 # Files to exclude from Docker
├── set-theme.php                 # Theme preference API
├── functions.php                 # (Modified) Added ThemeManager
├── css/theme.css                 # (Modified) CSS with variables
├── js/theme.js                   # (Modified) Theme management
├── views/page_template.php       # (Modified) Added selector UI
└── README.md                     # (Modified) Updated docs
```

---

## Troubleshooting

### Port 8080 Already in Use?
Edit `docker-compose.yml` and change:
```yaml
ports:
  - "8081:80"  # Use 8081 instead
```

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
