(function(root, factory) {
    'use strict';
    // Set up Backbone appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'semantic-ui'], function($) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Backbone.
            root.foo = factory(root, $);
        });

        // Next for Node.js or CommonJS. jQuery may not be needed as a module.
    } else if (typeof exports !== 'undefined') {
        var $ = require('jquery');
        factory(root, $);
    } else {
        factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
    }
}(this, function(root, $) {
    'use strict';
    $('.ui.search').search({
        apiSettings: {
            url: 'search/{query}'
        },
        onSearchQuery: function () {
            if (!$(this).search('get value')) {
                root.location.href = 'list';
            }
        }
    });
}));
