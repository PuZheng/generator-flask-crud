define(['jquery', 'sweetalert', 'l20n-ctx!/static/locales/{{locale}}/l20n', 
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
                title: gettext('info', {type: 'title'}),
                text: gettext('info', {type: 'remove'}),
            });
            return false;
        } 
        swal({
            type: 'warning',
            title: gettext('warning', {type: 'title'}),
            text: gettext('warning', {type: 'title', context: 'list'}),
            cancelButtonText: gettext('cancel_remove'),
            closeOnConfirm: false,
            showCancelButton: true,
        }, function () {
            $('.ui.dimmer').addClass('active').find('.loader').text(gettext('wait_for_removing') + '...');
            $.ajax({
                url: '/<%= packageName %>/list.json?ids=' + $('td input:checked').map(function () {
                    return $(this).attr('data-id');
                }).get().join(','),
                type: 'DELETE',
            }).done(function () {
                swal({
                    type: 'success',
                    title: gettext('success', {type: 'title'}),
                    text: gettext('success', {type: 'remove', context: 'list'}),
                }, function () {
                    window.location.reload();
                });
            }).fail(function () {
                swal({
                    type: 'error',
                    title: gettext('error', {type: 'remove', context:'list'}),
                });
            }).always(function () {
                $('.ui.dimmer').removeClass('active');
            });
        });

    });
});
