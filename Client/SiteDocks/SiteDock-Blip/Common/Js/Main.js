var GLOBAL = {
  displayErrors: {type: "popup"}, // type: <"none" | "popup" | "console">
  themeNames: {blip: 'Blip'},
  domain: 'localhost',
  domainSecure: 'localhost',
  httpURLHostname: 'http://',
  httpsURLHostname: 'https://',
  httpPort: '',   // Ex: ':8000', optional, default will be used if empty.
  httpsPort: '',  // Ex: ':4443', optional, default will be used if empty.
  appURL: '/',  // Application URL example: '/' or '/app/'
  popups: {shadow: undefined},
  onWindowLoadFunc: undefined,
  flagIsTouch: false,
  flagIsSilkBrowser: false,
  touchBottomAdjValue: 40,
  emailCheck: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  utility: {}, // Used for utility functions. To initialize use GLOBAL.utility.[<name>] = <functionName>;
  onWindowLoadRun: [] // Used to run extension functions on the window.onload event.  To initialize use GLOBAL.onWindowLoadRun.push(<functionName>);
};

(function (){

  init();

  function init(){

    GLOBAL.onWindowLoadFunc = onWindowLoad;

    if ('ontouchstart' in document.documentElement || 'touchstart' in document.documentElement){

      GLOBAL.flagIsTouch = true;
      GLOBAL.flagIsSilkBrowser = /(?:; ([^;)]+) Build\/.*)?\bSilk\/([0-9._-]+)\b(.*\bMobile Safari\b)?/.exec(navigator.userAgent);
      GLOBAL.flagIsSilkBrowser = (GLOBAL.flagIsSilkBrowser != null) ? true : false;

    }

  }

  let flagOnWindowLoad = false;

  function onWindowLoad(callback){

    // Select mobile browsers returning to site using history navigation compensation.
    let bodyWrapper = document.getElementById("bodyWrapper");
    let bodyWrapperPosTop = bodyWrapper.getBoundingClientRect().top;
    if(bodyWrapperPosTop != '0'){
      bodyWrapper.style.marginTop = Math.abs(bodyWrapperPosTop) + "px";
      let docBody = document.getElementById("docBody");
      docBody.style.height = "100vh";
    } 

    addCssFileTouch("/Assets/Themes/" + GLOBAL.themeNames.blip + "/Common/Css/Style_Touch.css");

    if(flagOnWindowLoad) return callback();

    GLOBAL.httpURLHostname += GLOBAL.domain + GLOBAL.httpPort;
    GLOBAL.httpsURLHostname += GLOBAL.domainSecure + GLOBAL.httpsPort;
    GLOBAL.utility['attrsToStr'] = attrsToStr;
    GLOBAL.utility['objLoaded'] = objLoaded;
    GLOBAL.utility['displayError'] = displayError;
    GLOBAL.utility['loadJsFile'] = loadJsFile;
    GLOBAL.utility['loadCssFile'] = loadCssFile;
    GLOBAL.utility['addCssFileTouch'] = addCssFileTouch;
    GLOBAL.utility['attrsToStr'] = attrsToStr;
    GLOBAL.utility["gotoPageAnchor"] = gotoPageAnchor;
    flagOnWindowLoad = true;

    initPopups();
    initPreloadImages();

    GLOBAL.onWindowLoadRun.forEach(function(item){
      item();
    });

    callback();

  }

  window.addEventListener( 'resize', onWindowResize, false );

  function onWindowResize() {

    if(typeof BrowseOnWindowResize == 'function'){BrowseOnWindowResize()}  // Placeholder, currently not used.

  }

  // Compensate for mobile/tablet bug in some browsers
  function gotoPageAnchor(anchor){

    // Disabling cache and/or looking for an event trigger failed.
    setTimeout(function(){

      window.location.href = "#" + anchor;

    }, 500);

  }

  function displayError(err){

    switch (GLOBAL.displayErrors.type) {
      case "popup":
        GLOBAL.popups.error.show(err);
        break;
      case "console":
        console.log(err);
        break;

      default:
        break;
    }
  }

  function initPreloadImages(){

    let sheets = document.styleSheets;
    let errorImagePaths = '';
    let imagesCnt = 0;
    let onCallbackCnt = 0;
    let tmpImage = [];

    for(let x = 0; x < sheets.length; x++){

      let rules;

      try{
          rules = sheets[x].cssRules;
      }catch(error){
          setTimeout(function(){initPreloadImages();},10);
          return;
      }

      for(y = 0; y < rules.length; y++){

        let tmp = rules[y].cssText.split('url("');

        if(tmp[1] != undefined){
          imageURL = tmp[1].split('")')[0];
          tmpImage[imagesCnt] = new Image();
           tmpImage[imagesCnt].onerror = function(err){
            errorImagePaths += err.path[0].outerHTML.slice(1,err.path[0].outerHTML.length).slice(0,err.path[0].outerHTML.length-2) + "<br>";
            onCallbackCnt++;
          };

           tmpImage[imagesCnt].onload = function(){
            onCallbackCnt++;
          };

          if(imageURL.indexOf(".svg") != -1 || imageURL.indexOf(".png") != -1 || imageURL.indexOf(".gif") != -1 || imageURL.indexOf(".jpg") != -1 ||
             imageURL.indexOf(".SVG") != -1 || imageURL.indexOf(".PNG") != -1 || imageURL.indexOf(".GIF") != -1 || imageURL.indexOf(".JPG") != -1){

              tmpImage[imagesCnt].src = imageURL;
              tmpImage[imagesCnt].id = "preloadedImage" + imagesCnt;
              imagesCnt++;

          }

        }

        if(x == sheets.length - 2 && y == rules.length - 2) postImagesLoadedExec();

      }

    }

    function postImagesLoadedExec(){

      setTimeout(function(){

        if(onCallbackCnt == imagesCnt ){
          showErrors();
          renderImages();
        }
        else{
          postImagesLoadedExec();
        }

      }, 10);

    }

    function renderImages(){

      let div = document.createElement('div');

      div.style.visibility = "hidden";
      div.style.position = "absolute";
      div.style.width = "0px";
      div.style.height = "0px";

      tmpImage.forEach(function(item){
        div.appendChild(item);
      });

      document.body.appendChild(div);

    }

    function showErrors(){

        if(errorImagePaths != ''){

          GLOBAL.utility.displayError("Error: Image(s) not found while preloading CSS url(...) parameters.<br><br>" + errorImagePaths);

        }
    }


  }

  function initPopups(){

    let containerShadow = document.createElement('div');
    containerShadow.classList.add('popup-container-shadow');

    let container = document.createElement('div');
    container.classList.add('popup-container');

    let containerError = container.cloneNode(true);
    containerError.classList.add('background-color-red');
    containerError.classList.add('font-color-white');
    containerError.innerHTML = "Error";

    containerShadow.appendChild(containerError);
    document.body.appendChild(containerShadow);

    containerShadow.onclick = function(){
      this.style.visibility = 'hidden';
      GLOBAL.popups.error.hide();
    }

    if( GLOBAL.popups.shadow == undefined ) {

      GLOBAL.popups.shadow = {
        panel: containerShadow,
        show: function(){

          GLOBAL.popups.shadow.panel.style.visibility = 'visible';

        },
        hide: function(){

          GLOBAL.popups.shadow.panel.style.visibility = 'hidden';

        }
      };
    }

    if( GLOBAL.popups.error == undefined ) {

      GLOBAL.popups.error = {
        redirectFocusObj: false,
        redirectFocusObjStyle: false,
        redirectFocusObjStyleOrg: false,
        panel: containerError,
        show: function(msg, redirectFocus = false, redirectFocusStyle = false){

          GLOBAL.popups.shadow.show();
          containerError.style.display = 'inline-block';
          containerError.innerHTML = msg;
          this.redirectFocusObj = redirectFocus;
          this.redirectFocusObjStyle = redirectFocusStyle;

        },
        hide: function(){

          GLOBAL.popups.shadow.hide();
          
          let shadowChildren = GLOBAL.popups.shadow.panel.childNodes;

          shadowChildren.forEach(function(child){
            child.style.display = 'none';
          });

          if(this.redirectFocusObj){

            this.redirectFocusObj.focus();

            if(this.redirectFocusObjStyle) {
              let _this = this;
              this.redirectFocusObjStyleOrg = this.redirectFocusObj.classList.item(0);
              this.redirectFocusObj.classList.remove(this.redirectFocusObjStyleOrg);
              this.redirectFocusObj.classList.add(this.redirectFocusObjStyle);
              this.redirectFocusObj.addEventListener('focusout', focusout);

              function focusout(){
                _this.redirectFocusObj.classList.remove(_this.redirectFocusObjStyle);
                _this.redirectFocusObj.classList.add(_this.redirectFocusObjStyleOrg);
              }
            }

          }

        }
      };
    }

  }
  // #endregion

  // #region Utility
  function objLoaded(objId, callback){

    loop();

    function loop(){

        setTimeout(function(){

          if(document.getElementById(objId) != undefined){

            callback(null);

          } else {

            loop();

          }

        },5);

    }
  }
  // #endregion

  // #region Debugging
  GLOBAL.utility["debug"] = { consoleExplodeObject: {ticCntrStr: '-'} };

  function consoleExplodeObject(o){

    if(typeof o != 'object' && typeof o != 'function'){
      console.log(GLOBAL.utility.debug.consoleExplodeObject.ticCntrStr + o);
      return;
    }

    var keys = Object.keys(o);

    keys.forEach(function(item){

      var str = GLOBAL.utility.debug.consoleExplodeObject.ticCntrStr + 'key: ' + item;

      if(o[item] != undefined && typeof o[item] != 'object'){
        str += ', value: ' + o[item];
      }

      console.log(str);

      if(typeof o[item] == 'object' || typeof o[item] == 'function'){

        GLOBAL.utility.debug.consoleExplodeObject.ticCntrStr += GLOBAL.utility.debug.consoleExplodeObject.ticCntrStr;
        consoleExplodeObject(item);

      }

    });

  }

  function attrsToStr(attrs) {
    var parts = [];
    $.each(attrs, function (name, val) {
        if (val != null) {
            parts.push(name + '="' + htmlEscape(val) + '"');
        }
    });
    return parts.join(' ');
  }

  function loadCssFile(filePath){

    var file=document.createElement("link");
    file.setAttribute("rel", "stylesheet");
    file.setAttribute("type", "text/css");
    file.setAttribute("href", filePath);

    if (typeof file !="undefined")
      document.getElementsByTagName("head")[0].appendChild(file);

  }

  function loadJsFile(filePath){

    var file=document.createElement("link");
    file.setAttribute("rel", "script");
    file.setAttribute("type", "text/javascript");
    file.setAttribute("href", filePath);

    if (typeof file !="undefined")
      document.getElementsByTagName("head")[0].appendChild(file);

  }

  function addCssFileTouch(filePath){

    if(GLOBAL.flagIsTouch){
        GLOBAL.flagIsTouch = true;
        loadCssFile(filePath);
    }

  }

})(window, document);


