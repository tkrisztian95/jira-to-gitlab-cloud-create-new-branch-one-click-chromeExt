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

var branchHref = getParamValue("web_url");

$(document).ready(function () {
    $("#link_openBranch").click(function () {
        sendMessage("clicked_openBranchOnGitlab", {
            web_url: branchHref,
        });
    });
});  