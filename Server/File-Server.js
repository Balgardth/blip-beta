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
        appName:                           'IOport Blip',
        appPackageName:                    'ioport-blip',
        version:                           '2.5.4', // {sip var="blipVersion" /}
        copyrightYear:                     ((date.getUTCFullYear() != '2020') ? '2020 - ' + date.getUTCFullYear(): '2020'),
        loggerOutputType:                  ref.loggerOutputTypeOptions.consoleAndFile,
        flagVerbose:                       true,  // Enable/Disable detailed running log        
        flagCache:                         false, // Enable/Disable all caching        
        flagSiteDockInstallOnStart:        true,  // Enable/Disable installing new site dock packages when the server starts.
        flagSiteDockLoadHanger71OnStart:   true,  // Enable/Disable loading Hanger71 site docks when the server starts.
        testDelay:                         0, // For simulating server request loads.
        favExt:                            '.png',
        cssExt:                            '.css',
        jsExt:                             '.js',
        registrationFileNameExt:           Object.freeze('.reg.json'),
        siteDocksPackageFileExts:          Object.freeze({zbm: '.zip.zbm', tbm: '.zip.tbm' }),        
        siteDockTypes:                     Object.freeze({hanger71: 0, thirdParty: 1}),
        package:                           {type:{
                                                hub:              0,
                                                app:              1,
                                                siteDockHanger71: 2
                                              }
                                           },
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
                                            loadingSiteDockFramework: 'Loading site dock framework: $<fileName>',
                                            loadingGenericRequiredFilesErr: 'Loading required files.'},
        pageNotification:                  {msg404: "Status code 404. This page can not be found.",
                                            msg500: "Status code 500. A server error has occurred."},
        templateLog:                       {cached: 'cached frag results: ', raw: 'raw frag results: '},
        sipTag:                            {open: '{sip var="', close: '" /}'},
        sipLoopTag:                        {beginOpen: '{sipLoop', beginClose: '}', endOpen: '{/sipLoop', endClose: '}'},
        sipLoopSplitTag:                   '{sipLoopSplit /}',
        sipLoopSplitTagVars:               {open: '{sipLoopSplit', close: '/}'},
        sssplitTag:                        '{sipSplit /}',
        siteDockInstanceNames:             [],
        publicSalt:                        null                                            
    };

    const path = {
        appDir:                                __dirname + '/../',
        hubDir:                                __dirname + '/../../',
        distDir:                               __dirname + '/../../Dist/',        
        dotRegDir:                             __dirname + '/../../Dist/.reg/',
        dotAppDir:                             __dirname + '/../.app/',
        dotDockDir:                            '/.dock/',
        criteriaFileName:                      'criteria.json',        
        identifierFileName:                    'identifier.json',
        nodePackageFileName:                   'package.json',
        modules:                               __dirname + '/node_modules/',
        serverClientDir:                       __dirname + '/../Client/SiteDocks/',
        coreDir:                               __dirname + '/Core/',
        coreCommonDir:                         __dirname + '/Core/Common/',
        configurationExtFileName:              __dirname + '/Configuration-Extension',
        utilitiesFileName:                     __dirname + '/Core/Common/Common_Utilities',
        templateAssemblerFileName:             __dirname + '/Core/Common/Common_Template-Assembler',        
        siteDocksDir:                          __dirname + '/SiteDocks/',
        siteDocksDeployDir:                    __dirname + '/SiteDocks/Deploy/',
        siteDockHanger71Dir:                   __dirname + '/SiteDocks/Hanger71/',
        siteDockHanger71DeployDir:             __dirname + '/SiteDocks/Hanger71/Deploy/',
        siteDocksInstalledPackagesDir:         __dirname + '/SiteDocks/InstalledPackages/',
        siteDockHanger71InstalledPackagesDir:  __dirname + '/SiteDocks/Hanger71/InstalledPackages/',
        siteDocksFramesDir:                    __dirname + '/SiteDocks/ExamplePackageFrames/',
        siteDocksConfigFileName:               'SiteDock-Configuration',
        siteDocksFileName:                     __dirname + '/SiteDocks/SiteDocks'
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
        crypto:               Object.freeze(require('crypto')),
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
 blip.utilities.integrityCheck(function(error){

    if(error) return;
    loadConfigurationExt();

 });

 /************
  * Configuration Extension
  ************/
 function loadConfigurationExt(){
    
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
        blip.server['siteDocks'] = Object.freeze(require(blip.path.siteDocksFileName).init(blip));

        /************
         * Common Files
         ************/
        blip['templateAssembler'] = require(blip.path.templateAssemblerFileName).init(blip);
        
        if(blip.svar.flagSiteDockInstallOnStart) {

            if(blip.svar.flagSiteDockLoadHanger71OnStart) 
                blip.server.siteDocks.checkForSiteDocks(blip.svar.siteDockTypes.hanger71);

            blip.server.siteDocks.checkForSiteDocks(blip.svar.siteDockTypes.thirdParty);

        } else {

            if(blip.svar.flagSiteDockLoadHanger71OnStart) 
                blip.templateAssembler.loadFramework(blip.server.siteDocks.checkForSiteDocks(blip.svar.siteDockTypes.hanger71, true));

            blip.templateAssembler.loadFramework(blip.server.siteDocks.checkForSiteDocks(blip.svar.siteDockTypes.thirdParty, true));
            
        }

    } catch (error){

        blip.server.loggerErr(blip.svar.logOutputMessages.loadingGenericRequiredFilesErr + ' ' + error);

    }

}