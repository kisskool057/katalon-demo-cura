# Use official PHP 7.4 Apache runtime as base image
FROM php:7.4-apache

# Set working directory
WORKDIR /var/www/html

# Enable Apache modules for SSL and rewrite
RUN a2enmod rewrite && \
    a2enmod ssl && \
    a2enmod socache_shmcb && \
    a2enmod headers

# Create self-signed SSL certificate directory
RUN mkdir -p /etc/apache2/ssl

# Generate self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/apache2/ssl/server.key \
    -out /etc/apache2/ssl/server.crt \
    -subj "/C=FR/ST=State/L=City/O=Organization/CN=localhost"

# Copy application code to container
COPY . /var/www/html/

# Copy SSL configuration
COPY apache-ssl.conf /etc/apache2/sites-available/default-ssl.conf
COPY apache-http.conf /etc/apache2/sites-available/000-default.conf

# Enable SSL site
RUN a2ensite default-ssl.conf

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Expose ports: 80 for HTTP, 443 for HTTPS
EXPOSE 80 443

# Start Apache in foreground
CMD ["apache2-foreground"]
