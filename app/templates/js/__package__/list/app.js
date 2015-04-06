(function(root, factory) {
    'use strict';
    // Set up Backbone appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'sweetalert', 'semantic-ui'], function($, swal) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Backbone.
            root.foo = factory(root, $, swal);
        });

        // Next for Node.js or CommonJS. jQuery may not be needed as a module.
    } else if (typeof exports !== 'undefined') {
        var $ = require('jquery');
        factory(root, $);
    } else {
        factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
    }
}(this, function(root, $, swal) {
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

    $('th input:checkbox').click(function () {
        $('td input:checkbox').prop('checked', $(this).is(':checked'));
    });

    $('button.remove.button').click(function () {
        if ($('td input:checked').length === 0) {
            swal({
                type: 'info',
                title: 'Hint',
                text: 'Please select at least one record to remove!',
            });
            return false;
        } 
        swal({
            type: 'warning',
            title: 'Warning!',
            text: 'Are you sure to remove the selected record(s)? (unrecoverable)',
            cancelButtonText: 'Do not remove！',
            closeOnConfirm: false,
            showCancelButton: true,
        }, function () {
            $('.ui.dimmer.mask').addClass('mask');
            $.ajax({
                url: '/<%= modelName %>/list.json?ids=' + $('td input:checked').map(function () {
                    return $(this).attr('data-id');
                }).get().join(','),
                type: 'DELETE',
            }).done(function () {
                swal({
                    type: 'success',
                    title: 'Success!',
                    text: 'Selected records have been removed!'
                }, function () {
                    root.location.reload();
                });
            }).fail(function () {
                swal({
                    type: 'error',
                    title: 'Failed to remove selected record(s)!'
                });
            }).always(function () {
                $('.ui.dimmer.mask').removeClass('mask');
            });
        });

    });
}));
