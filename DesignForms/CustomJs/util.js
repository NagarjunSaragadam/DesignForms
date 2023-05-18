function setActiveMenu(parent, child) {
    $("#" + parent + "-link").addClass(['active', 'pcoded-trigger']);
    $("#" + child + "-link").addClass("active");
}

function openLoader(status = 'Please wait.....') {
    $('#loader-message').html(status);
    $(".loader").show();
}

function closeLoader() {
    $(".loader").hide();
}

function getBehiveData() {
    var dt = document.getElementById('fromDate').value.split('-');
    if (dt == undefined || dt == '') {
        alert('Select the from date');
        return;
    }
    if (dt[1] == undefined)
        convertDate = null;
    else
        var convertDate = dt[1] + '-' + dt[2] + '-' + dt[0];
    window.location.replace("BehiveImporter?fromDate=" + convertDate);
}

function showHideFilters(show) {
    if (show) {
        $('#collapseExample').addClass('show');
    }
}