(function (){

    init();

    function init(){

        GLOBAL.onWindowLoadRun.push(initForm);

    }

    function initForm(){

        initFormContact();
        initFormFeedback();

    }

    function initFormContact(){

        let formContactSelectSubject = document.getElementById("formContactSelectSubject");
        let formContactSelectOptionContainer = document.getElementById("formContactSelectOptionContainer");
        let formContactFirstName = document.getElementById("formContactFirstName");
        let formContactLastName = document.getElementById("formContactLastName");
        let formContactPhone = document.getElementById("formContactPhone");
        let formContactEmail = document.getElementById("formContactEmail");
        let formContactSelectSubjectOption_1 = document.getElementById("formContactSelectSubjectOption_1");
        let formContactSelectSubjectOption_2 = document.getElementById("formContactSelectSubjectOption_2");
        let formContactSelectSubjectOption_3 = document.getElementById("formContactSelectSubjectOption_3");
        let formContactMessage = document.getElementById("formContactMessage");
        let formContactSubmit = document.getElementById("formContactSubmit");
        let formContactErrorMessage = document.getElementById("formContactErrorMessage");
        let formContactSuccessMessage = document.getElementById("formContactSuccessMessage");
        let formContactErrorOk = document.getElementById("formContactErrorOk");
        let formContactSuccessOk = document.getElementById("formContactSuccessOk");

        formContactFirstName.onfocus = function(){

            hideFieldErrorEffect(formContactFirstName);

        }

        formContactLastName.onfocus = function(){

            hideFieldErrorEffect(formContactLastName);

        }

        formContactPhone.onfocus = function(){

            hideFieldErrorEffect(formContactPhone);

        }

        formContactEmail.onfocus = function(){

            hideFieldErrorEffect(formContactEmail);

        }

        formContactSelectSubject.onfocus = function(){

            this.classList.add("form-select-field-active");
            formContactSelectOptionContainer.style.visibility = "visible";
            hideFieldErrorEffect(formContactSelectSubject);

        }

        formContactSelectSubjectOption_1.onclick = function(){

            let value = "IOport Blip Assistance";
            formContactSelectSubject.value = value;
            hideFormSelectOptionContainer();
            formSelectFieldSelected(formContactSelectSubject);

        }

        formContactSelectSubjectOption_2.onclick = function(){

            let value = "Seeking Consulting Work Services";
            formContactSelectSubject.value = value;
            hideFormSelectOptionContainer();
            formSelectFieldSelected(formContactSelectSubject);

        }

        formContactSelectSubjectOption_3.onclick = function(){

            let value = "General";
            formContactSelectSubject.value = value;
            hideFormSelectOptionContainer();
            formSelectFieldSelected(formContactSelectSubject);

        }

        formContactMessage.onfocus = function(){

            hideFieldErrorEffect(formContactMessage);
            hideFormSelectOptionContainer();
            formContactSelectSubject.classList.remove("form-select-field-active");
            showScraptchaContainer('scraptchaContainerContact');

        }

        formContactErrorOk.onclick = function(){

            formContactErrorMessage.style.visibility = "hidden";

        }

        formContactSuccessOk.onclick = function(){

            formContactSuccessMessage.style.visibility = "hidden";

            formContactFirstName.value = formContactFirstName.defaultValue;
            formContactLastName.value = formContactLastName.defaultValue;
            formContactPhone.value = formContactPhone.defaultValue;
            formContactEmail.value = formContactEmail.defaultValue;
            formContactSelectSubject.value = formContactSelectSubject.defaultValue;
            formContactMessage.value = formContactMessage.defaultValue;

        }

        function hideFormSelectOptionContainer(){

            formContactSelectOptionContainer.style.visibility = "hidden";

        }

        formContactSubmit.onmousedown = function(){

            formContactSubmit.focus();

        }

        formContactSubmit.onmouseup = function(){

            submitForm();

        }

        function submitForm(){

            let flagError = false;
            let lettersOnly = /^[A-Za-z]+$/;

            if(formContactFirstName.value.length < 2 ||
                !formContactFirstName.value.match(lettersOnly)){

                flagError = true;
                showFieldErrorEffect(formContactFirstName);

            }

            if(formContactLastName.value.length < 2 ||
            !formContactLastName.value.match(lettersOnly)){

                flagError = true;
                showFieldErrorEffect(formContactLastName);

            }

            var tmpPhone = formContactPhone.value.replace(/-/g, '');
            tmpPhone = tmpPhone.replace(/\./g, '');

            if(formContactPhone.value.length < 10 ||
            !tmpPhone.match(/^[0-9]+$/))
            {

                flagError = true;
                showFieldErrorEffect(formContactPhone);

            }

            if(!GLOBAL.emailCheck.test(formContactEmail.value) ||
                formContactEmail.value.length < 5){

                flagError = true;
                showFieldErrorEffect(formContactEmail);

            }

            if(formContactSelectSubject.value == ""){

                flagError = true;
                showFieldErrorEffect(formContactSelectSubject);

            }

            if(formContactMessage.value.length < 5){

                flagError = true;
                showFieldErrorEffect(formContactMessage);

            }

            /***** Error check *****/
            if (flagError){

                formContactErrorMessage.style.visibility = "visible";
                return;
            }

            var str = {
                formContactFirstName: formContactFirstName.value,
                formContactLastName: formContactLastName.value,
                formContactPhone: formContactPhone.value,
                formContactEmail: formContactEmail.value,
                formContactSelectSubject: formContactSelectSubject.value,
                formContactMessage: formContactMessage.value,
                scraptcha: JSON.stringify({sessId: document.getElementById('scraptchaSessionId').value,
                            reqId: document.getElementById('scraptchaRequestId').value,
                            id: document.getElementById('scraptchaId').value,
                            code: document.getElementById('scraptchaCode').value})
            };

            let url = GLOBAL.httpsURLHostname + GLOBAL.appURL + "Support/Contact/";

            sendEmailMessage(url, str, formContactSuccessMessage, "formContactLoaderContainer");

        }

    }

    function initFormFeedback(){

        let formFeedbackSelectSubject = document.getElementById("formFeedbackSelectSubject");
        let formFeedbackSelectOptionContainer = document.getElementById("formFeedbackSelectOptionContainer");
        let formFeedbackEmail = document.getElementById("formFeedbackEmail");
        let formFeedbackSelectSubjectOption_1 = document.getElementById("formFeedbackSelectSubjectOption_1");
        let formFeedbackSelectSubjectOption_2 = document.getElementById("formFeedbackSelectSubjectOption_2");
        let formFeedbackSelectSubjectOption_3 = document.getElementById("formFeedbackSelectSubjectOption_3");
        let formFeedbackSelectSubjectOption_4 = document.getElementById("formFeedbackSelectSubjectOption_4");
        let formFeedbackMessage = document.getElementById("formFeedbackMessage");
        let formFeedbackSubmit = document.getElementById("formFeedbackSubmit");
        let formFeedbackErrorMessage = document.getElementById("formFeedbackErrorMessage");
        let formFeedbackSuccessMessage = document.getElementById("formFeedbackSuccessMessage");
        let formFeedbackErrorOk = document.getElementById("formFeedbackErrorOk");
        let formFeedbackSuccessOk = document.getElementById("formFeedbackSuccessOk");

        formFeedbackEmail.onfocus = function(){

            hideFieldErrorEffect(formFeedbackEmail);

        }

        formFeedbackSelectSubject.onfocus = function(){

            this.classList.add("form-select-field-active");
            formFeedbackSelectOptionContainer.style.visibility = "visible";
            hideFieldErrorEffect(formFeedbackSelectSubject);

        }

        formFeedbackSelectSubjectOption_1.onclick = function(){

            let value = "Join IOport.com Mailing List";
            formFeedbackSelectSubject.value = value;
            hideFormSelectOptionContainer();
            formSelectFieldSelected(formFeedbackSelectSubject);

        }

        formFeedbackSelectSubjectOption_2.onclick = function(){

            let value = "IOport Blip Feature Request";
            formFeedbackSelectSubject.value = value;
            hideFormSelectOptionContainer();
            formSelectFieldSelected(formFeedbackSelectSubject);

        }

        formFeedbackSelectSubjectOption_3.onclick = function(){

            let value = "Report IOport Blip Bug";
            formFeedbackSelectSubject.value = value;
            hideFormSelectOptionContainer();
            formSelectFieldSelected(formFeedbackSelectSubject);

        }

        formFeedbackSelectSubjectOption_4.onclick = function(){

            let value = "Report IOport Blip Props";
            formFeedbackSelectSubject.value = value;
            hideFormSelectOptionContainer();
            formSelectFieldSelected(formFeedbackSelectSubject);

        }

        formFeedbackMessage.onfocus = function(){

            hideFieldErrorEffect(formFeedbackMessage);
            hideFormSelectOptionContainer();
            formFeedbackSelectSubject.classList.remove("form-select-field-active");
            showScraptchaContainer('scraptchaContainerFeedback');

        }

        formFeedbackErrorOk.onclick = function(){

            formFeedbackErrorMessage.style.visibility = "hidden";

        }

        formFeedbackSuccessOk.onclick = function(){

            formFeedbackSuccessMessage.style.visibility = "hidden";

            formFeedbackEmail.value = formFeedbackEmail.defaultValue;
            formFeedbackSelectSubject.value = formFeedbackSelectSubject.defaultValue;
            formFeedbackMessage.value = formFeedbackMessage.defaultValue;

        }

        function hideFormSelectOptionContainer(){

            formFeedbackSelectOptionContainer.style.visibility = "hidden";

        }

        formFeedbackSubmit.onmousedown = function(){

            formFeedbackSubmit.focus();

        }

        formFeedbackSubmit.onmouseup = function(){

            submitForm();

        }

        function submitForm(){

            let flagError = false;

            if(!GLOBAL.emailCheck.test(formFeedbackEmail.value) ||
                formFeedbackEmail.value.length < 5){

                flagError = true;
                showFieldErrorEffect(formFeedbackEmail);

            }

            if(formFeedbackSelectSubject.value == ""){

                flagError = true;
                showFieldErrorEffect(formFeedbackSelectSubject);

            }

            if(formFeedbackMessage.value.length < 5){

                flagError = true;
                showFieldErrorEffect(formFeedbackMessage);

            }

            /***** Error check *****/
            if (flagError){

                formFeedbackErrorMessage.style.visibility = "visible";
                return;
            }

            var str = {
                formFeedbackEmail: formFeedbackEmail.value,
                formFeedbackSelectSubject: formFeedbackSelectSubject.value,
                formFeedbackMessage: formFeedbackMessage.value,
                scraptcha: JSON.stringify({sessId: document.getElementById('scraptchaSessionId').value,
                    reqId: document.getElementById('scraptchaRequestId').value,
                    id: document.getElementById('scraptchaId').value,
                    code: document.getElementById('scraptchaCode').value})
            };

            let url = GLOBAL.httpsURLHostname + GLOBAL.appURL + "Support/Feedback/";

            sendEmailMessage(url, str, formFeedbackSuccessMessage, "formFeedbackLoaderContainer");

        }

    }

    function sendEmailMessage(url, messageString = {}, successMessageObj, loaderContainerIdName){

        let comm = GLOBAL.utility.commXmlHttp();

        comm.setUrl(url + encodeURIComponent(JSON.stringify(messageString)));

        comm.setResTarget(null, loaderContainerIdName);

        comm.setPostResFunc(function(){

            let results = JSON.parse(this.responseData);
            let scraptchaRequestId = document.getElementById("scraptchaRequestId");
            scraptchaRequestId.value = results.reqId;

            if(results.error){

                if(results.data == '#e007'){
                    let scraptchaCode = document.getElementById('scraptchaCode');
                    showFieldErrorEffect(scraptchaCode);

                    if(loaderContainerIdName == "formContactLoaderContainer"){
                        formContactErrorMessage.style.visibility = "visible";
                    } else {
                        formFeedbackErrorMessage.style.visibility = "visible";
                    }

                    scraptchaCode.onfocus = function(){

                        hideFieldErrorEffect(scraptchaCode);

                    }
                } else {
                    GLOBAL.utility.displayError('Error: ' + this.responseData);
                }

                return;
            }

            successMessageObj.style.visibility = "visible";

        });

        comm.sendHttpGet();

    }

    let flagInitialContactInit = false;
    let flagInitialFeedbackInit = false;

    function showScraptchaContainer(id){

        let scraptchaContainerContact = document.getElementById('scraptchaContainerContact');
        let scraptchaContainerFeedback = document.getElementById('scraptchaContainerFeedback');
        scraptchaRefresh = document.getElementById("scraptchaRefresh");        

        if(id == scraptchaContainerContact.id){

            scraptchaContainerContact.style.display = "block";

            if(scraptchaContainerFeedback.innerHTML == '') return scraptchaRefresh.click();

            scraptchaContainerContact.innerHTML = scraptchaContainerFeedback.innerHTML;
            scraptchaContainerFeedback.innerHTML = '';
            GLOBAL.utility.scraptcha.init();
            if(!flagInitialContactInit) {
                flagInitialContactInit = true;
                setTimeout(function(){scraptchaRefresh.click()},1000); 
            }
            
        } else {

            scraptchaContainerFeedback.style.display = "block";

            if(scraptchaContainerContact.innerHTML == '') return scraptchaRefresh.click();

            scraptchaContainerFeedback.innerHTML = scraptchaContainerContact.innerHTML;
            scraptchaContainerContact.innerHTML = '';
            GLOBAL.utility.scraptcha.init();
            if(!flagInitialFeedbackInit) {
                flagInitialFeedbackInit = true;
                setTimeout(function(){scraptchaRefresh.click()},1000); 
            }
        }

    }

    function formSelectFieldSelected(obj){

        obj.classList.remove("form-select-field-active");
        obj.classList.add("form-select-field-selected");

    }

    function showFieldErrorEffect(obj){

        obj.classList.add("form-field-error");

    }

    function hideFieldErrorEffect(obj){

        obj.classList.remove("form-field-error");

    }

})(window);