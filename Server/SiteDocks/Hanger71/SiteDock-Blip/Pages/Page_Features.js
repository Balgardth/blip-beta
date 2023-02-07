"user strict";

function init(blip, siteDock){

    let pageTitle = 'IOport Blip - Web Application Framework Features';
    let pageDescription = 'IOport Blip web application framework features.';
    let pageKeywords = 'blip web application framework, web application framework integral codebase structure, web application framework performance focused, web application framework inherently flexible, web application framework code extensible, web application framework open source, blip debugging options, blip documentation' +
                       'web application framework mobile ready';

    var templatePage = new blip.templateAssembler.TemplateEngine(siteDock, siteDock.url.pageFeatures, true);

    // header
    var htmlIncludes = {

        css: [{sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.css[
                   siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonCss].sipTag,
               externalFile: '<link rel="stylesheet" href="' + siteDock.path.clientThemePagesCssDir + 'Features' + blip.svar.cssExt + '" />\n'},
               {sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.css[
                    siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonCss].sipTag,
               externalFile: '<link rel="stylesheet" href="' + siteDock.path.clientThemeButtonsCssDir + 'Buttons_Generic' +
                    blip.svar.cssExt + '" />\n'}],

         js: [{sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.js[
                   siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonJs].sipTag,
               externalFile: '<script src="' + siteDock.path.clientThemePagesJsDir + 'Features' + blip.svar.jsExt + '"></script>\n'},
               {sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.js[
                   siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonJs].sipTag,
               externalFile: '<script src="' + siteDock.path.clientThemeButtonsJsDir + 'Buttons_Generic' +
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
        siteDock.path.templatesPagesDir + 'Page_Features-Body.html.tpl', true );

    // Footer
    var templateFragPageFooterId = templatePage.addFragFilePath(
            siteDock.templateCommonFrag.fileFooter.name, true );

    templatePage.addStrReplace(templateFragPageFooterId,
        siteDock.templateCommonFrag.fileFooter.strReplace);

    /******************************************************************
     ********************  Server Request Methods *********************
     ******************************************************************/

     siteDock.server.httpApp.get(templatePage.url, function (req, res) {

        templatePage.sendPage( req, res );

    });

}

module.exports.init = init;


