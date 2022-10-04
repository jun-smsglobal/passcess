var appfleet = new Vue({
el: '#appfleet',
data: {
  searchid: "",
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  btnDelDisable: true,
  optPartner: [],
  allFleet: [],
  newFleet: {fleetid:"", fleetname: "", partnerid: ""},
  currFleet: {},
  delName: [],
  priv : {userrights : null, useraccess : null}
},
mounted: function(){
  this.processUser();
  this.getAllFleets();
  // this.getAllPartners();
  removeData();
},
methods: {
  getAllFleets(){
    axios
      .get(localurl + "fleetmngt.php?action=read")
      .then(function(response){
        if(!response.data.error){
          appfleet.allFleet = response.data.fleet;
          appfleet.getDataGrid(response.data.fleet);
        } else {
          console.log(JSON.stringify(response.data.message));
          appfleet.getDataGrid("");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appfleet.getDataGrid("");
        appfleet.allFleet = appfleet.newFleet;
      })
      .finally(function(){
          appfleet.delBtnShow();
      });
  },
  getAllPartners(){
    axios
      .get(localurl + "fleetmngt.php?action=readpartner")
      .then(function(response){
        if(!response.data.error){
          appfleet.optPartner = response.data.partner;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appfleet.optPartner = [];
      });
  },
  // getFleets(dataid){
  //   if (dataid != "") {
  //     axios
  //       .get(localurl + "fleetmngt.php?action=search&searchid=" + dataid)
  //       .then(function(response){
  //         if(!response.data.error){
  //           appfleet.allFleet = response.data.fleet;
  //           // appfleet.allFleet = [];
  //           // appfleet.allFleet[0] = response.data.users;
  //         } else {
  //           alert(response.data.message);
  //         }
  //       })
  //       .catch(function(error){
  //         console.log(error);
  //         appfleet.allFleet = appfleet.newFleet;
  //       });
  //   }
  // },
  getDataGrid(vdata){
    // Load  datatable

    var oTblReport = null;
    oTblReport = $("#fleetmngtdata").DataTable ({
        "data" : vdata,
        "paging": true,
        "responsive": true,
        "searching": true,
        "destroy": true,
        "deferRender": true,
        "pageLength": 2,
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "language": {
          "paginate": {
            first: "<<",
            firstTitle: "First",
            last: ">>",
            next: ">",
            nextTitle: "Next",
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
        // "aoColumnDefs": [{ "bVisible": false, "aTargets": [0]] }],
        "columns" : [
            { title: '<input type="checkbox" id="checkall" title="Select all" class="checkall"/>', data: null, className: "text-center", orderable: false,
              render: function (data, type, row, meta) {
                return '<input type="checkbox" value="'+ data.fleetid + '" class="checkid" id=c-' + meta.row + '>';
              }},
            { title: "Fleet Name", data: "fleetname", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-' + meta.row + ' data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Partner Name", data: "partnername", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-' + meta.row + ' data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
        ],
        "order": [[ 1, "asc" ]],
        "retrieve" : true
    });

    $('#fleetmngtdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#fleetmngtdata').DataTable().row( id ).data();
        appfleet.selectFleet(data);
        appfleet.checkUser(2);
        appfleet.setFocusModal('2');
    });
    $('#fleetmngtdata tbody').on('click', '.checkid', function () {
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
      appfleet.delBtnShow();
    });
    $("#checkall").on('click', function () {
        $('#fleetmngtdata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
      appfleet.delBtnShow();
    });

    $(".dataTables_filter input").on('keyup change', function() {
      $('#fleetmngtdata').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });
    // tool tip for page button nav
    $('#fleetmngtdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#fleetmngtdata_next.next.paginate_button').attr('title', 'Next');
    $('#fleetmngtdata_first.first.paginate_button').attr('title', 'First');
    $('#fleetmngtdata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#fleetmngtdata').DataTable();
    myTable.clear().rows.add(vdata).draw();

    // $('#fleetmngtdata_previous').attr('title', 'Previous');
    // $('#fleetmngtdata_next').attr('title', 'Next');
    // $('#fleetmngtdata_first').attr('title', 'First');
    // $('#fleetmngtdata_last').attr('title', 'Last');
  },
  clearGrid(id){
    var myTable = $('#fleetmngtdata').DataTable();
    myTable.clear().draw();
  },
  processUser(){
    this.priv.userrights = window.localStorage.getItem('userRights');
    this.priv.useraccess = window.localStorage.getItem('userAccess');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  addFleet(){
    var formData = appfleet.toFormData(appfleet.newFleet);
    axios
      .post(localurl + "fleetmngt.php?action=create", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(response.data.error == false){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD FLEET"}', appfleet.newFleet);
          appfleet.newFleet = {fleetid:"", fleetname: "", partnerid: ""};
          appfleet.getAllFleets();
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
  updateFleet(){
    var formData = appfleet.toFormData(appfleet.currFleet);
    axios
      .post(localurl + "fleetmngt.php?action=update", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('fleetData'), appfleet.currFleet);
          removeData();
          appfleet.currFleet = {};
          appfleet.getAllFleets();
          appfleet.getAllPartners();
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
  deleteFleet(){
    // console.log(JSON.stringify(appfleet.currFleet));
    var formData = appfleet.toFormData(appfleet.currFleet);
    axios
      .post(localurl + "fleetmngt.php?action=delete", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE FLEET"}', appfleet.currFleet);
          appfleet.currFleet = {};
        } else {
          swal("", response.data.message, "warning");
          // console.log(JSON.stringify(response.data.message));
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
  selectFleet(userdata){
    appfleet.currFleet = userdata;
    window.localStorage.setItem('fleetData', JSON.stringify(appfleet.currFleet));
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
    if (this.priv.userrights == '1') {

      if (proc == 1) {
        appfleet.showAddModal = true;
      } else if (proc == 2) {
        appfleet.showEditModal = true;
      } else if (proc == 3) {
        var allSelected = $('.checkid:checked')
        if(allSelected.length == 0){
          swal("", "Please select a record.", "warning");
        } else {
          appfleet.delName = [];
          // var allSelected = $('.checkid:checked')
          $.each(allSelected, function(i, val){
            var id = $(val).attr("id").match(/\d+/)[0];
            var data = $('#fleetmngtdata').DataTable().row( id ).data();
            appfleet.delName.push(data.fleetname);
          });
          appfleet.showDeleteModal = true;
        }
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
        var data = $('#fleetmngtdata').DataTable().row( id ).data();
        appfleet.selectFleet(data);
        appfleet.deleteFleet();
      });

      swal("", "Successfully deleted", "success");
      $('.checkall').each(function(){ this.checked = false; });
      setTimeout(() => { appfleet.getAllFleets(); }, 500);
    } else {
      swal("", "Please select a record.", "warning");
    }
  },
  delBtnShow(){
    var allSelected = $('.checkid:checked')
    if(allSelected.length == 0){
      appfleet.btnDelDisable = true;
    } else {
      appfleet.btnDelDisable = false;
    }
  },

},
});
