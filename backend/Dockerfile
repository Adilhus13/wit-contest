FROM php:8.4-fpm-alpine

# System deps
RUN apk add --no-cache \
  bash \
  curl \
  git \
  unzip \
  icu-dev \
  libzip-dev \
  oniguruma-dev \
  mysql-client

# PHP extensions
RUN docker-php-ext-install \
  pdo_mysql \
  mbstring \
  zip \
  intl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Use non-root user
RUN addgroup -g 1000 app && adduser -G app -g app -s /bin/sh -D -u 1000 app
USER app

EXPOSE 9000
CMD ["php-fpm"]
