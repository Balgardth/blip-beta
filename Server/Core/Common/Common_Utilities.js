"user strict";

function init(blip){    

    initLogger();

    function initLogger(){

        blip.server.logger = new(blip.server.winston.createLogger)({
            exitOnError: false,
            format: blip.server.winston.format.combine(
                blip.server.winston.format.timestamp({format: blip.svar.logTimestamp}),
                blip.server.winston.format.json(),
                blip.server.winston.format.printf(blip.svar.logFormat)
            ),
            transports: [
                new(blip.server.winston.transports.DailyRotateFile)({
                    datePattern: blip.svar.logDatePattern,
                    level: 'info',
                    filename: blip.svar.logInfoFileNamePrefix + blip.svar.logFileNameExt,
                    dirname: __dirname + blip.svar.logDir,                    
                    frequency: blip.svar.logFrequency,
                    maxSize: blip.svar.logMaxSize,
                    maxFiles: blip.svar.logMaxFiles
                }),
                new(blip.server.winston.transports.DailyRotateFile)({
                    datePattern: blip.svar.logDatePattern,
                    level: 'error',
                    filename: blip.svar.logErrorFileNamePrefix + blip.svar.logFileNameExt,
                    dirname: __dirname + blip.svar.logDir,                    
                    frequency: blip.svar.logFrequency,
                    maxSize: blip.svar.logMaxSize,
                    maxFiles: blip.svar.logMaxFiles
                })
            ]
        });

        blip.server.loggerInfoErr = Object.freeze(function(msg){

            if(blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.none) return;

            msgOut = msg.stack || msg;

            if(blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.console ||
                blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.consoleAndFile)
            {
            
                console.log(msgOut);

            }

            if(blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.process ||
               blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.processAndFile)
            {
            
                process.stdout.write(JSON.stringify(msgOut));
                process.stderr.write(JSON.stringify(msgOut));

            }
            
            if(blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.file ||
               blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.consoleAndFile ||
               blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.processAndFile)
            {

                blip.server.logger.info(JSON.stringify(msgOut));
                blip.server.logger.error(JSON.stringify(msgOut));

            }            

        });

        blip.server.loggerInfo = Object.freeze(function(msg){            

            if(blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.none) return;

            msgOut = msg.stack || msg;

            if(blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.console ||
                blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.consoleAndFile)
            {
            
                console.log(msgOut);

            }

            if(blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.process ||
               blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.processAndFile)
            {
            
                process.stdout.write(JSON.stringify(msgOut));

            }
            
            if(blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.file ||
               blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.consoleAndFile ||
               blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.processAndFile)
            {

                blip.server.logger.info(JSON.stringify(msgOut));

            }

        })

        blip.server.loggerErr = Object.freeze(function(msg){

            if(blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.none) return;

            msgOut = msg.stack || msg;

            if(blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.console ||
                blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.consoleAndFile)
            {
            
                console.log(msgOut);

            }

            if(blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.process ||
               blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.processAndFile)
            {
            
                process.stderr.write(JSON.stringify(msgOut));

            }
            
            if(blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.file ||
               blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.consoleAndFile ||
               blip.svar.loggerOutputType == blip.ref.loggerOutputTypeOptions.processAndFile)
            {

                blip.server.logger.error(JSON.stringify(msgOut));

            }

        })

        process.on('uncaughtException', function(err){
            blip.server.logger.error(err.stack);
        });

        const unhandledRejections = new Map();
        
        process.on('unhandledRejection', function(reason, promise){
            var msg = 'unhandled rejection at ' + promise + ', ' + reason;
            blip.server.logger.error(msg);
            unhandledRejections.set(promise, reason);
        });

        process.on('rejectionHandled', function(promise){
            unhandledRejections.delete(promise);
        });

        process.on('warning', function(warning){
            blip.server.logger.error(warning.stack);
        });

    }

    function initHostFromReqHeaders(req) {

        if (req.headers != undefined) {

            if (req.headers.host != undefined) {

                return req.headers.host;

            } else {

                throw Error("Host not found in request header.");

            }

        } else {

            throw Error("Header not found in request.");

        }

    }

    function storeReqLogParams(req, siteDock = null){

        blip.server.appConnQueReqLogging = {
            siteDock: siteDock.svar.serverSiteDockName,
            url: req.url || 'NA',
            method: req.method || 'NA',
            ip: req.ip || 'NA',
            host: ((req.headers != undefined) ? req.headers.host || 'NA' : 'NA'),
            referer: ((req.headers != undefined) ? req.headers.referer || 'NA' : 'NA'),
            lang: ((req.headers != undefined) ? req.headers['accept-language'] || 'NA' : 'NA'),
            userAgent: ((req.headers != undefined) ? req.headers['user-agent'] || 'NA' : 'NA'),
            cookieId: ((req.headers != undefined) ? req.headers.cookie || 'NA' : 'NA')
        };

    }

    function logRequest(req = null, msg = null, siteDock = null){

        if(req != null){

            if(req != 'stored'){
                storeReqLogParams(req, siteDock);
            }

            blip.server.loggerInfo(blip.server.appConnQueReqLogging);

        }

        if(msg != null) blip.server.loggerInfo(msg);

    }

    function requestFailedHandler(res = null, err = null){

        if(err != null) blip.server.loggerInfoErr(err);
        if(res != null) res.end(blip.svar.pageNotification.msg500_100);

    }

    function JSONDecodeURIComponent(json){

        Object.keys(json).forEach(function(key){

            json[key] = decodeURIComponent(json[key]);

        });

        return json;

    }

    function returnEmptyResults(fields){

        var arrayEmptyFields = [{}];

        fields.forEach(function(item){

            arrayEmptyFields[0][item.name] = '';

        });

        return arrayEmptyFields;

    }

    function splitFillNoResults(text){

        var regExpSplitTag = new RegExp(blip.svar.sssplitTag, 'mg');

        text =  text.toString().replace(regExpSplitTag, 'No results');

        regExpSplitTag = new RegExp(blip.svar.ssloopsplitTag, 'mg');

        text = text.toString().replace(regExpSplitTag, '');

        regExpSplitTag = new RegExp(blip.svar.sipLoopTag.open, 'mg');

        text = text.toString().replace(regExpSplitTag, '');

        regExpSplitTag = new RegExp(blip.svar.sipLoopTag.close, 'mg');

        text = text.toString().replace(regExpSplitTag, '');

        return text;

    }

    function argIntegrityCheck(ops){        

        try{            

            for(let x = 0; x < ops.length; x++){                

                if(!(typeof(ops[x].op) === ops[x].type)){
                    blip.server.loggerInfoErr("Error: Wrong data type, needs " + ops[x].type + ".");
                    return false;
                }

                if(ops[x].subType != undefined){
                   if(ops[x].subType === "objectLiteral"){
                        if(!(ops[x].op === {}.constructor))
                        {
                            blip.server.loggerInfoErr("Error: Wrong data type, needs " + ops[x].subType) + ".";
                            return false;
                        }
                   }

                   if(ops[x].subType === "array"){                        

                        if(ops[x].op.length === undefined)
                        {
                            blip.server.loggerInfoErr("Error: Wrong data type, needs " + ops[x].subType) + ".";
                            return false;
                        }
                   }
                }
            }

            return true;

        } catch (err){
            blip.server.loggerInfoErr(err);
            return false;
        }

    }
    
    function generatePassword( length = 11, 
                                 wishlist = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$" ) {
                                      
        return Array(length).fill(wishlist).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');    

    }

    return {
        JSONDecodeURIComponent,
        returnEmptyResults,
        splitFillNoResults,
        storeReqLogParams,
        logRequest,
        requestFailedHandler,
        argIntegrityCheck,
        generatePassword,
        initHostFromReqHeaders
    };
                          
}

module.exports.init = init;

/****** PROTOTYPES ******/

// Convert a number to a formatted money value.
Number.prototype.toMoney = function(){
    var num = this.toFixed(2);
    return "$"+num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};