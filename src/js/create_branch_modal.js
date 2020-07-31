
function getParamValue(paramName) {
    var url = window.location.search.substring(1); //get rid of "?" in querystring
    var qArray = url.split('&'); //get key-value pairs
    for (var i = 0; i < qArray.length; i++) {
        var pArr = qArray[i].split('='); //split key and value
        if (pArr[0] == paramName)
            return pArr[1]; //return value
    }
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

    $("#badge_branchesCount").popover({ trigger: "hover" });

    $('#input_branchName').val(getParamValue("branch_name"));
    $('#badge_branchesCount').text(getParamValue("branch_count"));
    $("#ajaxSubmit").click(function () {
        sendMessage("clicked_createNewBranch", {
            branch: $('#input_branchName').val(),
            branch_from: $('#input_branchFrom').val()
        });
    });

    $('#badge_branchesCount').mouseover(function () {
        var divName = $(this).data("id");
        $('#' + divName).fadeIn();
    });

});  