$(document).ready(function () {

    $('#loadRecord').click(function () {
        openLoader("Loading details...");
    });

    $('#deleteRecord').click(function () {
        openLoader("Deleting record...");
    });

    // [ notification-button ]
    $('.notifications.btn').on('click', function (e) {
        e.preventDefault();

        var nFrom = $(this).attr('data-from');
        var nAlign = $(this).attr('data-align');
        var nIcons = $(this).attr('data-notify-icon');
        var nType = $(this).attr('data-type');
        var nAnimIn = $(this).attr('data-animation-in');
        var nAnimOut = $(this).attr('data-animation-out');
        var message = '';

        // [ Initialize validation ]
        $('#UserMenuform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'ApplicationId': {
                    required: true,
                },
                'Parent': {
                    required: false,
                },
                'MenuName': {
                    required: true,
                },
                'Path': {
                    required: true
                },
                'Role': {
                    required: false
                }
            },

            // Errors //

            errorPlacement: function errorPlacement(error, element) {
                var $parent = $(element).parents('.form-group');

                // Do not duplicate errors
                if ($parent.find('.jquery-validation-error').length) {
                    return;
                }

                $parent.append(
                    error.addClass('jquery-validation-error small form-text invalid-feedback')
                );
            },
            highlight: function (element) {
                var $el = $(element);
                var $parent = $el.parents('.form-group');

                $el.addClass('is-invalid');

                // Select2 and Rolesinput
                if ($el.hasClass('select2-hidden-accessible') || $el.attr('data-role') === 'Rolesinput') {
                    $el.parent().addClass('is-invalid');
                }
            },
            unhighlight: function (element) {
                $(element).parents('.form-group').find('.is-invalid').removeClass('is-invalid');
            }
        });

        if ($('#UserMenuform').valid()) {
            openLoader('Saving UserRole details.....');
            $.ajax({
                url: 'UserMenuModification',
                data: toJson(),
                type: 'Post',
                success: function (data) {
                    closeLoader();
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        let mode = $("#hdnGuid").val().replaceAll('-', '') == 0 ? 'Created' : 'Updated';
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#MenuName').val() + ' : ' + mode + ' Successfully', " User Menu ");
                        setTimeout(window.location.replace('/UserMenu'), 3000);
                        
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        console.error('Error saving User Menu:', message);
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", "  User Menu ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nType = 'danger';
                    message = 'Error In Updation';
                    console.error('Error saving User Menu:', thrownError);
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", " User Menu ")
                },

            });
        }
    });
});

function toJson() {
    return UserMenu = { Guid: $("#hdnGuid").val(), ApplicationId: $('#ApplicationId').val(), Parent: $('#Parent').val(), MenuName: $('#MenuName').val(), Path: $('#Path').val(), Role: $('#Role').val() };
};
function DeleteMenu(guid) {

    var UserMenu = {
        Guid: guid
    }
    var nFrom = $(this).attr('data-from');
    var nAlign = $(this).attr('data-align');
    var nIcons = $(this).attr('data-notify-icon');
    var nType = $(this).attr('data-type');
    var nAnimIn = $(this).attr('data-animation-in');
    var nAnimOut = $(this).attr('data-animation-out');
    var message = '';

    if (confirm('Are you sure? Menu will be deleted permanently')) {
        $.ajax({
            url: 'Delete',
            data: UserMenu,
            type: 'Post',
            success: function (data) {
                closeLoader();
                if (data?.success) {
                    nType = 'success';
                    message = data?.message;
                    /*   let mode = $("#hdnGuid").val().replaceAll('-', '') == 0 ? 'Created' : 'Updated';*/
                    let mode =  'Deleted';
                    /* notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#MenuName').val() + ' : ' + mode + ' Successfully', " User Menu ");*/
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, 'User menu' + ' : ' + mode + ' Successfully', "");
                    setTimeout(window.location.replace('/UserMenu'), 3000);

                } else {
                    nType = 'danger';
                    message = data?.message;
                    console.error('Error Deleting User Menu:', message);
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, "");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                nType = 'danger';
                message = 'Error In Deleting';
                console.error('Error Deleting User Menu:', thrownError);
                notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error Deleting", " User Menu ")
            },

        });
    }
}
