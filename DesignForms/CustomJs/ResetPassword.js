$(document).ready(function () {
    // [ notification-button ]
    var nFrom = $(this).attr('data-from');
    var nAlign = $(this).attr('data-align');
    var nIcons = $(this).attr('data-notify-icon');
    var nType = $(this).attr('data-type');
    var nAnimIn = $(this).attr('data-animation-in');
    var nAnimOut = $(this).attr('data-animation-out');
    var message = '';

       $('.notifications.btn').on('click', function (e) {
        e.preventDefault();

        // [ Initialize validation ]
        $('#RessetPassword').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'UserName': { required: true, },
                'Password': { required: true, },
                'OldPassword': { required: true, },
                'ConfirmPassword': { required: true, }
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

           if ($('#RessetPassword').valid()) {
               if (SubmitForm()) {
                   openLoader('Reset Password details.....');
                   $.ajax({
                       url: 'PasswordUpdate',
                       data: toJson(),
                       type: 'Post',
                       success: function (data) {
                           closeLoader();
                           if (data?.success) {
                               nType = 'success';
                               message = data?.message;
                               notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#UserName').val() + 'Password updated Successfully', " User ");
                               setTimeout(RedirectLogin, 3000);
                           } else {
                               nType = 'danger';
                               message = data?.message;
                               notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " User ");
                           }
                       },
                       error: function (xhr, ajaxOptions, thrownError) {
                           closeLoader();
                           nType = 'danger';
                           message = 'Error In Updation';
                           notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " User ")
                       },

                   });
               }
           }
    });
});
function RedirectLogin() {
    window.location = window.location.origin;
}

function toJson() {
    console.log($('#Password').val());
    return Asset = {
        username: $('#UserName').val(), password: btoa($('#Password').val()),
        OldPassword: btoa($('#OldPassword').val()), ConfirmPassword: btoa($('#ConfirmPassword').val())
    };
}

function SubmitForm() {

    var r = confirm("Are you sure you want to Reset Password?");
    if (r === false) {
        return false;
    } else {
        return true;
    }
}
