$(document).ready(function () {

    $('.notifications.btn').on('click', function (e) {

        e.preventDefault();
        var nFrom = $(this).attr('data-from');
        var nAlign = $(this).attr('data-align');
        var nIcons = $(this).attr('data-notify-icon');
        var nType = $(this).attr('data-type');
        var nAnimIn = $(this).attr('data-animation-in');
        var nAnimOut = $(this).attr('data-animation-out');
        var message = '';

        $('#subForm').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'header.SurveyorId': { required: true, },
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

        if ($('#subForm').valid()) {
            $.ajax({
                url: 'AssignSurveyorModification',
                type: 'Post',
                data: toJson(),
                success: function (data) {
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        redirect();
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Assign Surveyor ");
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " Assign Surveyor ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nType = 'danger';
                    message = 'Error In Operation';
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Assign Surveyor ")
                },
            })

        }
    });


});

function toJson() {
    var header = {
        SurveyorId: $("#header_SurveyorId").val(),
        PrHeaderId: $("#header_PrHeaderId").val(),
    };

    return PermitRequest = { header };
}

function redirect() {
    setTimeout(function () {
        window.location.replace('/Survey/AssignSurveyorIndex');
    }, 2000);
}