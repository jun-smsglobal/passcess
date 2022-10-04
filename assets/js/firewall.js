var sett = new Vue({
el: '#sett',
data: {
  vesselSetting : {vesselID: "", fleetID: "", partnerID: ""},
  showRulesModal: false,
  chckRule : false,
  chckLevel : false,
  showAddModal: false,
  showRemoveModal: false,
  showApplyModal: false,
  newRules: {cFacebook:0,cWhatsApp:0,cViber:0,cLine:0,cInsta:0,cWechat:0,cTwitter:0,cTikTok:0,cYoutube:0},
  settings: [],
  currSetting: {},
  oldSetting: {},
  btnShow: true,
  btnAppShow: true,
  currFacebook: {},
  currWhatsApp: {},
  currViber: {},
  currLine: {},
  currInsta: {},
  currWechat: {},
  currTwitter: {},
  currTikTok: {},
  currYoutube: {},
  currDefault: {},
  btnShowFB: true,
  btnShowWA: true,
  btnShowViber: true,
  btnShowLine: true,
  btnShowInsta: true,
  btnShowWeChat: true,
  btnShowTwit: true,
  btnShowTiktok: true,
  btnShowYTube: true,
  strMsg: "",
  strMsgNote: "",
  retProc: 0,
  defaultData: {firewall:"", domainfiltering:"", appsettings:[] },
  currRules: {appname:"", apprules:"", appdomains:"", appfeatures:"", appruleenabled:""},
  optFleet: [{ text: '', value: '' }],
  optVess: [{ text: '', value: '' }],
  privilage : {userrights : null, useraccess : null, TokenKey : null}
},
mounted: function(){
  this.processPrivilage();
  // this.getFleet();
  this.getVessel();
  setTimeout(() => { this.getAllSetting(); }, 200);
},
methods: {
  getAllSetting(){
    this.currFacebook = {};
    this.currWhatsApp = {};
    this.currViber = {};
    this.currLine = {};
    this.currInsta = {};
    this.currWechat = {};
    this.currTwitter = {};
    this.currTikTok = {};
    this.currYoutube = {};
    axios
      .get(serverurl + "apprules/" + this.vesselSetting.vesselID)
      .then(function(response){
        sett.settings = response.data;
        window.localStorage.setItem('AdvSett', JSON.stringify(sett.settings));

        if( (JSON.stringify(response.data.appsettings) != "") || (JSON.stringify(response.data.appsettings) != []) ){
          sett.currFacebook = sett.checkApp('Facebook');
          sett.currWhatsApp = sett.checkApp('WhatsApp');
          sett.currViber = sett.checkApp('Viber');
          sett.currLine = sett.checkApp('Line');
          sett.currInsta = sett.checkApp('Instagram');
          sett.currWechat = sett.checkApp('Wechat');
          sett.currTwitter = sett.checkApp('Twitter');
          sett.currTikTok = sett.checkApp('TikTok');
          sett.currYoutube = sett.checkApp('Youtube');
          sett.currDefault = sett.checkApp('defaults');

          // console.log(JSON.stringify(sett.currFacebook));
        };
        // sett.checkRules();
        sett.showApps();
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        sett.showApps();
      }) ;
    this.checkUser();
  },
  // getFleet(){
  //   axios
  //     .get(localurl + "vessel.php?action=getvessel&proc=12&id=" + this.vesselSetting.partnerID)
  //     .then(function(response){
  //       if(!response.data.error){
  //         sett.optFleet = response.data.vessel;
  //       } else {
  //         console.log(JSON.stringify(response.data.message));
  //       }
  //     })
  //     .catch(function(error){
  //       console.log(JSON.stringify(error.message));
  //       sett.optFleet = [{ text: '', value: '' }];
  //     });
  // },
  getVessel(){
    var strURL = "";
    if(this.privilage.userrights == '1'){
      strURL = localurl + "vessel.php?action=getvessel&proc=1&id=0";
    } else {
      strURL = localurl + "vessel.php?action=getvessel&proc=1&id=" + this.vesselSetting.partnerID;
    }

    axios
      // .get(localurl + "vessel.php?action=getvessel&proc=1&id=0")
      .get(strURL)
      .then(function(response){
        if(!response.data.error){
          sett.optVess = response.data.vessel;
          if (sett.vesselSetting.vesselID == ""){
            sett.vesselSetting.vesselID = sett.optVess[0].value;
            window.localStorage.setItem('vesselID', sett.optVess[0].value);
          };
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        sett.optVess = [{ text: '', value: '' }];
      });
  },
  processPrivilage(){
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');

    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
    this.privilage.TokenKey = window.localStorage.getItem('tokenKey');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  updateAdvSettings(){
    // var finalData = sett.defaultData;
    // finalData['firewall'] = sett.settings.firewall;
    // finalData['domainfiltering'] = sett.settings.domainfiltering;
    // finalData['appsettings'].push(sett.currDefault);
    // finalData['appsettings'].push(sett.currFacebook);
    // finalData['appsettings'].push(sett.currWhatsApp);
    // finalData['appsettings'].push(sett.currViber);
    // finalData['appsettings'].push(sett.currLine);
    // finalData['appsettings'].push(sett.currInsta);
    // finalData['appsettings'].push(sett.currWechat);
    // finalData['appsettings'].push(sett.currTwitter);
    // finalData['appsettings'].push(sett.currTikTok);
    // finalData['appsettings'].push(sett.currYoutube);
    //

    // console.log(JSON.stringify(sett.currSetting));

    sett.oldSetting = window.localStorage.getItem('AdvSett');
    axios
      .put(serverurl + "apprules/" + this.vesselSetting.vesselID, sett.currSetting)
      .then(function(response){
        // console.log(response.data);
        // sett.getAllSetting();
        sett.settings = response.data;

        addLogUpdate(window.localStorage.getItem('supportUser'), sett.oldSetting, sett.settings);
        removeData();
        hasChanged = false;
        swal("", "Successfully updated", "success");
        sett.showApps();
      })
      .catch(function(error){
        if(error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.config);
        }
        console.log(JSON.stringify(error.message));
      }) ;
      sett.currSetting = "";
  },
  selectAdvSettings(settdata){
    sett.currSetting = settdata;
  },
  changeVesselID(event){
    // console.log(this.vesselSetting.vesselID);
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    this.getAllSetting();
  },
  checkUser(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      this.btnShow = true;
      this.chckRule = false;
    } else {
      this.btnShow = false;
      this.chckRule = true;
    }
  },
  // checkRules(){
  //   if (sett.settings.domainfiltering == "allowall"){
  //     sett.chckRule = true;
  //     this.updateAppRules();
  //   } else {
  //     if (sett.settings.appsettings[0].appruleenabled == 0){
  //       sett.settings.appsettings[0].appruleenabled = 1;
  //     }
  //     sett.chckRule = false;
  //   };
  // },
  // updateAppRules(){
  //   for(var i = 0; i < sett.settings.appsettings.length; i++) {
  //     if (sett.settings.appsettings[i].appruleenabled == 1){
  //       sett.settings.appsettings[i].appruleenabled = 0;
  //     }
  //   }
  // },
  checkApp(strName){
    var results = [];
    var dataObj = sett.settings.appsettings;
    results = dataObj.filter(function(item){
                return item.appname == strName;
              });
    // console.log(JSON.stringify(results));
    return results;
  },
  checkAppRule(varProc, a, data){
    switch (varProc) {
      case 1: // facebook
        if (data == 1){
          for(var i = 0; i <= a; i++) {
            sett.currFacebook[i].appruleenabled = 1;
          }
        } else if((data == 0) && (a == 0)){
          for(var i = 0; i <= (sett.currFacebook.length - 1); i++) {
            sett.currFacebook[i].appruleenabled = 0;
          }
        }

        if(sett.showHideApp(sett.currFacebook) == 0){
          sett.msgConfirm("Facebook & FB Messenger", varProc);
        }
        break;
      case 2: // WhatsApp
        if (data == 1){
          for(var i = 0; i <= a; i++) {
            sett.currWhatsApp[i].appruleenabled = 1;
          }
        } else if((data == 0) && (a == 0)){
          for(var i = 0; i <= (sett.currWhatsApp.length - 1); i++) {
            sett.currWhatsApp[i].appruleenabled = 0;
          }
        }

        if(sett.showHideApp(sett.currWhatsApp) == 0){
          sett.msgConfirm("WhatsApp", varProc);
        }
        break;
      case 3: // Viber
        if (data == 1){
          for(var i = 0; i <= a; i++) {
            sett.currViber[i].appruleenabled = 1;
          }
        } else if((data == 0) && (a == 0)){
          for(var i = 0; i <= (sett.currViber.length - 1); i++) {
            sett.currViber[i].appruleenabled = 0;
          }
        }

        if(sett.showHideApp(sett.currViber) == 0){
          sett.msgConfirm("Viber", varProc);
        }
        break;
      case 4: // Line
        if (data == 1){
          for(var i = 0; i <= a; i++) {
            sett.currLine[i].appruleenabled = 1;
          }
        } else if((data == 0) && (a == 0)){
          for(var i = 0; i <= (sett.currLine.length - 1); i++) {
            sett.currLine[i].appruleenabled = 0;
          }
        }

        if(sett.showHideApp(sett.currLine) == 0){
          sett.msgConfirm("Line", varProc);
        }
        break;
      case 5: // Instagram
        if (data == 1){
          for(var i = 0; i <= a; i++) {
            sett.currInsta[i].appruleenabled = 1;
          }
        } else if((data == 0) && (a == 0)){
          for(var i = 0; i <= (sett.currInsta.length - 1); i++) {
            sett.currInsta[i].appruleenabled = 0;
          }
        }

        if(sett.showHideApp(sett.currInsta) == 0){
          sett.msgConfirm("Instagram", varProc);
        }
        break;
      case 6: // WeChat
        if (data == 1){
          for(var i = 0; i <= a; i++) {
            sett.currWechat[i].appruleenabled = 1;
          }
        } else if((data == 0) && (a == 0)){
          for(var i = 0; i <= (sett.currWechat.length - 1); i++) {
            sett.currWechat[i].appruleenabled = 0;
          }
        }

        if(sett.showHideApp(sett.currWechat) == 0){
          sett.msgConfirm("Wechat", varProc);
        }
        break;
      case 7: // Twitter
        if (data == 1){
          for(var i = 0; i <= a; i++) {
            sett.currTwitter[i].appruleenabled = 1;
          }
        } else if((data == 0) && (a == 0)){
          for(var i = 0; i <= (sett.currTwitter.length - 1); i++) {
            sett.currTwitter[i].appruleenabled = 0;
          }
        }

        if(sett.showHideApp(sett.currTwitter) == 0){
          sett.msgConfirm("Twitter", varProc);
        }
        break;
      case 8: // TikTok
        if (data == 1){
          for(var i = 0; i <= a; i++) {
            sett.currTikTok[i].appruleenabled = 1;
          }
        } else if((data == 0) && (a == 0)){
          for(var i = 0; i <= (sett.currTikTok.length - 1); i++) {
            sett.currTikTok[i].appruleenabled = 0;
          }
        }

        if(sett.showHideApp(sett.currTikTok) == 0){
          sett.msgConfirm("TikTok", varProc);
        }
        break;
      case 9: // Youtube
        if (data == 1){
          for(var i = 0; i <= a; i++) {
            sett.currYoutube[i].appruleenabled = 1;
          }
        } else if((data == 0) && (a == 0)){
          for(var i = 0; i <= (sett.currYoutube.length - 1); i++) {
            sett.currYoutube[i].appruleenabled = 0;
          }
        }

        if(sett.showHideApp(sett.currYoutube) == 0){
          sett.msgConfirm("Youtube", varProc);
        }
        break;
      default:
      }
  },
  msgConfirm(msg, vProc){
    sett.retProc = vProc;
    sett.strMsg = "This action will remove the  " + msg + "  in the firewall";
    $('#myModalMessage').modal('show').off('click');
  },
  HideModal(){
    $('#myModalMessage').modal('hide');
  },
  returnApp(){
    sett.HideModal();
    switch (sett.retProc) {
      case 1: // facebook
        sett.currFacebook[0].appruleenabled = 1;
        break;
      case 2: // WhatsApp
        sett.currWhatsApp[0].appruleenabled = 1;
        break;
      case 3: // Viber
        sett.currViber[0].appruleenabled = 1;
        break;
      case 4: // Line
        sett.currLine[0].appruleenabled = 1;
        break;
      case 5: // Instagram
        sett.currInsta[0].appruleenabled = 1;
        break;
      case 6: // WeChat
        sett.currWechat[0].appruleenabled = 1;
        break;
      case 7: // Twitter
        sett.currTwitter[0].appruleenabled = 1;
        break;
      case 8: // TikTok
        sett.currTikTok[0].appruleenabled = 1;
        break;
      case 9: // Youtube
        sett.currYoutube[0].appruleenabled = 1;
        break;
      default:
      }
    sett.showApps();
  },
  showApps(){
    if(sett.showHideApp(sett.currFacebook) == 0){
      sett.currFacebook = {}
    }
    if(sett.showHideApp(sett.currWhatsApp) == 0){
      sett.currWhatsApp = {}
    }
    if(sett.showHideApp(sett.currViber) == 0){
      sett.currViber = {}
    }
    if(sett.showHideApp(sett.currLine) == 0){
      sett.currLine = {}
    }
    if(sett.showHideApp(sett.currInsta) == 0){
      sett.currInsta = {}
    }
    if(sett.showHideApp(sett.currWechat) == 0){
      sett.currWechat = {}
    }
    if(sett.showHideApp(sett.currTwitter) == 0){
      sett.currTwitter = {}
    }
    if(sett.showHideApp(sett.currTikTok) == 0){
      sett.currTikTok = {}
    }
    if(sett.showHideApp(sett.currYoutube) == 0){
      sett.currYoutube = {}
    }

    if( (JSON.stringify(sett.currFacebook) == "{}") || (JSON.stringify(sett.currFacebook) == "") ){
      document.getElementById("FBApp").style.display = "none";
    } else {
      document.getElementById("FBApp").style.display = "block";
    };
    if( (JSON.stringify(sett.currWhatsApp) == "{}") || (JSON.stringify(sett.currWhatsApp) == "") ){
      document.getElementById("WhatsAppApp").style.display = "none";
    } else {
      document.getElementById("WhatsAppApp").style.display = "block";
    };
    if( (JSON.stringify(sett.currViber) == "{}") || (JSON.stringify(sett.currViber) == "") ){
      document.getElementById("ViberApp").style.display = "none";
    } else {
      document.getElementById("ViberApp").style.display = "block";
    };
    if( (JSON.stringify(sett.currLine) == "{}") || (JSON.stringify(sett.currLine) == "") ){
      document.getElementById("LineApp").style.display = "none";
    } else {
      document.getElementById("LineApp").style.display = "block";
    };
    if( (JSON.stringify(sett.currInsta) == "{}") || (JSON.stringify(sett.currInsta) == "") ){
      document.getElementById("InstaApp").style.display = "none";
    } else {
      document.getElementById("InstaApp").style.display = "block";
    };
    if( (JSON.stringify(sett.currWechat) == "{}") || (JSON.stringify(sett.currWechat) == "") ){
      document.getElementById("WeChatApp").style.display = "none";
    } else {
      document.getElementById("WeChatApp").style.display = "block";
    };
    if( (JSON.stringify(sett.currTwitter) == "{}") || (JSON.stringify(sett.currTwitter) == "") ){
      document.getElementById("TwitterApp").style.display = "none";
    } else {
      document.getElementById("TwitterApp").style.display = "block";
    };
    if( (JSON.stringify(sett.currTikTok) == "{}") || (JSON.stringify(sett.currTikTok) == "") ){
      document.getElementById("TikTokApp").style.display = "none";
    } else {
      document.getElementById("TikTokApp").style.display = "block";
    };
    if( (JSON.stringify(sett.currYoutube) == "{}") || (JSON.stringify(sett.currYoutube) == "") ){
      document.getElementById("YoutubeApp").style.display = "none";
    } else {
      document.getElementById("YoutubeApp").style.display = "block";
    };

  },
  showHideApp(varObj){
    var varRes = 0
    for(var i = 0; i <= (varObj.length - 1); i++) {
      if(varObj[i].appruleenabled == 1){
        varRes += 1;
      };
    }
    return varRes;
  },
  AddAppRule(){
    if(sett.newRules.cFacebook == 1){
      sett.currFacebook = sett.checkApp('Facebook');
      sett.currFacebook[0].appruleenabled = 1;
    } else {
      sett.changeAppValue(sett.currFacebook, 0)
    };

    if(sett.newRules.cWhatsApp == 1){
      sett.currWhatsApp = sett.checkApp('WhatsApp');
      sett.currWhatsApp[0].appruleenabled = 1;
    } else {
      sett.changeAppValue(sett.currWhatsApp, 0)
    };

    if(sett.newRules.cViber == 1){
      sett.currViber = sett.checkApp('Viber');
      sett.currViber[0].appruleenabled = 1;
    } else {
      sett.changeAppValue(sett.currViber, 0)
    };

    if(sett.newRules.cLine == 1){
      sett.currLine = sett.checkApp('Line');
      sett.currLine[0].appruleenabled = 1;
    } else {
      sett.changeAppValue(sett.currLine, 0)
    };

    if(sett.newRules.cInsta == 1){
      sett.currInsta = sett.checkApp('Instagram');
      sett.currInsta[0].appruleenabled = 1;
    } else {
      sett.changeAppValue(sett.currInsta, 0)
    };

    if(sett.newRules.cWechat == 1){
      sett.currWechat = sett.checkApp('Wechat');
      sett.currWechat[0].appruleenabled = 1;
    } else {
      sett.changeAppValue(sett.currWechat, 0)
    };

    if(sett.newRules.cTwitter == 1){
      sett.currTwitter = sett.checkApp('Twitter');
      sett.currTwitter[0].appruleenabled = 1;
    } else {
      sett.changeAppValue(sett.currTwitter, 0)
    };

    if(sett.newRules.cTikTok == 1){
      sett.currTikTok = sett.checkApp('TikTok');
      sett.currTikTok[0].appruleenabled = 1;
    } else {
      sett.changeAppValue(sett.currTikTok, 0)
    };

    if(sett.newRules.cYoutube == 1){
      sett.currYoutube = sett.checkApp('Youtube');
      sett.currYoutube[0].appruleenabled = 1;
    } else {
      sett.changeAppValue(sett.currYoutube, 0)
    };

    sett.showApps();
  },
  changeAppValue(varObj, vValue){
    for(var i = 0; i <= (varObj.length - 1); i++) {
      varObj[i].appruleenabled = vValue;
    }
  },
  setDefaultValue(proc){
    // add application
    if(proc == "1"){
      if( (JSON.stringify(sett.currFacebook) == "{}") || (JSON.stringify(sett.currFacebook) == "") ){
        sett.btnShowFB = true
        sett.newRules.cFacebook = 0;
      } else {
        sett.btnShowFB = false
        sett.newRules.cFacebook = 1;
      };
      if( (JSON.stringify(sett.currWhatsApp) == "{}") || (JSON.stringify(sett.currWhatsApp) == "") ){
        sett.btnShowWA = true
        sett.newRules.cWhatsApp = 0;
      } else {
        sett.btnShowWA = false
        sett.newRules.cWhatsApp = 1;
      };
      if( (JSON.stringify(sett.currViber) == "{}") || (JSON.stringify(sett.currViber) == "") ){
        sett.btnShowViber = true
        sett.newRules.cViber = 0;
      } else {
        sett.btnShowViber = false
        sett.newRules.cViber = 1;
      };
      if( (JSON.stringify(sett.currLine) == "{}") || (JSON.stringify(sett.currLine) == "") ){
        sett.btnShowLine = true
        sett.newRules.cLine = 0;
      } else {
        sett.btnShowLine = false
        sett.newRules.cLine = 1;
      };
      if( (JSON.stringify(sett.currInsta) == "{}") || (JSON.stringify(sett.currInsta) == "") ){
        sett.btnShowInsta = true
        sett.newRules.cInsta = 0;
      } else {
        sett.btnShowInsta = false
        sett.newRules.cInsta = 1;
      };
      if( (JSON.stringify(sett.currWechat) == "{}") || (JSON.stringify(sett.currWechat) == "") ){
        sett.btnShowWeChat = true
        sett.newRules.cWechat = 0;
      } else {
        sett.btnShowWeChat = false
        sett.newRules.cWechat = 1;
      };
      if( (JSON.stringify(sett.currTwitter) == "{}") || (JSON.stringify(sett.currTwitter) == "") ){
        sett.btnShowTwit = true
        sett.newRules.cTwitter = 0;
      } else {
        sett.btnShowTwit = false
        sett.newRules.cTwitter = 1;
      };
      if( (JSON.stringify(sett.currTikTok) == "{}") || (JSON.stringify(sett.currTikTok) == "") ){
        sett.btnShowTiktok = true
        sett.newRules.cTikTok = 0;
      } else {
        sett.btnShowTiktok = false
        sett.newRules.cTikTok = 1;
      };
      if( (JSON.stringify(sett.currYoutube) == "{}") || (JSON.stringify(sett.currYoutube) == "") ){
        sett.btnShowYTube = true
        sett.newRules.cYoutube = 0;
      } else {
        sett.btnShowYTube = false
        sett.newRules.cYoutube = 1;
      };
    // remove application
    } else {
      if( (JSON.stringify(sett.currFacebook) == "{}") || (JSON.stringify(sett.currFacebook) == "") ){
        sett.btnShowFB = false
        sett.newRules.cFacebook = 0;
      } else {
        sett.btnShowFB = true
        sett.newRules.cFacebook = 1;
      };
      if( (JSON.stringify(sett.currWhatsApp) == "{}") || (JSON.stringify(sett.currWhatsApp) == "") ){
        sett.btnShowWA = false
        sett.newRules.cWhatsApp = 0;
      } else {
        sett.btnShowWA = true
        sett.newRules.cWhatsApp = 1;
      };
      if( (JSON.stringify(sett.currViber) == "{}") || (JSON.stringify(sett.currViber) == "") ){
        sett.btnShowViber = false
        sett.newRules.cViber = 0;
      } else {
        sett.btnShowViber = true
        sett.newRules.cViber = 1;
      };
      if( (JSON.stringify(sett.currLine) == "{}") || (JSON.stringify(sett.currLine) == "") ){
        sett.btnShowLine = false
        sett.newRules.cLine = 0;
      } else {
        sett.btnShowLine = true
        sett.newRules.cLine = 1;
      };
      if( (JSON.stringify(sett.currInsta) == "{}") || (JSON.stringify(sett.currInsta) == "") ){
        sett.btnShowInsta = false
        sett.newRules.cInsta = 0;
      } else {
        sett.btnShowInsta = true
        sett.newRules.cInsta = 1;
      };
      if( (JSON.stringify(sett.currWechat) == "{}") || (JSON.stringify(sett.currWechat) == "") ){
        sett.btnShowWeChat = false
        sett.newRules.cWechat = 0;
      } else {
        sett.btnShowWeChat = true
        sett.newRules.cWechat = 1;
      };
      if( (JSON.stringify(sett.currTwitter) == "{}") || (JSON.stringify(sett.currTwitter) == "") ){
        sett.btnShowTwit = false
        sett.newRules.cTwitter = 0;
      } else {
        sett.btnShowTwit = true
        sett.newRules.cTwitter = 1;
      };
      if( (JSON.stringify(sett.currTikTok) == "{}") || (JSON.stringify(sett.currTikTok) == "") ){
        sett.btnShowTiktok = false
        sett.newRules.cTikTok = 0;
      } else {
        sett.btnShowTiktok = true
        sett.newRules.cTikTok = 1;
      };
      if( (JSON.stringify(sett.currYoutube) == "{}") || (JSON.stringify(sett.currYoutube) == "") ){
        sett.btnShowYTube = false
        sett.newRules.cYoutube = 0;
      } else {
        sett.btnShowYTube = true
        sett.newRules.cYoutube = 1;
      };
    };
  },
  setFocusModal(proc){
    sett.btnAppShow = true;
    if(proc == '1'){
      $('body').on('shown.bs.modal', '#myModalAddApp', function () {
          $('input:visible:enabled:first', this).focus();
          $('.modal-dialog').draggable({
            handle: ".modal-header"
          });
      })
    } else if(proc == '2') {
      $('body').on('shown.bs.modal', '#myModalRemoveApp', function () {
          $('input:visible:enabled:first', this).focus();
          $('.modal-dialog').draggable({
            handle: ".modal-header"
          });
      })
    }
  },
  btnCheckConfirm(proc){

    if(proc == '1'){
      sett.btnAppShow = true;
      if( (JSON.stringify(sett.currFacebook) == "{}") || (JSON.stringify(sett.currFacebook) == "") ){
        if(sett.newRules.cFacebook == 1){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currWhatsApp) == "{}") || (JSON.stringify(sett.currWhatsApp) == "") ){
        if(sett.newRules.cWhatsApp == 1){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currViber) == "{}") || (JSON.stringify(sett.currViber) == "") ){
        if(sett.newRules.cViber == 1){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currLine) == "{}") || (JSON.stringify(sett.currLine) == "") ){
        if(sett.newRules.cLine == 1){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currInsta) == "{}") || (JSON.stringify(sett.currInsta) == "") ){
        if(sett.newRules.cInsta == 1){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currWechat) == "{}") || (JSON.stringify(sett.currWechat) == "") ){
        if(sett.newRules.cWechat == 1){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currTwitter) == "{}") || (JSON.stringify(sett.currTwitter) == "") ){
        if(sett.newRules.cTwitter == 1){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currTikTok) == "{}") || (JSON.stringify(sett.currTikTok) == "") ){
        if(sett.newRules.cTikTok == 1){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currYoutube) == "{}") || (JSON.stringify(sett.currYoutube) == "") ){
        if(sett.newRules.cYoutube == 1){ sett.btnAppShow = false; }
      };

    } else if(proc == '2') {
      sett.btnAppShow = true;
      if( (JSON.stringify(sett.currFacebook) != "{}") && (JSON.stringify(sett.currFacebook) != "") ){
        if(sett.newRules.cFacebook == 0){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currWhatsApp) != "{}") && (JSON.stringify(sett.currWhatsApp) != "") ){
        if(sett.newRules.cWhatsApp == 0){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currViber) != "{}") && (JSON.stringify(sett.currViber) != "") ){
        if(sett.newRules.cViber == 0){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currLine) != "{}") && (JSON.stringify(sett.currLine) != "") ){
        if(sett.newRules.cLine == 0){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currInsta) != "{}") && (JSON.stringify(sett.currInsta) != "") ){
        if(sett.newRules.cInsta == 0){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currWechat) != "{}") && (JSON.stringify(sett.currWechat) != "") ){
        if(sett.newRules.cWechat == 0){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currTwitter) != "{}") && (JSON.stringify(sett.currTwitter) != "") ){
        if(sett.newRules.cTwitter == 0){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currTikTok) != "{}") && (JSON.stringify(sett.currTikTok) != "") ){
        if(sett.newRules.cTikTok == 0){ sett.btnAppShow = false; }
      };
      if( (JSON.stringify(sett.currYoutube) != "{}") && (JSON.stringify(sett.currYoutube) != "") ){
        if(sett.newRules.cYoutube == 0){ sett.btnAppShow = false; }
      };

    };
  },

}
});
