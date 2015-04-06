(function(root, factory) {
    'use strict';
    // Set up Backbone appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'toastr', 'sweetalert', 'crud-utils',
               'semantic-ui'], function($, toastr, swal, crudUtils) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Backbone.
            root.foo = factory(root, $, toastr, swal, crudUtils);
        });

        // Next for Node.js or CommonJS. jQuery may not be needed as a module.
    } else if (typeof exports !== 'undefined') {
        var $ = require('jquery');
        factory(root, $);
    } else {
        factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
    }
}(this, function(root, $, toastr, swal, crudUtils) {
    'use strict';

    var objId = $('.ui.form :hidden[name="id"]').val(); 

    $('.ui.form').submit(function () {
        return !objId; // prevent submit the form when edit the object
    });

    $('.remove.button').click(function () {
        swal({
            type: 'warning',
            title: 'Warning',
            text: 'Are you sure to delete this <%= modelName %>',
            showCancelButton: true,
            closeOnConfirm: false,
        }, function () {
            $('.ui.form').addClass('loading');
            $.ajax({
                url: '/<%= packageName %>/object/' + objId + '.json',
                type: 'DELETE'
            }).done(function () {
                swal({
                    type: 'success',
                    title: 'success!',
                    text: '<%= modelName %> "' + $('[name="name"]').val() + '" has been removed!'
                }, function () {
                    window.location.href = '/vendor/list';
                });
            }).fail(function () {
                swal({
                    type: 'error',
                    title: 'Error!',
                    text: 'Can\'t remove <%= modelName %> "' + $('[name="name"]').val() + '"',
                });
            }).always(function () {
                $('.ui.form').removeClass('loading');
            });
        });
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
            if (!objId || (this.val() === this.attr('data-committed-value'))) {
                return; // only commit the change when EDIT the object, and this field is changed
            }
            $('.ui.form').addClass('loading');

            var data = {};
            var $input = this;
            data[this.attr('name')] = this.val();
            $.ajax({
                url: objId + '.json',
                type: 'PUT',
                data: JSON.stringify(data),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            }).done(function () {
                toastr.success('updated!', '', {
                    positionClass: 'toast-bottom-center',
                    timeOut: 1000,
                });
                $input.attr('data-committed-value', $input.val());
            }).fail(function (data) {
                data.responseJSON && crudUtils.showFormErrors(data.responseJSON.errors);
                toastr.error('update failed!', '', {
                    positionClass: 'toast-bottom-center',
                    timeOut: 1000,
                });
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
