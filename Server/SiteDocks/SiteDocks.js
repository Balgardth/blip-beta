/**
 ****************
 * IMPORTANT NOTE: Hanger71 is for IOport supplied site docks!
 ****************
 *
 * Start-up installation instruction steps:
 * 1.  Copy <siteDockFileName>.zip.zbm into ./Server/SiteDocks/.
 * 2.  Restart the server.
 * 3.  Verify that you see the siteDock(s) loading entry in the log files.
 *
 * Note: blip.svar.flagSiteDockInstallOnStart needs to be set to true.
 */
"user strict";

function init(blip){

    let siteDockTypeDescriptions = {
        hanger71: 'hanger71 site dock',
        thirdParty: 'site dock'
    }

    function checkForSiteDocks(siteDockType, flagIgnorePackages = false){

        let siteDockPackageNames = [];
        let siteDocksToUnpack    = [];
        let dirList              = '';
        let dirListLength        = '';
        let installedPackagesDir = '';
        let deployPackagesDir    = '';
        let siteDocksDir         = '';
        let hanger71SiteDocksDir = ''

        let siteDockPathAndDesc = getSiteDockPathAndDescription(siteDockType);

        if(!siteDockPathAndDesc){

            blip.server.loggerErr('extractCmd(...) requires a siteDockType argument of ' +
            blip.svar.siteDockTypes.hanger71 + ' or ' + blip.svar.siteDockTypes.thirdParty + '.');
            return false;

        }

        switch (siteDockType) {
            case blip.svar.siteDockTypes.hanger71:

                dirList = blip.server.fs.readdirSync(blip.path.siteDockHanger71Dir);
                dirListLength = dirList.length;
                installedPackagesDir = String(blip.path.siteDockHanger71InstalledPackagesDir).split(/\//).reverse()[1];
                deployPackagesDir = String(blip.path.siteDockHanger71DeployDir).split(/\//).reverse()[1];
                siteDocksDir = String(blip.path.siteDocksDir).split(/\//).reverse()[1];
                break;


            case blip.svar.siteDockTypes.thirdParty:

                dirList = blip.server.fs.readdirSync(blip.path.siteDocksDir);
                dirListLength = dirList.length;
                installedPackagesDir = String(blip.path.siteDocksInstalledPackagesDir).split(/\//).reverse()[1];
                deployPackagesDir = String(blip.path.siteDocksDeployDir).split(/\//).reverse()[1];
                framesDir = String(blip.path.siteDocksFramesDir).split(/\//).reverse()[1];
                hanger71SiteDocksDir = String(blip.path.siteDockHanger71Dir).split(/\//).reverse()[1];
                break;

            default:
                return false;
        }

        if(dirList.length <= 1) {

            if(dirList[0] == installedPackagesDir) return;

        }

        for(let x = 0; x < dirListLength; x++){

            if(siteDockType == blip.svar.siteDockTypes.hanger71 && (dirList[x] == deployPackagesDir || dirList[x] == installedPackagesDir ||
                dirList[x] == siteDocksDir)) continue;

            if(siteDockType == blip.svar.siteDockTypes.thirdParty && (dirList[x] == deployPackagesDir || dirList[x] == installedPackagesDir ||
                dirList[x] == framesDir || dirList[x] == hanger71SiteDocksDir)) continue;

            let ext = dirList[x].toString().split('.');

            if(ext[2] != undefined && !flagIgnorePackages){

                if('.' + ext[1] + '.' + ext[2] == blip.svar.siteDocksPackageFileExts.zbm) {

                    siteDockPackageNames.push(ext[0]);
                    siteDocksToUnpack.push(ext[0]);

                }

            } else {

                let listType = blip.server.fs.lstatSync(siteDockPathAndDesc.path + dirList[x]);
                if(listType.isDirectory()) siteDockPackageNames.push(dirList[x]);

            }

            if(x == (dirListLength - 1)){

                if(flagIgnorePackages) return siteDockPackageNames;

                extractSiteDockArchives(siteDockType, blip.svar.siteDocksPackageFileExts.zbm, siteDocksToUnpack, function(error){

                    if(error) return blip.server.loggerErr(error);

                    validateSiteDocks(siteDockType, siteDockPackageNames, function(error, availSiteDocks){

                        if(error || availSiteDocks == null) return;

                        blip.templateAssembler.loadFramework(availSiteDocks);

                    });

                });

            }

        }

    }

    function extractionValidation(source, dest, callback) {

        var yauzl = blip.server.yauzl;
        var filesToCheck = [];

        yauzl.open(source, function(error, archiveFile) {

            if (error) return callback(error);

            archiveFile.on("error", function(error) {

                return callback(error);

            });

            archiveFile.on("entry", function(entry) {

                filesToCheck.push(entry.fileName);

            });

            archiveFile.on("end", function() {

                verifyFilesExists();

            });

        });

        function verifyFilesExists(){

            var cntr = filesToCheck.length - 1;
            var tries = blip.svar.siteDocksPackageExtractTimeout;
            var delay = blip.svar.siteDocksPackageExtractCheckDelay;

            checkFile();

            function checkFile(){

                var fileToCheck = dest + filesToCheck[cntr];

                blip.server.fs.stat(fileToCheck, function(error, stats){

                    if(error){

                        if( tries <= 0 ){

                            return callback("Archive extraction verification timed out for: " + source);

                        } else {

                            tries--;
                            setTimeout(function(){return checkFile()}, delay);

                        }

                    } else {

                        if( cntr <= 0 ){

                            return callback(null);

                        } else {

                            cntr--;
                            return checkFile();

                        }
                    }

                });

            }

        }

    }

    function extractCmd(siteDockType, source, dest, callback){

        let siteDockPathAndDesc = getSiteDockPathAndDescription(siteDockType);

        if(!siteDockPathAndDesc){

            blip.server.loggerErr('extractCmd(...) requires a siteDockType argument of ' +
            blip.svar.siteDockTypes.hanger71 + ' or ' + blip.svar.siteDockTypes.thirdParty + '.');
            callback(true);

        }

        blip.server.fs.stat(source.slice(0, source.length - 8), function(error){

            if(!error){

                blip.server.loggerErr('Skipping package installation, site dock directory already exists for package: ' +  source);
                callback(true);

            }

            runExtractCmd();

        });

        function runExtractCmd(){

            const { exec } = require("child_process");

            exec("yarn node ./Dist/extract " + source + " " + dest, (error, stdout, stderr) => {

                if (error) {
                    blip.server.loggerErr(error + ', Extracting '  + siteDockPathAndDesc.logDesc +  ' file: ' +  source);
                    callback(true);
                }

                if (stderr) {
                    blip.server.loggerErr(stderr + ', Extracting '  + siteDockPathAndDesc.logDesc +  ' file: ' +  source);
                    callback(true);
                }

                callback(false);

            });

        }

    }

    function extractSiteDockArchives(siteDockType, extType, archives, callback){

        var cntr = archives.length - 1;
        if(cntr == -1) return callback(null);

        let siteDockPathAndDesc = getSiteDockPathAndDescription(siteDockType);

        if(!siteDockPathAndDesc){

            return callback('extractSiteDockArchives(..) requires a siteDockType argument of ' +
            blip.svar.siteDockTypes.hanger71 + ' or ' + blip.svar.siteDockTypes.thirdParty + '.');

        }

        extract();

        function extract(){

            var fileName = archives[cntr] + extType;

            if(blip.svar.flagVerbose) blip.server.loggerInfo('Extracting '  + siteDockPathAndDesc.logDesc +  ' file: ' +  fileName);

            let pathWithFile = siteDockPathAndDesc.path + fileName;

            extractCmd(siteDockType, pathWithFile, siteDockPathAndDesc.path, function(error){

                if(error) return callback('Problem executing extraction command.');

                runextractionValidation();

            });

            function runextractionValidation(){

                cntr--;

                extractionValidation(pathWithFile, siteDockPathAndDesc.path, function(error) {

                    if(error) {

                        return callback(error);

                    }

                    if(blip.svar.flagVerbose) blip.server.loggerInfo('Moving '  + siteDockPathAndDesc.logDesc +  ' package file: ' +  fileName + " to " + siteDockPathAndDesc.installedPackagesDir);
                    blip.server.fs.renameSync(siteDockPathAndDesc.path +  fileName, siteDockPathAndDesc.installedPackagesDir + '/' + fileName);

                    if(cntr == -1){

                        callback(null);

                    } else {

                        extract();

                    }

                });

            }

        }

    }

    function validateSiteDocks(siteDockType, name, callback){

        let siteDocksToLoad = [];
        let nameLength = name.length;
        let flagSiteDocksToLoadAcquired = true;
        let flagSiteDocksToLoadAcquiredCheckAttempts = 1000;
        let flagSiteDocksToLoadAcquiredCheckTryCntr = 0;

        let siteDockPathAndDesc = getSiteDockPathAndDescription(siteDockType);

        if(!siteDockPathAndDesc){

            blip.server.loggerErr('validateSiteDocks(...) requires a siteDockType argument of ' +
                blip.svar.siteDockTypes.hanger71 + ' or ' + blip.svar.siteDockTypes.thirdParty + '.');
            return callback(true);

        }

        for(let x = 0; x < nameLength; x++){

            blip.server.fs.stat(siteDockPathAndDesc.path + name[x] + '/' + blip.path.siteDocksConfigFileName + '.js', function(error, stats){

                if(error){

                    blip.server.loggerErr(error + ', Reading '  + siteDockPathAndDesc.logDesc +  ' configuration file: ' + name[x] + ', it doesn\'t belong in this directory.');
                    return callback(true);

                }

                if(siteDockType == blip.svar.siteDockTypes.thirdParty){

                    if(blip.svar.flagVerbose) blip.server.loggerInfo('Stats birthtime for: ' + name[x] + ' is ' + stats.birthtime);
                    siteDocksToLoad.push({name: name[x], path: siteDockPathAndDesc.path + name[x] + '/' + blip.path.siteDocksConfigFileName});
                    if(x == nameLength - 1) sendCallback(siteDocksToLoad);


                } else if(siteDockType == blip.svar.siteDockTypes.hanger71){

                    flagSiteDocksToLoadAcquired = false;

                    validateIdent(name[x], function(error){

                        if(error) {

                            if(blip.svar.flagVerbose) blip.server.loggerInfo('Skipping ' + name[x] + ', validation problem.');

                        } else {

                            if(blip.svar.flagVerbose) blip.server.loggerInfo('Stats birthtime for: ' + name[x] + ' is ' + stats.birthtime);
                            siteDocksToLoad.push({name: name[x], path: siteDockPathAndDesc.path + name[x] + '/' + blip.path.siteDocksConfigFileName});

                        }
                        flagSiteDocksToLoadAcquired = true;

                    });

                    if(x == nameLength - 1) sendCallback(siteDocksToLoad);

                }

            });

        }

        function sendCallback(siteDocks){

            if(flagSiteDocksToLoadAcquired){

                if(siteDockType == blip.svar.siteDockTypes.hanger71){

                    if(blip.utilities.cleanSiteDockRegistry()) {

                        if(blip.svar.flagVerbose) blip.server.loggerInfo('Registration was cleaned of any extra Hanger71 site dock entries.');

                    }
                    
                }

                callback(false, siteDocks);

            } else {

                if(flagSiteDocksToLoadAcquiredCheckTryCntr < flagSiteDocksToLoadAcquiredCheckAttempts){

                setTimeout(function(){sendCallback(siteDocks)},10);
                flagSiteDocksToLoadAcquiredCheckTryCntr++;

                } else {

                    if(blip.svar.flagVerbose) blip.server.loggerError('validateSiteDocks(...) timed out.');
                    callback(true);

                }

            }
        }

    }

    /**
     * @function validateIdent
     * @param {string} name - The name of the site dock package.
     * @callback {boolean} The state of true = error or false = success no error.
     */
    async function validateIdent(name, callback){

        let criteria = await blip.utilities.getCriteriaParams(blip.path.siteDockHanger71Dir + name +
            blip.path.dotDockDir + blip.path.criteriaFileName);

        if(!criteria) return true;

        let identFile = blip.path.siteDockHanger71Dir + name + blip.path.dotDockDir + blip.path.identifierFileName;

        criteriaVersion = criteria.package.targetPackage.version;

        let ioportBlipPackageFile = blip.path.appDir + blip.path.nodePackageFileName;

        let ioBlip = blip.server.fs.readFileSync( ioportBlipPackageFile );
        ioBlipVersion = JSON.parse(ioBlip).version;

        let orHigher = (criteriaVersion[0] == '^') ? true : false;
        let comp = blip.utilities.versionCompare(criteriaVersion, ioBlipVersion);

        if((!orHigher && comp == -1) || (comp == 1)) {

            let msg = "IOport Blip version does not match the criteria needed for " + name +
                        ". Please upgrade ioport-blip to version: " + criteriaVersion + " or higher.";

            if(!orHigher){

                msg = "ioport-blip version does not match the criteria needed for " + name +
                        ". They must be the same at version: " + criteriaVersion;

            }

            blip.server.loggerErr(msg);
            callback(true);

        } else {

            validate();

        }

        function validate(){

            blip.server.fs.stat(identFile, function(error, stats){

                if(error){

                    if(blip.svar.flagVerbose)  blip.server.loggerInfo("Identifier file not found for " + name +  ".  Creating a new one.");

                    processCreateIdentifierFile(function(result){

                        if(result) return callback(true);

                        return validate();

                    });

                } else {

                    blip.utilities.verifyFileToken(criteria, function(result){

                        if(!result) return callback(true);

                        callback(false);

                    });

                }

            });

            async function processCreateIdentifierFile(callback){

                let token = await blip.utilities.createIdentifierFile(criteria.package.ident.serial, criteria.package.ident.salt,
                    blip.path.siteDockHanger71Dir + name + blip.path.dotDockDir + blip.path.identifierFileName);

                if(token === true) return callback(true);

                await blip.utilities.updateRegistry(blip.svar.package.type.siteDockHanger71, token, name);

                callback(false);

            }

        }

    }

    /**
     * @function getSiteDockPathAndDescription
     * @param {number} type - Type of site dock.
     * @borrows blip.svar.siteDockTypes as type
     * @returns {<object> || <boolean>}
     * @description Returns the site dock path, installed packages directory, and log description of the site dock type to be used in
     * logging messages or false if no type is found.
     */
    function getSiteDockPathAndDescription(type){

        switch (type) {

            case blip.svar.siteDockTypes.hanger71:
                return {path: blip.path.siteDockHanger71Dir, installedPackagesDir: blip.path.siteDockHanger71InstalledPackagesDir,
                    logDesc: siteDockTypeDescriptions.hanger71};

            case blip.svar.siteDockTypes.thirdParty:
                return {path: blip.path.siteDocksDir, installedPackagesDir: blip.path.siteDocksInstalledPackagesDir,
                    logDesc: siteDockTypeDescriptions.thirdParty};

            default:
                return false;
        }

    }

    return {checkForSiteDocks, validateSiteDocks};

}

module.exports.init = init;