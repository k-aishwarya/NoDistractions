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
            notifications = getNotifications()
            if(typeof notifications === 'undefined' || notifications==null){
            }
            else{
                if(final-count==600 && getNotifications().includes(10)){
                    alert("10 minutes left for "+name)
                }
                if(final-count==1200 && getNotifications().includes(20)){
                    alert("20 minutes left for "+name)
                }
                if(final-count==2400 && getNotifications().includes(40)){
                    alert("40 minutes left for "+name)
                }
                if(final-count==3600 && getNotifications().includes(60)){
                    alert("60 minutes left for "+name)
                }
            }
            this.total_delay = count
            console.log(count)
            siteObj=getSiteObject(name)
            validateTabs(siteObj)
            siteObj=getSiteObject(name)
            siteObj.total_delay = count
            setSiteObject(name,siteObj)
            if(count>final){
                var evt = new CustomEvent("BlockEvent", {detail: name});
                window.dispatchEvent(evt);
            }
        }, 1000);
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