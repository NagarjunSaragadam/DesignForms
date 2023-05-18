var surveyRequired = false;
$(document).ready(function () {

    if ($('#hdnGuid').val() != '' && $('#hdnGuid').val() != undefined && $('#hdnGuid').val() != null) {
        $('.submitBtn').html('Update Permit')
    }

    $('#header_MineralId').val($('#header_MineralLocationId').val());

    $('.surveyorRequired').hide();

    $('#surveyRequired').change(function () {
        if (this.checked) {
            $('.surveyorRequired').show();
            surveyRequired = true;
        } else {
            $('.surveyorRequired').hide();
            surveyRequired = false;
        }
    });

    $('#header_MineralLocationId').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        $('#header_MineralId').val(valueSelected)
    });

    if (type == 'G') {
        $('.surveyorRequired').show();
        surveyRequired = true;
        $('#header').html(" Granite Permit Request");
    } else {
        $('.surveyorRequired').hide();
        surveyRequired = false;
    }


    $('#adddetails').on('click', function (e) {
        if (type == 'G' && ($('#permitReqTbl tr').length > $('#header_BlocksVehiclesCnt').val())) {
            alert('No of detailed records cannot be greater than Block/Vehicle Count.');
            return false;
        }
        e.preventDefault();
        // [ Initialize validation ]    

        $('#permitReqForm').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'blockNo': { required: surveyRequired, },
                'details-uom': { required: surveyRequired, },
                'length': { required: surveyRequired, },
                'breadth': { required: surveyRequired, },
                'height': { required: surveyRequired, },
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

        if ($('#permitReqForm').valid()) {
            addtabledata();
        }
    });


    $("#permitReqForm").on('click', '.remTD', function () {
        if (confirm("Are you sure you want to delete this?")) {
            $(this).parent().parent().remove();
        }
    });


    $('.notifications.btn').on('click', function (e) {

        if (type == 'G' && ($('#permitReqTbl tr').length <= $('#header_BlocksVehiclesCnt').val())) {
            alert('No of detailed records must be equal to Block/Vehicle Count.');
            return;
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
        $.validator.addMethod(
            'fromtodate_format',
            function (value, element) {
                var reffromdate = new Date($('#header_ReqFromDate').val());
                var reftodate = new Date($('#header_ReqToDate').val());
                return this.optional(element) || (reffromdate < reftodate);
            },
            'Must be greater then Requisition From Date'
        );

        $('#dynamicform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'header.LeaseHolderId': { required: true, },
                'header.MineralLocationId': { required: true, },
                'header.PrType': { required: true, },
                'header.ReqFromDate': { required: true, },
                'header.ReqToDate': { required: true, fromtodate_format: true },
                'header.UomId': { required: true, },
                'header.BlocksVehiclesCnt': { required: true, }
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
            if (type == 'G' && ($('#permitReqTbl tr').length <= 1)) {
                nType = 'danger';
                notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Please select Details you require", " Permit Req ");
            }
            else {
                $.ajax({
                    url: 'PermitRequestModification',
                    type: 'Post',
                    data: toJson(),
                    success: function (data) {
                        if (data?.success) {
                            nType = 'success';
                            message = data?.message;
                            //redirect();
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
                })

            }
        }
    });


});


function addtabledata() {
    var nFrom = $(this).attr('data-from');
    var nAlign = $(this).attr('data-align');
    var nIcons = $(this).attr('data-notify-icon');
    var nType = $(this).attr('data-type');
    var nAnimIn = $(this).attr('data-animation-in');
    var nAnimOut = $(this).attr('data-animation-out');

    var td1text = 'VSE' + new Date().getFullYear().toString().substr(-2) + String($('#permitReqTbl tr').length).padStart(6, '0');
    var td1value = '<input type="hidden" value="' + td1text + '">';
    var td1 = td1text + td1value;


    var td2text = $("#blockNo").val();
    var td2value = '<input type="hidden" value="' + td2text+'">';
    var td2 = td2text + td2value;


    var td3text = $("#details-uom option:selected").text();
    var td3value = '<input type="hidden" value="' + $("#details-uom option:selected").val() + '">';
    var td3 = td3text + td3value;

    var td4text = $("#length").val();
    var td4value = '<input type="hidden" value="' + td4text + '">';
    var td4 = td4text + td4value;

    var td5text = $("#breadth").val();
    var td5value = '<input type="hidden" value="' + td5text + '">';
    var td5 = td5text + td5value;

    var td6text = $("#height").val();
    var td6value = '<input type="hidden" value="' + td6text + '">';
    var td6 = td6text + td6value;

    var td7 = $("#length").val() * $("#breadth").val() * $("#height").val();

    let stat = 0;
    $('#permitReqTbl > tbody  > tr').each(function () {
        console.log(this.cells[2].querySelector('input').value);
        if (this.cells.length > 0) {
            if ($("#blockNo").val() === this.cells[2].querySelector('input').value && $("#details-uom option:selected").val() === this.cells[3].querySelector('input').value
                && $("#length").val() === this.cells[4].querySelector('input').value && $("#breadth").val() === this.cells[5].querySelector('input').value && $("#height").val() === this.cells[6].querySelector('input').value) {
                stat = 1;
            }
        }
    });

    if (stat == 0) {
        var firstRowContent = '<tr role="row"><td><a class="remTD feather icon-x-circle" href="#"></a></td>';
        var lastRowContent = '</tr >';
        var middle = '<td>' + td1 + '</td> <td>' + td2 + '</td> <td>' + td3 + '</td> <td>' + td4 + '</td> <td>' + td5 + '</td> <td>' + td6 + '</td> <td>' + td7 + '</td>';
        $("#permitReqForm tbody").append(firstRowContent + middle + lastRowContent);
    }
    else {
        nType = 'danger';
        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Same Details already added ", " Permit Req ");
    }
}


function toJson() {
    var header = {
        PrHeaderId: $("#hdnGuid").val(),
        LeaseHolderId: $('#header_LeaseHolderId').val(),
        MineralLocationId: $('#header_MineralLocationId').val(),
        MineralId: $('#header_MineralId').val(),
        MineralName: $('#header_MineralName').val(),
        SurveyRequired: (type == 'G' ? 1 : 0),
        PrType: $('#header_PrType').val(),
        ReqFromdate: $('#header_ReqFromdate').val(),
        ReqTodate: $('#header_ReqTodate').val(),
        RequestedQty: $('#header_RequestedQty').val(),
        UomId: $('#header_UomId').val(),
        BlocksVehiclesCnt: $('#header_BlocksVehiclesCnt').val()
    };
    var details = [];
    if (type == 'G') {
        $('#permitReqTbl > tbody  > tr').each(function () {
            var PermitRequestDetail = {};
            if (this.cells.length > 0) {
                PermitRequestDetail['BlkNo'] = this.cells[2].querySelector('input').value;
                PermitRequestDetail['UomId'] = this.cells[3].querySelector('input').value;
                PermitRequestDetail['ActualLength'] = this.cells[4].querySelector('input').value;
                PermitRequestDetail['ActualBreadth'] = this.cells[5].querySelector('input').value;
                PermitRequestDetail['ActualHeight'] = this.cells[6].querySelector('input').value;
                details.push(PermitRequestDetail);
            }
        });
    }

    return PermitRequest = { header, details };
}

function redirect() {
    setTimeout(function () {
        if (type == 'G')
            window.location.replace('/PermitRequest/GraniteIndex');
        else
            window.location.replace('/PermitRequest/');
    }, 2000);
}