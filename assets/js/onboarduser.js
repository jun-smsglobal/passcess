var onboard = new Vue({
el: '#onboard',
data: {
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  btnDelDisable: true,
  btnShow: true,
  vesselSetting : {vesselID: "", fleetID: "", partnerID: ""},
  userList: [],
  userDataOld: [],
  newuserData:
        { vesselid: "",
          username: "",
          password: "",
          permissions: []
        },
  currUserData: {},
  pageUsers: [],
  delName: [],
  privilage : {userrights : null, useraccess : null},
  optVess: [{ text: '', value: '' }]
},
mounted: function(){
  this.processPrivilage();
  this.getVessel();
  setTimeout(() => { this.getAllUsers(); }, 200);
  removeData();
},
methods: {
  getAllUsers(){
    axios
      .get(serverurl + "userpanel/vessel/" + this.vesselSetting.vesselID)
      .then(function(response){
        onboard.userList = response.data;
        onboard.userDataOld = response.data;
        onboard.getDataGrid(response.data);
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        onboard.getDataGrid("");
        onboard.userList = [{}];
      })
      .finally(function(){
          onboard.delBtnShow();
      });
    this.checkBtnShow();
  },
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
          onboard.optVess = response.data.vessel;
          if (onboard.vesselSetting.vesselID == ""){
            onboard.vesselSetting.vesselID = onboard.optVess[0].value;
            window.localStorage.setItem('vesselID', onboard.optVess[0].value);
          };
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        onboard.optVess = [{ text: '', value: '' }];
      });
  },
  AddUserPortal(){
    onboard.newuserData.vesselid = this.vesselSetting.vesselID;
    console.log(JSON.stringify(onboard.newuserData));
    axios
      .post(serverurl + "userpanel", onboard.newuserData)
      .then(function(response){
        console.log(response.data);
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD ONBOARD PORTAL USER"}', onboard.newuserData);
        onboard.newuserData = { vesselid: "", username: "", password: "", permissions: []};
        onboard.getAllUsers();
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
  },
  updateUserPortal(){
    onboard.currUserData.vesselid = onboard.vesselSetting.vesselID;
    onboard.userDataOld = window.localStorage.getItem('userSett');
    axios
      .put(serverurl + "userpanel/" + onboard.currUserData.id, onboard.currUserData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), onboard.userDataOld, onboard.currUserData);
        onboard.currUserData = {};
        onboard.userDataOld = {};
        removeData();
        onboard.getAllUsers();
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

  },
  deleteUserPortal(){
    onboard.currUserData.vesselid = onboard.vesselSetting.vesselID;
    axios
      .delete(serverurl + "userpanel/" + onboard.currUserData.id, onboard.currUserData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE ONBOARD PORTAL USER"}', onboard.currUserData);
        onboard.currUserData = {};
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
  },
  selectUser(currentData){
    onboard.currUserData = currentData;
    window.localStorage.setItem('userSett', JSON.stringify(onboard.currUserData));
  },
  processPrivilage(){
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');
    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  changeVesselID(event){
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    this.getAllUsers();
  },
  ChangeRole(data){
    onboard.newuserData.vesselid = onboard.vesselSetting.vesselID;
    // console.log(onboard.newuserData.vesselid);
    // console.log(JSON.stringify(data));
  },
  checkUser(proc){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      if((this.vesselSetting.vesselID == "0") || (this.vesselSetting.vesselID == "")) {
          swal("", "Please choose a vessel.", "warning");
      } else {
        if (proc == 1) {
          onboard.showAddModal = true;
        } else if (proc == 2) {
          onboard.showEditModal = true;
        } else if (proc == 3) {
          var allSelected = $('.checkid:checked')
          if(allSelected.length == 0){
            swal("", "Please select a record.", "warning");
          } else {
            onboard.delName = [];
            var allSelected = $('.checkid:checked')
            $.each(allSelected, function(i, val){
              var id = $(val).attr("id").match(/\d+/)[0];
              var data = $('#onboarddata').DataTable().row( id ).data();
              onboard.delName.push(data.username);
            });
            onboard.showDeleteModal = true;
          }
        } else {
          // swal("", "Unable to access your request.", "warning");
        }
      }
    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
  },
  setFocus(eventid){
    document.getElementById(eventid).focus();
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#onboarddata").DataTable ({
        "data" : vdata,
        "paging": true,
        "responsive": true,
        "searching": true,
        "destroy": true,
        "deferRender": true,
        "pageLength": 50,
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "language": {
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
            { title: '<input type="checkbox" id="checkall" title="Select all" class="checkall"/>', data: null, className: "text-center", orderable: false,
              render: function (data, type, row, meta) {
                return '<input type="checkbox" value="'+ data.id + '" class="checkid" id=c-"' + meta.row + '">';
              }},
            { title: "Onboard User", data: "username", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Roles", data: null, className: "text-left",
              render : function ( data, type, row, meta ) {
                var objCount = data.permissions;
                var finalStr = "";
                for(var i = 0; i < objCount.length; i++) {
                  var obj = objCount[i];
                  if ((objCount.length -1) != i) {
                    finalStr += obj + ", ";
                  } else {
                    finalStr += obj;
                  }
                };
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ finalStr +'</button>';
              }},
            { title: "Full Name", data: null, className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ null +'</button>';
              }},
            { title: "E-Mail Address", data: null, className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ null +'</button>';
              }},
            { title: "Contact Number", data: null, className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ null +'</button>';
              }},
        ],
        "order": [[ 1, "asc" ]],
        "retrieve" : true
    });

    $('#onboarddata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#onboarddata').DataTable().row( id ).data();
        onboard.selectUser(data);
        onboard.checkUser(2);
        onboard.setFocusModal('2');
    });
    $('#onboarddata tbody').on('click', '.checkid', function () {
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
      onboard.delBtnShow();
    });
    $("#checkall").on('click', function () {
        $('#onboarddata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
      onboard.delBtnShow();
    });

    $(".dataTables_filter input").on('keyup change', function() {
      $('#onboarddata').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });
    // tool tip for page button nav
    $('#onboarddata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#onboarddata_next.next.paginate_button').attr('title', 'Next');
    $('#onboarddata_first.first.paginate_button').attr('title', 'First');
    $('#onboarddatalast.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#onboarddata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(id){
    var myTable = $('#onboarddata').DataTable();
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
  GetCheckValue(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      var allSelected = $('.checkid:checked')
      if(allSelected.length != 0){
        $.each(allSelected, function(i, val){

          var id = $(val).attr("id").match(/\d+/)[0];
          var data = $('#onboarddata').DataTable().row( id ).data();
          onboard.selectUser(data);
          onboard.deleteUserPortal();
        });

        swal("", "Successfully deleted", "success");
        $('.checkall').each(function(){ this.checked = false; });
        setTimeout(() => { onboard.getAllUsers(); }, 500);
      } else {
        swal("", "Please select a record.", "warning");
      }

    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
  },
  delBtnShow(){
    var allSelected = $('.checkid:checked')
    if(allSelected.length == 0){
      onboard.btnDelDisable = true;
    } else {
      onboard.btnDelDisable = false;
    }
  },
  checkBtnShow(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '3') {
      this.btnShow = true;
    } else {
      this.btnShow = false;
    }
  },

}
});
