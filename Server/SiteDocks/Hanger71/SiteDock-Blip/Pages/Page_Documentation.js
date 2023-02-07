"user strict";

function init(blip, siteDock){

    let pageTitle = 'IOport Blip - Web Application Framework Documentation';
    let pageDescription = 'IOport Blip documentation page.';
    let pageKeywords = 'blip documentation, ioport blip documentation, io blip documentation';

    var templatePage = new blip.templateAssembler.TemplateEngine(siteDock, siteDock.url.pageDocumentation, true);

    // header
    var htmlIncludes = {

        css: [{sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.css[
                   siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonCss].sipTag,
               externalFile: '<link rel="stylesheet" href="' + siteDock.path.clientThemeButtonsCssDir + 'Buttons_Generic' +
                   blip.svar.cssExt + '" />\n'},
              {sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.css[
                   siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonCss].sipTag,
               externalFile: '<link rel="stylesheet" href="' + siteDock.path.clientThemePagesCssDir + 'Documentation' + blip.svar.cssExt + '" />\n'},
              {sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.css[
                   siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonCss].sipTag,
               externalFile: '<link rel="stylesheet" href="' + siteDock.path.clientCommonCssDir + '3rdParty/Highlight/vs' + blip.svar.cssExt + '" />\n'}
            ],

        js: [{sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.js[
                   siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonJs].sipTag,
             externalFile: '<script src="' + siteDock.path.clientCommonJsDir + '3rdParty/Highlight/highlight2019_11_08.min.js"></script>\n'},
             {sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.js[
                   siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonJs].sipTag,
             externalFile: '<script src="' + siteDock.path.clientThemeMenuJsDir + 'Menus-Doc' + blip.svar.jsExt + '"></script>\n'},
             {sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.js[
                   siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonJs].sipTag,
             externalFile: '<script src="' + siteDock.path.clientThemePagesJsDir + 'Documentation' + blip.svar.jsExt + '"></script>\n'},
             {sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.js[
                   siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonJs].sipTag,
             externalFile: '<script src="' + siteDock.path.clientThemeButtonsJsDir + 'Buttons_Generic' +
                   blip.svar.jsExt + '"></script>\n'},
             {sipTag: siteDock.templateCommonFrag.fileHeader.htmlIncludes.js[
                   siteDock.templateCommonFrag.fileHeader.htmlIncludes.enum.commonJs].sipTag,
             externalFile: '<script src="' + siteDock.path.clientCommonJsDir + 'Anchor_History' +
                   blip.svar.jsExt + '"></script>\n'}
            ]
       };

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
        siteDock.path.templatesPagesDir + 'Page_Documentation-Body.html.tpl', false );

    var templateFragPageFooterId = templatePage.addFragFilePath(
            siteDock.templateCommonFrag.fileFooter.name, true );

    templatePage.addStrReplace(templateFragPageFooterId,
        siteDock.templateCommonFrag.fileFooter.strReplace);

    /******************************************************************
     ********************  Server Request Methods *********************
     ******************************************************************/

     siteDock.server.httpApp.get(templatePage.url, function ( req, res ) {

        templatePage.sendPage( req, res );

    });

}

module.exports.init = init;


