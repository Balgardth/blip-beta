
/**
 * Trigger an event before leaving the page.
 * 
 * Note: Preventing page caching can also be a solution.
 */

(function (){

    window.onload = function(){

      
      //This works!!!!!!!!!!!!!!!!
      window.onbeforeunload=function(e){

        
        console.log("popstate:==================================================================================================================================== ");


      }


      //This works!!!!!!!!!!!!!!!!
      window.addEventListener('beforeunload', function (e){

        e.returnValue = '';
        e.preventDefault();
        console.log("popstate:==================================================================================================================================== ");


      });

            

    }    

   
    
})(window, document);



