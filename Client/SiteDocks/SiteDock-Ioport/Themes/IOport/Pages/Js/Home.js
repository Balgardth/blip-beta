(function (){

    window.onload = function(){

        init();

    }    

    function init(){

        GLOBAL.onWindowLoadFunc(function(){/*<add code>*/});
        
        initButtons();
        
    }

    function initButtons(){

        document.getElementById("buttonTemplateEngine").onclick = function(){

            window.location.href = GLOBAL.httpURLHostname + GLOBAL.appURL + "Documentation#ss_TemplateEngineFH";

        }

        document.getElementById("buttonStyleThemes").onclick = function(){

            window.location.href = GLOBAL.httpURLHostname + GLOBAL.appURL + "Documentation#cs_Assets_DirectoryTree_ThemesFH";

        }

    }
    
})(window);

