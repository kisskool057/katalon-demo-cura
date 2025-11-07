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
- Map port 8080 on your machine to port 80 in the container
- Mount the current directory as a volume for live code updates

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

The application should now be running!

## Docker Compose Services

### Web Service (`web`)

- **Image**: Built from `Dockerfile`
- **Container Name**: `katalon-demo-cura`
- **Port Mapping**: `8080:80` (external:internal)
- **Volume**: Current directory mounted to `/var/www/html`
- **Restart Policy**: `unless-stopped`

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

## Troubleshooting

### Container Won't Start

**Problem**: `docker-compose up` fails with an error

**Solution**:
1. Check if port 8080 is already in use: `netstat -tulpn | grep 8080`
2. If so, change the port in `docker-compose.yml`: `8081:80` instead of `8080:80`
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

### Port 8080 Already in Use

**Problem**: `Error response from daemon: Ports are not available`

**Solution**:
1. Use a different port in `docker-compose.yml`:
   ```yaml
   ports:
     - "8081:80"  # Use 8081 instead
   ```
2. Restart: `docker-compose down && docker-compose up -d`
3. Access at: `http://localhost:8081`

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
