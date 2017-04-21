
chrome.tabs.onCreated.addListener(onTabCreated);
chrome.tabs.onUpdated.addListener(onTabUpdated);

function onTabCreated (tab){
    checkIfBoredPandaTab(tab);
}
function onTabUpdated( tabId,  changeInfo,  tab){
    if(changeInfo.status === "loading"){
        checkIfBoredPandaTab(tab);
    }

}

function checkIfBoredPandaTab(tab) {
    if (tab.url.indexOf("boredpanda.com") >= 0) {
        chrome.tabs.insertCSS(tab.id, {file: "style.css", allFrames: false, runAt: "document_end"}, function () {
            chrome.tabs.executeScript(tab.id, {file: "content.js", allFrames: false, runAt: "document_end"});
        });
    }
}