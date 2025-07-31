# Microservice Employee
FROM php:8.2-fpm-alpine

# Installer les dépendances
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx \
    supervisor

# Installer les extensions PHP
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Définir le répertoire de travail
WORKDIR /var/www/html

# Copier les fichiers de dépendances
COPY composer.json composer.lock ./

# Installer les dépendances PHP
RUN composer install --no-dev --optimize-autoloader

# Copier le code source
COPY . .

# Configurer les permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

# Copier la configuration Nginx spécifique au service
COPY docker/employee/nginx.conf /etc/nginx/nginx.conf

# Copier la configuration Supervisor
COPY docker/employee/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Exposer le port 8000
EXPOSE 8000

# Démarrer Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"] 