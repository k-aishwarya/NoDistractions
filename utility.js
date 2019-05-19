
function getSiteNameFromDetails(details){
  if(details.tabId!=-1){
    sitename = getSiteforTabId(details.tabId)
    if(sitename){
      return sitename
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
  // if(details.url){
  //   blockedSites = getSiteLists()
  //   if(blockedSites){
  //     for (var i=0;i< blockedSites.length; i++){
  //       if(details.url.includes(blockedSites[i])){
  //         console.log(blockedSites[i])
  //         return blockedSites[i];
  //       }
  //     }
  //   }
  // }
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
  cleared = false
  if(lastDate){
    if(lastDate!=currentDay){
      timers = getTimers()
      if(timers){
        for (var i=0; i<timers.length;i++){
          clearInterval(timers[i])
        }
      }
      localStorage.clear()
      cleared = true
    }
  }
  setLastdate(currentDay) 
  return cleared
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
  siteName = siteObject.name
  tabs = siteObject.tabs
  for (var i=0; i<tabs.length;i++){
    try{
      chrome.tabs.get(tabs[i], function (tab){
        if(!tab){
          removeTabIdFromSiteObject(tabs[i],siteName)
          chrome.browserAction.setIcon({
            path : "images/icon16.png",
            tabId : tabs[i]
          });
        }
      })
    }catch(e){
      console.log(e.message)
    }
  }
  tabs = siteObject.tabs
  try{
    sitePattern = ["*://*."+ siteName +".com/*"]
    chrome.tabs.query({url: sitePattern}, function(temp) {
      for (var i=0; i<temp.length;i++){
        if(!tabs.includes(temp[i].id)){
          // console.log("####################"+temp[i].id+siteName)
          addTabIdFromSiteObject(temp[i].id,siteName)
          chrome.browserAction.setIcon({
            path : "images/icon24.png",
            tabId : temp[i].id
          });
        }
      }
    });
  }catch(e){
    console.log(e.message)
  }
}