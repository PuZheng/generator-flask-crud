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

    var objId = $('.ui.form :hidden[name="id"]').val(); 

    $('.ui.form').submit(function () {
        if (objId) { 
            return false;
        }
    });


    $('.ui.form').form({
        // you should place all the fields here, including the optional one 
        // this is due to a bug in semantic-ui, the fields placed here will
        // invoke "onValid" with the wrong "this". 
        // but NOT includeing the sophiscated field you created which by pass 
        // semantic-ui's form validation mechanism entirely.
        foo: {
            identifier: 'foo',
            rules: [{
                type: 'empty',
                prompt: 'please input name'
            }, {
                type: 'foo-test',
                prompt: 'name already exists'
            }],
        },
    }, {
        inline: true,
        on: 'blur',
        rules: {
            'foo-test': function () {
                return false;
            },
        },
        onValid: function () {
            if (!objId) {
                return; // only commit the change when EDIT the object
            }
            if (this.attr('value') === this.val()) {
                return; // only commit the change when value changed
            }
            $('.ui.form').addClass('.loading');
            var data = {};
            data[this.attr('name')] = this.val();
            $.ajax({
                url: 'object/' + objId + '.json',
                type: 'PUT',
                data: JSON.stringify(data),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            }).done(function () {

            }).fail(function () {

            }).always(function () {
                $('.ui.form').removeClass('loading');
            });
        },
    });
    $('.ui.form input').keypress(function (e) {
        if (e.keyCode === 13) {
            $(this).blur();
        }
    });
}));
