(function (){

    init();

    function init(){

        GLOBAL.onWindowLoadRun.push(initTopMenuButtons);

    }

    // #region initTopMenuButtons
    let urlParamParsers = ['#','?'];

    function initTopMenuButtons(){

        menuGroup = [
        {idName: 'flyoutPanel', link: '*'},
        {topMenu:    {id: 'buttonTopMenuBarTabHome',                        
                        name: 'Home',
                        urlParamParsers: urlParamParsers,
                        link: GLOBAL.httpURLHostname + GLOBAL.appURL,
                        linkAlternative: 'http://' + GLOBAL.domain + GLOBAL.appURL,
                        style: 'top-menu-bar-tab-left',
                        styleActive: 'top-menu-bar-tab-active',
                        styleTabEffect: 'top-menu-bar-tab-wrapper',
                        styleTabEffectActive: 'top-menu-bar-tab-wrapper-active',
                        styleText: 'text-padding-8px',
                        styleTextActive: null,
                        styleTextEffect: null,
                        styleTextEffectActive: null,
                        styleFiller: 'top-menu-bar-tab-filler',
                        styleFillerActive: 'top-menu-bar-tab-filler-active',
                        width: null,
                        textAlign: 'left'},
        flyoutMenu: {id: 'buttonFlyoutMenuHome',
                        name: 'Home',
                        link: GLOBAL.httpURLHostname + GLOBAL.appURL,
                        style: 'flyout-menu-button',
                        styleActive: 'flyout-menu-button-active'}},
        {topMenu:    {id: 'buttonTopMenuBarTabFeatures',
                        name: 'Features',
                        urlParamParsers: urlParamParsers,
                        link: GLOBAL.httpURLHostname + GLOBAL.appURL + 'Features',
                        style: 'top-menu-bar-tab-left',
                        styleActive: 'top-menu-bar-tab-active',
                        styleTabEffect: 'top-menu-bar-tab-wrapper',
                        styleTabEffectActive: 'top-menu-bar-tab-wrapper-active',
                        styleText: 'text-padding-8px',
                        styleTextActive: null,
                        styleTextEffect: null,
                        styleTextEffectActive: null,
                        styleFiller: 'top-menu-bar-tab-filler',
                        styleFillerActive: 'top-menu-bar-tab-filler-active',
                        width: null,
                        textAlign: 'left'},
        flyoutMenu: {id: 'buttonFlyoutMenuFeatures',
                        name: 'Features',
                        link: GLOBAL.httpURLHostname + GLOBAL.appURL + 'Features',
                        style: 'flyout-menu-button',
                        styleActive: 'flyout-menu-button-active'}},
        {topMenu:    {id: 'buttonTopMenuBarTabDocumentation',
                        name: 'Documentation',
                        urlParamParsers: urlParamParsers,
                        link: GLOBAL.httpURLHostname + GLOBAL.appURL + 'Documentation',                        
                        style: 'top-menu-bar-tab-left',
                        styleActive: 'top-menu-bar-tab-active',
                        styleTabEffect: 'top-menu-bar-tab-wrapper',
                        styleTabEffectActive: 'top-menu-bar-tab-wrapper-active',
                        styleText: 'text-padding-8px',
                        styleTextActive: null,
                        styleTextEffect: null,
                        styleTextEffectActive: null,
                        styleFiller: 'top-menu-bar-tab-filler',
                        styleFillerActive: 'top-menu-bar-tab-filler-active',
                        width: null,
                        textAlign: 'left'},
        flyoutMenu: {id: 'buttonFlyoutMenuDocumentation',
                        name: 'Documentation',
                        link: GLOBAL.httpURLHostname + GLOBAL.appURL + 'Documentation',
                        style: 'flyout-menu-button',
                        styleActive: 'flyout-menu-button-active'}},
        {topMenu:   {id: 'buttonTopMenuBarTabAssistance',
                        name: 'Help',
                        urlParamParsers: urlParamParsers,
                        link: GLOBAL.httpURLHostname + GLOBAL.appURL + 'Assistance',                        
                        style: 'top-menu-bar-tab-left',
                        styleActive: 'top-menu-bar-tab-active',
                        styleTabEffect: 'top-menu-bar-tab-wrapper',
                        styleTabEffectActive: 'top-menu-bar-tab-wrapper-active',
                        styleText: 'text-padding-8px',
                        styleTextActive: null,
                        styleTextEffect: null,
                        styleTextEffectActive: null,
                        styleFiller: 'top-menu-bar-tab-filler',
                        styleFillerActive: 'top-menu-bar-tab-filler-active',
                        width: null,
                        textAlign: 'left'},
        flyoutMenu: {id: 'buttonFlyoutMenuAssistance',
                        name: 'Help',
                        link: GLOBAL.httpURLHostname + GLOBAL.appURL + 'Assistance',
                        style: 'flyout-menu-button',
                        styleActive: 'flyout-menu-button-active'}}        
        ];

        var BDT = GLOBAL.utility.BlipDynamoTabs();
        BDT.topMenuBarCondensedElement = 'topMenuBarCondensedTab';
        BDT.topMenuBarContainerElement = 'topMenuBarContainer';
        BDT.initParentMenu(menuGroup);

    }
    // #endregion

})();