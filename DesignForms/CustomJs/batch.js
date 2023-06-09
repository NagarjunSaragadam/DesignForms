﻿$(document).ready(function () {

    $("#opsbutton").click(function () {
        $("#PurchaseOrderId").removeClass('is-invalid');
    });

    $("#PurchaseOrderId").change(function () {

        if ($(this).val() == '' || $(this).val() < 1) {
            $("#PurchaseProject").val('');
            $("#PurchaseStore").val('');
            $("#Company").val('');
            $("#NewPurchaseOrderNo").val('');            
            $("#POButton").css("display", "block");
            $("#npo").css("display", "block");
        } else {
            $("#POButton").css("display", "none");
            $("#npo").css("display", "none");
            $.ajax({
                url: 'POGet',
                type: 'Post',
                data: Batch = { Guid: $(this).val() },
                success: function (data) {
                    $("#PurchaseOrderNo").val(data.purchaseOrderNo);
                    $("#PurchaseOrderDate").val(data.purchaseOrderDate);
                    $("#Company").val(data.company);
                    $("#PurchaseProject").val(data.purchaseProject);
                    getstore(data.purchaseProject, data.purchaseStore);

                    closeLoader();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nType = 'danger';
                    message = 'Error In Updation';
                    closeLoader();
                },

            });
        }
    });


    $("#PurchaseProject").change(function () {        
        getstore($(this).val());
        getCompany($(this).val())       
    });   

    // [ notification-button ]
    $('#batchButton').on('click', function (e) {
        e.preventDefault();
        var poId = $("#PurchaseOrderId").val();
        if (poId == null || poId == undefined || poId == '') {
            //swal("Please select Purchase Order to proceed..", "Purchase Order Batch Save", "error");
            $("#PurchaseOrderId").addClass('is-invalid');
            $("#PurchaseOrderId").focus();
            $("#PurchaseOrderId").blur();
            return false;
        }

        // [ Initialize validation ]
        $('#batchform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                "BatchNo": { required: true, },
                "BatchDescription": { required: false, },
                "Quantity": { required: true, },
                "AssetType": { required: true, },
                "AssetSpecification": { required: true, },
                "RecordStatus": { required: true, },
                "PurchaseBatchMasterGuid": { required: true, },
                "Uom": { required: true, },
                "UseFrequency": { required: true, },
                "UsageUom": { required: true, },
                "BatchStatus": { required: true, },
                "InvoiceNo": { required: true, },
                "InvoiceDate": { required: true, },
                "ReceivedBy": { required: true, },
                "ReceivedDate": { required: true, },
                "StructureType": { required: true, },
                "StructureSubType": { required: true, }
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

        if ($('#batchform').valid()) {
            swal({
                title: "Batch Generation!",
                text: "Do you want to auto-generate Assets for this Batch?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((yes) => {
                    if (yes) {
                        var request = toJson();
                        request["BatchStatus"] = "Processed";
                        saveBatch(request);
                    } else {
                        saveBatch(toJson());
                    }
                });
        }
        
    });

    $('#POButton').on('click', function (e) {
        e.preventDefault();

        var nFrom = $(this).attr('data-from');
        var nAlign = $(this).attr('data-align');
        var nIcons = $(this).attr('data-notify-icon');
        var nType = $(this).attr('data-type');
        var nAnimIn = $(this).attr('data-animation-in');
        var nAnimOut = $(this).attr('data-animation-out');
        var message = '';

        // [ Initialize validation ]
        $('#poform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {    
                "NewPurchaseOrderNo": { required: true, },
                "PurchaseOrderDate": { required: false, },
                "PurchaseStore": { required: true, },
                "PurchaseProject": { required: true, },
                "Company": { required: true, },                
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

        if ($('#poform').valid()) {
            openLoader('Saving Purchase Order details.....');
            $.ajax({
                url: 'POModification',
                data: toPOJson(),
                type: 'Post',
                success: function (data) {
                    closeLoader();
                    console.log(data);
                    if (data?.success) {
                        $('#PurchaseOrderId').append(new Option($('#NewPurchaseOrderNo').val(), data?.header));
                        $("#PurchaseOrderId").val(data?.header);     
                        $("#POButton").css("display", "none");
                        $("#npo").css("display", "none");
                        nType = 'success';
                        message = data?.message;
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#NewPurchaseOrderNo').val() + ' : Created Successfully', " Purchase Order ");
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        if (message.includes("PurchaseOrder Exist"))
                            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "PurchaseOrder No Exist ", " PurchaseOrder ");
                        else
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " Batch ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nType = 'danger';
                    message = 'Error In Updation';
                    closeLoader();
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " Batch ");
                },

            });
        }
    });

    function getstore(projectId, storeid) {
        setTimeout(function () {
            $.ajax({
                url: 'POStoreByProject',
                type: 'Post',
                data: Project = { Guid: projectId },
                success: function (data) {
                    $("#PurchaseStore").empty();
                    $.each(data, function (text, value) {
                        if (value.value != storeid)
                            $("#PurchaseStore").append($("<option/>").val(value.value).text(value.text));
                        else
                            $("#PurchaseStore").append($("<option selected/>").val(value.value).text(value.text));
                    });
                },
                error: function (xhr, ajaxOptions, thrownError) {

                }
            });
        }, 200);
    }

    function getCompany(projectId) {
        setTimeout(function () {
            $.ajax({
                url: 'POCompanyByProject',
                type: 'Post',
                data: Project = { Guid: projectId },
                success: function (data) {
                    $("#CompanyName").val(data.value);
                },
                error: function (xhr, ajaxOptions, thrownError) {

                }
            });
        }, 200);
    }

    const urlSearchParamlo = new URLSearchParams(window.location.search);
    const lparams = Object.fromEntries(urlSearchParamlo.entries());

    if (lparams.guid.length > 3) {
        $("#POButton").css("display", "none");
        $("#npo").css("display", "none");
        $("#PurchaseOrderId").attr('disabled', 'disabled');        
    }

});

function toJson() {
    return Batch = {
        Guid: $("#hdnGuid").val(), BatchNo: $("#BatchNo").val(), BatchDescription: $("#BatchDescription").val(), BatchQuantity: $("#BatchQuantity").val(),
        AssetType: $("#AssetType").val(), AssetSpecification: $("#AssetSpecification").val(), PurchaseOrderId: $("#PurchaseOrderId").val(), Uom: $("#Uom").val(),
        UseFrequency: $("#UseFrequency").val(), UsageUom: $("#UsageUom").val(), BatchStatus: "New", InvoiceNo: $("#InvoiceNo").val(), InvoiceDate: $("#InvoiceDate").val(), ReceivedBy: $("#ReceivedBy").val(),
        ReceivedDate: $("#ReceivedDate").val(), StructureType: $("#StructureType").val(), StructureSubType: $("#StructureSubType").val(), CreatedBy: 'SYSTEM',
        PurchaseOrderNo: $("#NewPurchaseOrderNo").val(), PurchaseOrderDate: $("#PurchaseOrderDate").val(), PurchaseStore: $("#PurchaseStore").val(),
        PurchaseProject: $("#PurchaseProject").val(), Company: $("#Company").val()
    };
};

function toPOJson() {
    return PurchaseOrder = {
        PurchaseOrderNo: $("#NewPurchaseOrderNo").val(),
        PurchaseOrderDate: $("#PurchaseOrderDate").val(),
        PurchaseStore: $("#PurchaseStore").val(),
        PurchaseProject: $("#PurchaseProject").val(),
        Company: $("#Company").val()
    };
};

function clearall() {
    $("#PurchaseOrderNo").val('');
    $("#PurchaseOrderDate").val('');
    $("#PurchaseStore").val('');
    $("#PurchaseProject").val('');
    $("#Company").val('');
}

function saveBatch(request) {
    openLoader('Saving Purchase Order Batch details.....');
    var nFrom = $(this).attr('data-from');
    var nAlign = $(this).attr('data-align');
    var nIcons = $(this).attr('data-notify-icon');
    var nType = $(this).attr('data-type');
    var nAnimIn = $(this).attr('data-animation-in');
    var nAnimOut = $(this).attr('data-animation-out');
    var message = '';
    $.ajax({
        url: 'BatchModification',
        data: request,
        type: 'Post',
        success: function (data) {
            closeLoader();
            if (data?.success) {
                nType = 'success';
                message = data;
                let mode = $("#hdnGuid").val().replaceAll('-', '') == 0 ? 'Created' : 'Updated';
                notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#BatchNo').val() + ' - ' + $('#BatchDescription').val() + ' : ' + mode + ' Successfully', " Batch ");
                window.location.replace('/batch');
            } else {
                nType = 'danger';
                message = data?.message ? data?.message : 'Error saving';
                console.error("Error saving batch details:", data);
                notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Error saving", " Batch ");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            closeLoader();
            nType = 'danger';
            message = 'Error In Updation';
            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " Batch ")
        },

    });
}