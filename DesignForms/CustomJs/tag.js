﻿$(document).ready(function () {

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
        $('#tagform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'Code': {
                    required: true,                    
                },
                'Name': {
                    required: true,
                },
                'Status': {
                    required: true,
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
		
        if ($('#tagform').valid()) {
            openLoader('Saving Tag details.....');
			$.ajax({
				url: 'TagModification',
				data: toJson(),
				type: 'Post',
                success: function (data) {
                    closeLoader();
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        let mode = $("#hdnGuid").val().replaceAll('-', '') == 0 ? 'Created' : 'Updated';
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#Code').val() + ' - ' + $('#Name').val() + ' : ' + mode + ' Successfully', " Tag ");
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        console.error('Error saving Tag:', message);
                        if (message.includes("Tag Exist"))
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Tag Name or Code are existed", " Tag ");
                        else
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", " Tag ");
                    }
				},
				error: function (xhr, ajaxOptions, thrownError) {
					nType = 'danger';
                    message = 'Error In Updation';
                    console.error('Error saving Tag:', thrownError);
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", " Tag ")
				},

			});
		}
    });
});

function toJson() {
    return Project = { Guid: $("#hdnGuid").val(), Code: $('#Code').val(), Name: $('#Name').val(), Status: $('#Status').val() };
};