import Request from './request.js';
const request = Request.new({ token: '', projectId: '' });

const KEY = "gitlab_settings";



chrome.storage.sync.get(KEY, function (result) {
    var settings = JSON.parse(result[KEY]);
    var token = settings.token;
    var projectId = settings.projectId;
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        if (key === KEY) {
            console.log("Api key updated " + key + " " + storageChange);
            apiKey = storageChange.newValue;
        }
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});

const getButtonInnerHTMLAsync = async () => {
    const buttonDoc = await fetch(chrome.runtime.getURL("/src/html/model/button.html"))
        .then(function (response) {
            // When the page is loaded convert it to text
            return response.text()
        }).then(function (html) {
            // Initialize the DOM parser
            var parser = new DOMParser();

            // Parse the text
            var doc = parser.parseFromString(html, "text/html");

            // You can now even select part of that html as you would in the regular DOM 
            // Example:
            // var docArticle = doc.querySelector('article').innerHTML;

            console.log(doc);
            return doc;
        })
        .catch(function (err) {
            console.log('Failed to fetch page: ', err);
        });
    return buttonDoc.body.innerHTML;
}

function getIssueTitle() {
    return $("[data-test-id=\"issue.views.issue-base.foundation.summary.heading\"]").text();
}

function getIssueId() {
    var url = location.href;
    var issueId = url.split('/').pop();
    return issueId;
}

function addButtonToIssueView() {
    var $controlRow = $('#helpPanelContainer > div > div.css-kyhvoj > div.css-e48442 > div.sc-hzDkRC.cJZhDw > div > div > div > div > div.sc-mLCjK.dvEKLH > div > div.sc-jDwBTQ.kLMxby > div.sc-gqjmRU.hNsKca > div > div.GridColumnElement__GridColumn-sc-57x38k-0.lnhCWP > div > div > div:nth-child(2) > div');
    if (!$controlRow.length) {
        console.log('Control row not found!');
    }
    getButtonInnerHTMLAsync().then(buttonHTML => {
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
            var issueTitle = getIssueTitle().toLowerCase().replace(/ /g, "_");
            var branchName = prefix + "/" + issueId + "-" + issueTitle;
            console.log("click: " + branchName);
            showModal(branchName);
        });

        $controlRow.append($branchBtnContainer);
    })
}

const showModal = (branchName) => {
    const modal = document.createElement("dialog");
    modal.setAttribute(
        "style", `
    height:250px;
    width: 450px;
    border: none;
    top:150px;
    border-radius:20px;
    background-color:white;
    position: fixed; box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
    `
    );
    modal.innerHTML = `<iframe id="popup-content"; style="height:100%"></iframe>
    <div style="position:absolute; top:0px; left:5px;">
    <button style="padding: 8px 12px; font-size: 16px; border: none; border-radius: 20px;">x</button>
    </div>`;
    document.body.appendChild(modal);
    const dialog = document.querySelector("dialog");
    dialog.showModal();
    const iframe = document.getElementById("popup-content");
    iframe.src = chrome.extension.getURL("/src/html/model/create_branch_modal.html?branch_name=" + branchName);
    iframe.frameBorder = 0;
    dialog.querySelector("button").addEventListener("click", () => {
        dialog.close();
    });
}

window.addEventListener('cors_event', function (event) {
    console.log("Window event");
    if (event.data.event_id === 'my_cors_message!') {
        console.log(event.data.data);
    }
});

$(document).ready(function () {
    addButtonToIssueView();
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("Message listener:" + request)
        // listen for messages sent from iframe
        if (request.message === 'clicked_createNewBranch') {
            try {
                console.log("Clicked create new branch button on dialog with branch name: '" + request.data.branch + "'");
            } catch (error) {
                console.log(`Error! ${error}`);
            } finally {
               
            }
        }
    });



export function main() {
    console.log("main()");
    console.log(
        "Is chrome.runtime available here?",
        typeof chrome.runtime.sendMessage == "function",
    );
}

