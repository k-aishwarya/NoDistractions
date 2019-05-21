//Timers
function addTimers(timerId){
    key="timers"
    timers = getTimers()
    if(timers){
        if(!timers.includes(timerId))
            timers.push(timerId)
    }
    else{
        timers=[timerId]
    }
    console.log("Adding timer=" + timerId +" for key=" +key )
    localStorage.setItem(key,JSON.stringify(timers))
}

function removeTimers(timerId){
    key = "timers"
    timers = getTimers()
    if(timers){
        var index = timers.indexOf(timerId);
        if (index > -1) {
            timers.splice(index, 1);
        }
    }   
    console.log("Removing timer=" + timerId +" for key=" +key)
    localStorage.setItem(key,JSON.stringify(timers))
}

function getTimers(){
    key="timers"
    timers=JSON.parse(localStorage.getItem(key))
    console.log("Getting timer=" + timers + " for key=" +key)
    return timers
}


//LastDate
function setLastdate(date){
    key = "lastDate"
    localStorage.setItem(key,date)
    console.log("Setting date=" + date + "for key=" +key)
}

function getLastDate(){
    key = "lastDate"
    date=localStorage.getItem(key)
    console.log("Getting date=" + date + "for key=" +key)
    if(date)
        return date
    else 
        return null
}

//SitesLists
function addBlockedSiteLists(siteName){
    key="blockedSites"
    siteLists = getSiteLists()
    if(siteLists){
        siteLists.push(siteName)
    }
    else{
        siteLists=[siteName]
    }
    console.log("Adding siteName=" + siteName +" for key=" +key )
    localStorage.setItem(key,JSON.stringify(siteLists))
}

function getSiteLists(){
    key="blockedSites"
    siteLists=JSON.parse(localStorage.getItem(key))  
    console.log("Getting siteLists=" + siteLists + " for key=" +key)
    return siteLists
}

function removeSiteLists(siteName){
    key = "blockedSites"
    siteLists = getSiteLists(key)
    console.log(siteLists)
    if(siteLists){
        var index = siteLists.indexOf(siteName);
        if (index > -1) {
            siteLists.splice(index, 1);
        }
    }
    console.log(siteLists)
    console.log("Removing siteName=" + siteName +" for key=" +key)
    localStorage.setItem(key,JSON.stringify(siteLists))
}


//SitePatterns 
function addSitePatterns(siteName){
    key = "sitePatterns"
    url = "*://*."+ siteName +".com/*";
    sitePatterns = getSitePatterns(key)
    console.log("here")
    console.log(sitePatterns)
    if(sitePatterns){
        sitePatterns.push(url)
    }
    else{
        sitePatterns=[url]
    }
    console.log("Adding sitePattern=" + url +" for key=" +key )
    localStorage.setItem(key,JSON.stringify(sitePatterns))
}

function getSitePatterns(){
    key = "sitePatterns"
    sitePatterns=JSON.parse(localStorage.getItem(key))
    console.log("Getting sitePattern=" + sitePatterns + "for key=" +key)
    return sitePatterns
}

function removeSitePattern(siteName){
    key = "sitePatterns"
    url = "*://*."+ siteName +".com/*";
    sitePatterns = getSitePatterns(key)
    if(sitePatterns){
        var index = sitePatterns.indexOf(url);
        if (index > -1) {
            sitePatterns.splice(index, 1);
        }
    }
    console.log("Removing sitePattern=" + url +" for key=" +key)
    localStorage.setItem(key,JSON.stringify(sitePatterns))
}


//Site Options
function setSiteOptions(siteName,maxTime){
    key = siteName+"_options"
    siteOptions = new site(key)
    siteOptions.given_delay = maxTime
    console.log("Setting site=" + JSON.stringify(siteOptions) + "for key=" +key)
    localStorage.setItem(key,JSON.stringify(siteOptions))
}

function getSiteOptions(siteName){
    key = siteName+"_options"
    siteOptions=JSON.parse(localStorage.getItem(key))
    console.log("Getting sites=" + siteOptions + "for key=" +key)
    return siteOptions
}

function removeSiteOptions(siteName){
    key = siteName+"_options"
    localStorage.removeItem(key)
    console.log("Removing SiteOptions for=" +key)
}


//TabIdSite Map
function setTabIdSite(tabId,siteName){
    console.log("Setting site=" + siteName +" for tabId=" +tabId )
    localStorage.setItem(tabId,siteName)
}

function getSiteforTabId(tabId){
    var siteName = localStorage.getItem(tabId)
    if(siteName){
        console.log("Getting site=" + siteName +" for tabId=" +tabId )
        return siteName 
    }   
    else{
        console.log("Getting site=undefined for tabId=" +tabId)
    }
    
}

function removeTabSiteMap(tabId){
    localStorage.removeItem(tabId)
    console.log("Removing tabId=" +tabId)
}


//SiteObject 
function setSiteObject(siteName,siteObject){
    console.log("Setting siteObject for siteName=" +siteName + " obj=" + JSON.stringify(siteObject))
    localStorage.setItem(siteName,JSON.stringify(siteObject))
}

function removeSiteObject(siteName){
    console.log("Removing siteObject for siteName=")
    localStorage.removeItem(siteName)
}

function updateTimer(siteName,timer){
    saved = getSiteObject(siteName)
    if(saved){
      saved.timer = timer
      console.log("Setting siteObject with timer ="+timer+" for siteName=" +siteName + " obj=" + JSON.stringify(saved))
      localStorage.setItem(siteName,JSON.stringify(saved))
    }
    else{
        console.log("Getting NULL siteObject while setting Timer for siteName=" +siteName)
    }
    
}

function removeTimerForSiteObject(siteName){
    saved = getSiteObject(siteName)
    if(saved){
      saved.timer = -1
      console.log("Setting siteObject with timer =-1 for siteName=" +siteName + " obj=" + JSON.stringify(saved))
      localStorage.setItem(siteName,JSON.stringify(saved))
    }
    else{
        console.log("Getting NULL siteObject while setting Timer for siteName=" +siteName)
    }
}

function getSiteObject(siteName){
    var result = JSON.parse(localStorage.getItem(siteName))
    if(result){   
      siteObject = new site(siteName);
      siteObject.tabs = result.tabs
      siteObject.given_delay = parseInt(result.given_delay)
      siteObject.timer = parseInt(result.timer)
      siteObject.total_delay = parseInt(result.total_delay)
      console.log("Getting siteObject for siteName=" +siteName + " obj=" + JSON.stringify(siteObject))
      return siteObject;
    }
    console.log("Getting NULL siteObject for siteName=" +siteName)
    return null;
}

function removeTabIdFromSiteObject(tabId,siteName){
    siteObj = getSiteObject(siteName)
    if(siteObj){
        var index = siteObj.tabs.indexOf(tabId);
        if (index > -1) {
            siteObj.tabs.splice(index, 1);
        }
        console.log(siteObj.tabs)
        localStorage.setItem(siteName,JSON.stringify(siteObj))
        console.log("Removing tabId=" + tabId +" for siteName=" +siteName + " obj=" + JSON.stringify(siteObj))
        return siteObj
    }
    else{
        console.log("Removing cannot be done for undefined siteObj with siteName="+siteName )
        return siteObj
    }
}

function addTabIdFromSiteObject(tabId,siteName){
    siteObj = getSiteObject(siteName)
    if(siteObj){
        if(!siteObj.tabs.includes(tabId))
            siteObj.tabs.push(tabId)
        localStorage.setItem(siteName,JSON.stringify(siteObj))
        console.log("Adding tabId=" + tabId +" for siteName=" +siteName )
        return siteObj
    }
    else{
        console.log("Adding cannot be done for undefined siteObj with siteName="+siteName )
    }
    return siteObj
}
