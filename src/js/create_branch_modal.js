function getParamValue(paramName) {
    var url = window.location.search.substring(1); //get rid of "?" in querystring
    var qArray = url.split('&'); //get key-value pairs
    for (var i = 0; i < qArray.length; i++) {
        var pArr = qArray[i].split('='); //split key and value
        if (pArr[0] == paramName)
            return pArr[1]; //return value
    }
}

function postMessage() {
    window.parent.postMessage(
        {
            event_id: 'my_cors_message',
            data: {
                v1: 'value1',
                v2: 'value2'
            }
        },
        "*" //or "www.parentpage.com"
    );
}

function sendMessage(message, data) {

    var data = data || {};

    chrome.tabs.getSelected(null, function (tab) {

        if (!tab) return;

        chrome.tabs.sendMessage(tab.id, {

            message: message,

            data: data

        });

    });

};

$(document).ready(function () {

    $('#input_branchName').val(getParamValue("branch_name"));

    $("#ajaxSubmit").click(function () {
        console.log("#ajaxSubmit");

        sendMessage("clicked_createNewBranch", { branch: $('#input_branchName').val() });
    });
});  