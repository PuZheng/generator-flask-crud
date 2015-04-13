define(['jquery', 'sweetalert', 'gettext', 
       'semantic-ui'], function($, swal, gettext) {
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

    $('button.remove.button').click(function () {
        if ($('td input:checked').length === 0) {
            swal({
                type: 'info',
                title: gettext('Hint'),
                text: gettext('Please select at least one record to remove!'),
            });
            return false;
        } 
        swal({
            type: 'warning',
            title: gettext('Warning!'),
            text: gettext('Are you sure to remove the selected record(s)?'),
            cancelButtonText: 'Do not remove！',
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
                    title: gettext('Success!'),
                    text: gettext('Selected records have been removed!'),
                }, function () {
                    window.location.reload();
                });
            }).fail(function () {
                swal({
                    type: 'error',
                    title: gettext('Failed to remove selected record(s)!'),
                });
            }).always(function () {
                $('.ui.dimmer.mask').removeClass('mask');
            });
        });

    });
});
