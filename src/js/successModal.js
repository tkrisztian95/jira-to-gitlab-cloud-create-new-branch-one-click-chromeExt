import { getParamValue, sendMessage } from "/src/js/utils.js";

var branchHref = getParamValue("web_url");

$(document).ready(function () {
    $("#link_openBranch").click(function () {
        sendMessage("clicked_openBranchOnGitlab", {
            web_url: branchHref,
        });
    });
});  