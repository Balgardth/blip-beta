/************
 * IMPORTANT:  It is recommended that you read the documentation if you are thinking about editing this file.
 ************/
"user strict";

function initBlip(){

    const date = new Date();

    const ref = Object.freeze({
        loggerOutputTypeOptions: {
            none:           0,
            console:        1,
            file:           2,
            process:        3,
            consoleAndFile: 4,
            processAndFile: 5
        }
    });

    const svar = {
        date:                              date,
        version:                           '2.5.3', // {sip var="blipVersion" /}
        copyrightYear:                     ((date.getUTCFullYear() != '2020') ? '2020 - ' + date.getUTCFullYear(): '2020'),
        loggerOutputType:                  ref.loggerOutputTypeOptions.consoleAndFile,
        flagVerbose:                       true, // Enable/Disable detailed running log
        flagCache:                         false, // Enable/Disable all caching
        testDelay:                         0, // For simulating server request loads.
        favExt:                            '.png',
        cssExt:                            '.css',
        jsExt:                             '.js',
        siteDocksPackageFileExt:           '.zip.zbm',
        siteDocksPackageExtractCheckDelay: 1000, // Check every minute
        siteDocksPackageExtractTimeout:    600000, // Try for 10 minutes
        siteDocksBlipListen:               '127.0.0.1',
        siteDocksBlipDomainName:           'localhost',
        logDir:                            '/../../../Logs',
        logInfoFileNamePrefix:             'Log_Server-Info',
        logErrorFileNamePrefix:            'Log_Server-Error',
        logFileNameExt:                    '_%DATE%.log',
        logTimestamp:                      'YYYY-MM-DD HH:mm:ss.SS',
        logDatePattern:                    null,
        logFrequency:                      null,
        logFormat:                         ({ level, message, timestamp }) => {return `${timestamp} [${level}] ${message}`;},
        logMaxSize:                        '10m',
        logMaxFiles:                       '90d',
        logOutputMessages:                 {updatingConfigUsingExtension: 'Updating configuration using extension: $<fileName>',
                                            loadingSiteDockRequiredFile: 'Loading site dock: $<fileName>',
                                            loadingGenericRequiredFilesErr: 'Loading required files.'},
        pageNotification:                  {msg404: "Status code 404. This page can not be found.",
                                            msg500: "Status code 500. A server error has occurred."},
        templateLog:                       {cached: 'cached frag results: ', raw: 'raw frag results: '},
        sipTag:                            {open: '{sip var="', close: '" /}'},
        sipLoopTag:                        {beginOpen: '{sipLoop', beginClose: '}', endOpen: '{/sipLoop', endClose: '}'},
        sipLoopSplitTag:                   '{sipLoopSplit /}',
        sipLoopSplitTagVars:               {open: '{sipLoopSplit', close: '/}'},
        sssplitTag:                        '{sipSplit /}',
        siteDockInstanceNames:             []
    };

    const path = {
        modules:                        __dirname + '/node_modules/',
        serverClientDir:                __dirname + '/../Client/SiteDocks/',
        coreDir:                        __dirname + '/Core/',
        coreCommonDir:                  __dirname + '/Core/Common/',
        configurationExtFileName:       __dirname + '/Configuration-Extension',
        utilitiesFileName:              __dirname + '/Core/Common/Common_Utilities',
        templateAssemblerFileName:      __dirname + '/Core/Common/Common_Template-Assembler',
        siteDocksDir:                   __dirname + '/SiteDocks/',
        siteDockHanger71Dir:            __dirname + '/SiteDocks/Hanger71/',
        siteDocksInstalledPackagesDir:  __dirname + '/SiteDocks/InstalledPackages/',
        siteDocksFramesDir:             __dirname + '/SiteDocks/ExamplePackageFrames/',
        siteDocksConfigFileName:        'SiteDock-Configuration',
        siteDockHanger71FileName:       __dirname + '/SiteDocks/Hanger71SiteDocks',
        siteDocksClientFileName:        __dirname + '/SiteDocks/SiteDocks'
    };

    const server = {
        winston:              Object.freeze(require('winston')),
        winstonRotateFile:    Object.freeze(require('winston-daily-rotate-file')),
        os:                   Object.freeze(require('os')),
        v8:                   Object.freeze(require('v8')),
        fs:                   Object.freeze(require('fs')),
        path:                 Object.freeze(require('path')),
        https:                Object.freeze(require('https')),
        http:                 Object.freeze(require('http')),
        util:                 Object.freeze(require('util')),
        inspect:              Object.freeze(require('util').inspect),
        express:              Object.freeze(require('express')),
        staticFile:           Object.freeze(require('connect-static-file')),
        moment:               Object.freeze(require('moment')),
        sizeOf:               Object.freeze(require('sizeof').sizeof),
        unzip:                Object.freeze(require('extract-zip')),
        yauzl:                Object.freeze(require('yauzl')),
        logger:               null,
        loggerInfo:           null,
        loggerErr:            null,
        loggerInfoErr:        null,
        appConnQue:           null,           // Use for global tmp data.
        appConnQueReqLogging: {tmp: 'tmp'},   // Holds http and https connection params req and res
        loadFramework:        null
    };

    return { ref, svar, path, server };
}

let blip = initBlip();

 /************
 * Utilities
 ************/
 blip['utilities'] = require(blip.path.utilitiesFileName).init(blip);

/************
 * Configuration Extension
 ************/
if(blip.server.fs.existsSync(blip.path.configurationExtFileName + '.js')){

    let updateConfiguration = require(blip.path.configurationExtFileName);

    updateConfiguration.go(blip, function(error){

        if(error){

            blip.server.loggerErr(blip.svar.logOutputMessages.updatingConfigUsingExtension.replace(/\$<fileName>/,
            blip.path.configurationExtFileName));

        }

        loadRequiredFiles();

    });

} else {

    loadRequiredFiles();

}

function loadRequiredFiles(){

    // Freeze parameters
    blip.svar = Object.freeze(blip.svar);
    blip.path = Object.freeze(blip.path);
    blip.utilities = Object.freeze( blip.utilities);
    
    try{
        /************
         * Blip Site Dock File Require Initialization
         ************/
        blip.server['siteDocks'] = Object.freeze(require(blip.path.siteDocksClientFileName).init(blip));
        blip.server['hanger71SiteDocks'] = Object.freeze(require(blip.path.siteDockHanger71FileName).init(blip));

        function loadFramework(siteDocks){

            /************
             * Common Files
             ************/
            blip['templateAssembler'] = Object.freeze(require(blip.path.templateAssemblerFileName).init(blip));

            /************
             * Load Site Docks
             ************/
            var siteDocksLength = siteDocks.length;

            if(siteDocksLength > 0){

                for(var x = 0; x < siteDocksLength; x++){

                    require(siteDocks[x].path).init(blip);

                    blip.server.loggerInfo(
                        blip.svar.logOutputMessages.loadingSiteDockRequiredFile.replace(/\$<fileName>/,
                        siteDocks[x].name));

                }

            }

        }

        blip.server.loadFramework = Object.freeze(loadFramework);
        blip.server.hanger71SiteDocks.checkForSiteDocks();

    } catch (error){

        blip.server.loggerErr(blip.svar.logOutputMessages.loadingGenericRequiredFilesErr + ' ' + error);

    }

}