var nFrom = $(this).attr('data-from');
var nAlign = $(this).attr('data-align');
var nIcons = $(this).attr('data-notify-icon');
var nType = $(this).attr('data-type');
var nAnimIn = $(this).attr('data-animation-in');
var nAnimOut = $(this).attr('data-animation-out');
var message = '';

const urlParams = new URLSearchParams(window.location.search);
const fromDate = urlParams.get('fromDate');
if (fromDate == null || fromDate == undefined || fromDate == '') {
    var date = new Date();
    document.getElementById('fromDate').value = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
} else {
    const dateSplit = fromDate.split('-');
    document.getElementById('fromDate').value = dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0];
}

closeLoader();

function getBehiveData() {
    openLoader('Fetching Behive Employee Data....');
    var dt = document.getElementById('fromDate').value.split('-');
    var trimDate = '';
    if (dt[1] != undefined && dt[1] != '') {
        trimDate = dt[2] + '-' + dt[1] + '-' + dt[0];
    }
    window.location.replace('../BehiveImporter/Index?fromDate=' + trimDate);
}

function mergeEmployee() {
    var modelArray = displayList;
    var selected = [];
    $.each($("input[name='each-record']:checked"), function () {
        selected.push($(this).val());
    });
    console.log(selected);
    if (selected.length == 0) {
        alert('Please select atleast one record to proceed.');
        return false;
    }
    var request = [];
    selected.forEach((value) => {
        request.push(modelArray[value]);
    });
    openLoader('Importing selected records.....');
    $.ajax({
        url: '../BehiveImporter/MergeEmployee',
        data: JSON.stringify(request),
        type: 'Post',
        contentType: "application/json",
        success: function (data) {
            closeLoader();
            if (data?.success) {
                nType = 'success';
                message = data?.message;
                notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, 'Selected records Imported Successfully', " Behive Employee Importer ");
            } else {
                nType = 'danger';
                message = data?.message;
                notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " Behive Employee Importer ");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            closeLoader();
            nType = 'danger';
            message = 'Error In Updation';
            notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, " Behive Employee Importer ")
        },

    });
}

function selectRecord(elem) {
    console.log(elem.type);
    $('#check-' + elem.id.split('-')[1]).prop('checked', !$('#check-' + elem.id.split('-')[1]).prop('checked'));
    //elem.checked = !elem.checked;
}

function checkAll(elem) {
    console.log(elem);
    //$('each-record').prop('checked', !elem.checked);
    var checkboxes = document.getElementsByName('each-record')
    checkboxes.forEach((item) => {
        item.checked = elem.checked;
    })
}