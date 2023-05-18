function onDimensionChange(id) {
    var selected = id.split('-')[1];
    if (selected && $('#length-' + selected).val() && $('#height-' + selected).val() && $('#breadth-' + selected).val()) {
        $('#volume-' + selected).html($('#length-' + selected).val() * $('#height-' + selected).val() * $('#breadth-' + selected).val());
    }
}

$(document).ready(function () {

    $('.notifications.btn').on('click', function (e) {
        var ret = false;
        $('#permitReqTbl > tbody  > tr').each(function () {
            if (this.cells.length > 0) {
                if (this.cells[8].querySelector('input').value &&
                    this.cells[9].querySelector('input').value &&
                    this.cells[10].querySelector('input').value) {

                } else {
                    alert('Please enter all Approved dimensions.');
                    ret = true;
                    return false;
                }
            }
        });

        if (ret) return false;
        e.preventDefault();
        var nFrom = $(this).attr('data-from');
        var nAlign = $(this).attr('data-align');
        var nIcons = $(this).attr('data-notify-icon');
        var nType = $(this).attr('data-type');
        var nAnimIn = $(this).attr('data-animation-in');
        var nAnimOut = $(this).attr('data-animation-out');
        var message = '';

        // [ Initialize validation ]

        $('#dynamicform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                //'header.LeaseHolderId': { required: true, }
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

        if ($('#dynamicform').valid()) {

            $.ajax({
                url: 'ApproveSurveyModification',
                type: 'Post',
                data: toJson(),
                success: function (data) {
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        redirect();
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Permit Request ");
                        redirect();
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "  Permit Request  ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nType = 'danger';
                    message = 'Error In Operation';
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Permit Request ")
                },
            });
        }
    });


});


function toJson() {
    var header = {
        PrHeaderId: $("#hdnGuid").val()
    };
    var details = [];
    $('#permitReqTbl > tbody  > tr').each(function () {
        var PermitRequestDetail = {};
        if (this.cells.length > 0) {
            PermitRequestDetail['PrDetailId'] = this.cells[0].querySelector('input').value;
            PermitRequestDetail['ApprovedLength'] = this.cells[8].querySelector('input').value;
            PermitRequestDetail['ApprovedBreadth'] = this.cells[9].querySelector('input').value;
            PermitRequestDetail['ApprovedHeight'] = this.cells[10].querySelector('input').value;
            details.push(PermitRequestDetail);
        }
    });

    return PermitRequest = { header, details };
}

function redirect() {
    setTimeout(function () {
        window.location.replace('/Survey/ApproveSurveyIndex');
    }, 2000);
}