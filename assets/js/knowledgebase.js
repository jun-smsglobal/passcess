var kbapp = new Vue({
el: '#kbapp',
data: {
  searchid: "",
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  allKB: [],
  rootKB: {},
  categoryKB: {},
  articleKB: {},
  newServices: {serviceid:"", servicedesc: "", servicevalue: ""},
  currServices: {},
  priv : {userrights : null, useraccess : null}
},
mounted: function(){
  this.processUser();
  this.getAllKB("3");
  this.getAllKB("4");
  this.getAllKB("5");
},
methods: {
  getAllKB(proc){
    axios
      .get(localurl + "knowledgebase.php?action=search&proc=" + proc + "&id=0")
      .then(function(response){
        // kbapp.allKB = "";
        // kbapp.rootKB = "";
        // kbapp.categoryKB = "";
        // kbapp.articleKB = "";
        if(!response.data.error){
          if(proc == "1"){
            kbapp.allKB = response.data.knowledgebasedata;
          }else if (proc == "3") {
            kbapp.rootKB = response.data.knowledgebasedata;
          }else if (proc == "4") {
            kbapp.categoryKB = response.data.knowledgebasedata;
          }else if (proc == "5") {
            kbapp.articleKB = response.data.knowledgebasedata;
          }else {
            swal("Warning", "test", "warning");
          }
        } else {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(error.message);
      });
  },
  filterKB(){
    // return this.categoryKB.filter(catid => )
  },
  checkdata(){
    console.log(JSON.stringify(kbapp.rootKB));
    console.log(JSON.stringify(kbapp.categoryKB));
  },
  searchAllKB(dataid){
    if (dataid != "") {
      axios
        .get(localurl + "knowledgebase.php?action=search&proc=2&id=" + dataid)
        .then(function(response){
          if(!response.data.error){
            kbapp.allKB = response.data.knowledgebasedata;
          } else {
            swal("Warning", response.data.message, "warning");
          }
        })
        .catch(function(error){
          console.log(error);
          kbapp.allKB = "[]";
        });
    }
  },
  processUser(){
    this.priv.userrights = window.localStorage.getItem('userRights');
    this.priv.useraccess = window.localStorage.getItem('userAccess');
  },
  addService(){
    console.log(JSON.stringify(kbapp.newServices));
    var formData = kbapp.toFormData(kbapp.newServices);
    axios
      .post(localurl + "knowledgebase.php?action=create", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(response.data.error == false){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD SERVICE"}', kbapp.newServices);
          kbapp.newServices = {serviceid:"", servicedesc: "", servicevalue: ""};
          kbapp.getAllKB();
          swal("Successfully added", "", "success");
        } else {
          swal("Warning", response.data.message, "warning");
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
        swal("Warning", JSON.stringify(error.message), "warning");
      });
  },
  updateService(){
    var formData = kbapp.toFormData(kbapp.currServices);
    axios
      .post(localurl + "knowledgebase.php?action=update", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('serviceData'), kbapp.currServices);
          removeData();
          kbapp.currServices = {};
          kbapp.getAllKB();
          swal("Successfully updated", "", "success");
        } else {
          swal("Warning", response.data.message, "warning");
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
        swal("Warning", JSON.stringify(error.message), "warning");
      });
  },
  deleteService(){
    console.log(JSON.stringify(kbapp.currServices));
    var formData = kbapp.toFormData(kbapp.currServices);
    axios
      .post(localurl + "knowledgebase.php?action=delete", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE FLEET"}', kbapp.currServices);
          kbapp.currServices = {};
          kbapp.getAllKB();
          swal("Successfully deleted", "", "success");
        } else {
          swal("Warning", response.data.message, "warning");
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
        swal("Warning", JSON.stringify(error.message), "warning");
      });
  },
  selectService(servicedata){
    kbapp.currServices = servicedata;
    window.localStorage.setItem('serviceData', JSON.stringify(kbapp.currServices));
  },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  checkUser(proc){
    if (this.priv.userrights <= '2') {
      // console.log(JSON.stringify(this.allKB));
      if ((JSON.stringify(this.allKB) == "[]") && (proc != 1) ){
        // swal("Warning", "Unable to access your request.", "warning");
      } else {
        if (proc == 1) {
          kbapp.showAddModal = true;
        } else if (proc == 2) {
          kbapp.showEditModal = true;
        } else if (proc == 3) {
          kbapp.showDeleteModal = true;
        } else {
          // swal("", "Unable to access your request.", "warning");
        }
      }
    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
  },
  setFocus(event){
    if (event == 1) {
      document.getElementById('addid').focus();
    } else if (event == 2) {
      document.getElementById('addservicename').focus();
    } else if (event == 3) {
      document.getElementById('addservicevalue').focus();
    } else if (event == 4) {
      document.getElementById('addbtn').focus();
    } else if (event == 5) {
      document.getElementById('editid').focus();
    } else if (event == 6) {
      document.getElementById('editservicename').focus();
    } else if (event == 7) {
      document.getElementById('editservicevalue').focus();
    } else if (event == 8) {
      document.getElementById('editbtn').focus();
    } else {
      document.getElementById('').focus();
    }
  },

},
});
