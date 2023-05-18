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
        $('#CompanyVform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'CompanyCode': {
                    required: true,
                },
                'CompanyName': {
                    required: true,
                },
                'City': {
                    required: true,
                },
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

                // Select2 and Tagsinput
                if ($el.hasClass('select2-hidden-accessible') || $el.attr('data-role') === 'tagsinput') {
                    $el.parent().addClass('is-invalid');
                }
            },
            unhighlight: function (element) {
                $(element).parents('.form-group').find('.is-invalid').removeClass('is-invalid');
            }
        });
        if ($('#CompanyVform').valid()) {
            openLoader('Saving CompanyV details.....');
            $.ajax({
                url: 'CompanyVModification',
                data: toJson(),
                type: 'Post',
                success: function (data) {
                    closeLoader();
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        let mode = $("#hdnGuid").val().replaceAll('-', '') == 0 ? 'Created' : 'Updated';
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#CompanyCode').val() + ' - ' + $('#CompanyName').val() + ' : ' + mode + ' Successfully', " CompanyV ");
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        console.error('Error saving CompanyV:', message);
                        if (message.includes("CompanyV Exist"))
                            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " Name or Code are existed", " CompanyV ");
                        else
                            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", " CompanyV ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nType = 'danger';
                    message = 'Error In Updation';
                    console.error('Error saving CompanyV:', thrownError);
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", " CompanyV ")
                },

            });
        }
    });
});

function toJson() {
    return Project = {
        Guid: $("#hdnGuid").val(),
        CompanyCode: $('#CompanyCode').val(),
        CompanyName: $('#CompanyName').val(),
        ParentCompany: $('#ParentCompany').val(),
        City: $('#City').val(),
        AddressLine1: $('#AddressLine1').val()
    };
};