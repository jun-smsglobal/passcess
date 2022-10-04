var app = new Vue({
el: '#app',
data: {
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  vesselSetting : {vesselID: "", fleetID: "", partnerID: "", tempID: ""},
  vessels: [],
  newVessel: {imo: "", vesselid: "", mac_address: "", vesselname: "", landingpage: "www.smsglobal.net", time_allowance: "30", percentage_allowance: "50", eta_time_allowance: "10",
    reboot_time_allowance: "10", unique_id: "", p2breconnecttime: "0", fleetid: "", bandwidth_value: "0", radius_domain: "", bandwidth_status: "", busnet_dload: "", busnet_uload: "",
    capacity: "", watchdog_services:{}, gps_settings:{}},
  appservices:[ {httpd: "0", mysqld: "0", radiusd: "0", dnsmasq: "0", crond: "0", vtrac:"0"}],
  // appservices: {},
  btnInputDisable: false,
  btnShow: true,
  currVessel: {},
  oldVessel: {},
  pageVessels: [],
  perPage: 8,
  activePage: 1,
  optFleet: [{ text: '', value: '' }],
  optFleetList: [{ text: '', value: '' }],
  optVess: [{ text: '', value: '' }],
  privilage : {userrights : null, useraccess : null, TokenKey : null}
},
mounted: function(){
  this.processPrivilage();
  this.getAllServices();
  this.getFleet();
  setTimeout(() => { this.getAllVessels(); }, 200);
  removeData();
},
methods: {
  getAllVessels(){
    axios
      .get(serverurl + "vessel/settings")
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(app.privilage.userrights <= '2') {
          app.vessels = response.data;
          app.oldVessel = response.data;
        } else {
          if((JSON.stringify(response.data) == "[]") || (JSON.stringify(response.data) == "")){
            console.log(JSON.stringify(response.data));
            app.vessels = [];
          } else {
            app.vessels = app.FilterFleetVess(response.data);
            app.oldVessel = app.FilterFleetVess(response.data);
          }
        };
        app.getDataGrid(app.vessels);
        // app.pageCount(app.vessels, app.activePage);
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        app.getDataGrid("");
        app.vessels = [{}];
      })
      .finally(function(){
        if (app.vesselSetting.vesselID){
          // window.localStorage.setItem('vesselID', app.vessels[0].vesselid);
          // window.localStorage.setItem('fleetID', app.vessels[0].fleetid);
        };
      });
    this.checkBtnShow();
  },
  // getVessels(vessid){
  //   if (vessid) {
  //     if((vessid.length) >= 3) {
  //       axios
  //         .get(serverurl + "vessel/search/" + vessid)
  //         .then(function(response){
  //           app.vessels = [];
  //           app.vessels = response.data;
  //           // console.log(JSON.stringify(app.vessels));
  //           app.pageCount(app.vessels, app.activePage);
  //         })
  //         .catch(function(error){
  //           console.log(JSON.stringify(error.message));
  //           app.vessels = app.newVessel;
  //         });
  //     } else {
  //       swal("Warning", "Must be more than 2 char/s to search.", "warning");
  //     }
  //   } else {
  //     app.getAllVessels();
  //   }
  // },
  getFleetList(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=2&id="+ this.vesselSetting.partnerID)
      .then(function(response){
        if(!response.data.error){
          app.optFleetList = response.data.vessel;
        } else {
          swal("", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        app.optFleet = [{ text: '', value: '' }];
      });
  },
  getAllServices(){
    axios
      .get(localurl + "watchdog.php?action=allservice")
      .then(function(response){
        if(!response.data.error){
          if(JSON.stringify(response.data.appservice) == "[]"){
            app.newVessel.watchdog_services = app.appservice
          } else {
            app.newVessel.watchdog_services = response.data.appservice;
            app.appservices = response.data.appservice;
          }
          // console.log(JSON.stringify(app.newVessel.watchdog_services));
        } else {
          swal("", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(error);
        app.appservices = '[{httpd: "0", mysqld: "0", radiusd: "0"}]';
      });
  },
  getFleet(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=17&id="+ this.vesselSetting.partnerID)
      .then(function(response){
        if(!response.data.error){
          app.optFleet = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        app.optFleet = [{ text: '', value: '' }];
      });
  },
  FilterFleetVess(dataObj){
    var results = [];
    results = dataObj.filter(function(item){

      for(var i = 0; i < app.optFleet.length; i++) {
        var obj = app.optFleet[i];
        return item.fleetid == obj.value;
      };
        // return item.fleetid == "1";
      })
    return results;
  },
  addVessel(){
    app.newVessel.unique_id = Math.floor(Date.now() / 1000);
    // console.log(app.newVessel.unique_id);
    var formData = app.toFormData(app.newVessel);
    axios
      .post(serverurl + "vessel/settings", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "REGISTERED"}', app.newVessel);

        app.newVessel = {vesselid: "", mac_address: "", vesselname: "", landingpage: "www.smsglobal.net", time_allowance: "30", percentage_allowance: "50", eta_time_allowance: "10",
          unique_id: "", p2breconnecttime: "0", fleetid: "", bandwidth_value: "0", radius_domain: "", bandwidth_status: "", busnet_dload: "", busnet_uload: "", watchdog_services:{}},

        app.getAllVessels();
        swal("", "Successfully added", "success");
      })
      .catch(function(error){
        if(error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log(JSON.stringify(error.message));
        }
        console.log(error.config);
        swal("", JSON.stringify(error.message), "warning");
      }) ;
  },
  updateVessel(){
    app.oldVessel = window.localStorage.getItem('vesselSett');
    // console.log(JSON.stringify(app.currVessel));
    axios
      .put(serverurl + "vessel/settings/" + this.currVessel['vesselid'], app.currVessel)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), app.oldVessel, app.currVessel);
        app.currVessel = {};
        app.oldVessel = {};
        // window.localStorage.removeItem('vesselSett');
        removeData();
        app.getAllVessels();
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
          console.log(JSON.stringify(error.message));
        }
        console.log(error.config);
        swal("Warning", JSON.stringify(error.message), "warning");
      }) ;
  },
  deleteVessel(){
    axios
      .delete(serverurl + "vessel/settings/" + this.currVessel['vesselid'], app.currVessel)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "UNREGISTERED"}', app.currVessel);
        app.getAllVessels();
        swal("", "Successfully deactivated \n\n Vessel ID :" + app.currVessel.vesselid, "success");
        app.currVessel = {};
      })
      .catch(function(error){
        if(error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log(JSON.stringify(error.message));
        }
        console.log(error.config);
        // swal("Warning", JSON.stringify(error.message), "warning");
      }) ;
  },
  selectVessel(vess){
    if(vess.vesselid){
      axios
        .get(serverurl + "vessel/settings/" + vess.vesselid)
        .then(function(response){
          app.currVessel = [];
          if(JSON.stringify(response.data)){
            app.currVessel = response.data;
            if(!app.currVessel.watchdog_services) {
              app.currVessel.watchdog_services = app.appservices;
            }
            // console.log(JSON.stringify(app.currVessel.watchdog_services));
          } else {
            // swal("Warning", "No Data Found.", "warning");
          }
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          app.currVessel = [];
        });
    };

    // app.currVessel = vess;
    window.localStorage.setItem('vesselSett', JSON.stringify(app.currVessel));
  },
  checkData(){
    console.log(JSON.stringify(app.currVessel.watchdog_services));
  },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  checkUser(proc){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      // console.log(JSON.stringify(this.vessels) );
      if (JSON.stringify(this.vessels)){
        if (proc == 1) {
          app.showAddModal = true;
        } else if (proc == 2) {
          app.showEditModal = true;
        } else if (proc == 3) {
          app.showDeleteModal = true;
        } else {
          // swal("", "Unable to access your request.", "warning");
        }
      } else {
        // swal("", "Unable to access your request.", "warning");
      }
    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
  },
  processPrivilage(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
    this.privilage.TokenKey = window.localStorage.getItem('tokenKey');

    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');
    this.vesselSetting.fleetID = window.localStorage.getItem('fleetID');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  processVessel(vessID, fleetID){
    window.localStorage.setItem('vesselID', vessID);
    window.localStorage.setItem('fleetID', fleetID);
  },
  switch_process(proc){
    if (proc == 1){
      if (app.newVessel.bandwidth_status == 1){
        app.newVessel.bandwidth_value = 1024;
      } else {
        app.newVessel.bandwidth_value = 0;
      }
    } else if (proc == 2){
      if (app.currVessel.bandwidth_status == 1){
        app.currVessel.bandwidth_value = 1024;
      } else {
        app.currVessel.bandwidth_value = 0;
      }
    }

  },
  getDataGrid(vdata){
    // Load only once for datatable
    var oTblReport = null;
    oTblReport = $("#vesseldata").DataTable ({
      "data" : vdata,
      // "scrollX": true,
      // "scrollY": 450,
      "paging": true,
      "responsive": true,
      "searching": true,
      "destroy": true,
      "deferRender": true,
      "pagingType": "input",
      "pageLength": 50,
      "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      "language": {
        "searchPlaceholder": "",
        "paginate": {
          first: "<<",
          last: ">>",
          next: ">",
          previous: "<"
        },
          "sEmptyTable": "No data available in table",
          "sLoadingRecords": "Loading...",
          "sProcessing": "Processing...",
          "sSearch": "Search: ",
          "sZeroRecords": "No matching records found"
        },
        "bInfo" : false,
        // "bLengthChange": false,
        "columns" : [
            { title: "", data: "vesselid",  className: "text-center",
              render : function ( data, type, row, meta ) {
                // var appRights = app.privilage.userrights;
                // '<li><a href="#" class="button-news" id=n-"' + meta.row + '">News/Announcement</a></li>'+
                return '<div class="btn-group">'+
                   '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" style="padding:0;border:none;background:none;">' +
                     '&nbsp;&nbsp;<span class="caret"></span></button>'+
                   '<ul class="dropdown-menu">'+
                     '<li><a href="#" class="button-network" id=n-"' + meta.row + '">Network Settings</a></li>'+
                     '<li><a href="#" class="button-firewall" id=n-"' + meta.row + '">Firewall Settings</a></li>'+
                     '<li><a href="#" class="button-voyage" id=n-"' + meta.row + '">Voyage Scheduling</a></li>'+
                     '<li class="divider"></li>'+
                     '<li><a href="#" class="button-user" id=n-"' + meta.row + '">Onboard Portal User</a></li>'+
                     '<li class="divider"></li>'+
                     '<li><a href="#" class="button-vessels" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">Edit Vessel Info</a></li>'+
                     '<li class="divider"></li>'+
                     '<li><a href="#" class="button-deactivate" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalDel">Deactivate Vessel</a></li>'+
                   '</ul></div>';
              }},
            { title: "IMO No.", data: "imo", className: "text-center",
              render : function ( data, type, row, meta ) {
                var uRights = app.privilage.userrights;
                return uRights >= 3 ? data :
                  '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Vessel Name", data: "vesselname", className: "text-left",
              render : function ( data, type, row, meta ) {
                var uRights = app.privilage.userrights;
                return uRights >= 3 ? data :
                  '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Date Registered", data: "created_at", className: "text-center",
              render : function ( data, type, row, meta ) {
                var uRights = app.privilage.userrights;
                return uRights >= 3 ? moment(data).format('YYYY-MM-DD HH:mm') :
                  '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+
                    moment(data).format('YYYY-MM-DD HH:mm') +'</button>';
              }},
            { title: "Capacity", data: "capacity", className: "text-center",
              render : function ( data, type, row, meta ) {
                var uRights = app.privilage.userrights;
                return uRights >= 3 ? data :
                  '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Origin", data: "origin", className: "text-center",
              render : function ( data, type, row, meta ) {
                var uRights = app.privilage.userrights;
                return uRights >= 3 ? data :
                  '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "ETD", data: "etd", className: "text-center",
              render : function ( data, type, row, meta ) {
                var uRights = app.privilage.userrights;
                return uRights >= 3 ? data :
                  '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Destination", data: "destination", className: "text-center",
              render : function ( data, type, row, meta ) {
                var uRights = app.privilage.userrights;
                return uRights >= 3 ? data :
                  '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "ETA", data: "eta", className: "text-center",
              render : function ( data, type, row, meta ) {
                var uRights = app.privilage.userrights;
                return uRights >= 3 ? data :
                  '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
        ],
        "order": [ 3, "desc" ],
        "retrieve" : true
    });

    $('#vesseldata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#vesseldata').DataTable().row( id ).data();

      // console.log(JSON.stringify(data));
      app.checkUser(2);
      app.selectVessel(data);
      app.getFleetList();
      app.checkIMO(data);
      app.setFocusModal('2');
    });

    $('#vesseldata tbody').on('click', '.button-network', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#vesseldata').DataTable().row( id ).data();

      app.processVessel(data.vesselid, data.fleetid);
      checkPrivilage(1);
    });
    $('#vesseldata tbody').on('click', '.button-firewall', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#vesseldata').DataTable().row( id ).data();

      app.processVessel(data.vesselid, data.fleetid);
      checkPrivilage(2);
    });
    $('#vesseldata tbody').on('click', '.button-voyage', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#vesseldata').DataTable().row( id ).data();

      app.processVessel(data.vesselid, data.fleetid);
      checkPrivilage(3);
    });
    $('#vesseldata tbody').on('click', '.button-user', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#vesseldata').DataTable().row( id ).data();

      app.processVessel(data.vesselid, data.fleetid);
      checkPrivilage(21);
    });
    $('#vesseldata tbody').on('click', '.button-news', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#vesseldata').DataTable().row( id ).data();

      app.processVessel(data.vesselid, data.fleetid);
      checkPrivilage(23);
    });
    $('#vesseldata tbody').on('click', '.button-vessels', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#vesseldata').DataTable().row( id ).data();

      // console.log(JSON.stringify(data));
      app.checkUser(2);
      app.selectVessel(data);
      app.getFleetList();
      app.setFocusModal('2');
    });
    $('#vesseldata tbody').on('click', '.button-deactivate', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#vesseldata').DataTable().row( id ).data();

      app.checkUser(3);
      app.selectVessel(data);
    });
    // tool tip for page button nav
    $('#vesseldata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#vesseldata_next.next.paginate_button').attr('title', 'Next');
    $('#vesseldata_first.first.paginate_button').attr('title', 'First');
    $('#vesseldata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#vesseldata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(){
    var myTable = $('#vesseldata').DataTable();
    myTable.clear().draw();
  },
  setFocus(eventid){
    document.getElementById(eventid).focus();
  },
  setFocusModal(proc){
    if(proc == "1"){
      $('body').on('shown.bs.modal', '#myModalAdd', function () {
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
  checkIMO(data){
    if(data.imo == ""){
      app.btnInputDisable = false
    } else {
      app.btnInputDisable = true
    };
  },
  checkBtnShow(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights == '1') {
      this.btnShow = true;
    } else {
      this.btnShow = false;
    }
  },

},
});
