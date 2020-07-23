$(function() {
    'use strict';
    let $page = $('#main');
    let options = {
        debug: true,
        prefetch: true,
        cacheLength: 2,
        forms: 'randomize-form',
        onStart: {
            duration: 250, // Duration of our animation
            render: function($container) {
                // Allow animation only on page change, not during refreshes or page loads
                $("body").removeClass("preload");
                // Add your CSS animation reversing class
                $container.addClass('is-exiting');
                // Restart your animation
                smoothState.restartCSSAnimations();
            }
        },
        onReady: {
            duration: 0,
            render: function($container, $newContent) {
                // Remove your CSS animation reversing class
                $container.removeClass('is-exiting');
                // Inject the new content
                $container.html($newContent);
                // Allow animation only on page change, not during refreshes or page loads
                $("body").removeClass("preload");
            }
        },
        onAfter: function($container, $newContent) {
            addMapScript();
        }
    };
    let smoothState = $page.smoothState(options).data('smoothState');
});
