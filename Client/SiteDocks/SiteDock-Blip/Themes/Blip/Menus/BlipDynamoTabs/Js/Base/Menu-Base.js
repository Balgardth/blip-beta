(function (){

    init();

    function init(){

        GLOBAL.utility["BlipDynamoTabs"] = newBlipDynamoTabs;

    }

    function newBlipDynamoTabs(){
        return new BlipDynamoTabs();
    }

    class BlipDynamoTabs{

        constructor(){
            this.updateFlyoutMenu = true;
            this.innerWidth = 574;
            this.innerHeight = 400;
            this.topMenuZIndex = 100;
            this.tabZindexStart = null;
            this.topMenuTabLeftOffsetIncrement = 4;
            this.tabDirection = 'right';
            this.parentButtons = [];
            this.childButtons = [];
            this.navMenuActiveButtons = null;
            this.topMenuBarCondensedObj = null;
            this.topMenuBarContainerObj = null;
        }

        get updateFlyoutMenuValue(){ return this.updateFlyoutMenu; }
        get parentButtonsObj(){ return this.parentButtons; }
        get childButtonsObj(){ return this.childButtons; }
        get innerWidthValue(){ return this.innerWidth; }
        get innerHeightValue(){ return this.innerHeight; }
        get topMenuZIndexValue(){ return this.topMenuZIndex; }
        get topMenuTabLeftOffsetIncrementValue(){ return this.topMenuTabLeftOffsetIncrement; }
        get topMenuBarCondensedElement(){ this.topMenuBarCondensedObj; }
        get topMenuBarContainerElement(){ this.topMenuBarContainerObj; }
        get tabDirectionValue(){ return this.tabDirection; }
        get lastTopMenuZIndex(){ return ( this.tabZindexStart > this.topMenuZIndex) ?  this.tabZindexStart + 1 : this.topMenuZIndex + 1;}

        set updateFlyoutMenuValue(bool){ this.updateFlyoutMenu = bool; }
        set innerWidthValue(num){ this.innerWidth = num; }
        set innerHeightValue(num){ this.innerHeight = num; }
        set topMenuZIndexValue(num){ this.topMenuZIndex = num; }
        set tabDirectionValue(num){ this.tabDirection = num; }
        set topMenuTabLeftOffsetIncrementValue(num){ this.topMenuTabLeftOffsetIncrement = num; }
        set topMenuBarCondensedElement(id){ this.topMenuBarCondensedObj = document.getElementById(id); }
        set topMenuBarContainerElement(id){ this.topMenuBarContainerObj = document.getElementById(id); }

        initParentMenu(menu){

            var _this = this;
            var eFPW = document.getElementById('flyoutPanel');
            var divMenuPlaceHolder;
            var divFlyoutMenuWrapper;
            _this.tabZindexStart = this.topMenuZIndex;
            var tmpZindex;
            var tmpPrevItem = null;
            var topMenuTabLeftOffset = 0;

            menu = changeDirection(menu);

            menu.forEach(function(item) {
                if(item.idName == undefined){
                    // Top page menu elements
                    var divMenuItemWrapper = document.createElement('div');
                    divMenuItemWrapper.classList.add(item.topMenu.styleTabEffect);
                    if(item.topMenu.maxWidth) divMenuItemWrapper.style.maxWidth = item.topMenu.maxWidth;
                    if(item.topMenu.minWidth) divMenuItemWrapper.style.minWidth = item.topMenu.minWidth;

                    if(_this.tabDirection == "right"){
                        divMenuItemWrapper.style.left = "-" + topMenuTabLeftOffset + "px";
                    } else if(_this.tabDirection == "left"){
                        divMenuItemWrapper.style.left = topMenuTabLeftOffset + "px";
                    }

                    var divTopMenuBarTab = document.createElement('div');
                    var divTopMenuBarTabTextWrapper = document.createElement('div');
                    divTopMenuBarTab.classList.add(item.topMenu.style);
                    if(item.topMenu.styleTextEffect) {
                        divTopMenuBarTabTextWrapper.classList.add(item.topMenu.styleTextEffect);
                        divTopMenuBarTab.appendChild(divTopMenuBarTabTextWrapper);
                    }
                    divMenuItemWrapper.style.zIndex = --_this.topMenuZIndex;
                    if(item.topMenu.textAlign) divTopMenuBarTab.style.textAlign = item.topMenu.textAlign;
                    topMenuTabLeftOffset = topMenuTabLeftOffset + _this.topMenuTabLeftOffsetIncrement;


                    divTopMenuBarTab.id = item.topMenu.id;
                    divMenuItemWrapper.id = item.topMenu.id + "StyleTabEffect";
                    var spanTextPadding = document.createElement('span');
                    spanTextPadding.classList.add(item.topMenu.styleText);
                    spanTextPadding.innerHTML = item.topMenu.name;
                    divMenuItemWrapper.appendChild(divTopMenuBarTab);
                    if(item.topMenu.styleTextEffect){
                        divTopMenuBarTabTextWrapper.appendChild(spanTextPadding);
                    } else {
                        divTopMenuBarTab.appendChild(spanTextPadding);
                    }
                    if(item.topMenu.styleFiller){
                        var divTopMenuBarTabFiller = document.createElement('div');
                        divTopMenuBarTabFiller.classList.add(item.topMenu.styleFiller);
                        divTopMenuBarTab.appendChild(divTopMenuBarTabFiller);
                        //divMenuItemWrapper.appendChild(divTopMenuBarTabFiller);
                    }
                    _this.topMenuBarContainerObj.appendChild(divMenuItemWrapper);
                }
            });

            GLOBAL.utility.objLoaded(menu[menu.length-1].topMenu.id, function(){
                initStage2();
            });

            function initStage2(){

                menu = changeDirection(menu);

                menu.forEach(function(item) {
                    /**
                     * Initialize Wrappers
                     */
                    if(item.idName != undefined){

                        if(_this.updateFlyoutMenu){
                            // Flyout menu elements
                            divMenuPlaceHolder = document.getElementById(item.idName);
                            var flyoutMenuWrapperId = 'flyoutMenuWrapper';
                            divFlyoutMenuWrapper;

                            if(document.getElementById(flyoutMenuWrapperId) == undefined){
                                divFlyoutMenuWrapper = document.createElement('div');
                            } else {
                                divFlyoutMenuWrapper = document.getElementById(flyoutMenuWrapperId);
                            }


                            if(divMenuPlaceHolder){
                                divFlyoutMenuWrapper.id = flyoutMenuWrapperId;
                                divMenuPlaceHolder.appendChild(divFlyoutMenuWrapper);
                                divFlyoutMenuWrapper.classList.add('flyout-menu-wrapper');
                            }
                        }

                    } else {

                        var divButton;
                        var eFlyoutMenu;

                        if(_this.updateFlyoutMenu){
                            divButton = document.createElement('div');
                            divButton.id = item.flyoutMenu.id;
                            divFlyoutMenuWrapper.appendChild(divButton);
                            divButton.classList.add(item.flyoutMenu.style);
                            divButton.innerHTML = item.flyoutMenu.name;
                            eFlyoutMenu = document.getElementById(item.flyoutMenu.id);
                        }

                        var eTopMenu = document.getElementById(item.topMenu.id);

                        if(isBaseLinkActive(item)){

                            if(_this.updateFlyoutMenu) eFlyoutMenu.classList.add(item.flyoutMenu.styleActive);
                            eTopMenu.classList.add(item.topMenu.styleActive);
                            if(item.topMenu.styleTextEffectActive){
                                eTopMenu.childNodes[0].classList.add(item.topMenu.styleTextEffectActive);
                            }
                            if(item.topMenu.styleTextEffect && item.topMenu.styleTextActive){
                                eTopMenu.childNodes[0].childNodes[0].classList.add(item.topMenu.styleTextActive);
                            } else {
                                if(item.topMenu.styleTextActive){
                                   eTopMenu.childNodes[0].classList.add(item.topMenu.styleTextActive);
                                }
                            }
                            eTopMenu.parentElement.classList.add(item.topMenu.styleTabEffectActive);

                            if(item.topMenu.styleFillerActive){
                                eTopMenu.childNodes[1].classList.add(item.topMenu.styleFillerActive);
                            }

                            if(tmpPrevItem != null){
                                eTopMenu.parentElement.style.zIndex = tmpZindex;
                            }

                            tmpZindex = eTopMenu.parentElement.style.zIndex;
                            eTopMenu.parentElement.style.zIndex = (_this.tabZindexStart > _this.topMenuZIndex) ?
                                _this.tabZindexStart + 1 : _this.topMenuZIndex + 1;

                            if(item.topMenu.flyoutChildMenuToggle != undefined){

                                if(item.topMenu.flyoutChildMenuToggle == true){

                                    childMenuActive(item.flyoutMenu.childMenu, function(data){

                                        item.flyoutMenu.childMenu.toggled = data;

                                    });

                                }

                            }

                            _this.navMenuActiveButtons = item;
                            _this.setTopNavCondensedName();

                        }

                        if(item.topMenu.styleTabEffect) {
                            let eTopMenuWrapper = document.getElementById(item.topMenu.id + "StyleTabEffect");

                            eTopMenuWrapper.onclick = function(){

                                window.open(item.topMenu.link, "_parent");

                            }

                            _this.parentButtons.push(eTopMenuWrapper);

                        }

                        eTopMenu.onclick = function(){

                            window.open(item.topMenu.link, "_parent");

                        }

                        _this.parentButtons.push(eTopMenu);

                        if(eFlyoutMenu && _this.updateFlyoutMenu){

                            eFlyoutMenu.onclick = function(){

                                if(item.flyoutMenu.link != null){

                                    window.open(item.flyoutMenu.link, "_parent");
                                    eFPW.style.visibility = 'hidden';

                                } else {

                                    clearButtons();

                                    eFlyoutMenu.classList.add(item.flyoutMenu.styleActive);

                                    if(item.flyoutMenu.childMenu != undefined){

                                    childMenuActive(item.flyoutMenu.childMenu, function(data){

                                        item.flyoutMenu.childMenu.toggled = data;

                                    });

                                    }

                                }

                                _this.navMenuActiveButtons = item;
                                _this.setTopNavCondensedName();

                            }
                            _this.parentButtons.push(eFlyoutMenu);
                        }

                        if(item.flyoutMenu.childMenu != undefined ){

                            if(item.flyoutMenu.childMenu.initFunc == undefined) return;

                            item.flyoutMenu.childMenu.initFunc(divFlyoutMenuWrapper);
                            item.flyoutMenu.childMenu.flagLoaded = true;

                        }

                    }

                });

                function isBaseLinkActive(obj){

                    let flagSkipParser = false;
                    let flagSkipLinkAlternative = false;
                    let baseURL = window.location.href;

                    if(obj.topMenu.urlParamParsers != undefined){
                        if(obj.topMenu.urlParamParsers == null) flagSkipParser = true;
                    } else if(obj.topMenu.urlParamParser == undefined){
                        flagSkipParser = true;
                    }

                    if(!flagSkipParser){

                        for(let x=0; x < obj.topMenu.urlParamParsers.length; x++){

                            if(baseURL.indexOf(obj.topMenu.urlParamParsers[x]) != -1){
                                baseURL = baseURL.split(obj.topMenu.urlParamParsers[x])[0];
                                break;
                            }

                        }
                    }

                    if(baseURL == obj.topMenu.link) return true;

                    if(obj.topMenu.linkAlternative != undefined){
                        if(obj.topMenu.linkAlternative == null) flagSkipLinkAlternative = true;
                    } else if(obj.topMenu.linkAlternative == undefined){
                        flagSkipLinkAlternative = true;
                    }

                    if(flagSkipLinkAlternative) return false;

                    if(typeof(obj.topMenu.linkAlternative) === "string"){

                        if(baseURL == obj.topMenu.linkAlternative) return true;

                    } else {

                        for(let x=0; x < obj.topMenu.linkAlternative.length; x++){

                            if(baseURL == obj.topMenu.linkAlternative[x]){
                                return true;
                                break;
                            }

                        }

                    }

                    return false;
                }

                var buttonFlyoutMenuEmptyId = "buttonFlyoutMenuEmpty";

                if(document.getElementById(buttonFlyoutMenuEmptyId) == undefined){
                    var divButtonFlyoutMenuEmpty = document.createElement('div');
                    divButtonFlyoutMenuEmpty.id = buttonFlyoutMenuEmptyId;
                    if(divMenuPlaceHolder){
                        divMenuPlaceHolder.appendChild(divButtonFlyoutMenuEmpty);
                    }
                    divButtonFlyoutMenuEmpty.classList.add('flyout-menu-empty-button');

                    var eBFME = document.getElementById('buttonFlyoutMenuEmpty');

                    eBFME.onclick = function(){

                        eFPW.style.visibility = 'hidden';

                    }

                    var eBTMBTPM = document.getElementById('buttonTopMenuBarTabPulldownMenu');

                    eBTMBTPM.onclick = function(){

                        eFPW.style.visibility = 'visible';

                    }
                }

            }

            // If direction is left reverse order
            function changeDirection(menu){

                if(_this.tabDirection == "left"){
                    var tmpMenu = [];

                    tmpMenu.push(menu[0]);

                    for(let x = menu.length - 1; x >= 1; x--){

                        tmpMenu.push(menu[x]);

                    }

                    menu = tmpMenu;

                }

                return menu;
            }

            function childMenuActive(childMenu, callback){

            childMenuActiveLoaded();

                function childMenuActiveLoaded(){

                    if(childMenu == undefined) return;

                    if(childMenu.flagLoaded == false){

                        setTimeout(function(){childMenuActiveLoaded()},5);

                    } else {

                        go();

                    }

                }

                function go(){

                    var flyoutWrapper = document.getElementById(childMenu.name);
                    var pulldownDivLineCenter = document.getElementById('pulldownDivLineCenter');
                    var pulldownDivLineWrapper = document.getElementById('pulldownChildDivWrapper');
                    pulldownDivLineWrapper.classList.add(childMenu.pulldownChildDivWrapperClass);
                    var pulldownDivLine = document.getElementById('pulldownChildDivLine');
                    pulldownDivLine.classList.add(childMenu.pulldownChildDivLineClass);

                    if(!childMenu.toggled){

                        flyoutWrapper.style.display = 'inline-block';
                        pulldownDivLineCenter.style.display = 'none';
                        pulldownDivLineWrapper.style.display = 'inline-block';

                    } else {

                        flyoutWrapper.style.display = 'none';
                        pulldownDivLineCenter.style.display = 'inline-block';
                        pulldownDivLineWrapper.style.display = 'none';

                    }

                    callback((childMenu.toggled) ? false : true);

                }

            }

            function clearButtons(){

                menu.forEach(function(item) {

                if(item.topMenu != undefined){
                    if(document.getElementById(item.topMenu.id) != undefined){
                        var eTopMenu = document.getElementById(item.topMenu.id);
                        if(item.topMenu.styleActive){
                            eTopMenu.classList.remove(item.topMenu.styleActive);
                        }
                        if(item.topMenu.styleTextEffectActive){
                            eTopMenu.childNodes[1].classList.remove(item.topMenu.styleTextEffectActive);
                        }
                        if(item.topMenu.styleFillerActive){
                            eTopMenu.childNodes[1].classList.remove(item.topMenu.styleFillerActive);
                        }
                    }
                }

                if(item.flyoutMenu != undefined){
                    var eFlyoutMenu = document.getElementById(item.flyoutMenu.id);
                    eFlyoutMenu.classList.remove(item.flyoutMenu.styleActive);
                }

                });

            }

        }

        setTopNavCondensedName(){

            if(!this.topMenuBarCondensedObj) {
                return;
            } else if(!this.navMenuActiveButtons){
                this.topMenuBarCondensedObj.style.visibility = 'hidden';
                return;
            }

            this.topMenuBarCondensedObj.style.visibility = 'visible';

            var activeButton;

            if(document.getElementById(this.navMenuActiveButtons.topMenu.id) != undefined){

                activeButton = document.getElementById(this.navMenuActiveButtons.topMenu.id);
                this.topMenuBarCondensedObj.innerHTML = this.navMenuActiveButtons.topMenu.name;

            } else if(document.getElementById(this.navMenuActiveButtons.flyoutMenu.id) != undefined) {

                activeButton = document.getElementById(this.navMenuActiveButtons.flyoutMenu.id);
                this.topMenuBarCondensedObj.innerHTML = this.navMenuActiveButtons.flyoutMenu.name;

            }

            /**
             * TODO
             * change background-color to object included color from menu settings.
             */

            var bgColor = window.getComputedStyle(activeButton, null).getPropertyValue('background-color');
            this.topMenuBarCondensedObj.style.backgroundColor = bgColor;

        }
    }

})();