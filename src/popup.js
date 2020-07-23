const LOCAL_STORAGE_API_KEY = "gitlab_apikey";

function saveApiKey() {
    var apikey = document.getElementById('apikey').value;
    var jsonfile = {};
    jsonfile[LOCAL_STORAGE_API_KEY] = apikey;
    chrome.storage.sync.set(jsonfile);
    document.getElementById("display_message").style.display= '';
    console.log("GitLab api key updated: " + JSON.stringify(jsonfile));
}

document.getElementById("btnSetApiKey").addEventListener("click", saveApiKey);
chrome.storage.sync.get(LOCAL_STORAGE_API_KEY, function (result) {
    document.getElementById('apikey').value = result[LOCAL_STORAGE_API_KEY];
});

window.addEventListener('click',function(e){
    if(e.target.href!==undefined){
      chrome.tabs.create({url:e.target.href})
    }
  })