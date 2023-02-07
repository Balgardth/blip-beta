(function (){

    init();

    function init(){

        GLOBAL.onWindowLoadRun.push(initTopHangingMenuButtons);        

    }

    // #region initTopHangingMenuButtons
    let urlParamParsers = ['#','?'];
    function initTopHangingMenuButtons(){

        menuGroupRight = [
        {idName: 'flyoutPanel', link: '*'},
        {topMenu:    {id: 'buttonTopMenuBarTabSupport',
                        name: 'Support',
                        urlParamParsers: urlParamParsers,
                        link: GLOBAL.httpsURLHostname + GLOBAL.appURL + 'Support',
                        style: 'top-menu-bar-tab-hanging-right',
                        styleActive: 'top-menu-bar-tab-hanging-right-active',
                        styleTabEffect: 'top-menu-bar-tab-hanging-wrapper-right',
                        styleTabEffectActive: 'top-menu-bar-tab-hanging-wrapper-right-active',
                        styleText: 'text-padding-4px',
                        styleTextActive: null,
                        styleTextEffect: "blank",
                        styleTextEffectActive: null,
                        styleFiller: null,
                        styleFillerActive: null,
                        maxWidth: '60px',
                        minWidth: '60px',
                        textAlign: 'center'},
        flyoutMenu: {id: 'buttonFlyoutMenuSupport',
                        name: 'Support',
                        link: GLOBAL.httpsURLHostname + GLOBAL.appURL + 'Support',
                        style: 'flyout-menu-button-hanging-right',
                        styleActive: 'flyout-menu-button-hanging-right-active'}},
        {topMenu:    {id: 'buttonTopMenuBarTabAbout',
                        name: 'About',
                        urlParamParsers: urlParamParsers,
                        link: GLOBAL.httpURLHostname + GLOBAL.appURL + 'About',
                        style: 'top-menu-bar-tab-hanging-right',
                        styleActive: 'top-menu-bar-tab-hanging-right-active',
                        styleTabEffect: 'top-menu-bar-tab-hanging-wrapper-right',
                        styleTabEffectActive: 'top-menu-bar-tab-hanging-wrapper-right-active',
                        styleText: 'text-padding-4px',
                        styleTextActive: null,
                        styleTextEffect: "blank",
                        styleTextEffectActive: null,
                        styleFiller: null,
                        styleFillerActive: null,
                        maxWidth: '60px',
                        minWidth: '60px',
                        textAlign: 'center',
                        flyoutChildMenuToggle: true},
        flyoutMenu: {id: 'buttonFlyoutMenuAbout',
                        name: 'About',
                        link: GLOBAL.httpURLHostname + GLOBAL.appURL + 'About',
                        style: 'flyout-menu-button-hanging-right',
                        styleActive: 'flyout-menu-button-hanging-right-active'}}
        ];



        var BDTR = GLOBAL.utility.BlipDynamoTabs();
        BDTR.topMenuBarCondensedElement = 'topMenuBarCondensedTabHanging';
        BDTR.topMenuBarContainerElement = 'topMenuBarContainerRight';
        BDTR.topMenuTabLeftOffsetIncrementValue = 8;
        BDTR.initParentMenu(menuGroupRight);

    }
    // #endregion

})();