(function (){

    init();

    function init(){

        GLOBAL.onWindowLoadRun.push(initTopMenuDocButtons);

    }

    // #region initTop'#'s
    function initTopMenuDocButtons(){

        menuGroup = [
        {idName: 'flyoutPanelDoc', link: '*'},
        {topMenu:    {id: 'buttonTab1',
                        name: 'Button 1',
                        link: '#',
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
        flyoutMenu: {id: 'buttonTab2Flyout',
                        name: 'Button 2',
                        link: '#',
                        style: 'flyout-menu-button',
                        styleActive: 'flyout-menu-button-active'}},
        {topMenu:    {id: 'buttonTab2',
                        name: 'Button 2',
                        link: '#',
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
        flyoutMenu: {id: 'buttonTab3Flyout',
                        name: 'Button 3',
                        link: '#',
                        style: 'flyout-menu-button',
                        styleActive: 'flyout-menu-button-active'}},
        {topMenu:    {id: 'buttonTab3',
                        name: 'Button 3',
                        link: '#',
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
        flyoutMenu: {id: 'buttonTab3Flyout',
                        name: 'Button 3',
                        link: '#',
                        style: 'flyout-menu-button',
                        styleActive: 'flyout-menu-button-active'}}
        ];

        var BDT = GLOBAL.utility.BlipDynamoTabs();
        BDT.updateFlyoutMenuValue = false;
        BDT.topMenuBarCondensedElement = 'topMenuBarCondensedTabDoc';
        BDT.topMenuBarContainerElement = 'topMenuBarContainerDoc';
        BDT.initParentMenu(menuGroup);

    }
    // #endregion

})();