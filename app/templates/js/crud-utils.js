(function(root, factory) {
    'use strict';
    // Set up Backbone appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
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
    var showFormErrors = function(errors, $form) {
        for (var k in errors) {
            var $input = $form.find('[name="' + k + '"]');
            var $ul = $('<ul class="ui list"></ul>');
            for (var i=0; i < errors[k].length; ++i) {
                $ul.append('<li class="item">' + errors[k][i] + '</li>');
            }
            var $prompt = $('<div class="ui red pointing prompt label transition visible"></div>').append($ul);
            $input.parent().addClass('error').append($prompt);
        }
    };
    return {
        showFormErrors: showFormErrors,
    };
}));
