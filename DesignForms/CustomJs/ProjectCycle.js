var projectTypeDeletedItems = [];
$(document).ready(function () {

    $("#ProjectTypesTable").on("click", "#removeItem", function () {
        if ($(this).attr('alt')) {
            projectTypeDeletedItems.push($(this).attr('alt'));
        }
        var row = $(this).closest('tr');
        var val1 = row.find("td").eq(0).text();
        var val2 = row.next().find("td").eq(0).text();
        row.find("td").eq(0).text(val2);
        row.next().find("td").eq(0).text(val1);
        row.insertBefore(row.next());
        row.remove();
        arrange_updown();
    });

    var nFrom = $(this).attr('data-from');
    var nAlign = $(this).attr('data-align');
    var nIcons = $(this).attr('data-notify-icon');
    var nType = $(this).attr('data-type');
    var nAnimIn = $(this).attr('data-animation-in');
    var nAnimOut = $(this).attr('data-animation-out');
    var message = '';

    $('#addProject').on('click', function (e) {
        e.preventDefault();
        // [ Initialize validation ]    

        $('#projectCycleform').validate({
            ignore: '.ignore, .select2-input',
            focusInvalid: false,
            rules: {
                'ProjectType': { required: true, },
                'ProjCycle': { required: true, }
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

        if ($('#projectCycleform').valid()) {
            addtabledata();
        }
    });

    function addtabledata() {
        let stat = 0;
        let count = 0;
        $('#ProjectTypesTable > tbody  > tr').each(function () {
            if (this.cells.length > 0) {
                count++;
                if ($("#ProjectType option:selected").val() === this.cells[2].querySelector('input').value && $("#ProjCycle option:selected").val() === this.cells[3].querySelector('input').value) {
                    stat = 1;
                }
            }
        });

        if (stat == 1) {
            nType = 'danger';
            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Same already already added ", " Project Cycle ");
            return;
        }

        var td1text = count + 1;
        var td1 = td1text;

        var td2hidden = "";

        var td2text = $("#ProjectType option:selected").text();
        var td2value = '<input type="hidden" value="' + $("#ProjectType option:selected").val() + '">';
        var td2 = td2text + td2value;

        var td3text = $("#ProjCycle option:selected").text();
        var td3value = '<input type="hidden" value="' + $("#ProjCycle option:selected").val() + '">';
        var td3 = td3text + td3value;

        var td4 = '<a href="#!" id="up"><i class="feather icon-arrow-up up upArrow"></i></a><a href="#!" id="down"><i class="feather icon-arrow-down down downArrow"></i></a>';

        var td6 = '<a href="#!" class="feather icon-x-circle" id="removeItem">';

        if (stat == 0) {
            var lastRowContent = '<td><a class="remTD feather icon-x-circle" href="#"></a></td></tr>';
            lastRowContent = '</tr>';
            var firstRowContent = '<tr class="trow"><td class="OrderNo">' + td1 + '</td><td hidden class="guid">' + td2hidden + '</td><td>' + td2 + '</td> <td>' + td3 + '</td> <td>' + td4 + '</td><td>' + td6 + '</td>';
            $("#ProjectTypesTable tbody").append(firstRowContent + lastRowContent);
        }
        arrange_updown();
    }

    arrange_updown();
    $("#ProjectTypesTable").on("click", ".up,.down", function () {
        var row = $(this).parents("tr:first");
        if ($(this).is(".up")) {
            var val1 = row.find("td").eq(0).text();
            var val2 = row.prev().find("td").eq(0).text();
            row.find("td").eq(0).text(val2);
            row.prev().find("td").eq(0).text(val1);
            row.insertBefore(row.prev());
            arrange_updown();
        }
        else {
            var val1 = row.find("td").eq(0).text();
            var val2 = row.next().find("td").eq(0).text();
            row.find("td").eq(0).text(val2);
            row.next().find("td").eq(0).text(val1);
            row.insertAfter(row.next());
            arrange_updown();
        }
    });

    $("#ProjectType").change(function () {
        $('#projectCycleform').submit();
    });

    $('#loadRecord').click(function () {
        openLoader("Loading details...");
    });

    $('#deleteRecord').click(function () {
        openLoader("Deleting record...");
    });

});

    function SaveOrder() {
        var nFrom = $(this).attr('data-from');
        var nAlign = $(this).attr('data-align');
        var nIcons = $(this).attr('data-notify-icon');
        var nType = $(this).attr('data-type');
        var nAnimIn = $(this).attr('data-animation-in');
        var nAnimOut = $(this).attr('data-animation-out');

        let requestJson = ProjectCycleOrdertoJson();
        if (requestJson.resultList.length > 0 || requestJson.deletedItems.length > 0) {
            openLoader('Saving ProjectCycle details.....');
            $.ajax({
                url: 'SaveProjectOrder',
                type: 'Post',
                data: ProjectCycleOrdertoJson(),
                success: function (data) {
                    closeLoader();
                    if (data?.success) {
                        nType = 'success';
                        message = data?.message;
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Project Cycle ");
                        redirect();
                    } else {
                        nType = 'danger';
                        message = data?.message;
                        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "  Project Cycle  ");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    closeLoader();
                    nType = 'danger';
                    message = 'Error In Operation';
                    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Project Cycle ");
                },
            });
        } else {
            nType = 'danger';
            message = 'No changes to save.';
            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, message, " Project Cycle ");
        }
    }

    function ProjectCycletoJson() {
        return ProjectCycle = { ProjectType: $('#ProjectType').val(), ProjCycle: $('#ProjCycle').val() };
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

    function ProjectCycleOrdertoJson() {
        var ProjectCycle = [];
        $('.trow').each(function () {
            ProjectCycle.push({
                Guid: $(this).find('.guid').text(),
                OrderNo: $(this).find('.OrderNo').text(),
                ProjectType: this.cells[2].querySelector('input').value,
                ProjCycle: this.cells[3].querySelector('input').value,
                CreatedBy: userName,
                LastUpdatedBy: userName
            });
        });
        return { CreatedBy: userName, LastUpdatedBy: userName, resultList: ProjectCycle, deletedItems: projectTypeDeletedItems };
    }

    function redirect() {
        setTimeout(function () {
            window.location.replace('/ProjectCycle/');
        }, 2000);
    }