const KEY = "gitlab_settings";

function save() {
  var settings =
    JSON.stringify({
      'token': document.getElementById('input_token').value,
      'projectId': document.getElementById('input_projectId').value
    });
  var jsonfile = {};
  jsonfile[KEY] = settings;
  chrome.storage.sync.set(jsonfile, function () {
    console.log('Saved', KEY, settings);
  });
  document.getElementById("display_message").style.display = '';
}

document.getElementById("btnSave").addEventListener("click", save);
chrome.storage.sync.get(KEY, function (result) {
  if (result[KEY] != null) {
    var obj = JSON.parse(result[KEY]);
    document.getElementById('input_token').value = obj.token;
    document.getElementById('input_projectId').value = obj.projectId;
  }
});

window.addEventListener('click', function (e) {
  if (e.target.href !== undefined) {
    chrome.tabs.create({ url: e.target.href })
  }
})