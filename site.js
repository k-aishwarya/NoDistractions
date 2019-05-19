class site {
    name = "";
    url = "";
    given_delay = 30; // seconds
    total_delay = 0;
    tabs = [];
    timer = 0;
    
    constructor(name){
        this.name = name;
        this.url = "*://*."+ name +".com/*";
    }

    startTimer(){
        var count = this.total_delay
        var final = this.given_delay
        var pattern = "*://*."+ this.name +".com/*";
        var name = this.name
        this.timer = setInterval(function() {
            count = count + 1
            this.total_delay = count
            console.log(count)
            siteObj = getSiteObject(name)
            if(siteObj.tabs.length==0){
                validateTabs(siteObj)
            }
            siteObj.total_delay = count
            setSiteObject(name,siteObj)
            if(count>final){
                var evt = new CustomEvent("BlockEvent", {detail: name});
                window.dispatchEvent(evt);
            }
        }, 60000);
    }

    stopTimer(){
        if(this.timer)
            console.log("Stopping timer")
            clearInterval(this.timer);
    }

    getTotaldelay(){
        return this.total_delay
    }

}