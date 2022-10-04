var appservices = new Vue({
el: '#appservices',
data: {
  searchid: "",
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  btnDelDisable: true,
  allServices: [],
  newServices: {serviceid:"", servicedesc: "", servicevalue: ""},
  currServices: {},
  delName: [],
  priv : {userrights : null, useraccess : null}
},
mounted: function(){
  this.processUser();
  this.getAllServices();
  removeData();
},
methods: {
  getAllServices(){
    axios
      .get(localurl + "watchdog.php?action=read")
      .then(function(response){
        if(!response.data.error){
          appservices.allServices = response.data.appservice;
          appservices.getDataGrid(response.data.appservice);
        } else {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appservices.allServices = appservices.newServices;
        appservices.clearGrid();
      })
      .finally(function(){
          appservices.delBtnShow();
      });
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#watchdogdata").DataTable ({
      "data" : vdata,
      // "scrollX": true,
      "scrollY": 450,
      "paging": true,
      "responsive": true,
      "searching": true,
      "destroy": true,
      "deferRender": true,
      "pageLength": 50,
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
              return '<input type="checkbox" value="'+ data.serviceid + '" class="checkid" id=c-"' + meta.row + '">';
            }},
          { title: "Service Name", data: "servicedesc", className: "text-left",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Default Value", data: "servicevalue", className: "text-center",
            render : function ( data, type, row, meta ) {
                return data === '1' ? '<input type="checkbox" checked id=n-"' + meta.row +'" disabled/>' : '<input type="checkbox" id=n-"' + meta.row +'" disabled/>';
              }},
      ],
      "order": [[ 1, "asc" ]],
    });

    $('#watchdogdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#watchdogdata').DataTable().row( id ).data();

      appservices.checkUser(2);
      appservices.selectService(data);
      appservices.setFocusModal('2');
    });
    $('#watchdogdata tbody').on('click', '.checkid', function () {
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
      appservices.delBtnShow();
    });
    $("#checkall").on('click', function () {
        $('#watchdogdata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
      appservices.delBtnShow();
    });
    $(".dataTables_filter input").on('keyup change', function() {
      $('#watchdogdata').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });
    // tool tip for page button nav
    $('#watchdogdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#watchdogdata_next.next.paginate_button').attr('title', 'Next');
    $('#watchdogdata_first.first.paginate_button').attr('title', 'First');
    $('#watchdogdata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#watchdogdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(id){
    var myTable = $('#watchdogdata').DataTable();
    myTable.clear().draw();
  },
  processUser(){
    this.priv.userrights = window.localStorage.getItem('userRights');
    this.priv.useraccess = window.localStorage.getItem('userAccess');
  },
  addService(){
    console.log(JSON.stringify(appservices.newServices));
    var formData = appservices.toFormData(appservices.newServices);
    axios
      .post(localurl + "watchdog.php?action=create", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(response.data.error == false){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD SERVICE"}', appservices.newServices);
          appservices.newServices = {serviceid:"", servicedesc: "", servicevalue: ""};
          appservices.getAllServices();
          swal("", "Successfully added", "success");
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
    var formData = appservices.toFormData(appservices.currServices);
    axios
      .post(localurl + "watchdog.php?action=update", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('serviceData'), appservices.currServices);
          removeData();
          appservices.currServices = {};
          appservices.getAllServices();
          swal("", "Successfully updated", "success");
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
    // console.log(JSON.stringify(appservices.currServices));
    var formData = appservices.toFormData(appservices.currServices);
    axios
      .post(localurl + "watchdog.php?action=delete", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE SERVICE"}', appservices.currServices);
          appservices.currServices = {};
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
    appservices.currServices = servicedata;
    window.localStorage.setItem('serviceData', JSON.stringify(appservices.currServices));
  },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  checkUser(proc){
    if (this.priv.userrights == '1') {
      // console.log(JSON.stringify(this.allServices));
      if ((JSON.stringify(this.allServices) == "[]") && (proc != 1) ){
        // swal("Warning", "Unable to access your request.", "warning");
      } else {
        if (proc == 1) {
          appservices.showAddModal = true;
        } else if (proc == 2) {
          appservices.showEditModal = true;
        } else if (proc == 3) {
          var allSelected = $('.checkid:checked')
          if(allSelected.length == 0){
            swal("", "Please select a record.", "warning");
          } else {
            appservices.delName = [];
            var allSelected = $('.checkid:checked')
            $.each(allSelected, function(i, val){
              var id = $(val).attr("id").match(/\d+/)[0];
              var data = $('#watchdogdata').DataTable().row( id ).data();
              appservices.delName.push(data.servicedesc);
            });
            appservices.showDeleteModal = true;
          }
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
        var data = $('#watchdogdata').DataTable().row( id ).data();
        appservices.selectService(data);
        appservices.deleteService();
      });

      swal("", "Successfully deleted", "success");
      $('.checkall').each(function(){ this.checked = false; });
      setTimeout(() => { appservices.getAllServices(); }, 500);
    } else {
      swal("", "Please select a record.", "warning");
    }
  },
  delBtnShow(){
    var allSelected = $('.checkid:checked')
    if(allSelected.length == 0){
      appservices.btnDelDisable = true;
    } else {
      appservices.btnDelDisable = false;
    }
  },

},
});
