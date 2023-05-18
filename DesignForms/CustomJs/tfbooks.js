$(document).ready(function () {
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
        $('#tfbform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'TfBookDate': {
                    required: true,
                },
                'TfBookNo': {
                    required: true,
                },
                'TfBookStartNo': {
                    required: true,
                },
                'TfBookEndNo': {
                    required: true,
                },
                //'AvailableTf': {
                //    required: true,
                //},
                'ProjectId': {
                    required: true,
                },
                'TfBookstatus': {
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

        if ($('#tfbform').valid()) {
            openLoader('Saving TF Book Details.');
            $.ajax({
                url: 'TransitFormBooksModification',
                data: toJson(),
                type: 'Post',
                success: function (data) {
                    closeLoader();
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        let mode = $("#hdnGuid").val().replaceAll('-', '') == 0 ? 'Created' : 'Updated';
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, ' Success ', " Transit Form Book ");
                        setTimeout(window.location.replace('/TransitFormBooks'), 3000);
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        //console.error('Error saving Transit Form Book:', message);
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, JSON.parse(message).detail , " Transit Form Book ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nType = 'danger';
                    message = 'Error In Updation';
                    //console.error('Error saving TF Book:', thrownError);
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", " Transit Form Book ")
                },

            });
        }
    });

    $('#TfBookStartNo, #TfBookEndNo').on('change', function () {
        var sn = $('#TfBookStartNo').val();
        var en = $('#TfBookEndNo').val();

        if (sn != undefined && sn != '' && en != undefined && en != '') {
            $('#AvailableTf').val(en - sn);
        }
    });    
});

function toJson() {
    return Project = {
        Id: $("#hdnId").val(), TfBookId: $("#hdnGuid").val(), TfBookDate: $('#TfBookDate').val(), TfBookNo: $('#TfBookNo').val(),
        TfBookStartNo: $('#TfBookStartNo').val(), TfBookEndNo: $('#TfBookEndNo').val(), AvailableTf: $('#AvailableTf').val(),
        ProjectId: $('#ProjectId option:selected').val(), TfBookstatus: $('#TfBookstatus option:selected').val()
    };
};