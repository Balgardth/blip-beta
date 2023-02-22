/**
 *
 * Installation instruction steps:
 * 1.  Copy <siteDockFileName>.zip.zbm into ./Server/SiteDocks.
 * 2.  Restart the server.
 * 3.  Verify that you see the siteDock(s) loading entry in the log files.
 */
"user strict";

function init(blip){
    
    let siteDockStr = "site dock";    

    function checkForSiteDocks(siteDocksToLoad){        

        const siteDocksConfigFileName = blip.path.siteDocksConfigFileName;
        var siteDockNames = [];
        var siteDocksToUnpack = [];

        var dirList = blip.server.fs.readdirSync(blip.path.siteDocksDir);

        var installedPackagesDir = String(blip.path.siteDocksInstalledPackagesDir).split(/\//).reverse()[1];
        var framesDir = String(blip.path.siteDocksFramesDir).split(/\//).reverse()[1];
        var hanger71SiteDocksDir = String(blip.path.siteDockHanger71Dir).split(/\//).reverse()[1];

        if(dirList.length <= 1) {

            if(dirList[0] == installedPackagesDir) return;

        }

        for(x = 0; x < dirList.length; x++){

            if(dirList[x] == installedPackagesDir || dirList[x] == framesDir || dirList[x] == hanger71SiteDocksDir) continue;

            let ext = dirList[x].toString().split('.');

            if(ext[2] != undefined){

                if(ext[2] == 'zbm') {

                    siteDockNames.push(ext[0]);
                    siteDocksToUnpack.push(ext[0]);

                }

            } else {

                let listType = blip.server.fs.lstatSync(blip.path.siteDocksDir + dirList[x]);
                if(listType.isDirectory()) siteDockNames.push(dirList[x]);

            }

        }

        extractArchiveFiles(function(error){

            if(error) return blip.server.loggerErr(error);

            loadModules();

        });

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

                    var fileToCheck = blip.path.siteDocksDir + filesToCheck[cntr];

                    blip.server.fs.stat(fileToCheck, function(error, stats){

                        if(error){

                            if( tries <= 0 ){

                                return callback("Archive extraction verification timed-out for: " + source);

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

        function loadModules(){

            for(let x = 0; x < siteDockNames.length; x++){

                blip.server.fs.stat(blip.path.siteDocksDir + siteDockNames[x] + '/' + siteDocksConfigFileName + '.js', function(error, stats){

                    if(error){

                        return blip.server.loggerErr(error + ', Reading ' + siteDockStr + ' configuration file: ' + siteDockNames[x] + ', it doesn\'t belong in this directory.');

                    }

                    if(blip.svar.flagVerbose) blip.server.loggerInfo('Stats birthtime for: ' + siteDockNames[x] + ' is ' + stats.birthtime);

                }); 
                
                try {
                    
                    siteDocksToLoad.push({name: siteDockNames[x], path: blip.path.siteDocksDir + siteDockNames[x] + '/' + siteDocksConfigFileName});
                    

                } catch (error) {

                    blip.server.loggerErr(error + ', Loading ' + siteDockStr + ': ' + siteDockNames[x]);
                }

            }       

            blip.server.loadFramework(siteDocksToLoad);        

        }    

        function extractCmd(source, dest){ 
            
            const { exec } = require("child_process");

            exec("yarn node ./Dist/extract " + source + " " + dest, (error, stdout, stderr) => {

                if (error) {
                    blip.server.loggerErr(error + ', Extracting ' + siteDockStr + ' file: ' +  source);
                    return;
                }

                if (stderr) {
                    blip.server.loggerErr(stderr + ', Extracting ' + siteDockStr + ' file: ' +  source);
                    return;
                }

            });

        }

        function extractArchiveFiles(callback){

            var cntr = siteDocksToUnpack.length - 1;

            if(cntr == -1) return callback(null);

            extract();

            function extract(){

                var fileName = siteDocksToUnpack[cntr] + blip.svar.siteDocksPackageFileExt;

                if(blip.svar.flagVerbose) blip.server.loggerInfo('Extracting ' + siteDockStr + ' file: ' +  fileName);

                extractCmd(blip.path.siteDocksDir + fileName, blip.path.siteDocksDir);

                cntr--;

                extractionValidation(blip.path.siteDocksDir + fileName, blip.path.siteDocksDir, function(error) {

                    if(error) {

                        return callback(error);

                    }

                    if(blip.svar.flagVerbose) blip.server.loggerInfo('Moving ' + siteDockStr + ' package file: ' +  fileName + " to " + installedPackagesDir);
                    blip.server.fs.renameSync(blip.path.siteDocksDir +  fileName, blip.path.siteDocksDir + installedPackagesDir + '/' + fileName);

                    if(cntr == -1){

                        callback(null);

                    } else {

                        extract();

                    }

                });

            }

        }

    }

    return {checkForSiteDocks};

}

module.exports.init = init;