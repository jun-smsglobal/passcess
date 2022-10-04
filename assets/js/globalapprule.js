var globalapps = new Vue({
el: '#globalapps',
data: {
  vesselSetting : {vesselID: "", fleetID: "", partnerID: ""},
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  btnShow: true,
  chckAdd: false,
  appsett: [],
  appSettID: "",
  currappsett: {},
  oldSetting: {},
  newRules: {appname:"", apprules:"", appdomains:"", appfeatures:""},
  optFleet: [{ text: '', value: '' }],
  optVess: [{ text: '', value: '' }],
  privilage : {userrights : null, useraccess : null, TokenKey : null},
  // appList: [{text:'Facebook'},{text:'WhatsApp'},{text:'Viber'},{text:'Line'},{text:'Instagram'},{text:'Wechat'},{text:'Twitter'},{text:'TikTok'},{text:'Youtube'},{text:'defaults'}],
  appList: [{ text: ''}],
  optActive: [
    { text: 'Enabled', value: '1' },
    { text: 'Disabled', value: '0' },
  ]
},
mounted: function(){
  this.processPrivilage();
  setTimeout(() => { this.getAllSetting(); }, 200);
},
methods: {
  getAllSetting(){
    this.getAppListName();
    axios
      .get(serverurl + "defaultsettings/apprules")
      .then(function(response){
        globalapps.appsett = response.data[0].settings;
        globalapps.appSettID = response.data[0].id;
        window.localStorage.setItem('AppsSett', JSON.stringify(globalapps.appsett));
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      }) ;
    this.checkBtnShow();
  },
  processPrivilage(){
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');

    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
    this.privilage.TokenKey = window.localStorage.getItem('tokenKey');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  addAppRule(){
    if(globalapps.chckAdd == false){
      axios
        .get(localurl + "vessel.php?action=getvessel&proc=19&id=" + globalapps.newRules.appname)
        .then(function(response){
          if(!response.data.error){
            console.log(JSON.stringify(response.data.vessel));
          } else {
            console.log(JSON.stringify(response.data.message));
          }
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
        });
    };

    globalapps.appsett.appsettings.push(globalapps.newRules);
    // console.log(JSON.stringify(globalapps.appsett[0].settings));
    axios
      .put(serverurl + "defaultsettings/apprules/" + this.appSettID, globalapps.appsett)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD GLOBAL APP RULES"}', globalapps.appsett);
        removeData();

        globalapps.getAllSetting();
        swal("", "Successfully updated", "success");
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
      globalapps.newRules = {appname:"", apprules:"", appdomains:"", appfeatures:""};
  },
  updateAppRule(){
    globalapps.oldSetting = window.localStorage.getItem('AppsSett');
    // console.log(JSON.stringify(globalapps.currappsett));
    axios
      // .put(serverurl + "defaultsettings/apprules/" + this.appSettID, globalapps.appsett)
      .put(serverurl + "defaultsettings/apprules", globalapps.currappsett)
      .then(function(response){
        globalapps.appsett = response.data;

        addLogUpdate(window.localStorage.getItem('supportUser'), globalapps.oldSetting, globalapps.appsett);
        removeData();
        globalapps.getAllSetting();

        swal("", "Successfully updated", "success");
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
      globalapps.currappsett = {};
  },
  selectAdvSettings(settdata){
    globalapps.currappsett = settdata;
  },
  checkUser(proc){
    if (this.privilage.userrights <= '2') {
      if (proc == 1) {
        globalapps.showAddModal = true;
        globalapps.setFocusModal(1);
      } else if (proc == 2) {
        globalapps.showEditModal = true;
        globalapps.setFocusModal(2);
      } else if (proc == 3) {
        globalapps.showDeleteModal = true;
      } else {
        // swal("", "Unable to access your request.", "warning");
      }
    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
  },
  checkBtnShow(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      this.btnShow = true;
    } else {
      this.btnShow = false;
    }
  },
  setFocus(eventid){
    document.getElementById(eventid).focus();
  },
  setFocusModal(proc){
    if(proc == "1"){
      $('body').on('shown.bs.modal', '#myModalAddApp', function () {
          $('input:visible:enabled:first', this).focus();
          $('input:visible:enabled:first', this).select();
          $('.modal-dialog').draggable({
            handle: ".modal-header"
          });
      })
    } else if (proc == "2") {
      $('body').on('shown.bs.modal', '#myModalEdit', function () {
          $('input:visible:enabled:first', this).focus();
          $('input:visible:enabled:first', this).select();
          $('.modal-dialog').draggable({
            handle: ".modal-header"
          });
      })
    };
  },
  getAppListName(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=18&id=0")
      .then(function(response){
        if(!response.data.error){
          globalapps.appList = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        globalapps.appList = [{ text: ''}];
      });
  },

}
});
