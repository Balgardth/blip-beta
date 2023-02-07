(function (){

  var anchorHistory = {

    flagPageTopActive: true,

    flagPageNavActive: false,

    flagAgentFirefox: false,

    objectPopstate: null,

    pageURL: null,

    eventFunction: null,  // Reserved for later.

    init: function(func=function(){}){

      var _this = this;

      _this.flagAgentFirefox = (navigator.userAgent.indexOf('Firefox') != -1) ? true : false; 

      eventFunction = func;

      let urlRootLink = window.location.href.split(GLOBAL.domain);

      this.pageURL = urlRootLink[1];

      window.addEventListener("popstate", function(e){

        if(_this.flagPageNavActive || _this.flagPageTopActive){

          _this.flagPageNavActive = false;
          _this.flagPageTopActive = false;

          return;

        } 
        
        let splitStr = window.location.href.split('#');

        if(splitStr.length < 2){

          window.location = _this.pageURL;

          if(!_this.flagAgentFirefox) _this.flagPageTopActive = true;

          return;

        }

        if(!_this.flagAgentFirefox) _this.flagPageNavActive = true;

        window.location = '#' + splitStr[1];

        this.eventFunction(e);

      });

    }

  }

  GLOBAL.utility["anchorHistory"] = anchorHistory;

})(window);