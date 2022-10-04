// var serverurl = "http://ec2-54-254-214-241.ap-southeast-1.compute.amazonaws.com/api/";
var serverurl = "https://api.passcess.net/api/";

// var localurl = "https://passcess.net/assets/api/";
var localurl = "http://localhost/passcess/assets/api/";

var localPrint = "https://passcess.net/mpdf/";
// var localPrint = "http://localhost/mpdftest/";

var localISP = new Array();
var hasChanged = false;

var IDLE_TIMEOUT = 15 * 60; //seconds
var _localStorageKey = 'global_countdown';
var _idleSecondsTimer = null;
var _lastResetTimeStamp = (new Date()).getTime();
var _localStorage = null;

function checkPrivilage(strProc){
  if (window.localStorage.getItem('userRights') == 0){
      window.localStorage.clear();
      // swal("Error", "Unauthorize access", "error");
      setTimeout(() => { window.location = "index.html"; }, 500);
  } else {
  switch (strProc) {
    case 1:
      window.localStorage.setItem('pageid', "vesselmngt");
      setTimeout(() => { window.location = "network.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "network.html");
      break;
    case 2:
      window.localStorage.setItem('pageid', "vesselmngt");
      setTimeout(() => { window.location = "firewall.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "firewall.html");
      break;
    case 3:
      window.localStorage.setItem('pageid', "vesselmngt");
      setTimeout(() => { window.location = "voyage.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "voyage.html");
      break;
    case 4:
      // if(window.localStorage.getItem('userRights') <= 3){
      //   window.localStorage.setItem('pageid', "othermngt");
      //   setTimeout(() => { window.location = "apprule.html"; }, 500);
      //   addLog(window.localStorage.getItem('supportUser'), "apprule.html");
      // } else {
      //   swal("Warning", "Please contact your system administrator.", "warning");
      //   setTimeout(() => { window.location.reload(); }, 500);
      // }
      break;
    case 5:
      window.localStorage.setItem('pageid', "systemmngt");
      setTimeout(() => { window.location = "genvoucher.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "genvoucher.html");
      break;
    case 6:
      window.localStorage.setItem('pageid', "vouchermngt");
      setTimeout(() => { window.location = "voucherhist.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "voucherhist.html");
      break;
    case 7:
      window.localStorage.setItem('pageid', "vouchermngt");
      setTimeout(() => { window.location = "allocvoucher.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "allocvoucher.html");
      break;
    case 8:
      window.localStorage.setItem('pageid', "vouchermngt");
      setTimeout(() => { window.location = "editvoucher.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "editvoucher.html");
      break;
    case 9:
      window.localStorage.setItem('pageid', "systemmngt");
      setTimeout(() => { window.location = "pcpuser.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "pcpuser.html");
      break;
    case 10:
      // partner report
      if(window.localStorage.getItem('userRights') <= 3){
        window.localStorage.setItem('pageid', "reportmngt");
        window.location = "emptypage.html";
      } else {
        // swal("Warning", "Please contact your system administrator.", "warning");
        setTimeout(() => { window.location.reload(); }, 500);
      }
      break;
    case 11:
      // fleet report
      if(window.localStorage.getItem('userRights') <= 3){
        window.localStorage.setItem('pageid', "reportmngt");
        window.location = "emptypage.html";
      } else {
        // swal("Warning", "Please contact your system administrator.", "warning");
        setTimeout(() => { window.location.reload(); }, 500);
      }
      break;
    case 12:
      window.localStorage.setItem('pageid', "vessrepmngt");
      setTimeout(() => { window.location = "vesselrep.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "vesselrep.html");
      break;
    case 13:
      window.localStorage.setItem('pageid', "reportmngt");
      setTimeout(() => { window.location = "voyagerep.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "voyagerep.html");
      break;
    case 14:
      window.localStorage.setItem('pageid', "systemmngt");
      setTimeout(() => { window.location = "usermngt.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "usermngt.html");
      break;
    case 15:
      // window.localStorage.setItem('pageid', "systemmngt");
      // setTimeout(() => { window.location = "userloghist.html"; }, 500);
      // addLog(window.localStorage.getItem('supportUser'), "userloghist.html");
      break;
    case 16:
      window.localStorage.setItem('pageid', "partnermngt");
      setTimeout(() => { window.location = "partnermngt.html"; }, 300);
      addLog(window.localStorage.getItem('supportUser'), "partnermngt.html");
      break;
    case 17:
      window.localStorage.setItem('pageid', "fleetmngt");
      setTimeout(() => { window.location = "fleetmngt.html"; }, 300);
      addLog(window.localStorage.getItem('supportUser'), "fleetmngt.html");
      break;
    case 18:
      addLog(window.localStorage.getItem('supportUser'), "logout");
      window.clearInterval(_idleSecondsTimer);
      window.localStorage.clear();
      setTimeout(() => { window.location = "index.html"; }, 300);
      break;
    case 19:
      window.localStorage.setItem('pageid', "usagemngt");
      setTimeout(() => { window.location = "datarep.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "datarep.html");
      break;
    case 20:
      break;
    case 21:
      window.localStorage.setItem('pageid', "vesselmngt");
      setTimeout(() => { window.location = "onboarduser.html"; }, 300);
      addLog(window.localStorage.getItem('supportUser'), "onboarduser.html");
      break;
    case 22:
      // window.localStorage.setItem('pageid', "helpmngt");
      // setTimeout(() => { window.location = "helpcenter.html"; }, 500);
      // addLog(window.localStorage.getItem('supportUser'), "helpcenter.html");
      break;
    case 23:
      window.localStorage.setItem('pageid', "vesselmngt");
      setTimeout(() => { window.location = "news.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "news.html");
      break;
    case 24:
      window.localStorage.setItem('pageid', "systemmngt");
      setTimeout(() => { window.location = "systemlog.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "systemlog.html");
      break;
    case 25:
      window.localStorage.setItem('pageid', "usagemngt");
      setTimeout(() => { window.location = "voyageapprep.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "voyageapprep.html");
      break;
    case 26:
      window.localStorage.setItem('pageid', "systemmngt");
      setTimeout(() => { window.location = "domaintools.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "domaintools.html");
      break;
    case 27:
      // // new page for knowledgebase
      // window.localStorage.setItem('pageid', "helpmngt");
      // setTimeout(() => { window.location = "knowledgebase.html"; }, 500);
      // addLog(window.localStorage.getItem('supportUser'), "knowledgebase.html");
      break;
    case 28:
      window.localStorage.setItem('pageid', "usagemngt");
      setTimeout(() => { window.location = "userappusage.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "userappusage.html");
      break;
    case 29:
      // window.localStorage.setItem('pageid', "systemmngt");
      // setTimeout(() => { window.location = "srvcwatchdog.html"; }, 300);
      // addLog(window.localStorage.getItem('supportUser'), "srvcwatchdog.html");
      break;
    case 30:
      window.localStorage.setItem('pageid', "systemmngt");
      setTimeout(() => { window.location = "philport.html"; }, 300);
      addLog(window.localStorage.getItem('supportUser'), "philport.html");
      break;
    case 31:
      window.localStorage.setItem('pageid', "vesselmngt");
      setTimeout(() => { window.location = "survey.html"; }, 300);
      addLog(window.localStorage.getItem('supportUser'), "survey.html");
      break;
    case 32:
      window.localStorage.setItem('pageid', "supportmngt");
      setTimeout(() => { window.location = "pcpsupport.html"; }, 300);
      addLog(window.localStorage.getItem('supportUser'), "pcpsupport.html");
      break;
    case 33:
      window.localStorage.setItem('pageid', "systemmngt");
      setTimeout(() => { window.location = "globalsetting.html"; }, 300);
      addLog(window.localStorage.getItem('supportUser'), "globalsetting.html");
      break;
    case 34:
      window.localStorage.setItem('pageid', "vessrepmngt");
      setTimeout(() => { window.location = "purchasehist.html"; }, 300);
      addLog(window.localStorage.getItem('supportUser'), "purchasehist.html");
      break;
    case 35:
      window.localStorage.setItem('pageid', "vessrepmngt");
      setTimeout(() => { window.location = "vessgps.html"; }, 300);
      addLog(window.localStorage.getItem('supportUser'), "vessgps.html");
      break;
    case 36:
      window.localStorage.setItem('pageid', "vessrepmngt");
      setTimeout(() => { window.location = "trackrep.html"; }, 300);
      addLog(window.localStorage.getItem('supportUser'), "trackrep.html");
      break;
    case 37:
      window.localStorage.setItem('pageid', "vessrepmngt");

      break;
    case 99:
      window.localStorage.setItem('pageid', "vesselmngt");
      setTimeout(() => { window.location = "dashboard.html"; }, 500);
      addLog(window.localStorage.getItem('supportUser'), "dashboard.html");

      // console.log(window.localStorage.getItem('tokenKey'));
      if(!window.localStorage.getItem('tokenKey')){
        getTokenKey("");
      }
      break;
    default:
      window.location.reload();
  }

  }
};

function removeData(){
  window.localStorage.removeItem('vesselSett');
  window.localStorage.removeItem('voucherData');
  window.localStorage.removeItem('networkSett');
  window.localStorage.removeItem('AdvSett');

  window.localStorage.removeItem('AppsSett');

  window.localStorage.removeItem('partnerData');
  window.localStorage.removeItem('fleetData');
  window.localStorage.removeItem('userData');
  window.localStorage.removeItem('serviceData');
  window.localStorage.removeItem('areaData');
  window.localStorage.removeItem('voucherDatalog');

  window.localStorage.removeItem('userSett');
  window.localStorage.removeItem('NewsSett');
};

function getTokenKey(tokenData){
  if(!tokenData){
    axios
      .get(serverurl + "appaccess?email=websupport@passcess.net&password=nulsohstx")
      .then(function(response){
        if(response.data.status == "success"){
          window.localStorage.setItem('tokenKey', response.data.api_key);
        } else {
          // window.localStorage.setItem('tokenKey', "");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      });
  } else {
    window.localStorage.setItem('tokenKey', tokenData);
  }
};

function addLog(strName, strPage){
  var logdata = {action: "logpage", id: "", msg: ""};
  logdata["id"] = strName;
  logdata["msg"] = strPage;
  var formData = toPostData(logdata);
  axios
    .post(localurl + "log.php", formData)
    // .post("http://passcess.crewcommcenter.com/api/log.php", formData)
    .then(function(response){
      if(response.data.error){
        console.log(JSON.stringify(response.data));
      }
    })
    .catch(function(error){
      console.log(JSON.stringify(error.message));
    });
  return false;
};

function addLogUpdate(strName, strOld, strNew){
  var logdata = {action: "logupdate", id: "", msg: "", newmsg:""};
  logdata["id"] = strName;
  logdata["msg"] = strOld;
  logdata["newmsg"] = JSON.stringify(strNew);

  var formData = toPostData(logdata);
  axios
    // .get("http://localhost/passcess/api/log.php?action=&id=" + strName + "&msg=" + strOld + "&newmsg=" + strNew )
    .post(localurl + "log.php", formData)
    .then(function(response){
      if(response.data.error){
        console.log(JSON.stringify(response.data));
      }
    })
    .catch(function(error){
      console.log(JSON.stringify(error.message));
    });
  return false;
};

function toPostData(obj){
  var fd = new FormData();
  for(var i in obj){
    fd.append(i,obj[i]);
  }
  return fd;
};

function checkMenuPermission(){
  var permissionUser = window.localStorage.getItem('userRights');
  switch (permissionUser){
    case "1":  // Super Admin
      document.getElementById("vouchermngt").style.display = "block";
      document.getElementById("mnVoucherList").style.display = "block";
      document.getElementById("mnAllocateVoucher").style.display = "block";
      document.getElementById("mnEditVoucher").style.display = "block";

      document.getElementById("mnNetwork").style.display = "block";
      document.getElementById("mnFirewall").style.display = "block";
      document.getElementById("mnVoyageSked").style.display = "block";
      document.getElementById("mnOnboardUser").style.display = "block";
      // document.getElementById("mnNews").style.display = "block";
      document.getElementById("mnNews").style.display = "none";
      document.getElementById("mnsupport").style.display = "block";
      document.getElementById("mnSurvey").style.display = "block";

      document.getElementById("mnVoyageRep").style.display = "block";
      document.getElementById("mnVesselRep").style.display = "block";
      document.getElementById("mnPurchase").style.display = "block";
      document.getElementById("mnVessGPS").style.display = "block";
      document.getElementById("mnTrackRep").style.display = "block";
      document.getElementById("usagemngt").style.display = "block";

      document.getElementById("mnfleetmngt").style.display = "block";
      document.getElementById("mnpartnermngt").style.display = "block";

      document.getElementById("systemmngt").style.display = "block";
      document.getElementById("mnportlist").style.display = "block";
      document.getElementById("mnappsetting").style.display = "block";
      document.getElementById("mnGenerateVoucher").style.display = "block";
      document.getElementById("mncontrolpanel").style.display = "block";
      // document.getElementById("mnwatchdog").style.display = "block";
      document.getElementById("mnsystemlog").style.display = "block";
      document.getElementById("mnGlobalSett").style.display = "block";
      break;
    case "2":  // Admin
      document.getElementById("vouchermngt").style.display = "block";
      document.getElementById("mnVoucherList").style.display = "block";
      document.getElementById("mnAllocateVoucher").style.display = "block";
      document.getElementById("mnEditVoucher").style.display = "none";

      document.getElementById("mnNetwork").style.display = "block";
      document.getElementById("mnFirewall").style.display = "block";
      document.getElementById("mnVoyageSked").style.display = "block";
      document.getElementById("mnOnboardUser").style.display = "block";
      // document.getElementById("mnNews").style.display = "block";
      document.getElementById("mnNews").style.display = "none";
      document.getElementById("mnsupport").style.display = "block";
      document.getElementById("mnSurvey").style.display = "block";

      document.getElementById("mnVoyageRep").style.display = "block";
      document.getElementById("mnVesselRep").style.display = "block";
      document.getElementById("mnPurchase").style.display = "block";
      document.getElementById("mnVessGPS").style.display = "block";
      document.getElementById("mnTrackRep").style.display = "block";
      document.getElementById("usagemngt").style.display = "block";

      document.getElementById("mnfleetmngt").style.display = "none";
      document.getElementById("mnpartnermngt").style.display = "none";

      document.getElementById("systemmngt").style.display = "block";
      document.getElementById("mnportlist").style.display = "none";
      document.getElementById("mnappsetting").style.display = "none";
      document.getElementById("mnGenerateVoucher").style.display = "none";
      document.getElementById("mncontrolpanel").style.display = "block";
      // document.getElementById("mnwatchdog").style.display = "none";
      document.getElementById("mnsystemlog").style.display = "block";
      document.getElementById("mnGlobalSett").style.display = "none";
      break;
    case "3":  // partner or fleet admin
      document.getElementById("vouchermngt").style.display = "none";
      document.getElementById("mnVoucherList").style.display = "none";
      document.getElementById("mnAllocateVoucher").style.display = "none";
      document.getElementById("mnEditVoucher").style.display = "none";

      document.getElementById("mnNetwork").style.display = "block";
      document.getElementById("mnFirewall").style.display = "block";
      document.getElementById("mnVoyageSked").style.display = "block";
      document.getElementById("mnOnboardUser").style.display = "block";
      // document.getElementById("mnNews").style.display = "block";
      document.getElementById("mnNews").style.display = "none";
      document.getElementById("mnsupport").style.display = "block";
      document.getElementById("mnSurvey").style.display = "block";

      document.getElementById("mnVoyageRep").style.display = "block";
      document.getElementById("mnVesselRep").style.display = "block";
      document.getElementById("mnPurchase").style.display = "block";
      document.getElementById("mnVessGPS").style.display = "block";
      document.getElementById("mnTrackRep").style.display = "block";
      document.getElementById("usagemngt").style.display = "block";

      document.getElementById("mnfleetmngt").style.display = "none";
      document.getElementById("mnpartnermngt").style.display = "none";

      document.getElementById("systemmngt").style.display = "block";
      document.getElementById("mnportlist").style.display = "none";
      document.getElementById("mnappsetting").style.display = "none";
      document.getElementById("mnGenerateVoucher").style.display = "none";
      document.getElementById("mncontrolpanel").style.display = "block";
      // document.getElementById("mnwatchdog").style.display = "none";
      document.getElementById("mnsystemlog").style.display = "none";
      document.getElementById("mnGlobalSett").style.display = "none";
      break;
    case "4":  // user
    case "5":  // guest
      document.getElementById("vouchermngt").style.display = "none";
      document.getElementById("mnVoucherList").style.display = "none";
      document.getElementById("mnAllocateVoucher").style.display = "none";
      document.getElementById("mnEditVoucher").style.display = "none";

      document.getElementById("mnNetwork").style.display = "block";
      document.getElementById("mnFirewall").style.display = "block";
      document.getElementById("mnVoyageSked").style.display = "block";
      document.getElementById("mnOnboardUser").style.display = "block";
      // document.getElementById("mnNews").style.display = "block";
      document.getElementById("mnNews").style.display = "none";
      document.getElementById("mnsupport").style.display = "none";
      document.getElementById("mnSurvey").style.display = "none";

      document.getElementById("mnVoyageRep").style.display = "block";
      document.getElementById("mnVesselRep").style.display = "block";
      document.getElementById("mnPurchase").style.display = "none";
      document.getElementById("mnVessGPS").style.display = "none";
      document.getElementById("mnTrackRep").style.display = "none";
      document.getElementById("usagemngt").style.display = "none";

      document.getElementById("mnfleetmngt").style.display = "none";
      document.getElementById("mnpartnermngt").style.display = "none";

      document.getElementById("systemmngt").style.display = "none";
      document.getElementById("mnportlist").style.display = "none";
      document.getElementById("mnappsetting").style.display = "none";
      document.getElementById("mnGenerateVoucher").style.display = "none";
      document.getElementById("mncontrolpanel").style.display = "none";
      // document.getElementById("mnwatchdog").style.display = "none";
      document.getElementById("mnsystemlog").style.display = "none";
      document.getElementById("mnGlobalSett").style.display = "none";
      break;
    default: null;
  }

};

function AllowOnlyNumbers(e) {
  e = (e) ? e : window.event;
  var clipboardData = e.clipboardData ? e.clipboardData : window.clipboardData;
  var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
  var str = (e.type && e.type == "paste") ? clipboardData.getData('Text') : String.fromCharCode(key);

  return (/^\d+$/.test(str));
};

function GetLastResetTimeStamp() {
    var lastResetTimeStamp = 0;
    if (_localStorage) {
        lastResetTimeStamp = parseInt(_localStorage[_localStorageKey], 10);
        if (isNaN(lastResetTimeStamp) || lastResetTimeStamp < 0)
            lastResetTimeStamp = (new Date()).getTime();
    } else {
        lastResetTimeStamp = _lastResetTimeStamp;
    }
    return lastResetTimeStamp;
};

function SetLastResetTimeStamp(timeStamp) {
    if (_localStorage) {
        _localStorage[_localStorageKey] = timeStamp;
    } else {
        _lastResetTimeStamp = timeStamp;
    }
};

function ResetTime() {
    SetLastResetTimeStamp((new Date()).getTime());
};

function AttachEvent(element, eventName, eventHandler) {
    if(!window.localStorage.getItem('supportUser')){
      checkPrivilage(18);
    }

    if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
        return true;
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler);
        return true;
    } else {
        //nothing to do, browser too old or non standard anyway
        return false;
    }
};

function WriteProgress(msg) {
    var oPanel = document.getElementById("SecondsUntilExpire");
    if (oPanel){
      oPanel.innerHTML = msg;
    } else if (console){
      // console.log(msg);
    }
};

function CheckIdleTime() {
    var currentTimeStamp = (new Date()).getTime();
    var lastResetTimeStamp = GetLastResetTimeStamp();
    var secondsDiff = Math.floor((currentTimeStamp - lastResetTimeStamp) / 1000);
    if (secondsDiff <= 0) {
        ResetTime();
        secondsDiff = 0;
    }
    WriteProgress((IDLE_TIMEOUT - secondsDiff) + "");
    if (secondsDiff >= IDLE_TIMEOUT) {
        window.clearInterval(_idleSecondsTimer);
        ResetTime();
        alert("Your session has expired.");
        checkPrivilage(18);
    }
};

function GetISP(){
  axios
    .get("http://ip-api.com/json")
    .then(function(response){
      // console.log(JSON.stringify(response.data));
      if(response.data.status == "success"){
        localISP = response.data;
      }
    })
    .catch(function(error){
      localISP = '';
      console.log(JSON.stringify(error));
    });

  // $.getJSON('http://ip-api.com/json', function(result) {
  //    alert(JSON.stringify(result));
  //  });
};

//return an array of objects according to key, value, or key and value matching
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}

//return an array of values that match on a certain key
function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}

//return an array of keys that match on a certain value
function getKeys(obj, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
}
