"user strict";

function init(blip){

    let regFile = blip.path.dotRegDir + blip.svar.appPackageName + blip.svar.registrationFileNameExt;
    let identsVerified = [];

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

        blip.server.loggerInfoErr = Object.freeze(function(msg, flagCritical = false){

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

            if(flagCritical) setTimeout(function(){process.exit()},2);

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

        blip.server.loggerErr = Object.freeze(function(msg, flagCritical = false){

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

            if(flagCritical) setTimeout(function(){process.exit()},2);

        });

        process.exitCode = 1;

        process.on('uncaughtException', function(err){
            blip.server.loggerErr(err.stack);
        });

        const unhandledRejections = new Map();

        process.on('unhandledRejection', function(reason, promise){
            var msg = 'unhandled rejection at ' + promise + ', ' + reason;
            blip.server.loggerErr(msg);
            unhandledRejections.set(promise, reason);
        });

        process.on('rejectionHandled', function(promise){
            unhandledRejections.delete(promise);
        });

        process.on('warning', function(warning){
            blip.server.loggerErr(warning.stack);
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
                    blip.server.loggerInfoErr("Wrong data type, needs " + ops[x].type + ".");
                    return false;
                }

                if(ops[x].subType != undefined){
                   if(ops[x].subType === "objectLiteral"){
                        if(!(ops[x].op === {}.constructor))
                        {
                            blip.server.loggerInfoErr("Wrong data type, needs " + ops[x].subType) + ".";
                            return false;
                        }
                   }

                   if(ops[x].subType === "array"){

                        if(ops[x].op.length === undefined)
                        {
                            blip.server.loggerInfoErr("Wrong data type, needs " + ops[x].subType) + ".";
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
    
    function getTokenRegParams(){

        return { crypto: { iterations: 1000, tokenLength: 64, digestAlgorithm: 'sha512' } }
    }

    function fetchRegInfo(){

        //Scans directories and finds registration files to populate return object with.
        //Will include a flagRegNotFound for directories with no reg file data for error handling.

        return Object;

    }

    function isTokenValid(token, params){

        let tokenFromParams = decrypt(encrypted);

        return Boolean;

    }

    function generatePassword( length = 11, wishlist = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$" ) {

        return Array(length).fill(wishlist).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

    }

    function generateSerialCode( length = 30, wishlist = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" ) {

        return Array(length).fill(wishlist).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

    }

    function generateRandomString(length){

        return blip.server.crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);

    }

    async function generateTokenHash(serial, salt, iterations, tokenLength, algorithm) {

        let token = '';

        try{

            token = await blip.server.crypto.pbkdf2Sync(serial, salt, iterations, tokenLength, algorithm).toString(`hex`);

        } catch(error){

            if(blip.svar.flagVerbose) blip.server.loggerErr(error);
            return -1;

        }

        return token;

    }

    async function verifyToken(serial, token, salt, iterations, tokenLength, algorithm) {

        try{

            let genToken = await blip.server.crypto.pbkdf2Sync(serial, salt, iterations, tokenLength,
                algorithm).toString(`hex`);

        if( genToken === token){

            return true;

        } else {

            return false;

        }

        } catch(error) {

            if(blip.svar.flagVerbose) blip.server.loggerErr(error);
            return -1;

        }

    }

    function versionCompare (a, b) {

        let pa = a.replace('^', '').split('.');
        let pb = b.replace('^', '').split('.');

        for (let x = 0; x < 3; x++) {

            let na = Number(pa[x]);
            let nb = Number(pb[x]);

            if (na > nb) return 1;  // a is greater
            if (nb > na) return -1; // a is less

        }

        return 0; // same

    };

    function integrityCheck(callback){

        // Does app version meet criteria
        let criteriaFile = blip.path.dotAppDir + blip.path.criteriaFileName;
        let identFile = blip.path.dotAppDir + blip.path.identifierFileName;
        let hubPackageFile = blip.path.hubDir + blip.path.nodePackageFileName;
        let criteriaVersion = null;
        let hubVersion = null;

        blip.server.fs.stat(criteriaFile, function(error, stats){

            if(error){

                blip.server.loggerErr("Reading criteria file. " + error, true);
                return callback(true);

            }

            let criteria = blip.server.fs.readFileSync( criteriaFile );
            criteriaVersion = JSON.parse(criteria).package.targetPackage.version;

            let hub = blip.server.fs.readFileSync( hubPackageFile );
            hubVersion = JSON.parse(hub).version;

            let orHigher = (criteriaVersion[0] == '^') ? true : false;
            let comp = versionCompare(criteriaVersion, hubVersion);

            if((!orHigher && comp == -1) || (comp == 1)) {

                let msg = "Hub version does not match the criteria needed for " + blip.svar.appPackageName +
                          ". Please upgrade ioport-hub to version: " + criteriaVersion + " or higher.";

                if(!orHigher){

                    msg = "ioport-hub version does not match the criteria needed for " + blip.svar.appPackageName +
                          ". They must be the same at version: " + criteriaVersion;

                }

                blip.server.loggerErr(msg, true);
                callback(true);

            } else {

                checkRegistration();

            }

        });

        async function checkRegistration(){

            let criteria = await getCriteriaParams(blip.path.dotAppDir + blip.path.criteriaFileName);
            if(!criteria) return callback(true);

            blip.server.fs.stat(regFile, function(error, stats){

                if(error){

                    if(blip.svar.flagVerbose)  blip.server.loggerInfo("Registration file not found.  Creating a new one.");

                    processCreateRegistrationFile(function(result){

                        if(result) return callback(false);

                        return checkRegistration();

                    });

                } else {

                    validateIdent();

                }

            });

            async function processCreateRegistrationFile(callback){

                callback(await createRegistrationFile(criteria.package.ident.serial, criteria.package.ident.salt, regFile));

            }

            function validateIdent(){

                blip.server.fs.stat(identFile, function(error, stats){

                    if(error){

                        if(blip.svar.flagVerbose) blip.server.loggerInfo("Identifier file not found for " + blip.svar.appPackageName + ".  Creating a new one.");

                        processCreateIdentifierFile(function(result){

                            if(result) return callback(false);

                            return validateIdent();

                        });

                    } else {

                        verifyFileToken(criteria, function(result){

                            if(!result) return callback(true);

                            callback(false);

                        });

                   }

                });

                async function processCreateIdentifierFile(callback){

                    let token = await createIdentifierFile(criteria.package.ident.serial, criteria.package.ident.salt, identFile);

                    if(token === true) return callback(true);

                    await updateRegistry(blip.svar.package.type.app, token, Object.keys(blip.svar.package.type)[blip.svar.package.type.app]);

                    callback(false);

                }
            }

        }

    }

    /**
     * @function verifyFileToken
     * @param {object} criteriaParams - Object from criteria file.
     * @callback {boolean} true = success or false = failed.
     */
    async function verifyFileToken(criteriaParams, callback){

        let packageName = criteriaParams.package.name;
        let packageType = null;
        let serial = criteriaParams.package.ident.serial;
        let salt = criteriaParams.package.ident.salt;
        let filePath = '';
        let tokenObj = '';
        let token = '';
        let flagRegTokenMatch = false;

        if(criteriaParams.package.type == Object.keys(blip.svar.package.type)[blip.svar.package.type.app]){

            filePath = blip.path.dotAppDir + blip.path.identifierFileName;
            packageType = blip.svar.package.type.app;

        } else if (criteriaParams.package.type == Object.keys(blip.svar.package.type)[blip.svar.package.type.siteDockHanger71]){

            filePath = blip.path.siteDockHanger71Dir + packageName + blip.path.dotDockDir + blip.path.identifierFileName;
            packageType = blip.svar.package.type.siteDockHanger71;

        }


        try{

            tokenObj = blip.server.fs.readFileSync( filePath );
            token = JSON.parse(tokenObj).token;


        } catch(error){

            blip.server.loggerErr('Opening identifier file: ' + error);
            return callback(false);

        }

        let tokenRegParams = getTokenRegParams();

        let tokenVerified = await verifyToken(
            serial,
            token,
            salt,
            tokenRegParams.crypto.iterations,
            tokenRegParams.crypto.tokenLength,
            tokenRegParams.crypto.digestAlgorithm
        );

        if(!tokenVerified || tokenVerified == -1) {

            let msg = 'Problem verifying the ' + packageName + ' integrity token.  ' + 'Try deleting the ' +
                filePath + ' file. A new token file will be generated to help ensure file structure integrity.';

            blip.server.loggerErr(msg);
            return callback(false);

        }

        let isDupPackage = checkForDuplicatePackges(packageName);

        if(isDupPackage){

            blip.server.loggerErr('The Hanger71 site dock registration is already being used.');
            return callback(false);
        } 

        identsVerified.push(packageName);
        
        // Check token against registration file.
        try{

            data = blip.server.fs.readFileSync( regFile );

        } catch(error){

            blip.server.loggerErr('Reading registration file: ' + regFile + error);
            return callback(false);

        }

        reg = JSON.parse(data);

        switch (packageType) {
            case blip.svar.package.type.app:
                if(reg.app.package.ident.token == token) flagRegTokenMatch = true;
                break;

            case blip.svar.package.type.siteDockHanger71:
                let siteDockToken = getSiteDockToken(reg.app.package.siteDocks, packageName);
                if(!siteDockToken) return blip.server.loggerErr('Registration site dock token not found during verification in ' +
                    packageName + '.');
                if(siteDockToken == token) flagRegTokenMatch = true;
                break;

            default:
                blip.server.loggerErr('Problem with package type in registration object when verifying token in ' +
                    packageName + '.');
                return callback(false);
        }

        if(!flagRegTokenMatch){

            blip.server.loggerErr('Registration token does not match with identifier file token in ' +
                packageName + '.');
            callback(false);

        } else {

            callback(true);

        }

        function getSiteDockToken(obj, name){

            for(let x = 0; x < obj.length; x++){

                if(obj[x].package.name == name) return obj[x].package.ident.token;

            }

            return false;
        }

        function checkForDuplicatePackges(name){

            for(let x = 0; x < identsVerified.length; x++){

                if(identsVerified[x] == name) return true;


            }

            return false;

        }

    }

    /**
     * @function createRegistrationFile
     * @param {string} serial
     * @param {string} salt
     * @param {string} file - The full path with file name.
     * @returns {boolean} - true = error, false = success (no error)
     */
    async function createRegistrationFile(serial, salt, file){

        let tokenParams = getTokenRegParams();

        let token = await generateTokenHash(
            serial,
            salt,
            tokenParams.crypto.iterations,
            tokenParams.crypto.tokenLength,
            tokenParams.crypto.digestAlgorithm
        );

        if(token == -1) {

            blip.server.loggerErr('Problem generating token in createRegistrationFile(...).', true);
            return true;
        }

        let  objectTofile = { app: {} };

        objectTofile.app = {
            package:{name:blip.svar.appPackageName,
            ident:{token: token},
            siteDocks:[]}
        }

        try{

            blip.server.fs.writeFileSync(file, JSON.stringify(objectTofile));
            return false;

        } catch(error){

            blip.server.loggerErr(error, 'Problem creating registration file: ' + file);
            return true;

        }

    }

    /**
     * @function createIdentifierFile
     * @param {string} serial
     * @param {string} salt
     * @param {string} file - The full path with file name.
     * @returns {boolean} - true = error, false = success (no error)
     */
    async function createIdentifierFile(serial, salt, file){

        let tokenRegParams = getTokenRegParams();

        let token = await generateTokenHash(
            serial,
            salt,
            tokenRegParams.crypto.iterations,
            tokenRegParams.crypto.tokenLength,
            tokenRegParams.crypto.digestAlgorithm
        );

        if(token == -1) {

            blip.server.loggerErr('Problem generating token in createIdentifierFile(...).');
            return true;
        }

        let objectTofile = '{"token":"' + token + '"}';

        try{

            blip.server.fs.writeFileSync(file, objectTofile);
            return token;

        } catch(error){

            blip.server.loggerErr(error, 'Problem creating identifier file: ' + file);
            return true;

        }

    }

    function updateRegistry(packageType, token, packageName){        

        try{

            data = blip.server.fs.readFileSync( regFile );

        } catch(error){

            blip.server.loggerErr('Reading registration file: ' + regFile + error);
            return callback(false);

        }

        reg = JSON.parse(data);

        switch (packageType) {
            case blip.svar.package.type.app:
                reg.app.package.ident.token = token;
                break;

            case blip.svar.package.type.siteDockHanger71:
                siteDockUpdateRegData(reg.app.package.siteDocks, packageName, token);
                break;

            default:
                blip.server.loggerErr('Problem with package type in registration object: ' + regFile);
                return callback(false);
        }

        try{

            blip.server.fs.writeFileSync(regFile, JSON.stringify(reg));

        } catch(error){

            blip.server.loggerErr('Writing registration file: ' + regFile + error);
            return callback(false);

        }

        return true;

        function siteDockUpdateRegData(obj, packageName, token){

            let flagFound = false;

            for(let x = 0; x < obj.length; x++){

                if(obj[x].package.name == packageName) {flagFound = true;
                    obj[x].package.ident.token = token; break;}

            }

            if(!flagFound){
                obj.push({package: {name: packageName, ident:{token: token}}});
            }

        }

    }

    function cleanSiteDockRegistry(){        

        try{

            data = blip.server.fs.readFileSync( regFile );

        } catch(error){

            if(blip.svar.flagVerbose) blip.server.loggerErr('Reading registration file: ' + regFile + error);
            return false;

        }

        reg = JSON.parse(data);
        
        let siteDockObj = siteDockCleanData(reg.app.package.siteDocks); 

        if(!siteDockObj)return true;

        reg.app.package.siteDocks = siteDockObj;

        try{

            blip.server.fs.writeFileSync(regFile, JSON.stringify(reg));
            return true;

        } catch(error){

            if(blip.svar.flagVerbose) blip.server.loggerErr('Updating registration file during cleaning process: ' + regFile + error);
            return false;

        }

        function siteDockCleanData(siteDockObj){

            let flagEntryNotFound = false;
            let tmpSiteDockRegInfo = [];

            for(let x = 0; x < siteDockObj.length; x++){

                for(let y = 0; y < identsVerified.length; y++){

                    if(siteDockObj[x].package.name == identsVerified[y]){
                        tmpSiteDockRegInfo.push(siteDockObj[x]);
                    } else {
                        flagEntryNotFound = true;
                    }

                }

            }

            if(flagEntryNotFound){
                return tmpSiteDockRegInfo;
            }

            return flagEntryNotFound;

        }

    }

    /**
     * @function getCriteriaParams
     * @param {string} file - The full path with file name.
     * @returns {object || boolean}
     *  object: Holds the criteria parameters for file integrity checks.
     *  boolean: true = no error, false = error
     */
    async function getCriteriaParams(file){

        try{

            let criteria = blip.server.fs.readFileSync(file);
            let criteriaParsed = JSON.parse(criteria);

            if(criteriaParsed.package.ident.salt == undefined) {

                criteriaParsed.package.ident["salt"] = await blip.utilities.generateRandomString(64);
                await blip.server.fs.writeFileSync(file, JSON.stringify(criteriaParsed));

            }

            return criteriaParsed;

        } catch(error){

            if(blip.svar.flagVerbose) blip.server.loggerErr(error);
            return false;

        }

    }

    return {
        JSONDecodeURIComponent,
        returnEmptyResults,
        splitFillNoResults,
        storeReqLogParams,
        logRequest,
        requestFailedHandler,
        argIntegrityCheck,
        initHostFromReqHeaders,
        generatePassword,
        generateSerialCode,
        generateRandomString,
        verifyFileToken,
        createIdentifierFile,
        updateRegistry,
        getCriteriaParams,        
        cleanSiteDockRegistry,
        versionCompare,
        integrityCheck
    }

}

module.exports.init = init;

/****** PROTOTYPES ******/

// Convert a number to a formatted money value.
Number.prototype.toMoney = function(){
    var num = this.toFixed(2);
    return "$"+num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

// Return last array element
Array.prototype.last = function(){
    return this[this.length - 1];
};