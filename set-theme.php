<?php
/**
 * Theme Setting Endpoint
 * Handles theme preference changes via AJAX
 */

session_start();
require 'functions.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Get the theme parameter
$theme = isset($_POST['theme']) ? $_POST['theme'] : null;

if (!$theme) {
    http_response_code(400);
    echo json_encode(['error' => 'Theme parameter is required']);
    exit;
}

// Set the theme using ThemeManager
if (ThemeManager::setTheme($theme)) {
    echo json_encode([
        'success' => true,
        'theme' => $theme,
        'message' => 'Theme updated successfully'
    ]);
} else {
    http_response_code(400);
    echo json_encode([
        'error' => 'Invalid theme value',
        'received' => $theme
    ]);
}

exit;
