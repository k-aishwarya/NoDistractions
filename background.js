function startingTimer(siteName,siteObject,tabId){
  if(siteObject){   
    validateTabs(siteObject)
    console.log("Site Exists")
    siteObject=addTabIdFromSiteObject(tabId,siteName)
 
    siteObject.stopTimer()
    removeTimers(siteObject.timer)
    siteObject.startTimer();
    addTimers(siteObject.timer)
    saved = getSiteObject(siteName)
    if(saved){
      updateTimer(siteName,siteObject.timer)
      addTimers(saved.timer)
    }
    else{
      setSiteObject(siteName,siteObject)
    }
  }
  else{
    console.log("Creating new site")
    siteObject = new site(siteName);
      (siteObject)
    if(!siteObject.tabs.includes(tabId))
      siteObject.tabs.push(tabId)
      
    siteObject.given_delay = getSiteOptions(siteName).given_delay
    console.log(siteObject.given_delay)
    siteObject.total_delay=siteObject.getTotaldelay()
    siteObject.startTimer();
    addTimers(siteObject.timer)
    saved = getSiteObject(siteName)
    if(typeof saved === 'undefined' || saved==null){
      setSiteObject(siteName,siteObject)
    }
    else{    
      updateTimer(siteName,siteObject.timer)
      addTimers(siteObject.timer)
    }
    
  }
}

function completed(tabId, removeInfo){
  console.log("Closing Tab");
  siteName = getSiteforTabId(tabId)
  if(siteName && siteName!=null ){
    siteObj = getSiteObject(siteName)
    if(siteObj){
      if(siteObj.tabs.length==1){
        siteObj.stopTimer()
        removeTimers(siteObj.timer)
        removeTimerForSiteObject(siteName)
      }
      siteObj = removeTabIdFromSiteObject(tabId,siteName)
      removeTabSiteMap(tabId)
    }
  }
}

function unBlock(siteName){
  siteObj = getSiteObject(siteName)
    if(siteObj){
      siteObj.stopTimer()
      tabs = siteObj.tabs
      if(tabs){
        for(var i=0;i<tabs.length;i++){
          tabId = tabs[i]
          siteObj = removeTabIdFromSiteObject(tabId,siteName)
        }
      }
    }
    removeSiteObject(siteName)
}

function blockButtonRequest(siteName){
  if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
     chrome.webRequest.onBeforeRequest.removeListener(blockRequest);

  if(chrome.webRequest.onBeforeRequest.hasListener(onEveryBlockedRequest))
     chrome.webRequest.onBeforeRequest.removeListener(onEveryBlockedRequest);

  sitePatterns = getSitePatterns()
  chrome.webRequest.onBeforeRequest.addListener(blockRequest, {urls: sitePatterns}, ['blocking']);
  chrome.webRequest.onBeforeRequest.addListener(onEveryBlockedRequest, {urls: sitePatterns}, ['blocking']);

  siteObject = new site(siteName);
  siteObject.name=siteName
  validateTabs(siteObject)
  siteObject.given_delay = getSiteOptions(siteName).given_delay
  console.log(siteObject.given_delay)
  siteObject.total_delay=siteObject.getTotaldelay()
  siteObject.startTimer();
  addTimers(siteObject.timer)
  saved = getSiteObject(siteName)
  if(typeof saved === 'undefined' || saved==null){
    setSiteObject(siteName,siteObject)
  }
  else{    
    updateTimer(siteName,siteObject.timer)
    addTimers(siteObject.timer)
  }
}


function onEveryBlockedRequest(details){
  console.log("everyRequest")
  console.log(details)
  clearStorageEveryNewDay()
  try{
    if(details.tabId==-1){
      throw "Invalid is tabId"
    }
    var siteName = getSiteNameFromDetails(details);
    if(siteName==null){
      throw "SiteName is null"
    }
    setTabIdSite(details.tabId,siteName)
    siteObject = getSiteObject(siteName)
    var blocked = false
    if(siteObject){
      blocked=(siteObject.total_delay>siteObject.given_delay)
    }
    if(!blocked){
      startingTimer(siteName,siteObject,details.tabId);
    }
    else{
      console.log ("Site is blocked "+ siteName)
    }
  }catch(e){
      console.log("Error on Request with exception e=" + e.message)
  }
}

function blockRequest(details) {
  console.log("blockRequest")
  console.log(details);
  siteName = getSiteNameFromDetails(details)
  siteObj = getSiteObject(siteName)
  if(siteObj){  
    if(siteObj.total_delay>siteObj.given_delay){
      return {cancel: true};
    }
  }
}

function updateFilters() {
  chrome.tabs.onRemoved.addListener(completed);

  window.addEventListener("BlockEvent", function(evt) {
      if(siteObj){
        alert(evt.detail + " is blocked for the day.")
        reloadTab(siteObj)  
        siteObj.stopTimer() 
      }
  }, false);

}  

updateFilters();