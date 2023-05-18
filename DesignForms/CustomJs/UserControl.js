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
        $('#UserControlform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'MenuId': {
                    required: true,
                },
                'ControlId': {
                    required: true,
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

        if ($('#UserControlform').valid()) {
            openLoader('Saving UserControl details.....');
            $.ajax({
                url: 'UserControlModification',
                data: toJson(),
                type: 'Post',
                success: function (data) {
                    closeLoader();
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        let mode = $("#hdnGuid").val().replaceAll('-', '') == 0 ? 'Created' : 'Updated';
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, mode + ' Successfully', " User Control ");
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        console.error('Error saving User Control:', message);
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", "  User Control ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nType = 'danger';
                    message = 'Error In Updation';
                    console.error('Error saving User Control:', thrownError);
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", " User Control ")
                },

            });
        }
    });
});

function toJson() {
    return UserControl = { Guid: $("#hdnGuid").val(), ControlId: $('#ControlId').val(), MenuId: $('#MenuId').val(), IsActive: $('#Active').prop('checked') ? 'Y' : 'N', Role: $('#Role').val() };
};