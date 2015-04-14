define(['jquery', 'toastr', 'sweetalert', 'crud-utils', 'URIjs/URI', 
       'l20nCtx!/static/locales/{{locale}}/i20n', 'underscore', 'underscore.string',
       'semantic-ui', 
], function($, toastr, swal, crudUtils, URI, ctx, _, s) {
    'use strict';
    _.mixin(s.exports());
    var objId = $('.ui.form :hidden[name="id"]').val(); 

    $('.ui.form').submit(function () {
        return !objId; // prevent submit the form when edit the object
    });

    var gettext = function () {
        ctx.getSync.apply(ctx, arguments);
    };
    $('.remove.button').click(function () {
        swal({
            type: 'warning',
            title: gettext('warning_title'),
            text: gettext('remove_question', {
                modelName: '<%= modelName %>',
            }),
            showCancelButton: true,
            closeOnConfirm: false,
            cancelButtonText: 'Don\'t remove!',
        }, function () {
            $('.ui.form').addClass('loading');
            $.ajax({
                url: '/<%= packageName %>/object/' + objId + '.json',
                type: 'DELETE'
            }).done(function () {
                swal({
                    type: 'success',
                    title: gettext('success_title'),
                    text: _.sprintf(gettext('delete_success', { modelName: '<%= modelName %>' }), $('[name="name"]').val()),
                }, function () {
                    root.location.href = URI(root.location.href).query(true).backref || '/<%= packageName %>/list';
                });
            }).fail(function () {
                swal({
                    type: 'error',
                    title: gettext('error_title'),
                    text: _.sprintf(gettext('remove_failed', { modelName: '<%= modelName %>' }, $('[name="name"]').val())) ,
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
        keyboardShortcuts: !objId, // only when create, enter will submit the form 
        inline: true,
        on: 'blur',
        rules: {
            'foo-test': function () {
                return false;
            },
            'optional': function () {
                return true;
            }
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
                data.responseJSON && crudUtils.showFormErrors(data.responseJSON.errors, $('.ui.form'));
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
            return false;
        }
    });
    function dirty() {
        // add real implementation
        return true;
    }
    window.onbeforeunload = function (e) {
        if (!objId && dirty()) {
            var confirmationMessage = 'Unsaved changes will be discarded if you leave this page';

            (e || window.event).returnValue = confirmationMessage;     //Gecko + IE
            return confirmationMessage;                                //Gecko + Webkit, Safari, Chrome etc.
        }
    };
});
