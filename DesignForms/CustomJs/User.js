$(document).ready(function () {
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
        $('#Userform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'EmpCode': {
                    required: true,
                },
                'Mobile': {
                    required: true,
                },
                'UserName': {
                    required: false,
                },
                'EmailId': {
                    required: true,
                },
                'IsLocked': {
                    required: false,
                },
                'FirstName': {
                    required: true,
                },
                'LastName': {
                    required: true,
                },
                'Reporting': {
                    required: false
                },
                'Department': {
                    required: true
                },
                'Role': {
                    required: true
                },
                 'Projects': {
                    required: true
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

        if ($('#Userform').valid()) {
            openLoader('Saving user details.....');
            $.ajax({
                url: 'UserModification',
                data: toJson(),
                type: 'Post',
                success: function (data) {
                    closeLoader();
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        let mode = $("#hdnGuid").val().replaceAll('-', '') == 0 ? 'Created' : 'Updated';
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, $('#EmpCode').val() + ' - ' + $('#LastName').val() + ' : ' + mode + ' Successfully', " User ");
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        if (message.includes("User Exist"))
                            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "User Exist with First name and last name or Employee code  or Email Id.", " User ");
                        else notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " User ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    closeLoader();
                    nType = 'danger';
                    message = 'Error In Updation';
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " User ")
                },

            });
        }
    });



    $('#Department').change(function () {
        $.ajax({
            type: "Get",
            url: "/User/EmployeesbyDepartment",
            data: { Department: $("#Department").val() },
            datatype: "json",
            traditional: true,
            success: function (data) {
                var Reporting = "<select id='Reporting'>";
                Reporting = Reporting + '<option value="">--Select--</option>';
                for (var i = 0; i < data.length; i++) {
                    Reporting = Reporting + '<option value=' + data[i].value + '>' + data[i].text + '</option>';
                }
                Reporting = Reporting + '</select>';
                $('#Reporting').html(Reporting);
            }
        });
    });
});

function toJson() {
    return User = {
        Guid: $("#hdnGuid").val(), UserName: $('#UserName').val(), EmailId: $('#EmailId').val(),
        FirstName: $('#FirstName').val(), LastName: $('#LastName').val(),
        Mobile: $('#Mobile').val(), EmpCode: $('#EmpCode').val(),
        Department: $('#Department').val(), Reporting: $('#Reporting').val(), Role: $('#Role').val(),
        IsLocked: document.getElementById("IsLocked").checked, Active: "1", Projects: $('#Projects').val(),
    };
};