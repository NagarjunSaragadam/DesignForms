﻿ var durl = 'LookUp/LookUpTypeModification';
var redirurl = 'index';
$(document).ready(function () {
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
        $('#lookupform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'Code': {
                    required: true,
                },
                'Name': {
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


        if ($('#lookupform').valid()) {
            openLoader('Saving Lookup details.....');
            $.ajax({
                url: 'LookUpTypeModification',
                data: toJson(),
                type: 'Post',
                success: function (data) {
                    closeLoader();
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;                        
                       // redirect();
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#Code').val() + ' - ' + $('#Name').val() + ' : ' + message, " Lookup Type ");
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        if (message.includes("Lookup Type Exist"))
                            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Lookup Type Name or Code are existed", " Lookup Type ");
                        else
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "  Lookup Type  ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nType = 'danger';
                    message = 'Error In Operation';
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Lookup Type ")
                },

            });
        }
    });
});

function loadPartialview(thisvalue) {
    openform();
    var x = thisvalue.parentElement.parentElement;    
    $("#Name").val(x.cells[3].innerHTML);
    $('#Code').val(x.cells[2].innerHTML);
    $('#hdnGuid').val(x.cells[4].innerHTML);
    $('#lookupform').show();
}

function openform() {    
    $('#lookupform').attr("style", "display:block");
}

function Closeform() {   
    $("#Name").val('');
    $('#Code').val('');
    $('#hdnGuid').val('');
    $('#lookupform').toggle();      
}

function toJson() {
    return Reason = { Guid: $("#hdnGuid").val(), Code: $('#Code').val(), Name: $('#Name').val()};
};

function redirect() {
    setTimeout(function () {
        location.reload();
    }, 2000);
}