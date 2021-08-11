//inspirobot.js

Module.register("MMM-inspirobot", {
	// Default module config.
	result: [],
	defaults: {
		// The only parameter is the update time in minutes
		//change inspirobotURL to 
		// /api?getSessionID=1
		// /api?generateFlow=1&sessionID=<generated_session_id>
		inspirobotURL : "http://www.inspirobot.me/api?generate=true",
		updateInterval : 1 * 10 * 1000, // every 5 minutes
		animationSpeed: 1000,
		retryDelay: 2500,
		inspirobotsession_id : "http://www.inspirobot.me/api?getSessionID=1",
		data : "http://www.inspirobot.me/api?generateFlow=1&sessionID="
	},

	start: function() {
        	Log.info("Starting module: " + this.name);
        	var self = this;
        	var configuredVersion = this.config.version;
	//	this.scheduleUpdate(this.config.initialLoadDelay);
		this.updateInspiration();
	},     
////////////////////////////////////////////////////////
	
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {nextLoad = delay;}
		var self = this;
		setTimeout(function() {self.updateInspiration();}, nextLoad);
	},

////////////////////////////////////////////////////////////	
	
	updateInspiration: function() {
		var inspiroSession = this.config.inspirobotsession_id;
		var inspiroDataurl = this.config.data;
		var inspirodata;
		var url = this.config.inspirobotURL;
		var self = this;
		var retry = false;
		var textquote;

	/*	var inspirobotRequest = new XMLHttpRequest();
		inspirobotRequest.open("GET", url, true);
		inspirobotRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processResponse(this.response);
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name + ": failed with 401");
					retry = true;
				} else {
					Log.error(self.name + ": Could not load inspiration");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		}; */
		
		
		
		//Get session key and append it to 
		var inspirobotsessionid = new XMLHttpRequest();
		inspirobotsessionid.open("GET", inspiroSession, true);
		inspirobotsessionid.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					inspiroDataurl += this.response;
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name + ": failed with 401");
					retry = true;
				} else {
					Log.error(self.name + ": Could not load inspiration");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		inspirobotsessionid.send();
		var inspirobotRequest = new XMLHttpRequest();
		inspirobotRequest.open("GET", inspiroDataurl, true);
		inspirobotRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					inspirodata = this.response;
					textquote = inspirodata.text;
					self.processResponse(textquote);
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name + ": failed with 401");
					retry = true;
				} else {
					Log.error(self.name + ": Could not load inspiration");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		
		
		inspirobotRequest.send();
	},
/////////////////////////////////////////////////////////////////
	
	
	processResponse: function(response) {
		Log.log("textquote: " + response);
		this.inspiredURL = response;
		this.show(this.config.animationSpeed, {lockString:this.identifier});
		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
		this.scheduleUpdate(this.config.initialLoadDelay);
	},
////////////////////////////////////////////////////////////////////////////
	
	// Override dom generator.
	getDom: function() {
		Log.log("Updating MMM-inspirobot DOM.");
		
		var inspiredURL = "http://generated.inspirobot.me/093/aXm6795xjU.jpg";
		
		let quoteTextDiv = document.createElement("div");
		quoteTextDiv.className = "normal";
		
		if (this.inspiredURL != "" && this.inspiredURL != null){
			inspiredURL = this.inspiredURL;
		}

		var wrapper = document.createElement("div");
		
		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		quoteTextDiv.innerHTML = inspiredURL;
		wrapper.appendChild(quoteTextDiv);
		
		
		
		
		
		return wrapper;
	}
});
