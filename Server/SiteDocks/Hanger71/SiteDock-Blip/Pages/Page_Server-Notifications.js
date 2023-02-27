"user strict";

function init(blip, siteDock) {

    let pageTitle = 'IOport Blip - Page Notification';
    let pageDescription = 'Page notification message.';
    let pageKeywords = 'blip, ioport, ioportblip, page notification';

    var templatePage = new blip.templateAssembler.TemplateEngine(siteDock);

    // header
    var htmlIncludes = {

        css: [{sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.css[
                    siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonCss].sipTag,
                externalFile: '<link rel="stylesheet" href="' + siteDock.path.clientThemeCommonCssDir + 'Server-Notification-Message' + blip.svar.cssExt + '" />\n'}
            ],

        js: [{sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.js[
                        siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonJs].sipTag,
                externalFile: '<script src="' + siteDock.path.clientThemeCommonJsDir + 'Server-Notification-Message' + 
                            blip.svar.jsExt + '"></script>\n'}]
        }

    var templateFragPageHeaderId = templatePage.addFragFilePath(
        siteDock.templateCommonFrag.fileHeader.name, true );

    templatePage.addIncludesHeader(templateFragPageHeaderId,
        siteDock.templateCommonFrag.fileHeader.htmlIncludes);

    templatePage.addIncludesHeader(templateFragPageHeaderId, htmlIncludes);

    templatePage.addStrReplace(templateFragPageHeaderId, [
            { srcStr: new RegExp(blip.svar.sipTag.open + 'pageTitle' + blip.svar.sipTag.close),
            rplStr: pageTitle},
            { srcStr: new RegExp(blip.svar.sipTag.open + 'pageDescription' + blip.svar.sipTag.close),
            rplStr: pageDescription},
            { srcStr: new RegExp(blip.svar.sipTag.open + 'pageKeywords' + blip.svar.sipTag.close),
            rplStr: pageKeywords},
        ]);

    // Body
    var templateFragPageBodyId = templatePage.addFragFilePath(
        siteDock.path.templatesCommonDir + 'Page_Server-Notification-Message.html.tpl', false );

    // Footer
    var templateFragPageFooterId = templatePage.addFragFilePath(
            siteDock.templateCommonFrag.fileFooter.name, true );

    templatePage.addStrReplace(templateFragPageFooterId,
        siteDock.templateCommonFrag.fileFooter.strReplace);

    /******************************************************************
     ********************  Server Request Methods *********************
     ******************************************************************/

    let searchStr = "serverNotificationMessage";

    function addPageNotFoundMessage(url){

        let message = blip.svar.pageNotification.msg404;

        templatePage.addStrReplace(templateFragPageBodyId,
            [{ srcStr: new RegExp(blip.svar.sipTag.open + searchStr + blip.svar.sipTag.close),
                rplStr: message}]);

        blip.server.loggerInfoErr(message + " " + url);

    }

    function addServerErrorMessage(error){

        let message = blip.svar.pageNotification.msg500;

        templatePage.addStrReplace(templateFragPageBodyId,
            [{ srcStr: new RegExp(blip.svar.sipTag.open + searchStr + blip.svar.sipTag.close),
                rplStr: message}]);

        blip.server.loggerInfoErr(message + " " + error);

    }

    siteDock.server.httpApp.use(function (req, res) {

        let url = 'URL: http://' + req.headers.host + req.url;

        addPageNotFoundMessage(url);        
        templatePage.sendPage( req, res );

    });

    siteDock.server.httpApp.use(function (error, req, res) {

        let url = 'URL: http://' + req.headers.host + req.url;

        if(error){

            addServerErrorMessage(error + url);
            templatePage.sendPage( req, res );
            return;

        }
        
        addServerErrorMessage('httpApp.use(...) problem with: ' + url);

    });    

    siteDock.server.httpsApp.use(function (req, res) {

        let url = 'URL: https://' + req.headers.host + req.url;

        addPageNotFoundMessage(url);
        templatePage.sendPage( req, res );

    });

    siteDock.server.httpsApp.use(function (error, req, res) {

        let url = 'URL: https://' + req.headers.host + req.url;

        if(error){

            addServerErrorMessage(error + url);
            templatePage.sendPage( req, res );
            return;

        }

        addServerErrorMessage('httpsApp.use(...) problem with: ' + url);

    });

}

module.exports.init = init;