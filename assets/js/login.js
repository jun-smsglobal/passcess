var applogin = new Vue({
el: '#applogin',
data: {
  loginMsg : "",
  showPolicy: false,
  loginData : {webuser: null, webpass: null, rights: null, access: null, partner: null},
  // type_pass: "password",
  // class_eye: "far fa-eye-slash",
  logSetting : {}
},
mounted: function(){
  this.checkUser();
},
methods: {
  loginUser() {
    this.loginMsg = "";

    if ((this.loginData.webuser) && (this.loginData.webpass))
    {
    var formData = applogin.toFormData(this.loginData);
    axios
      // .post("http://passcess.crewcommcenter.com/api/users.php", formData)
      .post(localurl + "users.php", formData)
      .then(function(response){
        applogin.logSetting = response.data;
        // console.log(JSON.stringify(applogin.logSetting));
        if (applogin.logSetting.code == 200) {
          applogin.loginData.rights = applogin.logSetting.rights;
          applogin.loginData.access = applogin.logSetting.access;
          applogin.loginData.partner = applogin.logSetting.partner;
        } else {
          applogin.loginData.webpass = null;
          applogin.loginMsg = "You have entered an invalid username or password. Please try again.";
          swal("", applogin.loginMsg, "info");
        }
      })
      .catch(function(error){
        if(error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
        applogin.loginMsg = "You have entered an invalid username or password. Please try again.";
        swal("", applogin.loginMsg, "info");
      })
      .finally(function(){
        if (applogin.logSetting.code == 200) {
          window.localStorage.setItem('userRights', applogin.logSetting.rights);
          window.localStorage.setItem('userAccess', applogin.logSetting.access);
          window.localStorage.setItem('supportUser', applogin.loginData.webuser);
          window.localStorage.setItem('vesselID', "");
          window.localStorage.setItem('partner', applogin.logSetting.partner);
          window.localStorage.setItem('tokenKey', "");
          addLog(applogin.loginData.webuser, "login");
          // getTokenKey("");
          checkPrivilage(99);
          // window.location.href = "dashboard.html";
        }
      });
    } else {
      applogin.loginMsg = "You have entered an invalid username or password. Please try again.";
      swal("", applogin.loginMsg, "info");
    }

    if (!this.loginData.webuser) {
        this.webpass = "";
        document.getElementById('loguser').focus();
    } else if (!this.loginData.webpass) {
        this.webpass = "";
        document.getElementById('loguser').focus();
    }

  },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  OnTop(){
    $("#onBegin").animate({ scrollTop: 0 }, "slow");
  },
  checkUser(){
    var chckUserExist = window.localStorage.getItem('supportUser');
    if(chckUserExist){
      checkPrivilage(99);
    } else {
      window.localStorage.clear();
      // window.localStorage.setItem('userRights', 0);
      // window.localStorage.setItem('userAccess', 0);
    }
  },

  // showPassword() {
  //   if(this.type_pass === "password") {
  //     this.type_pass = "text";
  //     this.class_eye = "fas fa-eye-slash"
  //   } else {
  //     this.type_pass = "password";
  //     this.class_eye = "far fa-eye-slash"
  //   }
  // }

},

});
