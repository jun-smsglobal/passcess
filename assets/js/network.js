var appnetwork = new Vue({
el: '#appnetwork',
data: {
  vesselSetting : {vesselID: "", fleetID: "", partnerID: ""},
  newSetting: [{id : 0, vesselid : "",
    settings : {DNS:{DNS1:"",DNS2:"",DNS3:"",DNS4:""},
      LAN:{uam:"",subnet:"",network:""},
      WAN_A:{mode:"_DHCP",address:"",gateway:"",netmask:"",interface:"WAN_A"},
      WAN_B:{mode:"_DHCP",address:"",gateway:"",netmask:"",interface:"WAN_B"}
    }}],
  settings: [],
  currSetting:{},
  saveSetting:{},
  oldNetwork: {},
  chckWANA: false,
  chckWANB: false,
  btnShow: true,
  // gpsvalue: 0,
  optFleet: [{ text: '', value: '' }],
  optVess: [{ text: '', value: '' }],
  privilage : {userrights : null, useraccess : null, TokenKey : null},
  options: [
    { text: 'STATIC', value: '_STATIC' },
    { text: 'DHCP', value: '_DHCP' }
  ],
  newiperfSett: [],
  curriperfSett: {"iperf_settings":{"iperf_server": "","key": "","port": "0","spdtest_mode": ""}},
  newGPSSett: [],
  currGPSSett: {"gps_settings":{"log": "","poll_time": "0","term_addr": "","term_port": "0"}},
  optMode: [
    { text: 'Speedtest.net', value: '1' },
    { text: 'Iperf Mode', value: '2' },
  ]
},
mounted: function(){
  this.processPrivilage();
  this.getFleet();
  this.getVessel();
  this.getGPSsett();
  setTimeout(() => { this.getSetting(); }, 200);
  // this.getIPERF();
  removeData();
},
methods: {
  getSetting(){
    if(this.vesselSetting.vesselID != 0) {
      axios
        .get(serverurl + "firewall/settings/" + this.vesselSetting.vesselID)
        .then(function(response){
          appnetwork.settings = [];

          if((JSON.stringify(response.data) == "{}") || (JSON.stringify(response.data) == "[]")) {
            appnetwork.settings = [{id : appnetwork.currSetting['id'],
              vesselid : appnetwork.VesselSett.vesselid,
              settings : {DNS:{DNS1:"",DNS2:"",DNS3:"",DNS4:""},
                LAN:{uam:"",subnet:"",network:""},
                WAN_A:{mode:"_DHCP",address:"",gateway:"",netmask:"",interface:"WAN_A"},
                WAN_B:{mode:"_DHCP",address:"",gateway:"",netmask:"",interface:"WAN_B"}
              }}]
            appnetwork.CheckInput(appnetwork.settings[0].settings);
          } else {
            appnetwork.settings[0] = response.data;
            appnetwork.CheckInput(appnetwork.settings[0].settings);
          }
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
        }) ;
    };
    this.checkUser();
  },
  getFleet(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=12&id=" + this.vesselSetting.partnerID)
      .then(function(response){
        if(!response.data.error){
          appnetwork.optFleet = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appnetwork.optFleet = [{ text: '', value: '' }];
      });
  },
  getGPSsett(){
    if((this.vesselSetting.vesselID == "0") || (this.vesselSetting.vesselID == "")){
      this.newiperfSett = this.curriperfSett;
      this.newGPSSett = this.currGPSSett;
    } else {
      axios
        .get(serverurl + "vessel/settings/" + this.vesselSetting.vesselID)
        .then(function(response){
          if((JSON.stringify(response.data) == "{}") || (JSON.stringify(response.data) == "[]")) {
            appnetwork.newiperfSett = appnetwork.curriperfSett;
            appnetwork.newGPSSett = appnetwork.currGPSSett;
          } else {
            appnetwork.newiperfSett = response.data;
            appnetwork.newGPSSett = response.data;
          }
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
        }) ;
    }
  },
  updateGPSSett(){
    axios
      .put(serverurl + "vessel/settings/" + this.vesselSetting.vesselID, this.newGPSSett)
      .then(function(response){
        if(JSON.stringify(response.data)){
          swal("", "Successfully updated.", "success");
          appnetwork.getGPSsett();
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      }) ;
  },
  updateIPERFSett(){
    axios
      .put(serverurl + "vessel/settings/" + this.vesselSetting.vesselID, this.newiperfSett)
      .then(function(response){
        if(JSON.stringify(response.data)){
          swal("", "Successfully updated.", "success");
          appnetwork.getGPSsett();
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      }) ;
  },
  getVessel(){
    var strURL = "";
    if(this.privilage.userrights == '1'){
      strURL = localurl + "vessel.php?action=getvessel&proc=1&id=0";
    } else {
      strURL = localurl + "vessel.php?action=getvessel&proc=1&id=" + this.vesselSetting.partnerID;
    }

    axios
      // .get(localurl + "vessel.php?action=getvessel&proc=1&id=1")
      .get(strURL)
      .then(function(response){
        if(!response.data.error){
          appnetwork.optVess = response.data.vessel;
          if (appnetwork.vesselSetting.vesselID == ""){
            appnetwork.vesselSetting.vesselID = appnetwork.optVess[0].value;
            window.localStorage.setItem('vesselID', appnetwork.optVess[0].value);
          };
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appnetwork.optVess = [{ text: '', value: '' }];
      });

  },
  selectSetting(sett){
    appnetwork.currSetting = sett;
    window.localStorage.setItem('networkSett', JSON.stringify(appnetwork.currSetting));
  },
  updateLAN(){

    appnetwork.oldNetwork = window.localStorage.getItem('networkSett');
    appnetwork.saveSetting = {LAN: this.currSetting.settings.LAN};
    axios
      .put(serverurl + "firewall/settings/" + this.currSetting['vesselid'] + "/LAN", appnetwork.saveSetting)
      .then(function(response){
        appnetwork.saveSetting = response.data;
        addLogUpdate(window.localStorage.getItem('supportUser'), appnetwork.oldNetwork, appnetwork.saveSetting);
        appnetwork.oldNetwork = {};
        removeData();
        appnetwork.getSetting();
        swal("", "Successfully updated \n\n LAN Settings", "success");
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
      this.saveSetting = {};
      this.getSetting();
  },
  updateDNS(){
    appnetwork.oldNetwork = window.localStorage.getItem('networkSett');
    appnetwork.saveSetting = {DNS: this.currSetting.settings.DNS};
    axios
      .put(serverurl + "firewall/settings/" + this.currSetting['vesselid'] + "/DNS", appnetwork.saveSetting)
      .then(function(response){
        appnetwork.saveSetting = response.data;
        addLogUpdate(window.localStorage.getItem('supportUser'), appnetwork.oldNetwork, appnetwork.saveSetting);
        appnetwork.oldNetwork = {};
        removeData();
        appnetwork.getSetting();
        swal("", "Successfully updated \n\n DNS Settings", "success");
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
      this.saveSetting = {};
      this.getSetting();
  },
  updateSetting(){
    appnetwork.oldNetwork = window.localStorage.getItem('networkSett');
    axios
      .put(serverurl + "firewall/settings/" + this.currSetting['vesselid'], appnetwork.currSetting)
      .then(function(response){
        appnetwork.saveSetting = response.data;
        addLogUpdate(window.localStorage.getItem('supportUser'), appnetwork.oldNetwork, appnetwork.settings);
        appnetwork.oldNetwork = {};
        removeData();
        appnetwork.getSetting();
        swal("", "Successfully updated \n\n WAN Settings", "success");
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
      this.currSetting = {};
      this.getSetting();
  },
  processPrivilage(){
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');

    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
    this.privilage.TokenKey = window.localStorage.getItem('tokenKey');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  changeVesselID(event){
    // console.log(this.vesselSetting.vesselID);
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    this.getSetting();
    this.getGPSsett();
  },
  CheckInput(data){
    // console.log(JSON.stringify(data));
    if(data.WAN_A.mode == "_DHCP"){
      this.chckWANA = true;
    } else {
      this.chckWANA = false;
    }
    if(data.WAN_B.mode == "_DHCP"){
      this.chckWANB = true;
    } else {
      this.chckWANB = false;
    }
  },
  checkUser(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      this.btnShow = true;
    } else {
      this.btnShow = false;
      // swal("", "Please contact your system administrator.", "warning");
    }
  },
  // GPSSettings(){
  //   if(appnetwork.gpsvalue == "1"){
  //     document.getElementById("gpstext").innerHTML = "ON"
  //   } else {
  //     document.getElementById("gpstext").innerHTML = "OFF"
  //   }
  // },

},
});
