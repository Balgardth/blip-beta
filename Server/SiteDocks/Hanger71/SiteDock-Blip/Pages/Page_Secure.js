"user strict";

function init(blip, siteDock){

    let pageTitle = 'IOport Blip - Secure Page Example';
    let pageDescription = 'IOport Blip secure page example.';
    let pageKeywords = 'blip secure page example, blip https example, blip ssl example';

    var templatePage = new blip.templateAssembler.TemplateEngine(siteDock, siteDock.url.pageSecure, true);

    // header
    var htmlIncludes = {

        css: [{sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.css[
                         siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonCss].sipTag,
               externalFile: '<link rel="stylesheet" href="' + siteDock.path.clientThemePagesCssDir + 'Secure' +
                             blip.svar.cssExt + '" />\n'}],

         js: [{sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.js[
                         siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonJs].sipTag,
               externalFile: '<script src="' + siteDock.path.clientThemePagesJsDir + 'Secure' +
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
            siteDock.path.templatesPagesDir + 'Page_Secure-Body.html.tpl', true );

     templatePage.addStrReplace(templateFragPageBodyId, [
        { srcStr: new RegExp(blip.svar.sipTag.open + 'sslRootUrl' + blip.svar.sipTag.close),
          rplStr:siteDock.svar.fullAppRootUrlSecure + 'Secure'}]);

    // Footer
    var templateFragPageFooterId = templatePage.addFragFilePath(
            siteDock.templateCommonFrag.fileFooter.name, true );

    templatePage.addStrReplace(templateFragPageFooterId,
        siteDock.templateCommonFrag.fileFooter.strReplace);    

    /******************************************************************
     ********************  Server Request Methods *********************
     ******************************************************************/

    siteDock.server.httpsApp.get(templatePage.url, function ( req, res ) {

        templatePage.sendPage( req, res );

    });

}

module.exports.init = init;


