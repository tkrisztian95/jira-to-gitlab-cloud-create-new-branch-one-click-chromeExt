const LOCAL_STORAGE_API_KEY = "gitlab_apikey";

var apiKey = "";
var projectId = "";

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

const getBranchFromGitlabAsync = async (issueId) => {
    console.log('Fetching branch of: "' + issueId + '"');
    const response = await fetch(encodeURI('https://gitlab.com/api/v4/projects/' + projectId + '/repository/branches?search=' + issueId), {
        method: 'GET',
        headers: {
            'PRIVATE-TOKEN': ''
        }
    });
    const myJson = await response.json(); //extract JSON from the http response


    console.log(myJson);

    return myJson;
}

const getButtonInnerHTMLAsync = async () => {
    const buttonDoc = await fetch(chrome.runtime.getURL("/src/data/button.html"))
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

            // console.log(doc);
            return doc;
        })
        .catch(function (err) {
            console.log('Failed to fetch page: ', err);
        });
    return buttonDoc.body.innerHTML;
}

function addButtonToIssueView() {
    getBranchFromGitlabAsync(issueId).then(branches => {
        var buttonRow = document.querySelector('#helpPanelContainer > div > div.css-kyhvoj > div.css-e48442 > div.sc-lhVmIH.qZopO > div > div > div > div > div.sc-lfIlRe.blteI > div > div.sc-ktHwxA.dibHAR > div.sc-caSCKo.frDVEh > div > div.GridColumnElement__GridColumn-sc-57x38k-0.lnhCWP > div > div > div:nth-child(2) > div');
        getButtonInnerHTMLAsync().then(buttonHTML => {
            buttonRow.insertAdjacentHTML('beforeend', buttonHTML);
        })
    });
}

addButtonToIssueView();