// ============================================
// THEME MANAGEMENT
// ============================================

// Apply theme class to body on page load
$(function() {
    applyCurrentTheme();
});

function applyCurrentTheme() {
    // Get the current theme from the radio button
    var selectedTheme = $('input[name="theme"]:checked').val();

    // Remove all theme classes
    $('body').removeClass('theme-light theme-dark');

    // Apply the selected theme class if it's not 'system'
    if (selectedTheme && selectedTheme !== 'system') {
        $('body').addClass('theme-' + selectedTheme);
        console.log('Theme applied:', 'theme-' + selectedTheme);
    } else {
        console.log('Theme not applied (system mode or no selection)');
    }

    // Debug: log current body classes
    console.log('Body classes:', document.body.className);
}

// Handle theme changes
$(function() {
    $('input[name="theme"]').on('change', function() {
        var selectedTheme = $(this).val();

        console.log('Theme radio changed to:', selectedTheme);

        // Apply the theme immediately
        applyCurrentTheme();

        // Send the theme preference to the server
        $.ajax({
            url: './set-theme.php',
            type: 'POST',
            data: { theme: selectedTheme },
            success: function(response) {
                console.log('Theme persisted to server:', response);
                // Visual feedback - briefly show a message
                var bgColor = window.getComputedStyle(document.body).backgroundColor;
                console.log('Current body background color:', bgColor);
            },
            error: function(xhr, status, error) {
                console.error('Error updating theme:', error, xhr.responseText);
            }
        });
    });
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
