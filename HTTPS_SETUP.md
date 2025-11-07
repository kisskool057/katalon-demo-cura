# HTTPS Setup Guide

## Overview

The CURA Healthcare Service application now runs on **HTTPS (secure connection)** by default. This document explains the SSL/HTTPS setup and how to handle security certificates.

## What's Changed

### Ports
- **HTTP (Port 8090)**: Automatically redirects to HTTPS
- **HTTPS (Port 8443)**: Secure connection (default)

### SSL Certificate
- **Type**: Self-signed certificate
- **Generated**: Automatically during Docker build
- **Validity**: 365 days
- **Location in Container**: `/etc/apache2/ssl/`
  - Certificate: `server.crt`
  - Private Key: `server.key`

## Quick Access

```bash
# Start Docker
docker-compose up -d

# Access the application
https://localhost:8443

# Accept the security warning in your browser
# This is normal for self-signed certificates
```

## Browser Security Warning

When you first access `https://localhost:8443`, your browser will show a security warning. This is **normal and expected**.

### Why the Warning?

The SSL certificate is **self-signed**, meaning it was created locally and not signed by a trusted Certificate Authority (CA). Browsers show warnings for self-signed certificates to protect users in production environments.

### Is It Safe?

**Yes, it is completely safe** for development! The warning appears because:
- The certificate is created on your local machine
- It's not signed by a trusted authority
- The certificate is valid only for localhost

### How to Proceed

**Google Chrome / Chromium / Microsoft Edge:**
1. Click "Advanced" at the bottom of the warning
2. Click "Proceed to localhost (unsafe)"
3. You'll see a lock icon with a warning in the address bar

**Mozilla Firefox:**
1. Click "Advanced..."
2. Click "Accept the Risk and Continue"
3. You may see a shield icon in the address bar

**Apple Safari:**
1. Click "Show Details"
2. Click "visit this website"
3. Confirm the action

## Apache Configuration

### SSL Configuration File
Location: `apache-ssl.conf`

Key features:
```apache
SSLEngine on
SSLCertificateFile /etc/apache2/ssl/server.crt
SSLCertificateKeyFile /etc/apache2/ssl/server.key

# Security headers
Header always set Strict-Transport-Security "max-age=31536000"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
```

### HTTP to HTTPS Redirect
Location: `apache-http.conf`

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

All HTTP requests are permanently redirected (301) to HTTPS.

## Technical Details

### Certificate Generation

The Dockerfile automatically generates a self-signed certificate using OpenSSL:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/apache2/ssl/server.key \
    -out /etc/apache2/ssl/server.crt \
    -subj "/C=FR/ST=State/L=City/O=Organization/CN=localhost"
```

### Certificate Properties
- **Algorithm**: RSA 2048-bit
- **Hash**: SHA256 (default for x509)
- **Days Valid**: 365 days from build date
- **Common Name (CN)**: localhost
- **Country**: France (FR)

## For Production Deployment

⚠️ **Important**: This self-signed certificate setup is for development only!

For production, you should:

### 1. Use a Trusted Certificate Authority
Options:
- **Let's Encrypt** (free, automated)
- **DigiCert**
- **GlobalSign**
- **Sectigo**
- Others...

### 2. Update the Dockerfile

Replace the certificate generation section with your own certificate:

```dockerfile
# Copy your certificate and key from the host
COPY ./certs/server.crt /etc/apache2/ssl/server.crt
COPY ./certs/server.key /etc/apache2/ssl/server.key

# Or use certbot for Let's Encrypt
RUN apt-get update && apt-get install -y certbot python3-certbot-apache
```

### 3. Use Environment Variables

```dockerfile
ENV SSL_CERT_FILE=/etc/apache2/ssl/server.crt
ENV SSL_KEY_FILE=/etc/apache2/ssl/server.key
```

### 4. Enable HSTS

Add to Apache config:

```apache
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
```

## Troubleshooting

### Certificate Expired
**Problem**: "Certificate has expired" warning

**Solution**:
1. Rebuild the Docker image:
   ```bash
   docker-compose build --no-cache
   ```
2. Restart containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Browser Keeps Showing Warning
**Problem**: Warning persists after accepting

**Solution**:
1. Clear browser cache and SSL exceptions
2. Try a different browser to test
3. Verify the container is running: `docker-compose ps`

### Port 8443 Already in Use
**Problem**: Address already in use error

**Solution**:
Edit `docker-compose.yml`:
```yaml
ports:
  - "8090:80"
  - "8444:443"  # Use 8444 instead of 8443
```

Then access: `https://localhost:8444`

### HTTPS Not Working at All
**Problem**: Connection refused or timeout

**Solution**:
1. Check container status:
   ```bash
   docker-compose ps
   ```

2. Check logs:
   ```bash
   docker-compose logs -f web
   ```

3. Rebuild and restart:
   ```bash
   docker-compose build --no-cache
   docker-compose down
   docker-compose up -d
   ```

## API Testing with HTTPS

### cURL
```bash
# Ignore self-signed certificate warning
curl -k https://localhost:8443

# Or use --cacert if you have the certificate
curl --cacert apache-ssl.conf https://localhost:8443
```

### Postman
1. Open Postman
2. Disable SSL certificate verification:
   - Settings (gear icon)
   - General tab
   - Toggle "SSL certificate verification" OFF

### Python Requests
```python
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning

# Suppress SSL warning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# Make request
response = requests.get('https://localhost:8443', verify=False)
```

### Node.js / Axios
```javascript
const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false // Ignore self-signed certificate
});

axios.get('https://localhost:8443', { httpsAgent: agent })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

## Security Notes

### During Development
✅ Self-signed certificates are fine
✅ HTTP redirects to HTTPS
✅ Security headers are configured
✅ HSTS is enabled

### Recommendations
- Keep certificates private
- Never commit private keys to version control
- Use `.gitignore` for sensitive files
- Rotate certificates regularly

### HTTPS Headers

The application sends these security headers:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

These headers protect against common web vulnerabilities.

## Files Related to HTTPS

```
katalon-demo-cura/
├── Dockerfile              # Generates self-signed certificate
├── apache-ssl.conf         # HTTPS configuration
├── apache-http.conf        # HTTP to HTTPS redirect
├── docker-compose.yml      # Port mapping
└── HTTPS_SETUP.md          # This file
```

## Additional Resources

- [Apache SSL/TLS Documentation](https://httpd.apache.org/docs/current/ssl/)
- [Let's Encrypt](https://letsencrypt.org/)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)

## Questions?

Refer to the main documentation:
- [README.md](README.md) - Project overview
- [DOCKER_GUIDE.md](DOCKER_GUIDE.md) - Docker deployment
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
