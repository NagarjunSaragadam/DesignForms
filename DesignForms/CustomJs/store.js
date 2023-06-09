﻿$(document).ready(function () {
    // [ notification-button ]

    $('#loadRecord').click(function () {
        openLoader("Loading details...");
    });

    $('#deleteRecord').click(function () {
        openLoader("Deleting record...");
    });

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
        $('#storeform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'Code': {
                    required: true,                    
                },
                'Name': {
                    required: true,
                },
                'Project': {
                    required: true,
                },
				'ParentStore': {
                    required: false,                    
                },
                'Incharge': {
                    required: false,
                },
                'InchargeMobile': {
                    required: false,
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
		
        if ($('#storeform').valid()) {
            openLoader('Saving Store details.....');
			$.ajax({
				url: 'StoreModification',
				data: toJson(),
				type: 'Post',
                success: function (data) {
                    closeLoader();
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        let mode = $("#hdnGuid").val().replaceAll('-', '') == 0 ? 'Created' : 'Updated';
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#Code').val() + ' - ' + $('#Name').val() + ' : ' + mode + ' Successfully', " Store ");
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        if (message.includes("Store Exist"))
                            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Store Name or Code are existed", " Store ");
                        else notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " Store ");
                    }
				},
                error: function (xhr, ajaxOptions, thrownError) {
                    closeLoader();
					nType = 'danger';
					message = 'Error In Updation';
					notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " Store ")
				},

			});
		}
    });
});

function toJson() {
    return Project = { Guid: $("#hdnGuid").val(), Code: $('#Code').val(), Name: $('#Name').val(), InchargeMobile: $('#InchargeMobile').val(), Incharge: $('#Incharge').val(), ParentStore: $('#ParentStore').val(), Project: $('#Project').val() };
};