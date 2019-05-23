
function getSiteNameFromDetails(details){
  if(details.tabId!=-1){
    sitename = getSiteforTabId(details.tabId)
    if(sitename){
      return sitename
    }
  }
  if(details.url){
    blockedSites = getSiteLists()
    if(blockedSites){
      for (var i=0;i< blockedSites.length; i++){
        if(details.url.includes(blockedSites[i])){
          console.log(blockedSites[i])
          return blockedSites[i];
        }
      }
    }
  }
  if(details.initiator){
    blockedSites = getSiteLists()
    if(blockedSites){
      for (var i=0;i< blockedSites.length; i++){
        if(details.initiator.includes(blockedSites[i])){
          console.log(blockedSites[i])
          return blockedSites[i];
        }
      }
    }
  }
  return null;
}

function getTodaysDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  } 
  if (mm < 10) {
    mm = '0' + mm;
  } 
  var today = dd + '-' + mm + '-' + yyyy;
  return today
}

function clearStorageEveryNewDay(){
  currentDay = getTodaysDate()
  lastDate = getLastDate()
  if(lastDate==null){
    setLastdate(currentDay) 
    lastDate = getLastDate()
  }
  if(lastDate){
    if(lastDate!=currentDay){
      timers = getTimers()
      if(timers){
        for (var i=0; i<timers.length;i++){
          clearInterval(timers[i])
        }
      }
      removeTimers();
      list = getSiteLists()
      if(list){
        for(var i=0; i<list.length;i++){
          siteName=list[i]
          var siteObj = getSiteObject(siteName)
          siteObj.total_delay=0
          setSiteObject(siteName,siteObj)
        }
      }
    }
  }
  setLastdate(currentDay) 
}

function reloadTab(siteObj){
  sitePattern = [siteObj.url]
  chrome.tabs.query({url: sitePattern}, function(temp) {
    for (var i=0; i<temp.length;i++){
      console.log("Reloading = " + temp[i].id)
      chrome.tabs.reload(temp[i].id)
    }
  });
}

function validateTabs(siteObject){
  console.log(siteObject)
  if(siteObject){
    siteName = siteObject.name
    tabs = siteObject.tabs
    for (var i=0; i<tabs.length;i++){
      try{
        console.log("Checking for " + tabs[i])
        chrome.tabs.get(tabs[i], function (tab){
          if (chrome.extension.lastError){
            var errorMsg = chrome.extension.lastError.message;
            console.log(errorMsg)
            tabId = parseInt(errorMsg.replace(/[^0-9]/g,''));
            console.log(tabId)
            removeTabIdFromSiteObject(tabId,siteName)
            removeTabSiteMap(tabId)
          }
          else{
            if(tab){
              console.log(tab)
              console.log(siteName)
              if(!tab.url.includes(siteName)){
                removeTabIdFromSiteObject(tab.id,siteName)
                removeTabSiteMap(tab.id)
              }
            }
          }
        })
      }catch(e){
        console.log("error in getting tab information")
      }
    }
    tabs = siteObject.tabs
    try{
      sitePattern = ["*://*."+ siteName +".com/*"]
      chrome.tabs.query({url: sitePattern}, function(temp) {
        for (var i=0; i<temp.length;i++){
          if(!tabs.includes(temp[i].id)){
            addTabIdFromSiteObject(temp[i].id,siteName)
            setTabIdSite(temp[i].id,siteName)
          }
        }
      });
    }catch(e){
      console.log(e.message)
    }
  }
}