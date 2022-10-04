var appuser = new Vue({
el: '#appuser',
data: {
  vesselSetting : {vesselID: "", fleetID: "", partnerID: ""},
  privilage : {userrights : null, useraccess : null, TokenKey : null},
  userListData: [],
  // currUserList: {},
  newUser: {name: "", email: "", password: "", company: "", vessel: "", position: ""},
  currRoleList: {},
  currUserList: {id: "", approved_by: "", role: "", name: ""},

  userRoleData: [],
  currRoleData: {},
  listRoleData: {},
  newRole: {role: ""},
  // grantRole: {rolename: "", {name:"", permission_id:""}},
  grantRole: {role: "", permission:{}},
  temprole: [],
  temppermission: [],
  roleactive: [],
  currentPermi: [],

  userPermiData: [],
  currPermiData: {},
  newPermi: {permission: ""},
  oldData: {},
  showRegModal: false,
  showEditUserModal: false,
  showDelUserModal: false,

  showRoleModal: false,
  showEditRoleModal: false,
  showDelRoleModal: false,

  showPermiModal: false,
  showEditPermiModal: false,
  showDelPermiModal: false,
  delName: [],
  btnShow: true,

  optFleet: [{ text: '', value: '' }],
  btnDelDisUser: true,
  btnDelDisRole: true,
  btnDelDisPermi: true,
},
mounted: function(){
  this.processPrivilage();
  this.getFleetList();
  setTimeout(() => { this.getPermission(); }, 200);
  setTimeout(() => { this.getUserRole(); }, 200);
  setTimeout(() => { this.getUserList(); }, 200);
},
methods: {
  getUserList(){
    axios
      // .get(serverurl + "user/list" + this.vesselSetting.vesselID)
      .get(serverurl + "user/list")
      .then(function(response){
        appuser.userListData = response.data;
        appuser.getDataGridUser(response.data);
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appuser.userListData = [];
        appuser.getDataGridUser("");
      })
      .finally(function(){
        appuser.delBtnShowUser();
      }) ;
  },
  getUserRole(){
    axios
      .get(serverurl + "userrole")
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        appuser.userRoleData = response.data;
        appuser.getDataGridRole(response.data);
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appuser.userRoleData = [];
        appuser.getDataGridRole("");
      })
      .finally(function(){
        appuser.delBtnShowRole();
      });
  },
  getPermission(){
    axios
      .get(serverurl + "userpermission")
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        appuser.userPermiData = response.data;
        appuser.getDataGridPermi(response.data);
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appuser.userPermiData = [];
        appuser.getDataGridPermi("");
      })
      .finally(function(){
        appuser.GetPermiList();
        appuser.delBtnShowPermi();
      });
  },
  getFleetList(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=2&id=0")
      .then(function(response){
        if(!response.data.error){
          appuser.optFleetList = response.data.vessel;
        } else {
          swal("", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appuser.optFleet = [{ text: '', value: '' }];
      });
  },
  processPrivilage(){
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');

    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
    this.privilage.TokenKey = window.localStorage.getItem('tokenKey');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');

    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      this.btnShow = true;
    } else {
      this.btnShow = false;
      // swal("", "Please contact your system administrator.", "warning");
    };
  },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  getDataGridUser(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#userData").DataTable ({
        "data" : vdata,
        "paging": true,
        "responsive": true,
        "searching": true,
        "destroy": true,
        "deferRender": true,
        "pagingType": "input",
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
        "columns" : [
            { title: '<input type="checkbox" id="checkall" title="Select all" class="checkall"/>', data: null, className: "text-center", orderable: false,
              render: function (data, type, row, meta) {
                return '<input type="checkbox" value="'+ data.id + '" class="checkidrole" id=c-' + meta.row + '>';
              }},
            { title: "Full Name", data: "name", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-' + meta.row + ' data-toggle="modal" data-target="#myModalEditUser">'+ data +'</button>';
              }},
            { title: "E-Mail Address", data: "email", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-' + meta.row + ' data-toggle="modal" data-target="#myModalEditUser">'+ data +'</button>';
              }},
            { title: "Company", data: "company", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-' + meta.row + ' data-toggle="modal" data-target="#myModalEditUser">'+ data +'</button>';
              }},
            { title: "Position", data: "position", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-' + meta.row + ' data-toggle="modal" data-target="#myModalEditUser">'+ data +'</button>';
              }},
            { title: "Fleet", data: "fleetid", className: "text-left",
              render : function ( data, type, row, meta ) {
                var value = appuser.optFleetList;
                for(var i=0; i<value.length; i++){
                  if(value[i].value === data)
                  {
                    return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ value[i].text +'</button>' ;
                    break;
                  }
                }
              }},
            { title: "Approved by", data: "approved_by", className: "text-left",
              render : function ( data, type, row, meta ) {
                return data == null ?
                  '<button type="button" class="borderless-button" id=n-' + meta.row + ' data-toggle="modal" data-target="#myModalEditUser">for approval</button>' :
                  '<button type="button" class="borderless-button" id=n-' + meta.row + ' data-toggle="modal" data-target="#myModalEditUser">'+ data +'</button>';
              }},
        ],
        "order": [[ 1, "asc" ]],
        "retrieve" : true
    });

    $('#userData tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#userData').DataTable().row( id ).data();
        appuser.selectUser(data);
        appuser.checkUser(2);
        appuser.setFocusModalUser('2');
    });
    $('#userData tbody').on('click', '.checkidrole', function () {
      var allSelected = $('.checkidrole:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
      appuser.delBtnShowUser();
    });
    $("#checkall").on('click', function () {
        $('#userData').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
      appuser.delBtnShowUser();
    });

    $(".dataTables_filter input").on('keyup change', function() {
      $('#userData').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });
    // tool tip for page button nav
    $('#userData_previous.previous.paginate_button').attr('title', 'Previous');
    $('#userData_next.next.paginate_button').attr('title', 'Next');
    $('#userData_first.first.paginate_button').attr('title', 'First');
    $('#userData_last.last.paginate_button').attr('title', 'Last');

    this.clearGridUser();
    this.RefreshDataUser(vdata);
  },
  RefreshDataUser(vdata){
    var myTable = $('#userData').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGridUser(id){
    var myTable = $('#userData').DataTable();
    myTable.clear().draw();
  },
  regUser(){
    // console.log(JSON.stringify(appuser.newUser));
    var formData = appuser.toFormData(appuser.newUser);
    axios
      .post(serverurl + "user/register", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "REGISTER USER"}', appuser.newUser);
        appuser.newUser = '{name: "", email: "", password: "", company: "", vessel: "", position: ""}' ;
        appuser.getUserList();
        swal("", "Successfully added", "success");
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      });
  },
  approveUser(){
    // console.log(JSON.stringify(appuser.currUserList));
    var formData = appuser.toFormData(appuser.currUserList);
    axios
      .post(serverurl + "user/approve", formData)
      .then(function(response){
        var res = (JSON.stringify(response.data.message));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "APPROVED USER"}', appuser.currUserList);
        appuser.currUserList = '{id: "", approved_by: "", role: "", name: ""}' ;
        appuser.getUserList();
        swal("", res + "\n" + "Notification will be sent to the user", "success");
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      });
  },

/////////////////////////////////////////////
  getDataGridRole(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#roleData").DataTable ({
        "data" : vdata,
        "paging": true,
        "responsive": true,
        "searching": true,
        "destroy": true,
        "deferRender": true,
        "pagingType": "input",
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
        "columns" : [
            { title: '<input type="checkbox" id="checkall" title="Select all" class="checkall"/>', data: null, className: "text-center", orderable: false,
              render: function (data, type, row, meta) {
                return '<input type="checkbox" value="'+ data.id + '" class="checkidrole" id=c-' + meta.row + '>';
              }},
            { title: "Role", data: "name", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-' + meta.row + ' data-toggle="modal" data-target="#myModalEditRole">'+ data +'</button>';
              }},
        ],
        "order": [[ 1, "asc" ]],
        "retrieve" : true
    });

    $('#roleData tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#roleData').DataTable().row( id ).data();
        appuser.selectRole(data);
        appuser.checkUser(5);
        appuser.setFocusModalRole('2');
    });
    $('#roleData tbody').on('click', '.checkidrole', function () {
      var allSelected = $('.checkidrole:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
      appuser.delBtnShowRole();
    });
    $("#checkall").on('click', function () {
        $('#roleData').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
      appuser.delBtnShowRole();
    });

    $(".dataTables_filter input").on('keyup change', function() {
      $('#roleData').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });
    // tool tip for page button nav
    $('#roleData_previous.previous.paginate_button').attr('title', 'Previous');
    $('#roleData_next.next.paginate_button').attr('title', 'Next');
    $('#roleData_first.first.paginate_button').attr('title', 'First');
    $('#roleData_last.last.paginate_button').attr('title', 'Last');

    this.clearGridRole();
    this.RefreshDataRole(vdata);
  },
  RefreshDataRole(vdata){
    var myTable = $('#roleData').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGridRole(id){
    var myTable = $('#roleData').DataTable();
    myTable.clear().draw();
  },
  selectUser(uData){
    // appuser.currUserList = uData;
    appuser.currUserList.id = uData.id;
    appuser.currUserList.name = uData.name;
    if((uData.approved_by == "") || (uData.approved_by == null)) {
      appuser.currUserList.approved_by = window.localStorage.getItem('supportUser');
    } else {
      appuser.currUserList.approved_by = uData.approved_by;
    }
    appuser.currUserList.role = "guest";

    appuser.currRoleList = appuser.userRoleData;
    // console.log(JSON.stringify(appuser.currUserList));
    // window.localStorage.setItem('userData', JSON.stringify(appuser.currUserList));
  },
  selectRole(rData){
    appuser.currRoleData = rData;
    appuser.GetUserRoleList(appuser.currRoleData.name);
    // appuser.grantRole.role = appuser.currRoleData.name;
    // window.localStorage.setItem('roleData', JSON.stringify(appuser.currRoleData));
  },
  selectPermi(pData){
    appuser.currPermiData = pData;
    window.localStorage.setItem('permiData', JSON.stringify(appuser.currPermiData));
  },
  checkUser(proc){
    if (this.privilage.userrights == '1') {

      switch (proc) {
        case 1:
          appuser.showRegModal = true;
          break;
        case 2:
          appuser.showEditUserModal = true;
          break;
        case 3:
          appuser.showDelUserModal = true;
          break;
        // role
        case 4:
          appuser.showRoleModal = true;
          break;
        case 5:
          appuser.showEditRoleModal = true;
          break;
        case 6:
          var allSelected = $('.checkidrole:checked')
          appuser.delName = [];

          if(allSelected.length == 0){
            swal("", "Please select a record.", "warning");
          } else {
            $.each(allSelected, function(i, val){
              var id = $(val).attr("id").match(/\d+/)[0];
              var data = $('#roleData').DataTable().row( id ).data();
              appuser.delName.push(data.name);
            });
            appuser.showDelRoleModal = true;
          }
          break;
        // permission
        case 7:
          appuser.showPermiModal = true;
          break;
        case 8:
          appuser.showEditPermiModal = true;
          break;
        case 9:
          var allSelected = $('.checkidpermi:checked')
          appuser.delName = [];

          if(allSelected.length == 0){
            swal("", "Please select a record.", "warning");
          } else {
            $.each(allSelected, function(i, val){
              var id = $(val).attr("id").match(/\d+/)[0];
              var data = $('#permiData').DataTable().row( id ).data();
              appuser.delName.push(data.name);
            });
            appuser.showDelPermiModal = true;
          }
          break;
      default:
        swal("", "Please contact your system administrator.", "warning");
      };

    } else {
      swal("", "Please contact your system administrator.", "warning");
    };
  },
  setFocus(eventid){
    document.getElementById(eventid).focus();
  },
  setFocusModalUser(proc){
    if(proc == "1"){
      $('body').on('shown.bs.modal', '#myModalReg', function () {
          $('input:visible:enabled:first', this).focus();
          $('input:visible:enabled:first', this).select();
          $('.modal-dialog').draggable({
            handle: ".modal-header"
          });
      })
    } else if (proc == "2") {
      $('body').on('shown.bs.modal', '#myModalEditUser', function () {
          $('input:visible:enabled:first', this).focus();
          $('input:visible:enabled:first', this).select();
          $('.modal-dialog').draggable({
            handle: ".modal-header"
          });
      })
    };
  },
  setFocusModalRole(proc){
    if(proc == "1"){
      $('body').on('shown.bs.modal', '#myModalAddRole', function () {
          $('input:visible:enabled:first', this).focus();
          $('input:visible:enabled:first', this).select();
          $('.modal-dialog').draggable({
            handle: ".modal-header"
          });
      })
    } else if (proc == "2") {
      $('body').on('shown.bs.modal', '#myModalEditRole', function () {
          $('input:visible:enabled:first', this).focus();
          $('input:visible:enabled:first', this).select();
          $('.modal-dialog').draggable({
            handle: ".modal-header"
          });
      })
    };
  },
  setFocusModalPermi(proc){
    if(proc == "1"){
      $('body').on('shown.bs.modal', '#myModalAddPermi', function () {
          $('input:visible:enabled:first', this).focus();
          $('input:visible:enabled:first', this).select();
          $('.modal-dialog').draggable({
            handle: ".modal-header"
          });
      })
    } else if (proc == "2") {
      $('body').on('shown.bs.modal', '#myModalEditPermi', function () {
          $('input:visible:enabled:first', this).focus();
          $('input:visible:enabled:first', this).select();
          $('.modal-dialog').draggable({
            handle: ".modal-header"
          });
      })
    };
  },
  delBtnShowUser(){
    var allSelected = $('.checkid:checked')
    if(allSelected.length == 0){
      appuser.btnDelDisUser = true;
    } else {
      appuser.btnDelDisUser = false;
    }
  },
  delBtnShowRole(){
    var allSelected = $('.checkidrole:checked')
    if(allSelected.length == 0){
      appuser.btnDelDisRole = true;
    } else {
      appuser.btnDelDisRole = false;
    }
  },
  delBtnShowPermi(){
    var allSelected = $('.checkidpermi:checked')
    if(allSelected.length == 0){
      appuser.btnDelDisPermi = true;
    } else {
      appuser.btnDelDisPermi = false;
    }
  },

  AddUserRole(){
    // console.log(JSON.stringify(appuser.newRole));
    var formData = appuser.toFormData(appuser.newRole);
    axios
      .post(serverurl + "userrole", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD USER ROLE"}', appuser.newRole);
        appuser.newRole = {name:""};
        appuser.getUserRole();
        swal("", "Successfully added", "success");
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      });
  },
  EditUserRole(){
    appuser.oldData = appuser.temppermission;
    var finalStr = "";
    var options = document.getElementById('editactivepermi').options;
    for (let i = 0; i < options.length; i++) {
      if(options.length == (i + 1)){
        finalStr += options[i].value
      } else {
        finalStr += options[i].value + ',' ;
      }
    }
    appuser.grantRole.permission = finalStr;
    // console.log(JSON.stringify(appuser.grantRole));

    var formData = appuser.toFormData(appuser.grantRole);
    axios
      // .put(serverurl + "userrole/" + this.currRoleData['id'], appuser.currRoleData)
      .post(serverurl + "userpermission/granttorole", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), JSON.stringify(appuser.oldData), appuser.grantRole);
        // removeData();
        appuser.getUserRole();
        swal("", "Successfully updated", "success");
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      }) ;
  },
  DelUserRole(){
    console.log(JSON.stringify(appuser.currRoleData));
    // axios
    //   .delete(serverurl + "userrole/" + this.currRoleData['id'], this.currRoleData)
    //   .then(function(response){
    //     // console.log(JSON.stringify(response.data));
    //     addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE USER ROLE"}', appuser.currRoleData);
    //     appuser.currRoleData = {};
    //   })
    //   .catch(function(error){
    //     if(error.response) {
    //       console.log(JSON.stringify(error.message));
    //     }
    //   }) ;
  },
  DelRole(){
    var allSelected = $('.checkidrole:checked')
    if(allSelected.length != 0){
      $.each(allSelected, function(i, val){

        var id = $(val).attr("id").match(/\d+/)[0];
        var data = $('#roleData').DataTable().row( id ).data();
        appuser.selectRole(data);
        appuser.DelUserRole();
      });

      swal("", "Successfully deleted", "success");
      $('.checkall').each(function(){ this.checked = false; });
      setTimeout(() => { appuser.getUserRole(); }, 500);
    } else {
      swal("", "Please select a record.", "warning");
    }
  },
  GetPermiList(){
    // console.log(JSON.stringify(appuser.userPermiData));
    appuser.temprole = [];

    for (var key of Object.keys(appuser.userPermiData)) {
      var element = {};
      element.permission_id = appuser.userPermiData[key].id;
      element.name = appuser.userPermiData[key].name;

      appuser.temprole.push(element);
      // appuser.currentPermi.push(element);
    };
  },
  GetUserRoleList(varRole){
    appuser.grantRole.role = "";
    appuser.grantRole.permission = "{}";
    appuser.grantRole.role = varRole;
    axios
      .get(serverurl + "userpermission/list/role/" + varRole)
      .then(function(response){
        if(JSON.stringify(response.data[0])){
          appuser.temppermission = response.data;
          delete appuser.temppermission.rolename;
        } else {
          appuser.temppermission = [];
          console.log(JSON.stringify(response.data) );
        };
      })
      .catch(function(error){
        appuser.temppermission = [];
        console.log(JSON.stringify(error.message));
      })
      .finally(function(){
        appuser.checkRoleList(appuser.temppermission);
      }) ;
  },
  compareDiff(newJson, oldJson) {
      let ids = oldJson.map(ch => ch.permission_id);
      return newJson.filter(ch => !ids.includes(ch.permission_id));
  },
  compareSame(newJson, oldJson) {
      let ids = oldJson.map(ch => ch.permission_id);
      return newJson.filter(ch => ids.includes(ch.permission_id));
  },
  checkRoleList(varID){
    var diffRole = [];
    var varRole = [];

    if((JSON.stringify(varID) == "") || (JSON.stringify(varID) == "{}") || (JSON.stringify(varID) == "[]")) {
      appuser.currentPermi = appuser.temprole;
      appuser.roleactive = [];
    } else {
      for (var key of Object.keys(varID)) {
        var element = {};
        element.permission_id = varID[key].permission_id;
        element.name = varID[key].name;

        diffRole.push(element)
      };
      // console.log(JSON.stringify(diffRole));

      varRole = appuser.compareSame(appuser.temprole, diffRole) ;
      appuser.roleactive = varRole;

      varRole = appuser.compareDiff(appuser.temprole, diffRole) ;
      appuser.currentPermi = varRole;
    };

    // console.log(JSON.stringify(appuser.roleactive));
    // console.log(JSON.stringify(appuser.currentPermi));
  },
  addDataRole(){
    var findData = [];
    var rdata = document.getElementById("editpermi").value ;
    if(rdata){
      findData = appuser.temprole.filter( record => record.permission_id == rdata);
      appuser.roleactive.push(findData[0]);
      // console.log(JSON.stringify(appuser.currentPermi));

      findData = appuser.currentPermi.findIndex( record => record.permission_id == rdata);
      appuser.currentPermi.splice(findData, 1);
      // console.log(JSON.stringify(appuser.roleactive));
    } else {
      console.log("Empty");
    };

    // if(rdata){
    //   for(var i = 0; i < appuser.userPermiData.length; i++) {
    //     var obj = appuser.userPermiData[i];
    //       if(obj.permission_id == rdata){
    //         var select1 = document.getElementById('editactivepermi')
    //         select1.append(new Option(obj.permission_id, obj.name))
    //       };
    //   };
    //
    //   for(var i = 0; i < appuser.currentPermi.length; i++) {
    //     var obj = appuser.currentPermi[i];
    //       if(obj.permission_id == rdata){
    //         var select2 = document.getElementById('editpermi')
    //         select2.removeChild(select2.querySelector('option[value="' + obj.permission_id + '"]'))
    //       };
    //   };
    // } else {
    //   console.log("Empty");
    // };
  },
  removeDataRole(){
    var findData = [];
    var rdata = document.getElementById("editactivepermi").value;
    if(rdata){
      findData = appuser.temprole.filter( record => record.permission_id == rdata);
      appuser.currentPermi.push(findData[0]);
      // console.log(JSON.stringify(appuser.currentPermi));

      findData = appuser.roleactive.findIndex( record => record.permission_id == rdata);
      appuser.roleactive.splice(findData, 1);
      // console.log(JSON.stringify(appuser.roleactive));
    } else {
      console.log("Empty");
    };
  },
  handleChange(e) {
    if(e.target.options.selectedIndex > -1) {
      console.log(e.target.value)
    }
  },
/////////////////////////////////////////////
  getDataGridPermi(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#permiData").DataTable ({
        "data" : vdata,
        "paging": true,
        "responsive": true,
        "searching": true,
        "destroy": true,
        "deferRender": true,
        "pagingType": "input",
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
        "columns" : [
            { title: '<input type="checkbox" id="checkall" title="Select all" class="checkall"/>', data: null, className: "text-center", orderable: false,
              render: function (data, type, row, meta) {
                return '<input type="checkbox" value="'+ data.id + '" class="checkidpermi" id=c-' + meta.row + '>';
              }},
            { title: "Rights / Permission", data: "name", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-' + meta.row + ' data-toggle="modal" data-target="#myModalEditPermi">'+ data +'</button>';
              }},
        ],
        "order": [[ 1, "asc" ]],
        "retrieve" : true
    });

    $('#permiData tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#permiData').DataTable().row( id ).data();
        appuser.selectPermi(data);
        appuser.checkUser(8);
        appuser.setFocusModalPermi('2');
    });
    $('#permiData tbody').on('click', '.checkidpermi', function () {
      var allSelected = $('.checkidpermi:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
      appuser.delBtnShowPermi();
    });
    $("#checkall").on('click', function () {
        $('#permiData').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
      appuser.delBtnShowPermi();
    });

    $(".dataTables_filter input").on('keyup change', function() {
      $('#permiData').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });
    // tool tip for page button nav
    $('#permiData_previous.previous.paginate_button').attr('title', 'Previous');
    $('#permiData_next.next.paginate_button').attr('title', 'Next');
    $('#permiData_first.first.paginate_button').attr('title', 'First');
    $('#permiData_last.last.paginate_button').attr('title', 'Last');

    this.clearGridPermi();
    this.RefreshDataPermi(vdata);
  },
  RefreshDataPermi(vdata){
    var myTable = $('#permiData').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGridPermi(id){
    var myTable = $('#permiData').DataTable();
    myTable.clear().draw();
  },
  AddUserPermi(){
    // console.log(JSON.stringify(appuser.newPermi));
    var formData = appuser.toFormData(appuser.newPermi);
    axios
      .post(serverurl + "userpermission", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD USER Permission"}', appuser.newPermi);
        appuser.newPermi = {name:""};
        appuser.getPermission();
        swal("", "Successfully added", "success");
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      });
  },
  EditUserPermi(){
    console.log(JSON.stringify(appuser.currPermiData));
    appuser.oldData = window.localStorage.getItem('permiData');

    // axios
    //   .put(serverurl + "userpermission/" + this.currPermiData['id'], appuser.currPermiData)
    //   .then(function(response){
    //     // console.log(JSON.stringify(response.data));
    //     addLogUpdate(window.localStorage.getItem('supportUser'), appuser.oldData, appuser.currPermiData);
    //     appuser.currPermiData = {};
    //     appuser.oldData = {};
    //     // removeData();
    //     appuser.getPermission();
    //     swal("", "Successfully updated", "success");
    //   })
    //   .catch(function(error){
    //     console.log(JSON.stringify(error.message));
    //   }) ;
  },
  DelUserPermi(){
    console.log(JSON.stringify(appuser.currPermiData));
    // axios
    //   .delete(serverurl + "userpermission/" + this.currPermiData['id'], this.currPermiData)
    //   .then(function(response){
    //     // console.log(JSON.stringify(response.data));
    //     addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE USER Permission"}', appuser.currPermiData);
    //     appuser.currPermiData = {};
    //   })
    //   .catch(function(error){
    //     if(error.response) {
    //       console.log(JSON.stringify(error.message));
    //     }
    //   }) ;
  },
  DelPermi(){
    var allSelected = $('.checkidpermi:checked')
    if(allSelected.length != 0){
      $.each(allSelected, function(i, val){

        var id = $(val).attr("id").match(/\d+/)[0];
        var data = $('#permiData').DataTable().row( id ).data();
        appuser.selectPermi(data);
        appuser.DelUserPermi();
      });

      swal("", "Successfully deleted", "success");
      $('.checkall').each(function(){ this.checked = false; });
      setTimeout(() => { appuser.getPermission(); }, 500);
    } else {
      swal("", "Please select a record.", "warning");
    }
  },

},
});
