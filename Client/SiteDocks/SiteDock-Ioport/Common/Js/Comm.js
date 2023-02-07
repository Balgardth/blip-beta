(function (){

    let displayError = function(){};

    init();

    function init(){

        GLOBAL.utility["commXmlHttp"] = newCommXmlHttp;
        GLOBAL.onWindowLoadRun.push(initDisplayError);

    }

    function initDisplayError(){

        displayError = GLOBAL.utility.displayError;

    }

    function newCommXmlHttp(){
        return new CommXmlHttp();
    }

    class CommXmlHttp {
        constructor() {
            this.errorMsg = 'The server returned an error.';
            this.url = null;
            this.xmlHttpOnReadyStateChangeFunc = xmlHttpOnReadyStateChange;
            this.timeout = 10000;  // Must be set to 0 when using synchronus
            this.onTimeoutFunc = timeoutMessage;
            this.targetObj = null;
            this.targetLoaderObj = null;
            this.targetLoaderFunc = animLoadingSpinner;
            this.targetLoaderFuncArgs = {xmlHttpOpenAsync: true};
            this.preReqFunc = null;
            this.postResFunc = null;
            this.responseData = null;
        }
        setUrl(url) {
            this.url = url;
        }
        setTimeout(count) {
            this.timeout = count;
        }
        setOnTimeoutFunc(func) {
            this.onTimeoutFunc = func;
        }
        setPreReqFunc(func) {
            this.preReqFunc = func;
        }
        setPostResFunc(func) {
            this.postResFunc = func;
        }
        setResTarget(targetId, loaderId = null) {
            this.targetObj = document.getElementById(targetId);
            this.targetLoaderObj = document.getElementById(loaderId);
        }
        setTargetLoaderFunc(func, args = null) {
            this.targetLoaderFunc = func;
            this.targetLoaderFuncArgs = args;

            if(args.xmlHttpOpenAsync != undefined){
                this.targetLoaderFuncArgs["xmlHttpOpenAsync"] = true;
            }
        }
        sendHttpGet() {
            let _this = this;
            if (_this.preReqFunc != null) {
                _this.preReqFunc();
            }
            _this.targetLoaderFunc(_this.targetLoaderObj, true, _this.targetLoaderFuncArgs);
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = ready;
            xmlHttp.open('GET', _this.url, _this.targetLoaderFuncArgs.xmlHttpOpenAsync);
            xmlHttp.timeout = _this.timeout;
            xmlHttp.ontimeout = function(){_this.onTimeoutFunc(_this);};
            xmlHttp.send();
            function ready() {
                _this.xmlHttpOnReadyStateChangeFunc(xmlHttp, _this);
            }
        }
        sendHttpPost() {
            let _this = this;
            if (_this.preReqFunc != null) {
                _this.preReqFunc();
            }
            _this.targetLoaderFunc(_this.targetLoaderObj, true, _this.targetLoaderFuncArgs);
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = ready;
            xmlHttp.open('POST', _this.url, _this.targetLoaderFuncArgs.xmlHttpOpenAsync);
            xmlHttp.timeout = _this.timeout;
            xmlHttp.ontimeout = function(){_this.onTimeoutFunc(_this);};
            xmlHttp.send();
            function ready() {
                 _this.xmlHttpOnReadyStateChangeFunc(xmlHttp, _this);
            }
        }
    }

    function timeoutMessage(_this) {

        displayError('Error: XMLHttpRequest (' + _this.url + ') timed out.');

    }

    function xmlHttpOnReadyStateChange(xmlHttp, _this) {           
            
        //console.log('Status: ' + xmlHttp.status + ',State: ' + xmlHttp.readyState + ', Response: ' + xmlHttp.response);       

        if( xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200){            
            
            _this.responseData = xmlHttp.responseText;

            if(_this.responseData != 'error' && _this.responseData != 'failure'){

                if(this.targetLoaderObj != null){

                    _this.targetLoaderFunc(_this.targetLoaderObj, false);

                }

                if(_this.targetObj != null) {

                    _this.targetObj.innerHTML = _this.responseData;

                }

                if(_this.postResFunc != null){

                    _this.postResFunc();

                }

            } else {

                //alert(_this.errorMsg);
                GLOBAL.utility.displayError(_this.errorMsg);
                _this.targetLoaderFunc(_this.targetLoaderObj, false);

            }
        } else if( xmlHttp.readyState == XMLHttpRequest.LOADING && xmlHttp.status != 200 &&
                   xmlHttp.response != '') {
                 
                    displayError('Error: XMLHttpRequest, Status: ' + xmlHttp.status + '. ' + 
                                  '<div class="popup-container-error-response">' + xmlHttp.response + '</div>');
                    _this.targetLoaderFunc(_this.targetLoaderObj, false);

        }

    }

    function animLoadingSpinner(obj, state, args = null){

        if(obj == null) return;

        if(state === true){

            obj.style.display = "inline-block";

        } else {

            obj.style.display = "none";

        }
    }

})();