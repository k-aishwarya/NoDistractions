// Saves options to chrome.storage

function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function replaceAll(str, term, replacement) {
  return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
}

function getSiteName(url){
    str = url
    str = str.substr(0, str.indexOf('.com'));
    str = replaceAll(str,"https","")
    str = replaceAll(str,":","")
    str = replaceAll(str,"www","")
    str = replaceAll(str,".","")
    str = replaceAll(str,"/","")
    str = replaceAll(str,"com","")
    return str
}   

function callback(tabs) {

    var maxTime = document.getElementById('maxTimeAllowed').value;
    var currentTab = tabs[0]; 
    chrome.extension.getBackgroundPage().console.log(currentTab); 
    siteName = getSiteName(currentTab.url)

    blockedSites = chrome.extension.getBackgroundPage().getSiteLists()
    if(blockedSites){
        if(blockedSites.includes(siteName)){
            alert(siteName + " is already blocked!!")
            return
        }
    }

    chrome.extension.getBackgroundPage().console.log(maxTime);
    chrome.extension.getBackgroundPage().console.log(siteName);

    chrome.extension.getBackgroundPage().setSiteOptions(siteName,maxTime)
    siteOptions = chrome.extension.getBackgroundPage().getSiteOptions(siteName) 

    chrome.extension.getBackgroundPage().addSitePatterns(siteName)
    sitePatterns = chrome.extension.getBackgroundPage().getSitePatterns()

    chrome.extension.getBackgroundPage().addBlockedSiteLists(siteName)
    

    chrome.extension.getBackgroundPage().console.log(sitePatterns)

    reloadTab(siteName)
}

function reloadTab(siteName){
    sitePattern = ["*://*."+ siteName +".com/*"]
    chrome.tabs.query({url: sitePattern}, function(temp) {
      for (var i=0; i<temp.length;i++){
        chrome.tabs.reload(temp[i].id)
      }
    });
}

function unblockCallback(tabs){
    var currentTab = tabs[0]; 
    siteName = getSiteName(currentTab.url)
    chrome.extension.getBackgroundPage().removeSiteLists(siteName)
    chrome.extension.getBackgroundPage().removeSitePattern(siteName)
    chrome.extension.getBackgroundPage().removeSiteOptions(siteName)
    chrome.extension.getBackgroundPage().unBlock(siteName)
    alert(siteName + " is unblocked!!")
}

function block_options() {
    var query = { active: true, currentWindow: true };
    chrome.tabs.query(query, callback);
}

function unblock_options() {
    var query = { active: true, currentWindow: true };
    chrome.tabs.query(query, unblockCallback);
}

  
document.getElementById('block').addEventListener('click',block_options);

document.getElementById('unblock').addEventListener('click',unblock_options);