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
    maxTime = parseInt(maxTime)*60
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

    chrome.extension.getBackgroundPage().blockButtonRequest(siteName)
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

function toggle() {
    timer_pop_up.style.display = "none"
    var x = document.getElementById("myDIV");
    chrome.extension.getBackgroundPage().console.log(x.style.display)
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    blockedSites = chrome.extension.getBackgroundPage().getSiteLists()
    var mainList = document.getElementById("navp");
    mainList.innerHTML = '';

    if(typeof blockedSites === 'undefined' || blockedSites==null){
        var opt = document.createElement('option');
        opt.value = "No Sites";
        opt.innerHTML = "No Sites";
        mainList.appendChild(opt); 
    }
    else{
        for(var i=0;i<blockedSites.length;i++){        
            var opt = document.createElement('option');
            opt.value = blockedSites[i];
            opt.innerHTML = blockedSites[i];
            mainList.appendChild(opt);         
        }
    }
    notifications = chrome.extension.getBackgroundPage().getNotifications()
    if(typeof notifications === 'undefined' || notifications==null){
    }
    else{
        for(var i=0;i<notifications.length;i++){        
            document.getElementById(notifications[i].toString()).checked=true
        }
    }
}

function toggleTimer() {
    lists_pop_up.style.display = "none"
    var timeShower = document.getElementById("timer");
    chrome.extension.getBackgroundPage().console.log(timeShower.style.display)
    if (timeShower.style.display === "none") {
        timeShower.style.display = "block";
    } else {
        timeShower.style.display = "none";
    }
    document.getElementById("demo").innerHTML = " Calculating...";
    blockedSites = chrome.extension.getBackgroundPage().getSiteLists()
    if(blockedSites){
        var query = { active: true, currentWindow: true };
        chrome.tabs.query(query, function(tabs){
            var currentTab = tabs[0];
            tabId = currentTab.id;
            siteName = getSiteName(currentTab.url)

            if(blockedSites.includes(siteName)){
                var x = setInterval(function() {
                    siteObj = chrome.extension.getBackgroundPage().getSiteObject(siteName)
                    timeLeft = parseInt(siteObj.given_delay) - parseInt(siteObj.total_delay)
                    var hours = 0;
                    var minutes = 0;
                    var seconds = 0;
                    if(timeLeft>0){
                        var hours = Math.floor(timeLeft / 3600);
                        timeLeft = timeLeft - hours * 3600;
    
                        var minutes = Math.floor(timeLeft / 60);
    
                        var seconds = timeLeft - minutes * 60;
                        
                    }                  
                    document.getElementById("demo").innerHTML = "<h3> "+ hours + " h "+ minutes + " m " + seconds + " s</h3>";
                    if (timeShower.style.display == "none") {
                        clearInterval(x);
                        document.getElementById("demo").innerHTML = " Calculating...";
                    }
                }, 1000);
            }
            else{
                document.getElementById("demo").innerHTML = " This site is not Blocked!!";
            }
            
        });
    }
    else{
        document.getElementById("demo").innerHTML = " No sites are Blocked!!";
    }
        
}

function unblockSites(){
    var mainList = document.getElementById("navp");
    siteName = mainList.options[mainList.selectedIndex].value
    chrome.extension.getBackgroundPage().console.log(siteName+" is unblocked")
    chrome.extension.getBackgroundPage().console.log(chrome.extension.getBackgroundPage().getSiteLists(siteName))
    chrome.extension.getBackgroundPage().removeSiteLists(siteName)
    chrome.extension.getBackgroundPage().removeSitePattern(siteName)
    chrome.extension.getBackgroundPage().removeSiteOptions(siteName)
    chrome.extension.getBackgroundPage().unBlock(siteName)
    alert(siteName + " is unblocked!!")
    mainList.removeChild(mainList.options[mainList.selectedIndex]);
    if(mainList.options.length==0){
        var opt = document.createElement('option');
        opt.value = "No Sites";
        opt.innerHTML = "No Sites";
        mainList.appendChild(opt); 
    }
}


function closeSites(){
    var mainList = document.getElementById("navp");
    siteName = mainList.options[mainList.selectedIndex].value
    sitePattern = ["*://*."+ siteName +".com/*"]
    chrome.tabs.query({url: sitePattern}, function(temp) {
      for (var i=0; i<temp.length;i++){
        chrome.tabs.remove(temp[i].id)
      }
    }); 
}

function addNotifications(){
    chrome.extension.getBackgroundPage().removeNotifications()
    if(document.getElementById("10").checked){
        chrome.extension.getBackgroundPage().addNotifications(10)
    }
    if(document.getElementById("20").checked){
        chrome.extension.getBackgroundPage().addNotifications(20)
    }
    if(document.getElementById("40").checked){
        chrome.extension.getBackgroundPage().addNotifications(40)
    }
    if(document.getElementById("60").checked){
        chrome.extension.getBackgroundPage().addNotifications(60)
    }
}

function removeNotifications(){
    chrome.extension.getBackgroundPage().console.log(chrome.extension.getBackgroundPage().getNotifications())
    chrome.extension.getBackgroundPage().removeNotifications()
    document.getElementById("10").checked=false
    document.getElementById("20").checked=false
    document.getElementById("40").checked=false
    document.getElementById("60").checked=false
}
  
document.getElementById('block').addEventListener('click',block_options);
document.getElementById('toggle').addEventListener('click',toggle);
document.getElementById('toggleTimer').addEventListener('click',toggleTimer);
document.getElementById('ub').addEventListener('click',unblockSites);
document.getElementById('cl').addEventListener('click',closeSites);
document.getElementById('add').addEventListener('click',addNotifications);
document.getElementById('reset').addEventListener('click',removeNotifications);

var lists_pop_up = document.getElementById('myDIV')
lists_pop_up.style.display = "none"

var timer_pop_up = document.getElementById('timer')
timer_pop_up.style.display = "none"