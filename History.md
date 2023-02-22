1.0.1 / 2020-07-23
===================

  * Initial release of the software.

1.0.2 / 2020-07-23
===================

  * Reduced archive size.
  * Updated server package dependencies.
  * Updated Help page with online links.

1.0.3 / 2020-07-28
===================
  * Updated BlipDynamoTabs menu.
    - Fixed jitter bug.
    - Added "linkAlternative" option to activate tabs.      
      - Solution allows for an alternative link to be added while keeping hostname constraint.
      - Updated "Documentation > Client-Side > Navigation Menu" with addition.

1.0.4 / 2020-07-31
===================
  * Updated BlipDynamoTabs menu.
    - Added "linkAlternative" array option to activate tabs.      
      - Can be used with a single URL entry or an array of URLs.
    - Added "urlParamParsers" to allow URL split tab activation.
  * Updated "Documentation".

1.0.5 / 2020-08-03
===================
  * Updated TemplateEngine.addStrReplace(id, obj).
    - Location: .\Framework\Server\Core\Common\Common_Template-Assembler.js.
    - Will now update existing entries.
      - The fragment cache flag needs to be false for live updates.
    - Can take either a single entry object or an array of objects when updating.  Initial entry must still be an array.

1.0.6 / 2020-08-06
===================
  * Added try...catch to the framework require includes in File-Server.js.
    - Captures error events during compile time and is now part of the debug control system.
  * Added port variables to the GLOBAL object in ./Assets/Common/Js/Main.js.
  * Updated "Documentation".
    - Reflecting additions above.
    - Added new entry for Client-Side > AJAX > setPostResFunc(func).
      - Text pertaining to this.responseData in the comm object.

1.0.7 / 2020-08-18
===================
  * Updated code comments to reflect documentation.

1.0.8 / 2020-11-11
===================
  * Added JavaScript CSS style.display = 'none' assignment to all child nodes added to the shadow popup container (GLOBAL.popups.shadow.panel) when using GLOBAL.popups.shadow.hide().
  * Added GLOBAL.popups.shadow.flagContainerShadowClickIgnore to GLOBAL.popups.shadow object.
  * Added domain restriction to configured specification.
  * Added compensation code for various mobile browser quirks.
  * Added server notification page messages for:
    - Status code 500, server error.
    - Status code 404, page not found.
  * Documentation updates.
    - New code additions.
    - Corrected description for "static sendText(res, text)".

2.1.0 / 2023-02-07
===================
  * Refactored the codebase to run with the Yarn package manager as a workspace.
  * Refactored the IOport Blip modules implementation.  Know using "site docks" to avoid confusion with node_modules.
    - This is revamped for the most part.
  * Updated BlipDynamoTabs to display as expected when using HD video monitors.
  * Updated node-modules dependencies.
  * Added more host configuration options and URL handling.
  * Updated documentation.

2.5.1 / 2023-02-13
===================
  * Added configuration options to edit the log format.
  * Updated documentation.
  * Tweaked the Blip client-side theme.
  * Fixed bug in the URL redirect method.

2.5.2 / 2023-02-13
===================
  * Set the default logger time to military.

2.5.3 / 2023-02-22
===================
  * Added logger addition to page error handler.  URLs will now be included.
  * Added error handling to req header filtering.
  * Refactored require _.init(..)_ method relating to _Core_ and _SiteDock_ files.
    - Note: Functionality remains unchanged.


    