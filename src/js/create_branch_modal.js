
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


chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.createBranchResponse != null) {
            if (message.createBranchResponse.message != null) {
                if (message.createBranchResponse.message == "Branch already exists") {
                    $("#input_branchName").addClass("is-invalid");
                    $("#invalidFeedback_branchName").text("Branch already exists!");
                }
                if (message.createBranchResponse.message.includes("Invalid reference")) {
                    $("#input_branchFrom").addClass("is-invalid");
                    $("#invalidFeedback_branchFrom").text("Reference name is invalid or not exists!");
                }
            } else if (message.createBranchResponse.error != null) {
                if (message.createBranchResponse.error.includes("branch is empty")) {
                    $("#input_branchName").addClass("is-invalid");
                    $("#invalidFeedback_branchName").text("Branch name cannot be empty!");
                }
                if (message.createBranchResponse.error.includes("ref is empty")) {
                    $("#input_branchFrom").addClass("is-invalid");
                    $("#invalidFeedback_branchFrom").text("Reference from cannot be empty!");
                }
            }
        }
    });


$(document).ready(function () {

    $("#badge_branchesCount").popover({ trigger: "hover" });

    $('#input_branchName').val(getParamValue("branch_name"));
    $('#badge_projectName').text(decodeURIComponent(getParamValue("project_name_with_namespace")));
    $('#badge_projectName').attr("href", getParamValue("project_web_url"));
    $('#badge_branchesCount').text(getParamValue("branch_count"));

    $("#ajaxSubmit").click(function () {
        sendMessage("clicked_createNewBranch", {
            branch: $('#input_branchName').val(),
            branch_from: $('#input_branchFrom').val()
        });
    });

    $("#badge_projectName").click(function () {
        sendMessage("clicked_openProjectOnGitlab", {
            web_url: $('#badge_projectName').attr("href"),
        });
    });

    $('#badge_branchesCount').mouseover(function () {
        var divName = $(this).data("id");
        $('#' + divName).fadeIn();
    });

    $("#input_branchName").on("change paste keyup", function () {
        if ($("#input_branchName").hasClass("is-invalid")) {
            $("#input_branchName").removeClass("is-invalid");
        }
    });

    $("#input_branchFrom").on("change paste keyup", function () {
        if ($("#input_branchFrom").hasClass("is-invalid")) {
            $("#input_branchFrom").removeClass("is-invalid");
        }
    });

});  