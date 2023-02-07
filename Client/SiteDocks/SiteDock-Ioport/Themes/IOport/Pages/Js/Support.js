(function (){

    let anchorFeatureRequest = "featureRequest";

    window.onload = function(){
        init();
    }

    function init(){

        GLOBAL.onWindowLoadFunc(function(){

            if(GLOBAL.flagIsTouch) GLOBAL.utility.addCssFileTouch("/Assets/Themes/" + GLOBAL.themeNames.ioport + "/Pages/Css/Support_Touch.css");

            initMobileAnchorCompensation();
            scraptcha.init();
            GLOBAL.utility['scraptcha'] = scraptcha;
            
        });

    }

    // Compensate for mobile/tablet bug in some browsers
    function initMobileAnchorCompensation(){

        if(window.location.href.split('#')[1] == anchorFeatureRequest + "FH"){

            GLOBAL.utility.gotoPageAnchor(anchorFeatureRequest);

        }

    }

    let flagScraptchPause = false;
    let flagScraptchUpdating = false;

    var scraptcha = {

        trackerObj: {
          id: null,
          reqId: null,
          sessId: null,
          linkId: null,
          code: null
        },

        init: function(){
          let _this = this;
          scraptcha.load();
          scraptcha.draw();
          document.getElementById('scraptchaContainerFeedback').style.visibility = "visible";
        },

        draw: function(){
          var eFC = document.getElementById('formContainer');
          var eSC = document.getElementById('scraptchaCodeRow');
          var eFCPadding = window.getComputedStyle(eFC).getPropertyValue('padding');
        },

        updateDivContents: function(url, str){

          if(flagScraptchPause || flagScraptchUpdating) return;
          flagScraptchUpdating = true;

          var xmlHttp = null;
          xmlHttp = new XMLHttpRequest();
          xmlHttp.onreadystatechange = popData;
          xmlHttp.open("GET", url, true);
          xmlHttp.send();

          let scraptchaLoaderContainer = document.getElementById("scraptchaLoaderContainer");
          let scraptchaContainerContact = document.getElementById("scraptchaContainerContact");
          let scraptchaContainerFeedback = document.getElementById("scraptchaContainerFeedback");
          let scraptchaCodeTable = document.getElementById("scraptchaCodeTable");
          let scraptchaRefresh = document.getElementById("scraptchaRefresh");

          if(scraptchaContainerContact.style.display == 'block' || scraptchaContainerFeedback.style.display == 'block'){

            scraptchaCodeTable.style.opacity = "0.2";
            scraptchaLoaderContainer.style.display = "inline-block";
            scraptchaRefresh.innerHTML = "Updating...";

          }

          function popData()
          {
            if( xmlHttp.readyState == 4 && xmlHttp.status == 200){
              flagScraptchUpdating = false;
              let results = JSON.parse(xmlHttp.responseText);

              let textRefreshImage = "Refresh Image";

              if(scraptchaContainerContact.style.display == 'block' || scraptchaContainerFeedback.style.display == 'block'){

                scraptchaCodeTable.style.opacity = "1";
                scraptchaLoaderContainer.style.display = "none";
                scraptchaRefresh.innerHTML = textRefreshImage;

              }

              if(results.error) {

                if(results.data == "#e003"){

                  flagScraptchPause = true;
                  scraptchaRefresh.innerHTML = "Paused for 30 sec.";
                  scraptchaCodeTable.style.opacity = "0.2";
                  scraptchaLoaderContainer.style.display = "inline-block";

                  setTimeout(function(){

                    scraptchaRefresh.innerHTML = textRefreshImage;
                    flagScraptchPause = false;
                    scraptchaRefresh.click();

                  }, 30000);

                } else if(results.data == "#e004" || results.data == "#e001" || results.data == "#e002"){

                  flagScraptchPause = true;
                  let errorMsg = "Mischief may be afoot.  Please refresh the browser.";
                  scraptchaRefresh.innerHTML = errorMsg;
                  GLOBAL.utility.displayError('Notification: ' + errorMsg);
                  
                }

                return;
              }
              let div = document.getElementById(str);
              div.innerHTML = results.data;
              scraptcha.draw();
            }
          }
        },

        load: function(){

          let _this = this;

          var cnt = 10;

          if(cnt > 0) load();

          function load(){
            if(document.getElementById("si01") != undefined){              

              // Used to prevent update flicker
              let scraptchaContainerFeedback = document.getElementById("scraptchaContainerFeedback");
              let offsetHeight = scraptchaContainerFeedback.offsetHeight;
              if(offsetHeight > 0){
                scraptchaContainerFeedback.style.height = offsetHeight + "px";
              }
              
              getScraptchaImagesStart();
              initButtons();
            } else {
              cnt--;
              setTimeout(function(){load()},500);
            }
          }

          function getScraptchaImagesStart(){

            var date = new Date();

            let comm = GLOBAL.utility.commXmlHttp();
            comm.setUrl(GLOBAL.httpsURLHostname + GLOBAL.appURL + "Support/scraptchaNew/" + Math.floor((Math.random()*100) + 1) + date.getTime());
            comm.setPostResFunc(postResults);
            comm.sendHttpGet();

            function postResults(){ 

              let results = JSON.parse(this.responseData);
              document.getElementById("scraptchaContainer").value = results.data;
              document.getElementById("scraptchaRequestId").value = results.reqId;
              document.getElementById("scraptchaSessionId").value = results.sessId;

            }
          }

          function getScraptchaImages(){
            _this.trackerObj.id = document.getElementById("scraptchaId").value;
            _this.trackerObj.reqId = document.getElementById("scraptchaRequestId").value;
            _this.trackerObj.sessId = document.getElementById("scraptchaSessionId").value;
            _this.trackerObj.linkId = Math.floor((Math.random()*100) + 1);
            _this.updateDivContents(GLOBAL.httpsURLHostname + GLOBAL.appURL + "Support/scraptcha/" + encodeURIComponent(JSON.stringify(_this.trackerObj)), "scraptchaContainer");
          }

          function initButtons(){
            var button = document.getElementById("scraptchaRefresh");
            button.onclick = function () {
              _this.trackerObj.id = document.getElementById("scraptchaId").value;
              _this.trackerObj.reqId = document.getElementById("scraptchaRequestId").value;
              _this.trackerObj.sessId = document.getElementById("scraptchaSessionId").value;
              _this.trackerObj.linkId = Math.floor((Math.random()*100) + 1);
              _this.updateDivContents(GLOBAL.httpsURLHostname + GLOBAL.appURL + "Support/scraptcha/" + encodeURIComponent(JSON.stringify(_this.trackerObj)), "scraptchaContainer");
              return false;
            }
          }
        },

        submit: function(){
            let _this = this;
            var element = document.getElementById("scraptchaReply");
            element.innerHTML = '';
            _this.trackerObj.id = document.getElementById("scraptchaId").value;
            _this.trackerObj.reqId = document.getElementById("scraptchaRequestId").value;
            _this.trackerObj.sessId = document.getElementById("scraptchaSessionId").value;
            _this.trackerObj.linkId = Math.floor((Math.random()*100) + 1);
            _this.trackerObj.code = document.getElementById("scraptchaCode").value;

            scraptcha.updateDivContents(GLOBAL.httpsURLHostname + GLOBAL.appURL + "Support/scraptchaValidate/" + encodeURIComponent(JSON.stringify(_this.trackerObj)), "scraptchaReply");

            setTimeout(function(){check();},200);

            var cnt = 0;

            function check(){
              if(element.innerHTML == '' && cnt < 30){
                cnt++;
                setTimeout(function(){check();},200);
              } else {
                if(element.innerHTML == "Valid"){
                  var str = '<div class="scraptcha-submit-reply">Message Submitted</div><div class="scraptcha-spacer-4"></div>';
                  document.getElementById('scraptchaContainer').style.left = '0px';
                  document.getElementById('scraptchaContainer').innerHTML = str;
                }
              }
            }
        }
      }

})(window);