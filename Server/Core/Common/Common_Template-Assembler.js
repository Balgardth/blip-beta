"user strict";

function init(blip){

    function performStringSip(str, tagVarName, strReplace){

        let strSearch = new RegExp(blip.svar.sipTag.open + tagVarName + blip.svar.sipTag.close, 'g');

        return str.toString().replace(strSearch, strReplace);
    }
    
    function getSortFragLoops(str){

        let fragIndices = getLoopFragIndices(str);

        // Match keys with frag
        let matchedKeyFrags = [];

        for(let x = 0; x < fragIndices.length; x++){

            let tmpFrag = str.slice(fragIndices[x].openIndex, fragIndices[x].closeIndex);
            matchedKeyFrags.push({key: fragIndices[x].key, frag: tmpFrag});

        }

        if(matchedKeyFrags[0].key !== 'TemplateEngine') { } // return error value

        var sortedFragKeys = [{}];
        sortedFragKeys[0][matchedKeyFrags[0].key] = [ { frag: matchedKeyFrags[0].frag.replace('{sipLoop id="TemplateEngine"}','') } ];

        for(let x = 1; x < matchedKeyFrags.length; x++){

            buildSortedFragKeys(matchedKeyFrags[x], sortedFragKeys);

        }

        //outputSortedFragKeys(sortedFragKeys);

        function buildSortedFragKeys(objLitRef, sortedObj){

            for(let x=0; x < sortedObj.length; x++){

                for(let y=0; y < Object.keys(sortedObj[x]).length; y++){

                    let key = Object.keys(sortedObj[x])[y];

                    if(key === "frag"){

                        if(typeof(sortedObj[x][key]) != 'string') {

                            if(sortedObj[x][key][y].frag != undefined){

                                buildSortedFragKeys(objLitRef, sortedObj[x][key]);

                            }
                            continue;
                        }

                        let tmpSplit = sortedObj[x][key].toString().split(objLitRef.frag);

                        if(tmpSplit.length === 1) continue;

                        sortedObj[x][key] = [ { frag: tmpSplit[0] }, {}, { frag: tmpSplit[1].replace('{sipLoop id="' + objLitRef.key + '"}','').replace('{/sipLoop}','') } ];
                        sortedObj[x][key][1][objLitRef.key] = [ { frag: objLitRef.frag.replace('{sipLoop id="' + objLitRef.key + '"}','').replace('{/sipLoop}','') } ];

                    } else if( sortedObj[x][key][y].frag != undefined) {

                        buildSortedFragKeys(objLitRef, sortedObj[x][key]);

                    }

                }

            }

        }

        return sortedFragKeys;

    }
    
    function getLoopFragIndices(str){

        let regExpStrBegin = new RegExp('{sipLoop([ ]+?)id="(.*?)"}', 'gi');
        let matchedTagsOpen = str.match(regExpStrBegin);
        let ssloopCloseStr = '{/sipLoop}';
        let regExpStrEnd = new RegExp(ssloopCloseStr, 'gi');
        let matchedTagsClose = str.match(regExpStrEnd);

        let matchedTagsOpenLength = matchedTagsOpen.length;
        let matchedTagsCloseLength = matchedTagsClose.length;

        //Error condition
        if(matchedTagsOpenLength != matchedTagsCloseLength){
            return -1;
        }

        //Get indices
        let matchedIndicesOpen = [];
        let matchedIndicesClose = getIndices(str, ssloopCloseStr);

        for(let x = 0; x < matchedTagsOpenLength; x++){

            matchedIndicesOpen.push(str.indexOf(matchedTagsOpen[x]));
        }

        let sortedMatchedJoin = matchedIndicesOpen.concat(matchedIndicesClose).sort(function(a,b){return a - b});

        for(let x = 0; x < sortedMatchedJoin.length; x++){

            for(let y = 0; y < matchedIndicesOpen.length; y++){

                if(sortedMatchedJoin[x] == matchedIndicesOpen[y]) sortedMatchedJoin[x] = {key: matchedTagsOpen[y].split(/"/)[1], open: sortedMatchedJoin[x]};
            }

            if(sortedMatchedJoin[x].open != undefined) continue;

            for(let y = 0; y < matchedIndicesClose.length; y++){

                if(sortedMatchedJoin[x] == matchedIndicesClose[y]) sortedMatchedJoin[x] = {key: matchedTagsClose[y].split(/"/)[1], close: sortedMatchedJoin[x]};
            }

        }

        let sortedMatchedJoinTmp = sortedMatchedJoin;
        let matchedIndices = [];

        loop1:
        for(let x = 0; x < sortedMatchedJoinTmp.length; x++){

            let matchedIndexCloseCntr = 0;

            if(sortedMatchedJoinTmp[x].open != undefined){

            loop2:
                for(let y = x; y < sortedMatchedJoin.length; y++){

                    if(sortedMatchedJoin[y].open != undefined ){

                        matchedIndexCloseCntr++;

                    } else if(matchedIndexCloseCntr > 0) {

                        matchedIndexCloseCntr--;

                    }

                    if( matchedIndexCloseCntr == 0){

                        matchedIndices.push({key: sortedMatchedJoinTmp[x].key, openIndex: sortedMatchedJoinTmp[x].open, closeIndex: sortedMatchedJoin[y].close});
                        break loop2;

                    }
                }
            }

        }

        return matchedIndices;
    }

    function getIndices(haystack, needle){
        var returns = [];
        var position = 0;
        while(haystack.indexOf(needle, position) > -1){
            var index = haystack.indexOf(needle, position);
            returns.push(index);
            position = index + needle.length;
        }
        return returns;
    }

    function assembleLoopFragData(dataObj, loopData = {}){

        if(!blip.utilities.argIntegrityCheck([
            {op: dataObj, type: 'object', subType: 'array'},
            {op: loopData, type: 'object', subType: 'object literal'}
        ])) return -1;

        let str = '';

        run(dataObj);

        function run(obj, loopName = 'TemplateEngine'){

            for(let x = 0; x < obj.length; x++){

                for(let y = 0; y < Object.keys(obj[x]).length; y++){

                    let key = Object.keys(obj[x])[y];

                    if(key == 0) continue;

                    if(typeof(obj[x][key]) == 'string'){

                        str += addLoopData(obj[x][key], loopName);

                    } else if( key !== 'frag') {

                        loopName = key;

                    }

                    if( Object.keys(obj[x][key][y])[0] != undefined){

                        run(obj[x][key], loopName);

                    }
                }
            }
        }

        function addLoopData(str, loopName){

            if(loopData[loopName] == undefined) return str;

            var strFrag = '';

            for(let x = 0; x < loopData[loopName].length; x++){

                let tmpStr = str;

                for(let y = 0; y <= Object.keys(loopData[loopName]).length; y++){

                    let key = Object.keys(loopData[loopName][x])[y];

                    tmpStr = tmpStr.replace('{sipLoopSplit var="' + key + '" /}', loopData[loopName][x][key]);

                }

                strFrag += tmpStr;

            }

            delete loopData[loopName];

            return strFrag;
        }

        return str;
    }

    function getContentFromTplFile(filePath){

        var fileContents;

        try{
            fileContents = blip.server.fs.readFileSync(filePath);
        } catch (err){
            blip.server.loggerInfoErr(err);
            fileContents = -1;
        }

        return fileContents;

    }

    function te_sendTextHtmlPage(res, text){

        setTimeout(function () {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(text);
        }, blip.svar.testDelay);

    }

    function te_sendText(res, text){

        setTimeout(function () {
            res.send(text);
        }, blip.svar.testDelay);

    }

    let te_tEOCntr = 0;
    let te_templateEngineObjects = [];

    function te_addFrag(store, obj, flagCache = false) {
        var params = {
            store: store,          // Store is either a filepath or data.
            storeIsData: false,    // Is this.store is data or filepath if false.
            includesHeader: null,  // Header includes such as .js and .css files.
            includesFooter: null,  // Footer includes such as .js and .css files.
            strReplace: null,      // The below sip may make this obsolete.
            sipData: null,         // Server Induced Population {sipName: sipData,(...)}
            cache: { enabled: flagCache, data: null, time: null },
            render: {
                // enabled.state:<'fixed','cycle'>
                enabled: { on: true, state: 'fixed', timeSpan: null, startTime: null },
                // disable can be used to set a time delay to disable render
                // disable.enabled.state:<null,'stop'>, Overrides enabled.
                disable: { on: false, state: null, timeSpan: null, startTime: null }
            }
        };
        return (obj.frag.push(params) - 1);
    }

    class TemplateEngine {
        constructor(siteDock = null, url = null, flagCache = false) {
            this.id = te_tEOCntr++;
            this.siteDock = siteDock;
            this.url = url;
            this.cache = { enabled: flagCache, data: null, time: null };
            this.cacheMem = 0;
            this.frag = [];
            this.type = 'page';  // page or fragment
            te_templateEngineObjects.push(this);
        }
        static get objects(){
            return te_templateEngineObjects;
        }
        static setCacheState(id, state){

            for(let x = 0; x < te_templateEngineObjects.length; x++){

                if(te_templateEngineObjects[x].id != id) continue;

                te_templateEngineObjects[x].cache.enabled = state;

                if(!state) {

                    te_templateEngineObjects[x].cacheMem = 0;
                    te_templateEngineObjects[x].cache.data = null;
                }

                break;
            }

        }
        static sendText(res, text) {
            te_sendText(res, text);
        }
        static sendTextHtmlPage(res, text) {
            te_sendTextHtmlPage(res, text);
        }
        get cacheMemValue(){
            return this.cacheMem;
        }
        setFragSipKeyedData(id, sipData) {
            this.frag[id].sipData = sipData;
        }
        getFrag(id){
            return this.frag[id].store;
        }
        addFragFilePath(filePath, flagCache = false){
            return te_addFrag(filePath, this, flagCache);
        }
        addFragData(data, flagCache = false){
            let id = te_addFrag(data, this, flagCache);
            this.frag[id].storeIsData = true;
            return id;
        }
        removeFrag(id) {
            this.frag[id] = null;
        }
        updateFragData(idObj, data, flagCache=false) {
            if(idObj.id == null){
                idObj.id = this.addFragData(data);
                this.frag[idObj.id].cache.enabled = flagCache;
            } else {
                this.frag[idObj.id].store = data;
            }
            return idObj.id;
        }
        updateFragCache(id, data, flagCache=true) {
            this.frag[id].cache.enabled = flagCache;
            this.frag[id].cache.data = data;
        }       
        disableFrag(id, obj) {
            this.frag[id].render.enabled.on = false;
            this.frag[id].render.disable.on = true;
            this.frag[id].render.disable.state = obj.state;
            if (obj.timeSpan != undefined) {
                this.frag[id].render.disable.timeSpan = obj.timeSpan;
                this.frag[id].render.disable.startTime = new Date();
            }
        }        
        enableFrag(id, obj) {
            this.frag[id].render.enabled.on = true;
            this.frag[id].render.enabled.on = false;
            this.frag[id].render.enabled.state = obj.state;
            if (obj.timeSpan != undefined) {
                this.frag[id].render.enabled.timeSpan = obj.timeSpan;
                this.frag[id].render.enabled.startTime = new Date();
            }
        }
        setFragCacheState(id, flagState) {
            this.frag[id].cache.enabled = flagState;
            if(flagState == false) this.frag[id].store = null;
        }
        addIncludesHeader(id, includes) {
            var _this = this;
            if (_this.frag[id].includesHeader == null) {
                _this.frag[id].includesHeader = { fav: [], css: [], js: [] };
            }
            if (includes.fav != undefined) {
                includes.fav.forEach(function (item) {
                    _this.frag[id].includesHeader.fav.push(item);
                });
            }
            if (includes.css != undefined) {
                includes.css.forEach(function (item) {
                    _this.frag[id].includesHeader.css.push(item);
                });
            }
            if (includes.js != undefined) {
                includes.js.forEach(function (item) {
                    _this.frag[id].includesHeader.js.push(item);
                });
            }
        }
        addIncludesFooter(id, includes) {
            var _this = this;
            if (_this.frag[id].includesFooter == null) {
                _this.frag[id].includesFooter = { css: [], js: [] };
            }
            if (includes.css != undefined) {
                includes.css.forEach(function (item) {
                    _this.frag[id].includesFooter.css.push(item);
                });
            }
            if (includes.js != undefined) {
                includes.js.forEach(function (item) {
                    _this.frag[id].includesFooter.js.push(item);
                });
            }
        }
        addStrReplace(id, obj) {
            let _this = this;

            if (_this.frag[id].strReplace == null) {
                _this.frag[id].strReplace = obj;
                return;
            }

            if(obj[0] != undefined){

                for(let y=0; y < obj.length; y++){

                    replaceIdent(obj[y]);

                }

            } else {

                replaceIdent(obj);

            }            

            function replaceIdent(item){                

                for(let x=0; x < _this.frag[id].strReplace.length; x++){

                    if(_this.frag[id].strReplace[x].srcStr.toString() == item.srcStr.toString()){
                        _this.frag[id].strReplace[x] = item;
                        return;
                    }

                }

                _this.frag[id].strReplace.push(item);

            }
        }
        sendError(res, msg, sendResponseHeader=true) {
            if(sendResponseHeader){
                te_sendTextHtmlPage(res, msg);
            } else {
                te_sendText(res, msg);
            }            
        }
        /* Checks to see if page is cached and will send if it is. */
        sendPageCacheHandler(req, res, id){

            if(id == null) return false;

            if(this.frag[id].cache.enabled){
                this.sendPage(req, res);
                return true;
            } else {
                return false;
            }
        }
        sendPage(req, res, sendResponseHeader=true) {
            
            var _this = this;
            blip.utilities.storeReqLogParams(req, _this.siteDock);
            var html = '';
            if (blip.svar.flagCache && _this.cache.enabled && _this.cache.data != null) {
                html = _this.cache.data;
                if (blip.svar.flagVerbose)
                    blip.utilities.logRequest('stored', blip.svar.templateLog.cached + _this.url);
            }
            else {
                var frag = '';
                for (var x = 0; x < _this.frag.length; x++) {
                    if (blip.svar.flagCache && _this.frag[x].cache.enabled && _this.frag[x].cache.data != null) {
                        frag = _this.frag[x].cache.data;
                        if (blip.svar.flagVerbose){

                            if(_this.frag[x].storeIsData){
                                blip.utilities.logRequest('stored', blip.svar.templateLog.cached + 'data');
                            } else {
                                blip.utilities.logRequest('stored', blip.svar.templateLog.cached + _this.frag[x].store);
                            }

                        }
                    }
                    else {
                        try {
                            if(_this.frag[x].storeIsData){
                                frag = _this.frag[x].store;
                            } else {
                                frag = blip.server.fs.readFileSync(_this.frag[x].store);
                            }
                        }
                        catch (err) {
                            blip.server.loggerInfoErr(err);
                        }
                        if (_this.frag[x].includesHeader != null) {
                            frag = te_templateIncludes(frag, _this.frag[x].includesHeader);
                        }
                        if (_this.frag[x].sipData != null) {
                            frag = te_templateSip(frag, _this.frag[x].sipData);
                        }
                        if (_this.frag[x].strReplace != null) {
                            frag = te_templateStrReplace(frag, _this.frag[x].strReplace);
                        }
                        if (blip.svar.flagVerbose){
                            if(_this.frag[x].storeIsData){
                                blip.utilities.logRequest('stored', blip.svar.templateLog.raw + 'data');
                            } else {
                                blip.utilities.logRequest('stored', blip.svar.templateLog.raw + _this.frag[x].store);
                            }
                        }
                    }
                    if (_this.frag[x].cache.enabled && _this.frag[x].cache.data == null) {
                        _this.frag[x].cache.data = frag;
                        _this.frag[x].cache.time = new Date();
                    }
                    html += frag;
                }
                if (_this.cache.enabled && _this.cache.data == null) {
                    _this.cache.data = html;
                    _this.cache.time = new Date();
                    _this.cacheMem = blip.server.sizeOf(_this.cache.data);
                }
            }

            if(sendResponseHeader) {
                te_sendTextHtmlPage(res, html);
            } else {
                te_sendText(res, html);
            }

        }
    }

    function te_templateIncludes(text, includes){

        var tmpIncTags = [];

        Object.keys(includes).forEach( function(key){

            if (key != 'enum') {

                includes[key].forEach(function(item){

                    var reInc = RegExp(item.sipTag, 'g');
                    text = text.toString().replace( reInc, '\t\t' + item.externalFile + item.sipTag );
                    tmpIncTags.push(item.sipTag);

                });

            }

        });

        tmpIncTags.forEach(function(tag){

            text = text.replace( tag, '');

        });

        return text;
    }

    function te_templateSip(text, sipData){

        Object.keys(sipData).forEach( function(key){

            var reInc = RegExp(blip.svar.sipTag.open + key + blip.svar.sipTag.close, 'g');
            text = text.toString().replace( reInc, sipData[key]  );

        });

        return text;
    }

    function te_templateStrReplace(text, obj){

        obj.forEach(function(item){

            text = text.toString().replace(item.srcStr, item.rplStr);

        });

        return text;
    }

    module.exports = {TemplateEngine,
                      getContentFromTplFile,
                      performStringSip,
                      getLoopFragIndices,
                      getSortFragLoops,
                      assembleLoopFragData};

}

module.exports.init = init;