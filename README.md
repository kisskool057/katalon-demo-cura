# Katalon Sample Website - CURA Healthcare Service

## HTML Template

[Stylish Portfolio](http://startbootstrap.com/template-overviews/stylish-portfolio/) is a responsive, one page portfolio theme for [Bootstrap](http://getbootstrap.com/) created by [Start Bootstrap](http://startbootstrap.com/). The theme features multiple content sections with an off canvas navigation menu.

## Features

### Dark Mode / Theme Support

The application now includes a comprehensive theme system supporting:
- **Light Theme** - Bright, clean interface
- **Dark Theme** - Dark mode for comfortable night viewing
- **System Theme** - Automatically follows OS/browser dark mode preference

#### How to Use Theme Selector

1. Click the menu toggle button (hamburger icon) in the top-right corner
2. Scroll to the "Theme" section at the bottom of the sidebar menu
3. Select your preferred theme:
   - **Light** - Forces light theme
   - **Dark** - Forces dark theme
   - **System** - Uses your operating system's dark mode setting

Your preference is automatically saved to your session and will be remembered during your visit.

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed

### Quick Start with Docker

1. Clone the repository
2. Navigate to the project directory
3. Run the following command to start the application:

```bash
docker-compose up -d
```

4. Access the application at: **http://localhost:8080**

### Docker Commands

**Start the application:**
```bash
docker-compose up -d
```

**Stop the application:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f web
```

**Rebuild the image:**
```bash
docker-compose build --no-cache
```

### Docker Configuration

- **Image**: Based on `php:7.4-apache`
- **Port**: 8080 (accessible as http://localhost:8080)
- **Volume**: Source code directory is mounted for development
- **Modules**: Apache mod_rewrite is enabled for .htaccess support

## Libraries

[DateTime Picker](http://www.malot.fr/bootstrap-datetimepicker/index.php) is a Bootstrap form component to handle date and time data.

[Underscore.php](http://brianhaveri.github.io/Underscore.php/)  is a PHP port of the popular Underscore.js library. In addition to porting Underscore's functionality, Underscore.php includes matching unit tests. Underscore.php requires PHP 5.3 or greater.

## Technical Stack

- **Backend**: PHP 7.4
- **Frontend**: HTML5, Bootstrap 3.3.7, jQuery
- **Styling**: CSS with CSS Custom Properties (Variables)
- **Server**: Apache with mod_rewrite
- **Deployment**: Docker & Docker Compose

## Project Structure

```
katalon-demo-cura/
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose configuration
├── functions.php              # PHP functions & ThemeManager class
├── set-theme.php              # Theme preference endpoint
├── css/theme.css              # CSS with theme variables
├── js/theme.js                # Theme management JavaScript
├── views/page_template.php    # Main template with theme selector
└── ...other files...
```
