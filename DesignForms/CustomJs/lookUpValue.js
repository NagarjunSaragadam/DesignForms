 var durl = 'LookUpChild/LookUpTypeModification';

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
            $.ajax({
                url: durl,
                data: toJson(),
                type: 'Post',
                success: function (data) {
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        redirect();
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#Code').val() + ' - ' + $('#Name').val() + ' : ' + message, " Look Up Type ");
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        if (message.includes("Lookup Type Value Exist"))
                            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Lookup Type Value Exist Name or Code are existed", " Lookup Type Value ");
                        else
                            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "  Lookup Type Value  ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nType = 'danger';
                    message = 'Error In Operation';
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Lookup Type Value ");
                },

            });
        }
    });


    $("#LookupvaluesTables").on("click", ".up,.down", function () {
        var row = $(this).parents("tr:first");
        if ($(this).is(".up")) {
            var val1 = row.find("td").eq(1).text();
            var val2 = row.prev().find("td").eq(1).text();
            if (val2 == '' || val2 == null) {
                val2 = val1;
            }
            if (val1 == '' || val1 == null) {
                val1 = val2;
            }
           
            row.find("td").eq(1).text(val2);
           
            row.prev().find("td").eq(1).text(val1);
            row.insertBefore(row.prev());
            arrange_updown();
        }
        else {
           
            var val1 = row.find("td").eq(1).text();
            var val2 = row.next().find("td").eq(1).text();
            if (val2 == '' || val2 == null) {
                val2 = val1;
            }
            if (val1 == '' || val1 == null) {
                val1 = val2;
            }
            row.find("td").eq(1).text(val2);
            row.next().find("td").eq(1).text(val1);
            row.insertAfter(row.next());
            arrange_updown();
        }
    });
});

function loadPartialview(thisvalue) {
    var x = thisvalue.parentElement.parentElement;    
    $('#Code').val(x.cells[4].innerHTML);
    $("#Name").val(x.cells[5].innerHTML);    
    $('#hdnGuid').val(x.cells[7].innerHTML);
    $('#collapseExample').collapse('show');
}
function arrange_updown() {
    var count = $('.trow').length;
    $('.trow').each(function () {

        if (count == 1) {
            $(this).find('.upArrow').removeClass('icon-arrow-up');
            $(this).find('.downArrow').removeClass('icon-arrow-down');
        }
        else if ($(this).find('.OrderNo').text() == 1) {
            $(this).find('.upArrow').removeClass('icon-arrow-up');
            $(this).find('.downArrow').addClass('icon-arrow-down');
        }
        else if ($(this).find('.OrderNo').text() == count) {
            $(this).find('.downArrow').removeClass('icon-arrow-down');
            $(this).find('.upArrow').addClass('icon-arrow-up');
        }
        else {
            $(this).find('.upArrow').addClass('icon-arrow-up');
            $(this).find('.downArrow').addClass('icon-arrow-down');
        }
    });
}


function SaveOrder() {
    var nFrom = $(this).attr('data-from');
    var nAlign = $(this).attr('data-align');
    var nIcons = $(this).attr('data-notify-icon');
    var nType = $(this).attr('data-type');
    var nAnimIn = $(this).attr('data-animation-in');
    var nAnimOut = $(this).attr('data-animation-out');

    let requestJson = LookupvaluesOrdertoJson();
    if (requestJson.resultList.length > 0) {
        openLoader('Saving Lokup values order.....');
        $.ajax({
            url: 'LookUpChild/SaveLookupvaluesOrder',
            type: 'Post',
            data: LookupvaluesOrdertoJson(),
            success: function (data) {
                closeLoader();
                if (data?.success) {
                    nType = 'success';
                    message = data?.message;
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Lokup values ");
                    redirect();
                } else {
                    nType = 'danger';
                    message = data?.message;
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "  Lokup values  ");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                closeLoader();
                nType = 'danger';
                message = 'Error In Operation';
                notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Lokup values  ");
            },
        });
    } else {
        nType = 'danger';
        message = 'No changes to save.';
        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Lookup values ");
    }
}
function LookupvaluesOrdertoJson() {
    var LookupvaluesList = [];
    var userName = $('#hdnUserIDSS').val();
    var LookupTypeId = $('#hdntypeGuid').val();
    var Lclorderno = 0;
    $('.trow').each(function () {
        
        if ($(this).find('.OrderNo').text() === '' || $(this).find('.OrderNo').text() === 0 || $(this).find('.OrderNo').text() === '0') {
            Lclorderno = Lclorderno + 1;
        } else {
            Lclorderno = $(this).find('.OrderNo').text();
        }
        LookupvaluesList.push({
            Guid: $(this).find('.guid').text(),
            OrderId: Lclorderno,
            //Code: $(this).cells[2].querySelector('input').value,
            //Name: $(this).cells[3].querySelector('input').value,
            LookupTypeId: LookupTypeId,
            LastUpdatedBy: userName,
        });
    });
    return { resultList: LookupvaluesList};
}

function Closeform() {  
    $("#Name").val('');
    $('#Code').val('');
    $('#hdnGuid').val('');
  /*  $('#hdntypeGuid').val('');*/
}

function openform() {
    $('#lookupform').attr("style", "display:block");
}

function clearall() {
    $('#lookupform').val("");
}

function toJson() {
    return Reason = { Guid: $("#hdnGuid").val(), Code: $('#Code').val(), Name: $('#Name').val(), LookupTypeId: $('#hdntypeGuid').val()};
};

function redirect() {
    setTimeout(function () {
        location.reload();
    }, 2000);
}