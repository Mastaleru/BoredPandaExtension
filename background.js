
chrome.tabs.onCreated.addListener(onTabCreated);
chrome.tabs.onUpdated.addListener(onTabUpdated);

function onTabCreated (tab){
    checkIfBoredPandaTab(tab);
}
function onTabUpdated( tabId,  changeInfo,  tab){
    if(changeInfo.status === "pending"){
        checkIfBoredPandaTab(tab);
    }

}

function checkIfBoredPandaTab(tab){
    if(tab.url.indexOf("boredpanda.com")>=0){
        console.log("asdas");
        chrome.tabs.executeScript(tab.id, {file:"content.js",allFrames:false,runAt:"document_end"});
    }
}