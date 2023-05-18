$(document).ready(function () {
    // [ notification-button ]
    var nFrom = $(this).attr('data-from');
    var nAlign = $(this).attr('data-align');
    var nIcons = $(this).attr('data-notify-icon');
    var nType = $(this).attr('data-type');
    var nAnimIn = $(this).attr('data-animation-in');
    var nAnimOut = $(this).attr('data-animation-out');
    var message = '';

    $('#reset-link').click(function () {
        $('#loginForm').attr('action', '../User/ResetPassword');
        $('#loginForm').submit();
    });

    if ($('#authError').val() != null && $('#authError').val().length > 0) {
        nType = 'danger';
      /*  notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#authError').val(), " User Login ");*/
        $('#authError').val('');
    }

    $('.notifications.btn').on('click', function (e) {
        e.preventDefault();

        // [ Initialize validation ]
        $('#loginForm').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'UserName': { required: true, },
                'Password': { required: true, }
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

        if ($('#loginForm').valid()) {
            //openLoader('Authenticating.....');
            //$('#Password').val(btoa($('#Password').val()));
            //$('#loginForm').submit();
            $('#login-btn').prop("disabled", true);
            $('#login-load').show();
            $.ajax({
                url: 'Login/authenticate',
                data: toJson(),
                type: 'Post',
                success: function (data) {
                    closeLoader();
                    console.log(data.redirect);
                    console.log(data);
                    if (data?.success) {
                        window.location.replace("../Home");
                    } else {
                        $('#login-btn').prop("disabled", false);
                        $('#login-load').hide();
                        nType = 'danger';
                        message = data?.message ? data?.message : 'Error Logging In';
                        console.error("Error logging in:", data);
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " User Login ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $('#login-btn').prop("disabled", false);
                    $('#login-load').hide();
                    //closeLoader();
                    nType = 'danger';
                    message = 'Error In Updation';
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " User Login ")
                },

            });
        }
    });
});

function toJson() {
    return Asset = {
        username: $('#UserName').val(), password: btoa($('#Password').val())
    };
};