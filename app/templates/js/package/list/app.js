define(['jquery', 'sweetalert', 'l20nCtx!/static/locales/{{locale}}/l20n', 
       'semantic-ui'], function($, swal, ctx) {
    'use strict';
    $('.ui.search').search({
        apiSettings: {
            url: 'search/{query}'
        },
        onSearchQuery: function () {
            if (!$(this).search('get value')) {
                window.location.href = 'list';
            }
        }
    });

    $('th input:checkbox').click(function () {
        $('td input:checkbox').prop('checked', $(this).is(':checked'));
    });
    var gettext = function () {
        return ctx.getSync.apply(ctx, arguments);
    };
    $('button.remove.button').click(function () {
        if ($('td input:checked').length === 0) {
            swal({
                type: 'info',
                title: gettext('info.title'),
                text: gettext('info.remove'),
            });
            return false;
        } 
        swal({
            type: 'warning',
            title: gettext('warning.title'),
            text: gettext('warning.remove.list'),
            cancelButtonText: gettext('cancel_remove'),
            closeOnConfirm: false,
            showCancelButton: true,
        }, function () {
            $('.ui.dimmer.mask').addClass('mask');
            $.ajax({
                url: '/<%= packageName %>/list.json?ids=' + $('td input:checked').map(function () {
                    return $(this).attr('data-id');
                }).get().join(','),
                type: 'DELETE',
            }).done(function () {
                swal({
                    type: 'success',
                    title: gettext('success.title'),
                    text: gettext('success.remove.list'),
                }, function () {
                    window.location.reload();
                });
            }).fail(function () {
                swal({
                    type: 'error',
                    title: gettext('error.remove.list'),
                });
            }).always(function () {
                $('.ui.dimmer.mask').removeClass('mask');
            });
        });

    });
});
