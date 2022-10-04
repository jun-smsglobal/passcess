var appuser = new Vue({
el: '#appuser',
data: {
  searchid: "",
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  btnShow: true,
  btnAction: {show: false, trans: 0, hide: true},
  allusers: [],
  newUser: {userid:"", username: "", userpass: "", rights: 5, access: "0001", active: 3, vessel_partner: "1"},
  currUser: {},
  delName: [],
  priv : {userrights : null, useraccess : null},
  optUserlevel: [
    { text: 'Super Admin', value: '1' },
    { text: 'Partner Admin', value: '2' },
    { text: 'Fleet Admin', value: '3' },
    { text: 'Vessel Admin', value: '4' },
    { text: 'Guest', value: '5' }
  ],
  optUseraccess: [
    { text: 'VIEW', value: '0001' },
    { text: 'UPDATE,VIEW', value: '0011' },
    { text: 'ADD,UPDATE,VIEW', value: '1011' },
    { text: 'ADD,DELETE,UPDATE,VIEW', value: '1111' }
  ],
  optPartner: [],
  optActive: [
    { text: 'Active', value: '1' },
    { text: 'Deactivate', value: '0' },
    { text: 'Unverified', value: '3' },
  ],
  optAction: [
    { text: '', value: '0' },
    // { text: 'Add User', value: '1' },
    // { text: 'Edit User', value: '2' },
    { text: 'Delete User', value: '3' },
    { text: 'Deactivate', value: '4' },
  ]
},
mounted: function(){
  this.processUser();
  // this.getAllPartners();
  this.getAllUsers();
  removeData();
},
methods: {
  getAllUsers(){
    axios
      .get(localurl + "usermngt.php?action=read")
      .then(function(response){
        if(!response.data.error){
          appuser.allusers = response.data.users;
          appuser.getDataGrid(response.data.users);
        } else {
          appuser.getDataGrid("");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error));
        appuser.getDataGrid("");
        appuser.allusers = appuser.newUser;
      });
    this.checkBtnShow();
  },
  getAllPartners(){
    axios
      .get(localurl + "fleetmngt.php?action=readpartner")
      .then(function(response){
        if(!response.data.error){
          appuser.optPartner = response.data.partner;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appuser.optPartner = [];
      });
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#usermngtdata").DataTable ({
        "data" : vdata,
        // "scrollX": true,
        "scrollY": 450,
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
        // "bLengthChange": false,
        "columns" : [
            { title: '<input type="checkbox" id="checkall" title="Select all" class="checkall"/>', data: null, className: "text-center", orderable: false,
              render: function (data, type, row, meta) {
                return '<input type="checkbox" value="'+ data.userid + '" class="checkid" id=c-"' + meta.row + '">';
              }},
            { title: "Control Panel User", data: "username", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Role", data: "rights", className: "text-left",
              render : function ( data, type, row, meta ) {
                var value = appuser.optUserlevel;
                for(var i=0; i<value.length; i++){
                  if(value[i].value === data)
                  {
                    return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ value[i].text +'</button>' ;
                    break;
                  }
                }
              }},
              { title: "Rights", data: "access", className: "text-left",
                render : function ( data, type, row, meta ) {
                  var value = appuser.optUseraccess;
                  for(var i=0; i<value.length; i++){
                    if(value[i].value === data)
                    {
                      return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ value[i].text +'</button>' ;
                      break;
                    }
                  }
                }},
              { title: "Status", data: "active", className: "text-center",
                render : function ( data, type, row, meta ) {
                  var valDisplay = ""
                  return data === "1" ?
                    '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">Active</button>' :
                    '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">Deactivate</button>' ;
                }},
            { title: "Partner", data: "partnername", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
        ],
        "order": [[ 1, "asc" ]],
        "retrieve" : true
    });

    $('#usermngtdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#usermngtdata').DataTable().row( id ).data();
        appuser.selectUser(data);
        appuser.checkUser(2);
        appuser.setFocusModal('2');
    });
    $('#usermngtdata tbody').on('click', '.checkid', function () {
      appuser.setDefault();
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
        // appuser.setDefault();
      } else if(allSelected.length == 1){
        $("#actions").append('<option value="1">Edit User</option>');
        appuser.btnAction.show = true;
        appuser.btnAction.hide = false;
      } else {
        $("#actions option[value='1']").remove();
        appuser.btnAction.show = true;
        appuser.btnAction.hide = false;
      };
      appuser.SortSelect('2');
    });
    $("#checkall").on('click', function () {
        $('#usermngtdata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
    });

    $(".dataTables_filter input").on('keyup change', function() {
      $('#usermngtdata').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });
    // tool tip for page button nav
    $('#usermngtdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#usermngtdata_next.next.paginate_button').attr('title', 'Next');
    $('#usermngtdata_first.first.paginate_button').attr('title', 'First');
    $('#usermngtdata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#usermngtdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(id){
    var myTable = $('#usermngtdata').DataTable();
    myTable.clear().draw();
  },
  processUser(){
    this.priv.userrights = window.localStorage.getItem('userRights');
    this.priv.useraccess = window.localStorage.getItem('userAccess');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  addUser(){
    var formData = appuser.toFormData(appuser.newUser);
    axios
      .post(localurl + "usermngt.php?action=create", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD PORTAL USER"}', appuser.newUser);
          appuser.newUser = {userid:"", username: "", userpass: "", rights: 5, access: "0001", active: 0, vessel_partner: "SMSG"};
          appuser.getAllUsers();
          swal("", "Successfully added", "success");
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
          console.log('Error', error.config);
        }
        console.log(JSON.stringify(error.message));
      });
  },
  updateUser(){
    var formData = appuser.toFormData(appuser.currUser);
    axios
      .post(localurl + "usermngt.php?action=update", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('userData'), appuser.currUser);
          appuser.setDefault();
          removeData();
          appuser.currUser = {};
          appuser.getAllUsers();
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
          console.log('Error', error.config);
        }
        console.log(JSON.stringify(error.message));
      });
  },
  deleteUser(){
    // console.log(JSON.stringify(appuser.currUser));
    var formData = appuser.toFormData(appuser.currUser);
    axios
      .post(localurl + "usermngt.php?action=delete", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE PORTAL USER"}', JSON.stringify(appuser.currUser));
          appuser.currUser = {};
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
          console.log('Error', error.config);
        }
        console.log(JSON.stringify(error.message));
      });
  },
  deactivateUser(){
    var formData = appuser.toFormData(appuser.currUser);
    axios
      .post(localurl + "usermngt.php?action=deactivate", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DEACTIVATE PORTAL USER"}', JSON.stringify(response.data.message));
          appuser.currUser = {};
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
          console.log('Error', error.config);
        }
        console.log(JSON.stringify(error.message));
      });
  },
  selectUser(userdata){
    appuser.currUser = userdata;
    window.localStorage.setItem('userData', JSON.stringify(appuser.currUser));
  },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  checkUser(proc){
    this.getAllPartners();
    if (this.priv.userrights <= '2') {
      if (proc == 1) {
        appuser.showAddModal = true;
      } else if (proc == 2) {
        appuser.showEditModal = true;
      } else if (proc == 3) {

        appuser.delName = [];
        var allSelected = $('.checkid:checked')
        $.each(allSelected, function(i, val){
          var id = $(val).attr("id").match(/\d+/)[0];
          var data = $('#usermngtdata').DataTable().row( id ).data();
          appuser.delName.push(data.username);
        });
        appuser.showDeleteModal = true;
      } else {
        // swal("", "Unable to access your request.", "warning");
      }
    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
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
    var allSelected = $('.checkid:checked')
    if(allSelected.length != 0){
      $.each(allSelected, function(i, val){

        var id = $(val).attr("id").match(/\d+/)[0];
        var data = $('#usermngtdata').DataTable().row( id ).data();
        appuser.selectUser(data);
        appuser.deleteUser();
      });

      swal("", "Successfully deleted", "success");
      $('.checkall').each(function(){ this.checked = false; });
      setTimeout(() => { appuser.getAllUsers(); }, 300);
    } else {
      swal("", "Please select a record.", "warning");
    }
  },
  checkBtnShow(){
    this.priv.userrights = window.localStorage.getItem('userRights');
    if (this.priv.userrights <= '2') {
      this.btnShow = true;
    } else {
      this.btnShow = false;
    }
  },
  SelectTransac(){
    if(appuser.btnAction.trans == "2"){
      var allSelected = $('.checkid:checked')
      $.each(allSelected, function(i, val){
        var id = $(val).attr("id").match(/\d+/)[0];
        var data = $('#usermngtdata').DataTable().row( id ).data();
        appuser.selectUser(data);
        appuser.checkUser(2);
        appuser.setFocusModal('2');
      });

      $('#myModalEdit').modal('show');
    };
    if(appuser.btnAction.trans == "3"){
      $('#myModalDel').modal('show');
    };
    if(appuser.btnAction.trans == "4"){
      var allSelected = $('.checkid:checked')
      $.each(allSelected, function(i, val){
        var id = $(val).attr("id").match(/\d+/)[0];
        var data = $('#usermngtdata').DataTable().row( id ).data();
        appuser.selectUser(data);
        appuser.deactivateUser();
      });

      appuser.setDefault();
      swal("", "Successfully Deactivate user", "success");
      $('.checkall').each(function(){ this.checked = false; });
      setTimeout(() => { appuser.getAllUsers(); }, 300);
    };
  },
  SortSelect(proc){
    if(proc == "1"){
      $("#actions").html($("#actions option").sort(function (a, b) {
          return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
      }))
    } else {
      $("#actions").html($("#actions option").sort(function (a, b) {
          return a.value == b.value ? 0 : a.value < b.value ? -1 : 1
      }))
    };
  },
  setDefault(){
    $("#actions option[value='1']").remove();

    appuser.btnAction.trans = 0;
    appuser.btnAction.show = false;
    appuser.btnAction.hide = true;
  },

},
});
