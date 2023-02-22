/**
 *
 * Installation instruction steps:
 * 1.  Copy <siteDockFileName>.zip.zbm into ./Server/SiteDocks/Hanger71.
 * 2.  Restart the server.
 * 3.  Verify that you see the hanger71 siteDock(s) loading entry in the log files.
 */
"user strict";

function init(blip){

    let hanger71SiteDockStr = "hanger71 site dock";

    function checkForSiteDocks(){

        const siteDocksConfigFileName = blip.path.siteDocksConfigFileName;
        var siteDockNames = [];
        var siteDocksToUnpack = [];

        var dirList = blip.server.fs.readdirSync(blip.path.siteDockHanger71Dir);

        var installedPackagesDir = String(blip.path.siteDocksInstalledPackagesDir).split(/\//).reverse()[1];
        var siteDocksDir = String(blip.path.siteDocksDir).split(/\//).reverse()[1];

        if(dirList.length <= 1) {

            if(dirList[0] == installedPackagesDir) return;

        }

        for(x = 0; x < dirList.length; x++){

            if(dirList[x] == installedPackagesDir || dirList[x] == siteDocksDir) continue;

            let ext = dirList[x].toString().split('.');

            if(ext[2] != undefined){

                if(ext[2] == 'zbm') {

                    siteDockNames.push(ext[0]);
                    siteDocksToUnpack.push(ext[0]);

                }

            } else {

                let listType = blip.server.fs.lstatSync(blip.path.siteDockHanger71Dir + dirList[x]);
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

                    var fileToCheck = blip.path.siteDockHanger71Dir + filesToCheck[cntr];

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

            var siteDocksToLoad = [];

            for(let x = 0; x < siteDockNames.length; x++){

                blip.server.fs.stat(blip.path.siteDockHanger71Dir + siteDockNames[x] + '/' + siteDocksConfigFileName + '.js', function(error, stats){

                    if(error){

                        return blip.server.loggerErr(error + ', Reading '  + hanger71SiteDockStr +  ' configuration file: ' + siteDockNames[x] + ', it doesn\'t belong in this directory.');

                    }

                    if(blip.svar.flagVerbose) blip.server.loggerInfo('Stats birthtime for: ' + siteDockNames[x] + ' is ' + stats.birthtime);

                });

                try {

                    siteDocksToLoad.push({name: siteDockNames[x], path: blip.path.siteDockHanger71Dir + siteDockNames[x] + '/' + siteDocksConfigFileName});


                } catch (error) {

                    blip.server.loggerErr(error + ', Loading '  + hanger71SiteDockStr +  ': ' + siteDockNames[x]);
                }

            }

            blip.server.siteDocks.checkForSiteDocks(siteDocksToLoad);

        }

        function extractCmd(source, dest){

            const { exec } = require("child_process");

            exec("yarn node ./Dist/extract " + source + " " + dest, (error, stdout, stderr) => {

                if (error) {
                    blip.server.loggerErr(error + ', Extracting '  + hanger71SiteDockStr +  ' file: ' +  source);
                    return;
                }

                if (stderr) {
                    blip.server.loggerErr(stderr + ', Extracting '  + hanger71SiteDockStr +  ' file: ' +  source);
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

                if(blip.svar.flagVerbose) blip.server.loggerInfo('Extracting '  + hanger71SiteDockStr +  ' file: ' +  fileName);

                extractCmd(blip.path.siteDockHanger71Dir + fileName, blip.path.siteDockHanger71Dir);

                cntr--;

                extractionValidation(blip.path.siteDockHanger71Dir + fileName, blip.path.siteDockHanger71Dir, function(error) {

                    if(error) {

                        return callback(error);

                    }

                    if(blip.svar.flagVerbose) blip.server.loggerInfo('Moving '  + hanger71SiteDockStr +  ' package file: ' +  fileName + " to " + installedPackagesDir);
                    blip.server.fs.renameSync(blip.path.siteDockHanger71Dir +  fileName, blip.path.siteDockHanger71Dir + installedPackagesDir + '/' + fileName);

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