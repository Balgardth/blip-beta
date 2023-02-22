"use strict";

function init(blip){

    function initSiteDockParams(){

        const siteDockName  = 'SiteDock-Blip';  // This should be unique relative to other site docks!
        const listen        = blip.svar.siteDocksBlipListen;
        const listenSsl     = listen;
        const domainName    = blip.svar.siteDocksBlipDomainName;
        const domainNameSsl = domainName;
        const hosts         = ['']; // Example: ['www','downloads']
        const hostsSsl      = ['']; // ['secure'] for none

        const svar = {
            version:                       '2.5.3', // {sip var="siteDockVersion" /}
            serverSiteDockName:            siteDockName,
            clientSiteDock:                siteDockName,
            clientStyleTheme:              'Blip',
            clientStyleMenuTheme:          'BlipDynamoTabs',
            domainName:                    domainName,
            domainNameSsl:                 domainNameSsl,
            hosts:                         hosts,
            hostsSsl:                      hostsSsl,
            siteDomain:                    hosts[0]     + ((hosts[0] != '') ? '.' : '') + domainName,
            siteDomainSecure:              hostsSsl[0]  + ((hostsSsl[0]  != '') ? '.' : '') + domainNameSsl,
            flagForceSiteDomain:           true,   // Forces the site to use the siteDomain URL.  Disable to use only an IP address or allow multiple host names.
            flagForceSiteDomainSecure:     false,  // Forces the site to use the siteDomainSecure URL.  Disable to use only an IP address or allow multiple host names.
            serverIp:                      listen,
            serverPort:                    80,
            serverSslIp:                   listenSsl,
            serverSslPort:                 443,
            sslPassphrase:                 '',
            appUrlRootPath:                '/'
        }

        let fullAppRootUrlPort = (svar.serverPort != '' && svar.serverPort != 80) ? ':' + svar.serverPort : '';
        let fullAppRootUrlSecurePort = (svar.serverSslPort != '' && svar.serverSslPort != 443) ? ':' + svar.serverSslPort : '';

        svar['fullAppRootUrl'] =       'http://' + svar.siteDomain  + fullAppRootUrlPort + svar.appUrlRootPath;
        svar['fullAppRootUrlSecure'] = 'https://' + svar.siteDomainSecure + fullAppRootUrlSecurePort + svar.appUrlRootPath;

        const path = Object.freeze({
            sslKeyDir:                __dirname + '/Ssl/',
            siteDockPagesDir:         __dirname + '/Pages/',
            siteDockCommonDir:        __dirname + '/',
            templatesDir:             __dirname + '/Templates/Themes/' + svar.clientStyleTheme + '/',
            templatesCommonDir:       __dirname + '/Templates/Themes/' + svar.clientStyleTheme + '/Common/',
            templatesPagesDir:        __dirname + '/Templates/Themes/' + svar.clientStyleTheme + '/Pages/',
            templatesExamplesDir:     __dirname + '/Templates/Themes/' + svar.clientStyleTheme + '/Examples/',
            sandboxDir:               __dirname + '/Templates/Themes/' + svar.clientStyleTheme + '/Sandbox',
            serverClientFaviconDir:   __dirname + '/../../../Client/SiteDocks/' + svar.clientSiteDock + '/Themes/' + svar.clientStyleTheme + '/Images/Favicons/',
            clientCommonImagesDir:    '/Assets/Common/Images/',
            clientCommonJsDir:        '/Assets/Common/Js/',
            clientCommonCssDir:       '/Assets/Common/Css/',
            clientThemeFaviconDir:    '/Assets/Themes/' + svar.clientStyleTheme + '/Images/Favicons/',
            clientThemeCommonJsDir:   '/Assets/Themes/' + svar.clientStyleTheme + '/Common/Js/',
            clientThemeCommonCssDir:  '/Assets/Themes/' + svar.clientStyleTheme + '/Common/Css/',
            clientThemeFontsDir:      '/Assets/Themes/' + svar.clientStyleTheme + '/Fonts/',
            clientThemeImagesDir:     '/Assets/Themes/' + svar.clientStyleTheme + '/Images/',
            clientThemePagesJsDir:    '/Assets/Themes/' + svar.clientStyleTheme + '/Pages/Js/',
            clientThemePagesCssDir:   '/Assets/Themes/' + svar.clientStyleTheme + '/Pages/Css/',
            clientThemeMenuJsDir:     '/Assets/Themes/' + svar.clientStyleTheme + '/Menus/' + svar.clientStyleMenuTheme + '/Js/',
            clientThemeMenuCssDir:    '/Assets/Themes/' + svar.clientStyleTheme + '/Menus/' + svar.clientStyleMenuTheme + '/Css/',
            clientThemeButtonsJsDir:  '/Assets/Themes/' + svar.clientStyleTheme + '/Buttons/Js/',
            clientThemeButtonsCssDir: '/Assets/Themes/' + svar.clientStyleTheme + '/Buttons/Css/',
            clientThemeFontsJsDir:    '/Assets/Themes/' + svar.clientStyleTheme + '/Fonts/Js/',
            clientThemeFontsCssDir:   '/Assets/Themes/' + svar.clientStyleTheme + '/Fonts/Css/',
            clientThemeFormsJsDir:    '/Assets/Themes/' + svar.clientStyleTheme + '/Forms/Js/',
            clientThemeFormsCssDir:   '/Assets/Themes/' + svar.clientStyleTheme + '/Forms/Css/',
            clientThemeImagesJsDir:   '/Assets/Themes/' + svar.clientStyleTheme + '/Images/Js/',
            clientThemeImagesCssDir:  '/Assets/Themes/' + svar.clientStyleTheme + '/Images/Css/',
            clientThemeLoadersJsDir:  '/Assets/Themes/' + svar.clientStyleTheme + '/Loaders/Js/',
            clientThemeLoadersCssDir: '/Assets/Themes/' + svar.clientStyleTheme + '/Loaders/Css/'
        });

        const server = {
            httpApp:     null,
            httpsApp:    null,
            httpServer:  null,
            httpsServer: null
        }

        const url = {
            pageHome:          svar.appUrlRootPath,
            pageFeatures:      svar.appUrlRootPath + 'Features',
            pageDocumentation: svar.appUrlRootPath + 'Documentation',
            pageAssistance:    svar.appUrlRootPath + 'Assistance',
            pageSecure:        svar.appUrlRootPath + 'Secure'
        }

        const templateCommonFrag = Object.freeze({

            fileHeader: { name: path.templatesCommonDir + 'Header.html.tpl',
                htmlIncludes: {
                    enum: {commonCss: 0, commonJs: 0},
                    fav: [
                        // Web, Android, and other...
                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="icon" type="image/png" sizes="16x16" href="' + path.clientThemeFaviconDir +
                        'favicon-16x16' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="icon" type="image/png" sizes="32x32" href="' + path.clientThemeFaviconDir +
                        'favicon-32x32' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="icon" type="image/png" sizes="36x36" href="' + path.clientThemeFaviconDir +
                        'android-icon-36x36' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="icon" type="image/png" sizes="48x48" href="' + path.clientThemeFaviconDir +
                        'android-icon-48x48' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="icon" type="image/png" sizes="72x72" href="' + path.clientThemeFaviconDir +
                        'android-icon-72x72' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="icon" type="image/png" sizes="96x96" href="' + path.clientThemeFaviconDir +
                        'favicon-96x96' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="icon" type="image/png" sizes="144x144" href="' + path.clientThemeFaviconDir +
                        'android-icon-144x144' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="icon" type="image/png" sizes="192x192" href="' + path.clientThemeFaviconDir +
                        'android-icon-192x192' + blip.svar.favExt + '" />\n'},

                        // Apple devices
                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="apple-touch-icon-precomposed" href="' + path.clientThemeFaviconDir +
                        'apple-icon-precomposed' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="apple-touch-icon" sizes="57x57" href="' + path.clientThemeFaviconDir +
                        'apple-icon-57x57' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="apple-touch-icon" sizes="60x60" href="' + path.clientThemeFaviconDir +
                        'apple-icon-60x60' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="apple-touch-icon" sizes="72x72" href="' + path.clientThemeFaviconDir +
                        'apple-icon-72x72' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="apple-touch-icon" sizes="76x76" href="' + path.clientThemeFaviconDir +
                        'apple-icon-76x76' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="apple-touch-icon" sizes="114x114" href="' + path.clientThemeFaviconDir +
                        'apple-icon-114x114' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="apple-touch-icon" sizes="144x144" href="' + path.clientThemeFaviconDir +
                        'apple-icon-144x144' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="apple-touch-icon" sizes="152x152" href="' + path.clientThemeFaviconDir +
                        'apple-icon-152x152' + blip.svar.favExt + '" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="apple-touch-icon" sizes="180x180" href="' + path.clientThemeFaviconDir +
                        'apple-icon-180x180' + blip.svar.favExt + '" />\n'},

                        //Microsoft
                        {sipTag: blip.svar.sipTag.open + 'msapplication-TileImage' + blip.svar.sipTag.close,
                        externalFile: '<meta name="msapplication-TileImage" content="' + path.clientThemeFaviconDir +
                        'ms-icon-144x144.png" />\n'},

                        {sipTag: blip.svar.sipTag.open + 'themeFavicon' + blip.svar.sipTag.close,
                        externalFile: '<link rel="manifest" href="' + path.clientThemeFaviconDir +
                        'manifest.json" />\n'}

                    ],
                    css: [{sipTag: blip.svar.sipTag.open + 'commonCss' + blip.svar.sipTag.close,
                        externalFile: '<link rel="stylesheet" href="' + path.clientThemeCommonCssDir + 'Style' + blip.svar.cssExt + '"/>\n'},

                        {sipTag: blip.svar.sipTag.open + 'commonCss' + blip.svar.sipTag.close,
                        externalFile: '<link rel="stylesheet" href="' + path.clientThemeMenuCssDir + 'Menus' + blip.svar.cssExt + '"/>\n'}],

                    js: [{sipTag: blip.svar.sipTag.open + 'commonJs' + blip.svar.sipTag.close,
                        externalFile: '<script src="' + path.clientCommonJsDir + 'Main' + blip.svar.jsExt + '"></script>\n'},

                        {sipTag: blip.svar.sipTag.open + 'commonJs' + blip.svar.sipTag.close,
                        externalFile: '<script src="' + path.clientCommonJsDir + 'Comm' + blip.svar.jsExt + '"></script>\n'},

                        {sipTag: blip.svar.sipTag.open + 'commonJs' + blip.svar.sipTag.close,
                        externalFile: '<script src="' + path.clientThemeMenuJsDir + 'Base/Menu-Base' + blip.svar.jsExt + '"></script>\n'},

                        {sipTag: blip.svar.sipTag.open + 'commonJs' + blip.svar.sipTag.close,
                        externalFile: '<script src="' + path.clientThemeMenuJsDir + 'Menus' + blip.svar.jsExt + '"></script>\n'}]
                }
            },
            fileFooter: {name: path.templatesCommonDir + 'Footer.html.tpl',
                htmlIncludes: null,
                    strReplace: [{ srcStr: new RegExp(blip.svar.sipTag.open + 'copyrightYear' + blip.svar.sipTag.close),
                    rplStr: blip.svar.copyrightYear},
                    { srcStr: new RegExp(blip.svar.sipTag.open + 'siteDockVersion' + blip.svar.sipTag.close),
                    rplStr: svar.version}]
            }

        });

        return { svar, server, url, path, templateCommonFrag };
    }

    let blipSiteDock = initSiteDockParams();
    blip.svar.siteDockInstanceNames.push(blipSiteDock.svar.serverSiteDockName);


    try{

    /*******************
     * Site Mounts HTTP
     ******************/
    if(blipSiteDock.svar.serverIp !== undefined && blipSiteDock.svar.serverIp !== ''){

        blipSiteDock.server.httpApp = new blip.server.express();
        blipSiteDock.server.httpSever = blip.server.http.createServer(blipSiteDock.server.httpApp).listen(blipSiteDock.svar.serverPort, blipSiteDock.svar.serverIp);

        blipSiteDock.server.httpApp.use('/Assets', blip.server.express.static(blip.path.serverClientDir + blipSiteDock.svar.clientSiteDock + '/'));
        blipSiteDock.server.httpApp.use('/Sandbox', blip.server.express.static(blipSiteDock.path.sandboxDir));
        blipSiteDock.server.httpApp.use('/favicon.ico', blip.server.staticFile(blipSiteDock.path.serverClientFaviconDir + 'favicon.ico'));
        blipSiteDock.server.httpApp.use('/browserconfig.xml', blip.server.staticFile(blipSiteDock.path.serverClientFaviconDir + 'browserconfig.xml'));

        let hostsString = '';

        if(blipSiteDock.svar.hosts[0] != ''){

            hostsString = '(using: ';

            for(let x = 0; x < blipSiteDock.svar.hosts.length; x++){
                
                hostsString += blipSiteDock.svar.hosts[x] + ', ';

            }

            hostsString = hostsString.slice(0, hostsString.length - 2) + ').';

        }

        if(blip.svar.flagVerbose) blip.server.loggerInfo("Server http://" + hostsString + blipSiteDock.svar.domainName + " is listening on " + blipSiteDock.svar.serverIp + ":" + blipSiteDock.svar.serverPort);

    }

    /*******************
     * Site Mounts HTTPS
     ******************/
    if(blipSiteDock.svar.serverSslIp !== undefined && blipSiteDock.svar.serverSslIp !== ''){

        blipSiteDock.server.httpsApp = new blip.server.express();

        const options = {
            key: blip.server.fs.readFileSync(blipSiteDock.path.sslKeyDir + 'clientCert.key'),
            cert: blip.server.fs.readFileSync(blipSiteDock.path.sslKeyDir + 'clientCert.pem'),
            //passphrase: blipSiteDock.svar.sslPassphrase
        };

        blipSiteDock.server.httpsServer = blip.server.https.createServer(options, blipSiteDock.server.httpsApp).listen(blipSiteDock.svar.serverSslPort, blipSiteDock.svar.serverSslIp);
        blipSiteDock.server.httpsApp.set('trust proxy', 1);

        blipSiteDock.server.httpsApp.use('/Assets', blip.server.express.static(blip.path.serverClientDir + blipSiteDock.svar.clientSiteDock + '/'));
        blipSiteDock.server.httpsApp.use('/favicon.ico', blip.server.staticFile(blipSiteDock.path.serverClientFaviconDir + 'favicon.ico'));

        let hostsSslString = '';

        if(blipSiteDock.svar.hostsSsl[0] != ''){

            hostsSslString = '(using: ';

            for(let x = 0; x < blipSiteDock.svar.hostsSsl.length; x++){
                
                hostsSslString += blipSiteDock.svar.hostsSsl[x] + ', ';

            }

            hostsSslString = hostsSslString.slice(0, hostsSslString.length - 2) + ').';

        }

        if(blip.svar.flagVerbose) blip.server.loggerInfo("SSL server https://" + hostsSslString + blipSiteDock.svar.domainName + " is listening on " + blipSiteDock.svar.serverSslIp + ":" + blipSiteDock.svar.serverSslPort);
    }

    require(blipSiteDock.path.siteDockCommonDir + "Common_Main").init(blip, blipSiteDock);

    /************
     * Root Files
     ************/
    require(blipSiteDock.path.siteDockPagesDir + "Page_Home").init(blip, blipSiteDock);
    require(blipSiteDock.path.siteDockPagesDir + "Page_Features").init(blip, blipSiteDock);
    require(blipSiteDock.path.siteDockPagesDir + "Page_Documentation").init(blip, blipSiteDock);
    require(blipSiteDock.path.siteDockPagesDir + "Page_Assistance").init(blip, blipSiteDock);
    require(blipSiteDock.path.siteDockPagesDir + "Page_Secure").init(blip, blipSiteDock);

    /************
     * Page Not Found Redirect
     *   - Needs to be the last require(...) loaded.
     ************/
    require(blipSiteDock.path.siteDockPagesDir + "Page_Server-Notifications").init(blip, blipSiteDock);

    } catch(error) {

        blip.server.loggerErr('Error: Loading required files in ' + blipSiteDock.svar.serverSiteDockName + ' SiteDock-Configuration. ' + error);

    }

}

module.exports.init = init;