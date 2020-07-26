import Request from './request.js';
const request = Request.new({ token: '', projectId: '' });

const LOCAL_STORAGE_API_KEY = "gitlab_apikey";

let url = location.href;
console.log(url);
let issueId = url.split('/').pop();
var branches;

chrome.storage.sync.get(LOCAL_STORAGE_API_KEY, function (result) {
    console.log(result);
    apiKey = result[LOCAL_STORAGE_API_KEY];
    console.log("Api key loaded:" + apiKey)
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        if (key === LOCAL_STORAGE_API_KEY) {
            console.log("Api key updated");
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

function addButtonToIssueView() {
    request.getBranchFromGitlabAsync(issueId).then(branches => {
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
                var prefix = "task";
                var issueTitle = getIssueTitle().toLowerCase().replace(/ /g, "_");
                var branchName = prefix + "/" + issueId + "-" + issueTitle;
                console.log("click: " + branchName);
            });

            $controlRow.append($branchBtnContainer);
        })
    });
}

$(document).ready(function () {
    addButtonToIssueView();
});

export function main() {
    console.log("main()");
    console.log(
        "Is chrome.runtime available here?",
        typeof chrome.runtime.sendMessage == "function",
    );
}

