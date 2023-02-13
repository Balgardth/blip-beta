"use strict";

function init(blip, siteDock) {

    if(siteDock.svar.serverSslIp !== undefined && siteDock.svar.serverSslIp !== ''){

        siteDock.server.httpsApp.use(function (req, res, next) {

            if(siteDock.svar.siteDomainSecure === undefined) return;

            let hostAndDomain = req.headers.host;

            try{

                if(req.headers != undefined && siteDock.svar.flagForceSiteDomainSecure){

                    let flagHostExists = false;

                    for(let x = 0; x < siteDock.svar.hostsSsl.length; x++){

                        let addPeriod = (siteDock.svar.hostsSsl[x] != '') ? '.' : '';

                        if( addPeriod == '' && hostAndDomain.split(/\./).length >= 2 ){

                            break;

                        } else if(hostAndDomain.indexOf(siteDock.svar.hostsSsl[x] + addPeriod +
                        siteDock.svar.domainNameSsl) != -1) {

                            flagHostExists = true;
                            break;

                        }

                    }

                    if(!flagHostExists) {
                        return res.redirect(siteDock.svar.fullAppRootUrlSecure + req.url.slice(1,req.url.length));
                    };
                }

            } catch(err) {

                blip.server.loggerErr("Error: Secure domain host error. " + err);
                return;

            }

            next();

        });

    }

    if(siteDock.svar.serverIp !== undefined && siteDock.svar.serverIp !== ''){

        siteDock.server.httpApp.use(function (req, res, next) {

            if(siteDock.svar.siteDomain === undefined) return;

            let hostAndDomain = req.headers.host;

            try{

                if(req.headers != undefined && siteDock.svar.flagForceSiteDomain){

                    let flagHostExists = false;

                    for(let x = 0; x < siteDock.svar.hosts.length; x++){

                        let addPeriod = (siteDock.svar.hosts[x] != '') ? '.' : '';

                        if( addPeriod == '' && hostAndDomain.split(/\./).length >= 2 ){

                            break;

                        } else if(hostAndDomain.indexOf(siteDock.svar.hosts[x] + addPeriod +
                        siteDock.svar.domainName) != -1) {

                            flagHostExists = true;
                            break;

                        }

                    }

                    if(!flagHostExists) {
                        return res.redirect(siteDock.svar.fullAppRootUrl + req.url.slice(1,req.url.length));
                    };
                }

            } catch(err) {

                blip.server.loggerErr("Error: Domain host error. " + err);
                return;

            }

            next();

        });

    }

    /********************
     *  Redirect Examples
     ********************/
    siteDock.server.httpApp.get('/Products/Blip/Support', function (req, res) {

        res.redirect(siteDock.svar.fullAppRootUrlSecure + siteDock.url.pageAssistance.slice(1,req.url.length));

    });

    siteDock.server.httpApp.get('/Products/Blip', function (req, res) {

        res.redirect(siteDock.svar.fullAppRootUrl);

    });
    
}


module.exports.init = init;