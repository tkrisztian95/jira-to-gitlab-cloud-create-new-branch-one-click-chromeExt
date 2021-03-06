import Request from './request.js';
import { _x, getHTMLAsync } from './utils.js'

const KEY = "gitlab_settings";
var token;
var projectId;
var debug = false;

function log(message) {
    if (debug) {
        console.log(message);
    }
}

chrome.storage.sync.get(KEY, function (result) {
    if (result[KEY] != null) {
        var settings = JSON.parse(result[KEY]);
        this.token = settings.token;
        this.projectId = settings.projectId;
    }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        if (key === KEY) {
            var settings = JSON.parse(storageChange.newValue);
            this.token = settings.token;
            this.projectId = settings.projectId;
            log("Settings updated!")
        }
        log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});

function getIssueTitle() {
    return $("[data-test-id=\"issue.views.issue-base.foundation.summary.heading\"]").text();
}

function getIssueId() {
    var url = location.href;
    var issueId = url.split('/').pop();
    return issueId;
}

function addButtonToIssueView() {
    var $controlRow = $(_x("//*[@data-test-id='issue.views.issue-details.issue-layout.left-most-column']/div[2]/div"));
    if (!$controlRow.length) {
        log('Control row not found!');
    }
    getHTMLAsync("/src/html/button.html").then(buttonHTML => {
        var $branchBtnContainer = $(buttonHTML);
        var $branchBtn = $branchBtnContainer.find("button");

        $branchBtnContainer.mouseover(async function (event) {
            $branchBtn.attr('class', 'css-r3no7s');
        });

        $branchBtnContainer.mouseleave(async function (event) {
            $branchBtn.attr('class', 'css-1hy2148');
        });

        $branchBtn.click(async function (event) {
            var issueId = getIssueId();
            var prefix = "task";

            chrome.storage.sync.get(KEY, function (result) {
                if (result[KEY] != null) {
                    var settings = JSON.parse(result[KEY]);
                    let token = settings.token;
                    let projectId = settings.projectId;

                    Request.new({ token: token, projectId: projectId }).getProjectById(issueId).then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else if (response.status === 401) {
                            alert("GitLab access token is invalid! \nPlease check the Chrome extension settings!");
                        } else {
                            alert("Error happened during fetching branches from GitLab!");
                        }
                        throw new Error(response.status);
                    }).then((data) => {
                        log(data);
                        let project_name_with_namespace = data.name_with_namespace;
                        let project_web_url = data.web_url;

                        Request.new({ token: token, projectId: projectId }).searchBranch(issueId).then((response) => {
                            if (response.status === 200) {
                                return response.json();
                            } else if (response.status === 401) {
                                alert("Cannot create new branch, GitLab access token is invalid! \nPlease check the Chrome extension settings!");
                            } else {
                                alert("Error happened during fetching branches from GitLab!");
                            }
                            throw new Error(response.status);
                        }).then((data) => {
                            var branchesFoundWithIssueId = data.length;
                            var issueTitle = getIssueTitle().toLowerCase().replace(/ /g, "_");
                            var sugestedBranchName = prefix + "/" + issueId + "-" + issueTitle;
                            log("Branches found with issue id :" + branchesFoundWithIssueId);
                            openCreateBranchModal(project_name_with_namespace, project_web_url, sugestedBranchName, branchesFoundWithIssueId);
                        });
                    });

                } else {
                    alert("Please set the access token and project id first in the Chrome extension settings!");
                }
            });

        });

        $controlRow.prepend($branchBtnContainer);
    })
}

function addDevelopmentSectionToSidebar() {
    var $footNote = $('div[data-test-id=\"issue.views.issue-base.context.context-items\"]');
    if (!$footNote.length) {
        log('Footnote row not found!');
    }
    getHTMLAsync("/src/html/development.html").then(devHTML => {
        var $developmentContainer = $(devHTML);
        $footNote.after($developmentContainer);
    })
}

const openCreateBranchModal = (projectName, projectWebUrl, branchName, branchesCount) => {
    const modal = document.createElement("dialog");
    modal.setAttribute(
        "id", `modal_createBranch`);
    modal.setAttribute(
        "style", `
    height:350px;
    width: 550px;
    border: none;
    top:150px;
    border-radius:20px;
    background-color:white;
    position: fixed; box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
    `
    );
    modal.innerHTML = `<iframe id="popup-content-create"; style="height:100%" width="550"></iframe>
    <div style="position:absolute; top:0px; top:3px; left:543px;">
    <button style="padding: 8px 12px; font-size: 16px; border: none; border-radius: 20px;">x</button>
    </div>`;
    document.body.appendChild(modal);
    const dialog = document.getElementById("modal_createBranch");
    dialog.showModal();
    const iframe = document.getElementById("popup-content-create");
    iframe.src = chrome.extension.getURL("/src/html/createModal.html?" +
        "project_name_with_namespace=" + projectName +
        "&project_web_url=" + projectWebUrl +
        "&branch_name=" + branchName +
        "&branch_count=" + branchesCount);
    iframe.frameBorder = 0;
    dialog.querySelector("button").addEventListener("click", () => {
        dialog.close();
    });
    return modal;
}

function closeCreateBranchModal() {
    const dialog = document.getElementById("modal_createBranch");
    if (dialog) {
        dialog.close();
    }
}

const openSuccessNotifModal = (branchName, webUrl) => {
    log("openSuccessNotifModal:" + branchName + "_" + webUrl)
    const modal = document.createElement("dialog");
    modal.setAttribute(
        "id", `modal_branchCreateSuccessNotif`);
    modal.setAttribute(
        "style", `
    height:49px;
    width: 548px;
    border: none;
    top:60px;
    border-radius:20px;
    background-color:white;
    position: fixed; box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
    padding: inherit;
    overflow: hidden;
    `
    );
    modal.innerHTML = `<iframe id="popup-content-notif"; style="height:100%" width="550"></iframe>
    <div style="position:absolute; top:0px; top:5px; left:515px;">
    <button style="padding: 8px 12px; font-size: 16px; border: none; border-radius: 20px;">x</button>
    </div>`;
    document.body.appendChild(modal);
    const dialog = document.getElementById("modal_branchCreateSuccessNotif");
    dialog.showModal();
    const iframe = document.getElementById("popup-content-notif");
    iframe.src = chrome.extension.getURL("/src/html/successModal.html?" +
        "branch_name=" + branchName +
        "&web_url=" + webUrl
    );
    iframe.frameBorder = 0;
    dialog.querySelector("button").addEventListener("click", () => {
        dialog.close();
    });
    return modal;
}

function closeSuccessNotifModal() {
    const dialog = document.getElementById("modal_branchCreateSuccessNotif");
    if (dialog) {
        dialog.close();
    }
}

$(document).ready(function () {
    addButtonToIssueView();
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from iframe
        if (request.message === 'clicked_createNewBranch') {
            try {
                var name = request.data.branch;
                var from = request.data.branch_from;
                log("Clicked create new branch button on dialog with branch name: '" + name + "' and branch from '" + from + "'");
                Request.new({ token: this.token, projectId: this.projectId }).createNewBranch(name, from).then((response) => {
                    if (response.status === 201) {
                        return response.json();
                    } else if (response.status === 400) {
                        response.json().then(data => {
                            chrome.runtime.sendMessage(
                                { createBranchResponse: data });
                        });
                    } else if (response.status === 401) {
                        alert("Cannot create new branch, GitLab private token is invalid! \nPlease check the Chrome extension settings!");
                    } else {
                        throw new Error(response.status);
                    }
                }).then((data) => {
                    if (data != null) {
                        closeCreateBranchModal();
                        openSuccessNotifModal(data.name, data.web_url);
                        setTimeout(function () {
                            closeSuccessNotifModal();
                        }, 4000);
                    }
                });
            } catch (error) {
                log(`Error! ${error}`);
            } finally {
               // closeCreateBranchModal();
            }
        } else if (request.message === 'clicked_openProjectOnGitlab') {
            window.open(request.data.web_url);
        }
        else if (request.message === 'clicked_openBranchOnGitlab') {
            closeSuccessNotifModal();
            window.open(request.data.web_url);
        }
    });


export function main() {
    //console.log("main()");
    //console.log(
    //    "Is chrome.runtime available here?",
    //    typeof chrome.runtime.sendMessage == "function",
    //);
}

