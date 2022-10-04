var apprules = new Vue({
el: '#apprules',
data: {
  appSetting : {appid: "0", appname: "", apprulesid: "0"},
  showAddModal: false,
  showAddRuleModal: false,
  showEditModal: false,
  showDeleteModal: false,
  allappRules: [],
  currappRules: {},
  // pageappRules: [],
  // perPage: 8,
  optAppname: [{ appid: '', appname: '' }],
  NewAppRules: {apprulesid: "", appid: "", apprules: "", appdomains: "", appfeatures: "", appenabled: "1"},
  AppRulesData: {action: "", id: "", ruleid: "0", ipset: "", domain: "", feature: "", stat: "0"},
  NewAppName: [{appname: "", appimgloc:"", appimg:""}],
  privilage : {userrights : null, useraccess : null},
  optActive: [
    { text: 'Enabled', value: '1' },
    { text: 'Disabled', value: '0' },
  ]
},
mounted: function(){
  this.processUser();
  this.getAppName();
  this.getAllAppRules();
},
methods: {
  getAllAppRules(){
    axios
      .get(localurl + "apprules.php?action=getapprules&id=0")
      // .get(this.localurl + "apprules.php?action=getapprules&id=" + this.appSetting.appid)
      .then(function(response){
        if(!response.data.error){
          apprules.allappRules = response.data.apprules;
          // apprules.pageCount(apprules.allappRules, 1);
        } else {
          swal("", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      }) ;
  },
  getAppName(){
    axios
      .get(localurl + "apprules.php?action=getapp&id=0")
      .then(function(response){
        if(!response.data.error){
          apprules.optAppname = response.data.appname;
        } else {
          swal("", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(error);
        apprules.optAppname = [{ appid: '', appname: '' }];
      });
  },
  processUser(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
  },
  addAppRule(){
    apprules.AppRulesData["action"] = "addapprules";
    apprules.AppRulesData["id"] = apprules.appSetting.appid;
    apprules.AppRulesData["ruleid"] = "";
    apprules.AppRulesData["ipset"] = apprules.NewAppRules.apprules;
    apprules.AppRulesData["domain"] = apprules.NewAppRules.appdomains;
    apprules.AppRulesData["feature"] = apprules.NewAppRules.appfeatures;
    apprules.AppRulesData["stat"] = apprules.NewAppRules.appenabled;

    var formData = apprules.toFormData(apprules.AppRulesData);
    axios
      .post(localurl + "apprules.php", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD APP RULES"}', apprules.NewAppRules);
          apprules.NewAppRules = {apprulesid: "", appid: "", apprules: "", appdomains: "", appfeatures: "", appenabled: ""};
          apprules.getAllAppRules();
          swal("", response.data.message, "success");
        } else {
          swal("", response.data.message, "warning");
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
        console.log(JSON.stringify(error));
        swal("", JSON.stringify(error.message), "warning");
      });
  },
  updateAppRule(){
    apprules.AppRulesData["action"] = "updateapprules";
    apprules.AppRulesData["id"] = apprules.currappRules.appid;
    apprules.AppRulesData["ruleid"] = apprules.currappRules.apprulesid;
    apprules.AppRulesData["ipset"] = apprules.currappRules.apprules;
    apprules.AppRulesData["domain"] = apprules.currappRules.appdomains;
    apprules.AppRulesData["feature"] = apprules.currappRules.appfeatures;
    apprules.AppRulesData["stat"] = apprules.currappRules.appenabled;

    var formData = apprules.toFormData(apprules.AppRulesData);
    axios
      .post(localurl + "apprules.php", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('appruledata'), apprules.currappRules);
          apprules.removeData();
          apprules.currappRules = {};
          apprules.getAllAppRules();
          swal("", "Successfully updated", "success");
        } else {
          swal("", response.data.message, "warning");
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
        console.log(JSON.stringify(error));
        swal("", JSON.stringify(error.message), "warning");
      });
  },
  deleteAppRule(){
    apprules.AppRulesData["action"] = "delapprules";
    apprules.AppRulesData["id"] = apprules.currappRules.appid;
    apprules.AppRulesData["ruleid"] = apprules.currappRules.apprulesid;
    // console.log(JSON.stringify(apprules.currappRules));
    var formData = apprules.toFormData(apprules.AppRulesData);
    axios
      .post(localurl + "apprules.php", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE APP RULE"}', apprules.currappRules);
          apprules.currappRules = {};
          apprules.getAllAppRules();
          swal("", "Successfully delete", "success");
        } else {
          swal("", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error));
        swal("", JSON.stringify(error.message), "warning");
      });
  },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  selectApprules(appruledata){
    apprules.currappRules = appruledata;
    window.localStorage.setItem('appruledata', JSON.stringify(apprules.currappRules));
  },
  addAppName(){
    //
  },
  checkUser(proc, id){
    if (this.privilage.userrights <= '2') {
      if (proc == 1) {
        apprules.appSetting.appid = id;
        apprules.showAddRuleModal = true;
      } else if (proc == 2) {
        apprules.showEditModal = true;
      } else if (proc == 3) {
        apprules.showDeleteModal = true;
      } else if (proc == 4) {
        apprules.showAddModal = true;
      } else {
        swal("", "Unable to access your request.", "warning");
      }
    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
  },
  removeData(){
    window.localStorage.removeItem('appruledata');
  },
  changeApp(appiddata){
    apprules.getAllAppRules();
  },
  passFileUrl(){
    document.getElementById('addappimg').click();
  },
  setFocus(event){
    if (event == 1) {
      document.getElementById('addfeature').focus();
    } else if (event == 2) {
      document.getElementById('addrule').focus();
    } else if (event == 3) {
      document.getElementById('adddomain').focus();
    } else if (event == 4) {
      document.getElementById('addstat').focus();
    } else if (event == 5) {
      document.getElementById('addbtn').focus();
    } else if (event == 6) {
      document.getElementById('editfeature').focus();
    } else if (event == 7) {
      document.getElementById('editrule').focus();
    } else if (event == 8) {
      document.getElementById('editdomain').focus();
    } else if (event == 9) {
      document.getElementById('editstat').focus();
    } else if (event == 10) {
      document.getElementById('editbtn').focus();
    } else if (event == 11) {
      document.getElementById('addappname').focus();
    } else if (event == 12) {
      document.getElementById('addapploc').focus();
    } else if (event == 13) {
      document.getElementById('addappimg').focus();
    } else if (event == 14) {
      document.getElementById('addbtnapp').focus();
    }
  },
  // pageCount(items, page){
  //   apprules.pageappRules = paginate(items, page, this.perPage);
  // },

}
});
