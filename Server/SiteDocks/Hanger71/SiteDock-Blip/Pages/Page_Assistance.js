"user strict";

function init(blip, siteDock){

    let pageTitle = 'IOport Blip - Web Application Framework Help';
    let pageDescription = 'IOport Blip help and assistance page.';
    let pageKeywords = 'ioport blip help, io blip help, blip help, blip support, io blip support, ioport blip support';

    var templatePage = new blip.templateAssembler.TemplateEngine(siteDock, siteDock.url.pageAssistance, true);

    // header
    var htmlIncludes = {

    js: [{sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.js[
            siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonJs].sipTag,
          externalFile: '<script src="' + siteDock.path.clientThemePagesJsDir + 'Assistance' + blip.svar.jsExt + '"></script>\n'}],
    css: [{sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.css[
        siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonCss].sipTag,
          externalFile: '<link rel="stylesheet" href="' + siteDock.path.clientThemeButtonsCssDir + 'Buttons_Generic' + blip.svar.cssExt + '" />\n'},
        {sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.css[
            siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonCss].sipTag,
        externalFile: '<link rel="stylesheet" href="' + siteDock.path.clientThemePagesCssDir + 'Assistance' + blip.svar.cssExt + '" />\n'}]
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
      siteDock.path.templatesPagesDir + 'Page_Assistance-Body.html.tpl', false);

    templatePage.addStrReplace(templateFragPageBodyId, [
        { srcStr: new RegExp(blip.svar.sipTag.open + 'httpAppUrl' + blip.svar.sipTag.close, 'g'),
          rplStr: blip.svar.fullAppRootUrl},
        { srcStr: new RegExp(blip.svar.sipTag.open + 'httpsAppUrl' + blip.svar.sipTag.close, 'g'),
          rplStr: blip.svar.fullAppRootUrlSecure},
        { srcStr: new RegExp(blip.svar.sipTag.open + 'blipVersion' + blip.svar.sipTag.close),
          rplStr: blip.svar.version},
        { srcStr: new RegExp(blip.svar.sipTag.open + 'copyrightYear' + blip.svar.sipTag.close),
        rplStr: blip.svar.copyrightYear}]);

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


