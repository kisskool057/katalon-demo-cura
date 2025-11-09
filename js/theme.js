// ============================================
// THEME MANAGEMENT
// ============================================

console.log('[theme] Theme Management Script Loaded');

// Apply theme class to body on page load
function applyCurrentTheme() {
    console.log('[theme] applyCurrentTheme() called');

    // Get the current theme from the radio button - use vanilla JS
    var themeRadios = document.querySelectorAll('input[name="theme"]');
    console.log('Found theme radios:', themeRadios.length);

    var selectedTheme = null;
    for (var i = 0; i < themeRadios.length; i++) {
        if (themeRadios[i].checked) {
            selectedTheme = themeRadios[i].value;
            break;
        }
    }

    console.log('[theme] Selected theme:', selectedTheme);

    // Remove all theme classes
    document.body.classList.remove('theme-light', 'theme-dark');
    console.log('[theme] Removed all theme classes');

    // Apply the selected theme class
    if (selectedTheme) {
        document.body.classList.add('theme-' + selectedTheme);
        console.log('[theme] Added class: theme-' + selectedTheme);
    } else {
        console.warn('[theme] No theme selected; defaulting to light');
        document.body.classList.add('theme-light');
    }

    // Debug: log current body classes
    console.log('[theme] Body classes:', document.body.className);
    console.log('[theme] Body computed background:', window.getComputedStyle(document.body).backgroundColor);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCurrentTheme);
} else {
    applyCurrentTheme();
}

// Handle theme changes with vanilla JS
document.addEventListener('change', function(e) {
    if (e.target.name === 'theme') {
        var selectedTheme = e.target.value;
        console.log('[theme] Theme radio changed to:', selectedTheme);

        // Apply the theme immediately
        applyCurrentTheme();

        // Send the theme preference to the server
        var xhr = new XMLHttpRequest();
        xhr.open('POST', './set-theme.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('[theme] Theme persisted to server:', xhr.responseText);
                var bgColor = window.getComputedStyle(document.body).backgroundColor;
                console.log('Current body background color:', bgColor);

                // Close the menu automatically after selection
                // Use jQuery to ensure consistency with existing menu code
                if ($('#sidebar-wrapper').hasClass('active')) {
                    $('#sidebar-wrapper').removeClass('active');
                }
            } else {
                console.error('[theme] Server error:', xhr.status, xhr.responseText);
            }
        };
        xhr.onerror = function() {
            console.error('[theme] Network error updating theme');
        };
        xhr.send('theme=' + encodeURIComponent(selectedTheme));
    }
});

// ============================================
// NAVIGATION AND SCROLLING
// ============================================

// Closes the sidebar menu
$("#menu-close").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
});

// Opens the sidebar menu
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
});

// Scrolls to the selected menu item on the page
$(function() {
    $('a[href*=#]:not([href=#],[data-toggle],[data-target],[data-slide])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});

//#to-top button appears after scrolling
var fixed = false;
$(document).scroll(function() {
    if ($(this).scrollTop() > 250) {
        if (!fixed) {
            fixed = true;
            // $('#to-top').css({position:'fixed', display:'block'});
            $('#to-top').show(function() {
                $('#to-top').css({
                    position: 'fixed',
                    display: 'block'
                });
            });
        }
    } else {
        if (fixed) {
            fixed = false;
            $('#to-top').hide(function() {
                $('#to-top').css({
                    display: 'none'
                });
            });
        }
    }
});
