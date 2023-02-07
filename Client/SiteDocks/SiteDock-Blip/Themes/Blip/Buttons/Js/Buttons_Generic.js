(function (){

    init();

    function init(){

        GLOBAL.onWindowLoadRun.push(addButtonGenericTouch);

    }

    function addButtonGenericTouch(){

        if(GLOBAL.flagIsTouch) GLOBAL.utility.addCssFileTouch("/Assets/Themes/"+ GLOBAL.themeNames.blip + "/Buttons/Css/Buttons_Generic_Touch.css");

    }

})();