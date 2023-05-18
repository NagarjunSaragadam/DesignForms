$(document).ready(function () {
    var status = '';
    $('input[type=radio][name=ApprovalFlag]').on('change', function (a, b, c) {
        if ($(this).val() === 'R') {
            $('.mandatory').show();
            $('#Reason').prop('readonly', false);
        } else {
            $('.mandatory').hide();
            $('#Reason').val('');
            $('#Reason').prop('readonly', true);
        }
    });

    // [ notification-button ]
    $('.approve.btn').on('click', function (e) {
        status = $('input[name="ApprovalFlag"]:checked').val();
        if (!(status == 'A' || status == 'R')) {
            swal('Please select Approve or Reject.');
            return false;
        } else if (status == 'R' && !$('#Reason').val()) {
            swal('Reason is mandatory to Reject record.');
            return false;
        }

        e.preventDefault();
		
        var nFrom = $(this).attr('data-from');
        var nAlign = $(this).attr('data-align');
        var nIcons = $(this).attr('data-notify-icon');
        var nType = $(this).attr('data-type');
        var nAnimIn = $(this).attr('data-animation-in');
        var nAnimOut = $(this).attr('data-animation-out');
        var message = '';
        
		// [ Initialize validation ]
        $('#authForm').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'ApprovalFlag': {
                    required: true,                    
                },
                'Reason': {
                    required: $('input[name="ApprovalFlag"]:checked').val() == 'R',
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

                // Select2 and Tagsinput
                if ($el.hasClass('select2-hidden-accessible') || $el.attr('data-role') === 'tagsinput') {
                    $el.parent().addClass('is-invalid');
                }
            },
            unhighlight: function (element) {
                $(element).parents('.form-group').find('.is-invalid').removeClass('is-invalid');
            }
        });
		
        if ($('#authForm').valid()) {
            openLoader('Submitting Response. Please wait...');
			$.ajax({
				url: 'Approve',
                data: toJsonRequest(),
				type: 'Post',
                success: function (data) {
                    closeLoader();
                    if (data?.success) {
                        $('.notifications.btn').hide();
                        nType = 'success';
                        message = data?.message;
                        let mode = status == 'R' ? 'Rejected' : 'Approved';
                        redirect();
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#uniqId').html() + ' : ' + mode + ' Successfully', " Request ");
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        console.error('Error saving Request:', message);
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Request ");
                    }
				},
                error: function (xhr, ajaxOptions, thrownError) {
                    closeLoader();
					nType = 'danger';
                    message = 'Error In Updation';
                    console.error('Error saving Tag:', thrownError);
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", " Request ")
				},

			});
		}
    });
});

function toJsonRequest() {
    return AuthorizeRecordRequest = {
        ApprovalFlag: $('input[name="ApprovalFlag"]:checked').val(),
        Reason: ($('input[name="ApprovalFlag"]:checked').val() == 'A' ? '' : $('#Reason').val()),
        Guid: $("#Guid").val()
    };
};

function redirect() {
    setTimeout(function () {
        window.location.replace('/' + window.location.pathname.split('/')[1]+'/');
    }, 2000);
}