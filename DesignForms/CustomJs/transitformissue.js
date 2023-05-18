$(document).ready(function () {

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
                'header.IssueDate': { required: true, },
                'header.IssuedBy': { required: true, },
                'header.PaymentDate': { required: true, },
                'header.PaymentMode': { required: true, },
                'header.PayAmount': { required: true, },
                'header.UomId': { required: true, }
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
                url: 'TransitFormsIssueModification',
                type: 'Post',
                data: toJson(),
                success: function (data) {
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        //redirect();
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Transit Form Issue ");
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "  Transit Form Issue  ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nType = 'danger';
                    message = 'Error In Operation';
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Transit Form Issue ")
                },
            })
        }
    });


});

function toJson() {
    var header = {
        PrHeaderId: $("#PrHeaderId").val(),
        PermitNo: $('#header_PermitNo').val(),
        IssueDate: $('#header_IssueDate').val(),
        IssuedBy: $('#header_IssuedBy').val(),
        PaymentDate: $('#header_PaymentDate').val(),
        PaymentMode: $('#header_PaymentMode').val(),
        PayAmount: $('#header_PayAmount').val()
    };
    var details = [];
    $('#trnstIssTbl > tbody  > tr').each(function () {
        var TransitFormIssueDetail = {};
        if (this.cells.length > 0) {
            TransitFormIssueDetail['ContractorBlkNo'] = this.cells[1].innerHTML.trim();
            TransitFormIssueDetail['MdlHolderId'] = this.cells[26].querySelector('select').value;
            TransitFormIssueDetail['TransitFormBookNoId'] = this.cells[23].querySelector('select').value;
            details.push(TransitFormIssueDetail);
        }
    });

    return TransitFormIssue = { header, details };
}

function redirect() {
    setTimeout(function () {
        window.location.replace('/TransitFormIssue/');
    }, 2000);
}