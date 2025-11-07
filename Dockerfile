# Use official PHP 7.4 Apache runtime as base image
FROM php:7.4-apache

# Set working directory
WORKDIR /var/www/html

# Enable mod_rewrite for Apache (needed for .htaccess)
RUN a2enmod rewrite

# Copy application code to container
COPY . /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"]
