(function (){

    let flagAnchorTopVisible = false;
    let flagButtonToTopMobilePressed = false;
    let scrollFooterNav;
    let buttonReturnToTop;


    window.onload = function(){

        init();

    }

    function init(){        

        GLOBAL.onWindowLoadFunc(function(){
            initAdjustTouchScreen();
            escapeHTMLCodeSyntax();
            initToc(function(){
                initMobileAnchorCompensation();
                GLOBAL.utility.anchorHistory.init();
            });                   

            document.body.addEventListener( 'scroll', pageScrollAction);
            buttonReturnToTop = document.getElementById("buttonReturnToTop");
            scrollFooterNav = document.getElementById("scrollFooterNav");

            if(GLOBAL.flagIsTouch){
                document.body.addEventListener('touchstart', buttonToTopMobilePressedAction);
            }

            buttonReturnToTop.onclick = function(){

                //document.body.scrollTop = 0;  BUG: Can't use due to a browser page position tracking problem when elements on the page are condensed.
                window.location.href = '#topOfDoc';


                if(GLOBAL.flagIsTouch){

                    buttonReturnToTop.style.visibility = "hidden";
                    flagButtonToTopMobilePressed = true;
                }

            }

        });

    }

    // Compensate for mobile/tablet bug in some browsers
    function initMobileAnchorCompensation(){

        let anchorList = ['ss_TemplateEngine', 'cs_Assets_DirectoryTree_Themes'];

        anchorList.forEach(function(anchorListItem){
        
            if(window.location.href.split('#')[1] == anchorListItem + "FH"){
                
                GLOBAL.utility.gotoPageAnchor(anchorListItem);

            }

        });

    }

    // Compensates for stuck active button
    function buttonToTopMobilePressedAction(){

        if(document.body.scrollTop > 40 && flagButtonToTopMobilePressed){
            buttonReturnToTop.style.visibility = "visible";
            flagButtonToTopMobilePressed = false;
        }

    }

    let setTimeoutVar = null;

    function pageScrollAction(){

        if(document.body.scrollTop > 80){

            if(!flagAnchorTopVisible){

                scrollFooterNav.classList.add("scroll-footer-nav-wrapper-bounce");
                scrollFooterNav.classList.remove("scroll-footer-nav-wrapper-retract");
                flagAnchorTopVisible = true;

            } else {

                scrollFooterNav.classList.remove("scroll-footer-nav-wrapper-bounce");
                scrollFooterNav.classList.add("scroll-footer-nav-wrapper-bounce-trigger");

                if(setTimeoutVar != null) clearTimeout(setTimeoutVar);

                setTimeoutVar = setTimeout(function(){

                        scrollFooterNav.classList.remove("scroll-footer-nav-wrapper-bounce-trigger");
                        if(flagAnchorTopVisible){
                            scrollFooterNav.classList.add("scroll-footer-nav-wrapper-bounce");
                        }

                }, 2000);

            }

        } else {

            if(flagAnchorTopVisible){

               hideButtonScrollTop();

            }
        }

    }

    function hideButtonScrollTop(){

        scrollFooterNav.classList.add("scroll-footer-nav-wrapper-retract");
        scrollFooterNav.classList.remove("scroll-footer-nav-wrapper-bounce");
        flagAnchorTopVisible = false;

    }

    function initToc(callback){

        GLOBAL.utility['doc'] = {goToAnchor: docGoToAnchor};

        let sectionTypes = {serverSide: "ss_", clientSide: "cs_"};

        let tocWrappers = document.getElementsByClassName("toc-category-wrapper");

        let divSectionExpandContractWrapper = document.createElement('div');
        divSectionExpandContractWrapper.classList.add("button-section-expand-contract-wrapper");
        let divSectionExpandContract = document.createElement('div');
        divSectionExpandContract.classList.add("button-section-toc-bar-contract");
        divSectionExpandContractWrapper.appendChild(divSectionExpandContract);        

        let divBulletExpandContractPreWrapper = document.createElement('div');
        divBulletExpandContractPreWrapper.classList.add("button-bullet-expand-contract-pre-wrapper");
        let divBulletExpandContractWrapper = document.createElement('div');
        divBulletExpandContractWrapper.classList.add("button-bullet-expand-contract-wrapper");
        divBulletExpandContractPreWrapper.appendChild(divBulletExpandContractWrapper);

        let divSectionExpandContractCat = document.createElement('div');
        divSectionExpandContractCat.classList.add("button-section-toc-bar-cat-contract");

        let clone = divSectionExpandContractCat.cloneNode(true);
        divBulletExpandContractWrapper.appendChild(clone);

        let buttonAllSectionTocExpandContractAll = document.getElementById("buttonAllSectionTocExpandContractAll");
        let buttonAllSectionTocExpandContract = document.getElementById("buttonAllSectionTocExpandContract");
        let buttonSsSectionTocExpandContract = document.getElementById("ssButtonSectionTocExpandContract");
        let buttonSsSectionTocExpandContractAll = document.getElementById("ssButtonSectionTocExpandContractAll");
        let buttonCsSectionTocExpandContract = document.getElementById("csButtonSectionTocExpandContract");
        let buttonCsSectionTocExpandContractAll = document.getElementById("csButtonSectionTocExpandContractAll");
        let containerSectionTocServer = document.getElementsByClassName("section-container-server section-container-ext")[0];
        let containerSectionTocClient = document.getElementsByClassName("section-container-client section-container-ext")[0];
        let serverSideTOCContainer = document.getElementById("serverSideTOCContainer");
        let clientSideTOCContainer = document.getElementById("clientSideTOCContainer");

        let styleContractAll = "button-section-toc-contract-all";
        let styleExpandAll = "button-section-toc-expand-all";
        let styleContract = "button-section-toc-contract";
        let styleExpand = "button-section-toc-expand";
        let styleContractBar = "button-section-toc-bar-contract";
        let styleExpandBar = "button-section-toc-bar-expand";
        let styleContractBarCat = "button-section-toc-bar-cat-contract";
        let styleExpandBarCat = "button-section-toc-bar-cat-expand";

        let buttons = [];
        let buttonsAllGroupActionButtons = [];
        let buttonsGroupActionButtons = [];

        initButtonsSingleAction();

        let flagButtonAllSectionTocExpandContractAllStateToggled = false;

        initButtonsGroupAction("serverSide", {all: buttonSsSectionTocExpandContractAll, section: buttonSsSectionTocExpandContract, containerShell: containerSectionTocServer, container: serverSideTOCContainer});
        initButtonsGroupAction("clientSide", {all: buttonCsSectionTocExpandContractAll, section: buttonCsSectionTocExpandContract, containerShell: containerSectionTocClient, container: clientSideTOCContainer});

        /**
         * Top most buttons that toggle all others.
         */
        let flagGroupToggleStateAll = true;
        let flagGroupToggleStateSection = true;

        initButtonsGroupActionAll();

        function initButtonsGroupActionAll(){

            buttonAllSectionTocExpandContractAll.onclick = buttonAllSectionTocExpandContractAllClick;

            buttonAllSectionTocExpandContract.onclick = buttonAllSectionTocExpandContractClick;

        }

        function buttonAllSectionTocExpandContractAllClick(){

            if(flagGroupToggleStateAll){
                buttonAllSectionTocExpandContractAll.firstChild.classList.remove(styleContractAll);
                buttonAllSectionTocExpandContractAll.firstChild.classList.add(styleExpandAll);
                flagGroupToggleStateAll = false;

                buttonsGroupActionButtons.forEach(function(item){

                   if(item.state == true) item.button.click();

                });

            } else {
                buttonAllSectionTocExpandContractAll.firstChild.classList.remove(styleExpandAll);
                buttonAllSectionTocExpandContractAll.firstChild.classList.add(styleContractAll);
                flagGroupToggleStateAll = true;

                buttonsGroupActionButtons.forEach(function(item){

                   if(item.state == true) item.button.click();

                });
            }

            resetAllUlCategoryTOCBullets("serverSide",  flagGroupToggleStateAll);
            resetAllUlCategoryTOCBullets("clientSide",  flagGroupToggleStateAll);

            buttonsAllGroupActionButtons.forEach(function(item){
                if ((flagGroupToggleStateAll == false && (item.state == false || item.state == undefined)) ||
                    (flagGroupToggleStateAll == true  && item.state == true)
                ) {
                    item.button.click();
                }
            });

        }

        function buttonAllSectionTocExpandContractClick(event, flagClickSectionGroupButtons = true){

            if(flagGroupToggleStateSection){

                flagGroupToggleStateSection = false;
                buttonAllSectionTocExpandContract.firstChild.classList.remove(styleContract);
                buttonAllSectionTocExpandContract.firstChild.classList.add(styleExpand);

                buttonAllSectionTocExpandContractAll.style.visibility = "hidden";


            } else {

                flagGroupToggleStateSection = true;
                buttonAllSectionTocExpandContract.firstChild.classList.remove(styleExpand);
                buttonAllSectionTocExpandContract.firstChild.classList.add(styleContract);

                buttonAllSectionTocExpandContractAll.style.visibility = "visible";
            }

            if(!flagClickSectionGroupButtons) return;            


            buttonsGroupActionButtons.forEach(function(item){
                if ((flagGroupToggleStateSection == false && (item.state == false || item.state == undefined)) ||
                    (flagGroupToggleStateSection == true  && item.state == true)
                ) {
                    item.button.click();
                }
            });

        }

        /**
         * Individual TOC buttons
         */
        function initButtonsSingleAction(){

            for(let x = 0; x < tocWrappers.length; x++){

                let bulletGroup = getBulletUlGroup(tocWrappers[x]);

                if(bulletGroup != -1){

                    let catHeading = getTocCatHeading(tocWrappers[x]);
                    buttons.push({});
                    let buttonPos = buttons.length - 1;

                    if(catHeading != -1){

                        let clone = divSectionExpandContractWrapper.cloneNode(true);
                        let aTagElements = getATagElement(catHeading);
                        catHeading.appendChild(clone);
                        buttons[buttonPos] = {container: bulletGroup, buttonSymbol: clone.firstChild, state: {toggle: true, href: aTagElements[1], styleExpand:  styleExpandBar, styleContract: styleContractBar}};
                        clone.onclick = function(){
                            buttons[buttonPos].state.toggle = buttonTocExpandContract(bulletGroup, buttons[buttonPos].state, buttons[buttonPos].buttonSymbol);
                        };
                        if(!GLOBAL.flagIsTouch) clone.onmouseover = function(){
                            catHeading.getElementsByTagName('div')[2].style.visibility = "visible";
                            catHeading.getElementsByTagName('div')[2].onmouseleave = function(){
                                this.style.visibility = "hidden";
                            }
                        }
                        buttons[buttonPos]['headingExpContButton'] = clone;

                    }

                    let catDiv = catHeading.getElementsByTagName('div')[0];

                    if(!GLOBAL.flagIsTouch) catDiv.onmouseover = function(){catHeading.getElementsByTagName('div')[2].style.visibility = "visible";}
                    if(!GLOBAL.flagIsTouch) catDiv.onmouseleave = function(){catHeading.getElementsByTagName('div')[2].style.visibility = "hidden";}
                    buttons[buttonPos]['heading'] = catHeading;

                    addBulletButtons(bulletGroup);

                }

            }

            function addBulletButtons(group){

                let elLi = getBulletLiGroup(group);

                for(let x = 0; x < elLi.length; x++){

                    let bulletGroup = getBulletUlGroup(elLi[x]);

                    if(bulletGroup != -1){

                        if(elLi[x].getElementsByTagName('div')[0] == undefined) continue;

                        let divEl = elLi[x].getElementsByTagName('div')[0];
                        let clone = divBulletExpandContractPreWrapper.cloneNode(true);
                        divEl.appendChild(clone);
                        if(!GLOBAL.flagIsTouch) divEl.onmouseenter = function(){this.getElementsByTagName('div')[1].style.visibility = "visible";}
                        if(!GLOBAL.flagIsTouch) divEl.onmouseleave = function(){this.getElementsByTagName('div')[1].style.visibility = "hidden";}
                        buttons.push({bullet: divEl});
                        let buttonPos = buttons.length - 1;
                        let divParent = clone.parentNode;
                        let buttonWrapper = clone.firstChild;
                        buttons[buttonPos] = {container: bulletGroup, buttonSymbol: buttonWrapper.firstChild, state: {toggle: true, href: divParent.firstChild.href, styleExpand:  styleExpandBarCat, styleContract: styleContractBarCat}};
                        if(!GLOBAL.flagIsTouch){
                            clone.onmouseenter = function(){
                                let divParent = clone.parentNode;
                                divParent.firstChild.href = '#';
                            };
                            clone.onmouseleave = function(){
                                let divParent = clone.parentNode;
                                divParent.firstChild.href = buttons[buttonPos].state.href;
                            };
                        }
                        clone.onclick = function(){
                            buttons[buttonPos].state.toggle = buttonTocExpandContract(bulletGroup, buttons[buttonPos].state, buttons[buttonPos].buttonSymbol);
                        };
                        buttons[buttonPos]['bulletExpContButton'] = clone;
                        addBulletButtons(bulletGroup);

                    }
                }

            }

        }

        /**
         * Buttons within each TOC section based on top most major category.
         *
         * @param {string} type : Options are "sectionTypes" member names.
         * @param {obj lit} buttons : Member options are groupButtons = {all: <button element obj>, section: <button element obj>,
         *                            container: <container element obj>}.
         */
        function initButtonsGroupAction(type, groupButtons){

            let bAGABPos = buttonsAllGroupActionButtons.length;
            let bGABPos = buttonsGroupActionButtons.length;
            let flagButtonAllSectionTocExpandContractAllToggled = true;

            groupButtons.all.onclick = function(){

                if(buttonsAllGroupActionButtons[bAGABPos].state){
                    groupButtons.all.firstChild.classList.remove(styleExpandAll);
                    groupButtons.all.firstChild.classList.add(styleContractAll);
                    buttonsAllGroupActionButtons[bAGABPos].state = false;
                    flagButtonAllSectionTocExpandContractAllToggled = true;

                } else {
                    groupButtons.all.firstChild.classList.remove(styleContractAll);
                    groupButtons.all.firstChild.classList.add(styleExpandAll);
                    buttonsAllGroupActionButtons[bAGABPos].state = true;
                    flagButtonAllSectionTocExpandContractAllToggled = false;
                }

                for(let x = 0; x < buttons.length; x++){

                    if(buttons[x].bulletExpContButton != undefined || buttons[x].headingExpContButton != undefined){

                        if(buttons[x].state.href == undefined) continue;

                        if(buttons[x].state.href.toString().indexOf(sectionTypes[type]) != -1){

                            buttons[x].state.toggle = buttonTocExpandContract(buttons[x].container, buttons[x].state, buttons[x].buttonSymbol);
                            buttons[x]["type"] = type;

                        }

                    }

                }

                resetAllUlCategoryTOCBullets(type,  flagButtonAllSectionTocExpandContractAllToggled);

                let flagToggleButtonAllSectionTocExpandContractAll = true;

                for(let x = 0; x < buttonsAllGroupActionButtons.length; x++){

                    if(buttonsAllGroupActionButtons[x].state == false || buttonsAllGroupActionButtons[x].state == undefined){
                        flagToggleButtonAllSectionTocExpandContractAll = false;
                        break;
                    }

                }

                if(flagToggleButtonAllSectionTocExpandContractAll){

                    if(!flagButtonAllSectionTocExpandContractAllStateToggled){

                        buttonAllSectionTocExpandContractAll.firstChild.classList.remove(styleContractAll);
                        buttonAllSectionTocExpandContractAll.firstChild.classList.add(styleExpandAll);
                        flagButtonAllSectionTocExpandContractAllStateToggled = true;
                        flagGroupToggleStateAll = false;

                    }

                } else {

                    if(flagButtonAllSectionTocExpandContractAllStateToggled){

                        buttonAllSectionTocExpandContractAll.firstChild.classList.add(styleContractAll);
                        buttonAllSectionTocExpandContractAll.firstChild.classList.remove(styleExpandAll);
                        flagButtonAllSectionTocExpandContractAllStateToggled = false;
                        flagGroupToggleStateAll = true;

                    }

                }

            }

            buttonsAllGroupActionButtons[bAGABPos] = {state: false, type: type, button: groupButtons.all};
            flagButtonAllSectionTocExpandContractAllHidden = true;

            groupButtons.section.onclick = function(){                

                if(buttonsGroupActionButtons[bGABPos].state){

                    groupButtons.section.firstChild.classList.remove(styleExpand);
                    groupButtons.section.firstChild.classList.add(styleContract);
                    groupButtons.container.style.display = "block";
                    groupButtons.containerShell.style.paddingBottom = "4px";
                    buttonsGroupActionButtons[bGABPos].state = false;

                    groupButtons.all.style.visibility = "visible";
                    flagButtonAllSectionTocExpandContractAllHidden = true;

                    setButtonAllSectionTocExpandContractAllVisibility();

                } else {

                    groupButtons.section.firstChild.classList.remove(styleContract);
                    groupButtons.section.firstChild.classList.add(styleExpand);
                    groupButtons.container.style.display = "none";
                    groupButtons.containerShell.style.paddingBottom = "1px";
                    buttonsGroupActionButtons[bGABPos].state = true;

                    groupButtons.all.style.visibility = "hidden";
                    flagButtonAllSectionTocExpandContractAllHidden = false;

                    setButtonAllSectionTocExpandContractAllVisibility();

                }

            }

            function setButtonAllSectionTocExpandContractAllVisibility(){

                let flagHideButtonAllSectionTocExpandContractAll = true;

                for(let x = 0; x < buttonsGroupActionButtons.length; x++){
                    if(buttonsGroupActionButtons[x].state == false || buttonsGroupActionButtons[x].state == undefined){
                        flagHideButtonAllSectionTocExpandContractAll = false;
                        break;
                    }
                }

                if(flagHideButtonAllSectionTocExpandContractAll && flagGroupToggleStateSection){

                    if(!GLOBAL.flagIsTouch) buttonAllSectionTocExpandContractAll.style.visibility = 'hidden';
                    buttonAllSectionTocExpandContractClick(null, false);
                    flagButtonAllSectionTocExpandContractAllHidden = true;

                } else if(buttonAllSectionTocExpandContractAll.style.visibility == 'hidden' &&
                         (flagGroupToggleStateSection || flagButtonAllSectionTocExpandContractAllHidden)) {

                    if(!GLOBAL.flagIsTouch) buttonAllSectionTocExpandContractAll.style.visibility = 'visible';
                    buttonAllSectionTocExpandContractClick(null, false);
                    flagButtonAllSectionTocExpandContractAllHidden = false;

                }

            }

            buttonsGroupActionButtons[bGABPos] = {state: false, type: type, button: groupButtons.section};

        }

        function resetAllUlCategoryTOCBullets(type, state){

            for(let x = 0; x < buttons.length; x++){

                if(buttons[x].type == undefined) continue;
                if(buttons[x].state == undefined) continue;
                if(buttons[x].headingExpContButton == undefined) continue;
                if(buttons[x].headingExpContButton.click == undefined) continue;

                if(buttons[x].type == type && buttons[x].state.toggle != state){

                    buttons[x].headingExpContButton.click();

                }

            }

        }

        function buttonTocExpandContract(obj, state, buttonSymbol){
            if(state.toggle){
                obj.style.display = 'none';
                buttonSymbol.classList.remove(state.styleContract);
                buttonSymbol.classList.add(state.styleExpand);
            } else {
                obj.style.display = 'block';
                buttonSymbol.classList.remove(state.styleExpand);
                buttonSymbol.classList.add(state.styleContract);
            }
            return (state.toggle) ? false : true;
        }

        function getBulletUlGroup(parent){

            if(parent.getElementsByTagName("ul")[0] != undefined){

                return parent.getElementsByTagName("ul")[0];

            }

            return -1;

        }

        function getBulletLiGroup(parent){

            if(parent.getElementsByTagName("li") != undefined){

                return parent.getElementsByTagName("li");

            }

            return -1;

        }

        function getATagElement(parent){

            if(parent.getElementsByTagName("a") != undefined){

                return parent.getElementsByTagName("a");

            }

            return -1;

        }

        function getTocCatHeading(parent){

            if(parent.getElementsByClassName("button-link-color-docs-bullet-level-0-wrapper")[0] != undefined){

                return parent.getElementsByClassName("button-link-color-docs-bullet-level-0-wrapper")[0];

            }

            return -1;

        }


        function docGoToAnchor(link){

            let anchorPrefix = "#";
            let anchorPostfix = "_toc";

            if( flagGroupToggleStateSection == false ) { buttonAllSectionTocExpandContract.click(); }

            Object.keys(sectionTypes).forEach(function(key){

                if(link.indexOf(sectionTypes[key]) != -1){

                    for(let x = 0; x < buttonsGroupActionButtons.length; x++){

                        if(buttonsGroupActionButtons[x].type == key){
                            if(buttonsGroupActionButtons[x].state == false) buttonsGroupActionButtons[x].button.click();
                            buttonsGroupActionButtons[x].button.click();
                        }
                    }

                    for(let x = 0; x < buttonsAllGroupActionButtons.length; x++){

                        if(buttonsAllGroupActionButtons[x].type == key){
                            if(buttonsAllGroupActionButtons[x].state == false) buttonsAllGroupActionButtons[x].button.click();
                        }

                    }

                    let linkParts = link.toString().split("_");
                    let endPos = linkParts.length - 1;
                    let loopCompareCntr = 0;

                    for(let x = 0; x < buttons.length; x++){

                        if(loopCompareCntr + 2 == endPos) break;

                        let tmp = buttons[x].state.href.toString().split(anchorPrefix);
                        let anchor = tmp[1].toString().split("_");
                        let compareStrAnchor = anchorPrefix + anchor[0] + anchor[1];
                        let compareStrLink = linkParts[0] + linkParts[1];

                        for(let x = 0; x < loopCompareCntr; x++){
                            compareStrAnchor += anchor[x + 2];
                            compareStrLink += linkParts[x + 2];
                        }

                        compareStrAnchor += anchorPostfix;
                        compareStrLink += anchorPostfix;

                        if(compareStrAnchor == compareStrLink){
                            if(buttons[x].bulletExpContButton != undefined){
                                if(buttons[x].state.toggle == false ) buttons[x].bulletExpContButton.click();
                            } else {
                                if(buttons[x].state.toggle == false ) buttons[x].headingExpContButton.click();
                            }
                            loopCompareCntr++;
                            if(loopCompareCntr == endPos) break;
                        }

                    }
                }

            });

            window.location.href = link;

        }

        callback();
    }

    function escapeHTMLCodeSyntax(){

        function htmlEscape(s) {
            return s
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
        }

        let codeInstances = document.getElementsByClassName("html section-illustration-highlight-syntax-code");

        for(let x = 0; x < codeInstances.length; x++){

            let escapedStr = htmlEscape(codeInstances[x].innerHTML);
            codeInstances[x].innerHTML = escapedStr;

        }

    }

    // Compensator for Silk browser
    function initAdjustTouchScreen(){

        if(!GLOBAL.flagIsTouch && !GLOBAL.flagIsSilkBrowser) return;
        
        let touchBottomAdjValue = GLOBAL.touchBottomAdjValue;

        let htmlSelector = document.querySelector("html");

        htmlSelector.style.height = "calc(100% + " + touchBottomAdjValue + "px)";
        htmlSelector.style.minHeight = "calc(100% + " + touchBottomAdjValue + "px)";

        let footerTouchExtend = document.getElementById("footerTouchExtend");
        footerTouchExtend.style.padding = Number(touchBottomAdjValue/2) + "px";

    }

})(window);

hljs.initHighlightingOnLoad();





