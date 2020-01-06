// Github登录
function login_by_github(data_id, callback) {
    $.ajax({
        success: function (re) {
            callback(data_id, re);
        },
        url: "https://api.github.com/users/"+data_id, type: 'GET', timeoutSeconds: 10,
        dataType: 'json'
    });
}