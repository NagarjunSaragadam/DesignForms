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
        $('#LeaseHolderform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'LeaseHolderName': { required: true, },
                'LeaseHolderCode': { required: true, },
                'ContactPerson': { required: true, },
                'PanNumber': { required: true, },
                'GstRegistrationNo': { required: true, },
                'EmailId': { required: true, },
                'MobileNo': { required: true, },
                'City': { required: true, },
                'District': { required: true, },
                'State': { required: true, },
                'PinCode': { required: true, },
                'AddressLine1': { required: true, },
                'AddressLine2': { required: false, },
               
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

        if ($('#LeaseHolderform').valid()) {
            openLoader('Saving Lease Holder details.....');
            $.ajax({
                url: 'LeaseHolderModification',
                data: toJson(),
                type: 'Post',
                success: function (data) {
                    closeLoader();
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        let mode = $("#hdnGuid").val().replaceAll('-', '') == 0 ? 'Created' : 'Updated';
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#LeaseHolderCode').val() + ' - ' + $('#LeaseHolderName').val() + ' : ' + mode + " successfully.", " Lease holder ");
                        //window.location.replace('/project');
                    } else {
                        nType = 'danger';
                        message = data?.message ? data?.message : 'Error saving';
                        console.error("Error saving lease holder details:", data);
                        if (message.includes("Mines lease holder already Exist"))
                            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Lease holder Name or Code are existed", " Project ");
                        else
                            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", " Project ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    closeLoader();
                    nType = 'danger';
                    message = 'Error In Updation';
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " Project ")
                },

            });
        }

       
    });
    $('#State').change(function () {
        $.ajax({
            type: "Get",
            url: "/MinesLeaseHolders/DistrictsbyState",
            data: { StateId: $("#State").val() },
            datatype: "json",
            traditional: true,
            success: function (data) {
                var District = "<select id='District'>";
                District = District + '<option value="">--Select--</option>';
                for (var i = 0; i < data.length; i++) {
                    District = District + '<option value=' + data[i].value + '>' + data[i].text + '</option>';
                }
                District = District + '</select>';
                $('#District').html(District);
            }
        });
    });
});

function toJson() {
    return MinesLeaseHolder = {
        LeaseHolderId: $('#LeaseHolderId').val(),
        LeaseHolderName: $('#LeaseHolderName').val(),
        LeaseHolderCode: $('#LeaseHolderCode').val(),
        ContactPerson: $('#ContactPerson').val(),
        PanNumber: $('#PanNumber').val(),
        GstRegistrationNo: $('#GstRegistrationNo').val(),
        EmailId: $('#EmailId').val(),
        MobileNo: $('#MobileNo').val(),
        City: $('#City').val(),
        District: $('#District').val(),
        State: $('#State').val(),
        PinCode: $('#PinCode').val(),
        CityTown: $('#CityTown').val(),
        AddressLine1: $('#AddressLine1').val(),
        AddressLine2: $('#AddressLine2').val(),
    };
};