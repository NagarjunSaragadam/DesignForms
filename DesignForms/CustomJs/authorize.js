var session = window.localStorage.getItem('vs-login-auth-token');
if (session == '' || session == undefined || session == 'undefined') {
    window.location.replace("../Unauthorized");
}
/*
try {
    var status = atob(session);
    var userName = status.split('~')[0];
} catch (err) {
    console.log(err.message);
    window.location.replace("../Unauthorized");
}*/

function setUserName() {
    document.getElementById('loggedinUser').innerHTML = userName;
}

function logout() {
    window.localStorage.removeItem('vs-login-auth-token');
    window.location.replace('../login');
}

function getSession() {
    var session = window.localStorage.getItem('vs-login-auth-token');
    if (session == '' || session == undefined || session == 'undefined') {
        window.location.replace("../Unauthorized");
    }
    return session;
}

function callAPI(params) {
    $.ajax({
        url: params.url,
        type: params.type,
        data: params.data,
        dataType: 'json',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", getSession());
        },
        success: params.successCallback,
        error: params.errorCallback
    });
}