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
        $('#mdlholderform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'MdlhCode': {
                    required: true,
                },
                'MdlhName': {
                    required: true,
                },
                'MineralId': {
                    required: false,
                },
                'BusinessPlace': {
                    required: true,
                },
                'ValidFrom': {
                    required: true,
                },
                'ValidTo': {
                    required: true,
                },
                'SurveyNos': {
                    required: true,
                },
                'ContactPersionName': {
                    required: true,
                },
                'GstRegNo': {
                    required: true,
                },
                'PanNo': {
                    required: true,
                },
                'Mobile': {
                    required: true,
                },
                'AlternateMobile': {
                    required: true,
                },
                'Email': {
                    required: true,
                },
                'AddressLine1': {
                    required: true,
                },
                'AddressLine2': {
                    required: true,
                },
                'City': {
                    required: true,
                },
                'District': {
                    required: true,
                },
                'State': {
                    required: true,
                },
                'PinCode': {
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

        if ($('#mdlholderform').valid()) {
            openLoader('Saving MDL Holder Details.');
            $.ajax({
                url: 'MDLHolderModification',
                data: toJson(),
                type: 'Post',
                success: function (data) {
                    closeLoader();
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        let mode = $("#hdnGuid").val().replaceAll('-', '') == 0 ? 'Created' : 'Updated';
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, ' Success ', " MDL Holder ");
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        console.error('Error saving MDL Holder:', message);
                        if (message.includes("Exist"))
                            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Record already exist", " MDL Holder ");
                        else
                            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", " MDL Holder ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nType = 'danger';
                    message = 'Error In Updation';
                    console.error('Error saving MDL Holder:', thrownError);
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", " MDL Holder ")
                },

            });
        }
    });
});


function toJson() {
    return MDLHolder = {
        Id: $("#hdnId").val(), MdlhId: $("#hdnGuid").val(), MdlhCode: $('#MdlhCode').val(), MdlhName: $('#MdlhName').val(),
        MineralId: $('#MineralId option:selected').val(), BusinessPlace: $('#BusinessPlace').val(), ValidFrom: $('#ValidFrom').val(),
        ValidTo: $('#ValidTo').val(), SurveyNos: $('#SurveyNos').val(), ContactPersionName: $('#ContactPersionName').val(),
        GstRegNo: $('#GstRegNo').val(), PanNo: $('#PanNo').val(), Mobile: $('#Mobile').val(), AlternateMobile: $('#AlternateMobile').val(),
        Email: $('#Email').val(), AddressLine1: $('#AddressLine1').val(), AddressLine2: $('#AddressLine2').val(),
        City: $('#City').val(), District: $('#District option:selected').val(), State: $('#State option:selected').val(),
        PinCode: $('#PinCode').val()
    };
};