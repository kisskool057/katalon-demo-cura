# Docker Deployment Guide

## Overview

This guide explains how to deploy the CURA Healthcare Service application using Docker and Docker Compose for local development.

## Prerequisites

Before you start, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Docker Compose** (version 1.29 or higher)
  - Usually comes bundled with Docker Desktop

## Quick Start

### 1. Navigate to the Project Directory

```bash
cd /path/to/katalon-demo-cura
```

### 2. Build and Start the Container

```bash
docker-compose up -d
```

This command will:
- Build the Docker image from the Dockerfile
- Start the container named `katalon-demo-cura`
- Map port 8090 on your machine to port 80 in the container
- Map port 8443 on your machine to port 443 in the container (HTTPS)
- Mount the current directory as a volume for live code updates

### 3. Access the Application

Open your browser and navigate to:
```
https://localhost:8443
```

**Note**: The application uses a self-signed SSL certificate for development. Your browser may show a security warning - this is normal and expected. Click "Advanced" and "Proceed to localhost" to continue.

The application should now be running!

## Docker Compose Services

### Web Service (`web`)

- **Image**: Built from `Dockerfile`
- **Container Name**: `katalon-demo-cura`
- **Port Mapping**:
  - `8090:80` (HTTP - auto-redirects to HTTPS)
  - `8443:443` (HTTPS - secure connection)
- **Volume**: Current directory mounted to `/var/www/html`
- **Restart Policy**: `unless-stopped`
- **SSL**: Self-signed certificate generated during build

## Common Commands

### Start the Application

```bash
docker-compose up -d
```

The `-d` flag runs containers in the background (detached mode).

### Stop the Application

```bash
docker-compose down
```

### View Running Containers

```bash
docker-compose ps
```

### View Application Logs

```bash
docker-compose logs -f web
```

The `-f` flag follows the log output (streams in real-time).

### Rebuild the Image

```bash
docker-compose build --no-cache
```

Use `--no-cache` to ignore cached layers and rebuild from scratch.

### Execute Commands in the Container

```bash
docker-compose exec web bash
```

This gives you shell access to the running container.

### Remove Everything (Including Images)

```bash
docker-compose down -v --rmi all
```

⚠️ **Warning**: This will delete volumes and images. Use with caution.

## Development Workflow

### Code Changes

Since the source code directory is mounted as a volume, any changes you make locally are immediately reflected in the container:

1. Edit files in your IDE/editor locally
2. Refresh your browser to see changes (no restart needed)
3. Sessions and database state are preserved

### Debugging

To see real-time logs while using the application:

```bash
docker-compose logs -f web
```

PHP errors and warnings will appear here.

## Architecture

### Dockerfile Breakdown

```dockerfile
FROM php:7.4-apache          # Base image with PHP 7.4 and Apache
WORKDIR /var/www/html        # Set working directory
RUN a2enmod rewrite          # Enable Apache mod_rewrite for .htaccess
COPY . /var/www/html/        # Copy application code
RUN chown -R www-data:www-data /var/www/html  # Set permissions
EXPOSE 80                    # Expose port 80
CMD ["apache2-foreground"]   # Start Apache
```

### docker-compose.yml Breakdown

```yaml
services:
  web:
    build:                   # Build configuration
      context: .
      dockerfile: Dockerfile
    container_name: katalon-demo-cura
    ports:
      - "8080:80"           # Port mapping
    volumes:
      - .:/var/www/html     # Volume mount for development
    restart: unless-stopped  # Auto-restart policy
    networks:
      - cura-network        # Custom network
```

## SSL/HTTPS Configuration

### Self-Signed Certificate

The Docker image generates a self-signed SSL certificate automatically during build:

- **Certificate File**: `/etc/apache2/ssl/server.crt`
- **Private Key**: `/etc/apache2/ssl/server.key`
- **Validity**: 365 days from build date
- **Common Name**: localhost

### Browser Security Warning

When accessing `https://localhost:8443`, your browser will display a security warning because the certificate is self-signed. This is **normal and expected** for development.

**How to proceed:**

**Chrome/Chromium/Edge**:
1. Click "Advanced"
2. Click "Proceed to localhost (unsafe)"

**Firefox**:
1. Click "Advanced..."
2. Click "Accept the Risk and Continue"

**Safari**:
1. Click "Show Details"
2. Click "visit this website"

### HTTP to HTTPS Redirect

All HTTP traffic on port 8090 is automatically redirected to HTTPS on port 8443:

```
http://localhost:8090 → https://localhost:8443
```

This redirection is configured in `apache-http.conf` using Apache mod_rewrite.

### For Production

For production use, you should:

1. **Use a proper SSL certificate** from a trusted Certificate Authority (Let's Encrypt, DigiCert, etc.)
2. **Store secrets securely** (use environment variables, Kubernetes secrets, etc.)
3. **Enable HSTS** (HTTP Strict Transport Security)
4. **Configure security headers** (already included in the config)

## Troubleshooting

### Container Won't Start

**Problem**: `docker-compose up` fails with an error

**Solution**:
1. Check if port 8090 or 8443 is already in use: `netstat -tulpn | grep 8090` or `grep 8443`
2. If so, change the ports in `docker-compose.yml`:
   ```yaml
   ports:
     - "8091:80"   # Use 8091 instead of 8090
     - "8444:443"  # Use 8444 instead of 8443
   ```
3. Try again: `docker-compose up -d`

### Permission Issues

**Problem**: Files created in the container can't be edited locally

**Solution**:
This shouldn't happen with the volume setup, but if it does:

```bash
docker-compose exec web chown -R 1000:1000 /var/www/html
```

### Application Shows Blank Page

**Problem**: Server error with blank page

**Solution**:
1. Check logs: `docker-compose logs -f web`
2. Verify all files exist: `docker-compose exec web ls -la`
3. Check PHP syntax: `docker-compose exec web php -l index.php`

### Browser Shows Certificate Security Warning

**Problem**: "This site cannot provide a secure connection" or certificate warning

**Solution**:
This is expected with self-signed certificates. You can safely ignore this warning:

1. **Chrome/Edge**: Click "Advanced" → "Proceed to localhost"
2. **Firefox**: Click "Advanced..." → "Accept the Risk and Continue"
3. **Safari**: Click "Show Details" → "visit this website"

The warning appears because the certificate is created locally, not by a trusted Certificate Authority. This is completely safe for development.

### HTTPS Not Working

**Problem**: `https://localhost:8443` shows connection error

**Solution**:
1. Ensure the container is running: `docker-compose ps`
2. Check if port 8443 is in use: `netstat -tulpn | grep 8443`
3. Rebuild the image to regenerate SSL certificate: `docker-compose build --no-cache`
4. Restart: `docker-compose down && docker-compose up -d`

## Performance Notes

### Volume Performance on Windows/Mac

If you're using Docker Desktop on Windows or Mac with WSL2 backend, volume performance may be slightly slower than on Linux. This is normal and suitable for development.

For faster performance, you can:
1. Use named volumes instead of bind mounts
2. Exclude large directories (node_modules, vendor, etc.)

### Caching

The Dockerfile uses layer caching. To invalidate cache:

```bash
docker-compose build --no-cache
```

## Production Considerations

⚠️ **Note**: This Docker setup is optimized for **local development** only.

For production deployment:
1. Use a production PHP image
2. Configure separate environments for secrets
3. Use proper secrets management
4. Set up a reverse proxy (nginx)
5. Use persistent volumes for session/data storage
6. Configure health checks
7. Set resource limits
8. Use a load balancer if needed

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PHP Docker Images](https://hub.docker.com/_/php)
- [Best Practices for Docker](https://docs.docker.com/develop/dev-best-practices/)
