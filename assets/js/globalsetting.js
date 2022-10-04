var globalsett = new Vue({
el: '#globalsett',
data: {
  alliperfSett: [],
  curriperfSett: {"fieldname":"","settings":{"iperf_server":"","key":"","port":"0","spdtest_mode":""}},
  optMode: [
    { text: 'Speedtest.net', value: '1' },
    { text: 'Iperf Mode', value: '2' },
  ],
  // allotherSett: [],

// forGPS Setting //
  allGPSSett: [],
  currGPSSett: {"fieldname":"","settings":{"log": "","poll_time": "0","term_addr": "","term_port": "0"}},

// for service watchdog //
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
  this.getiperfSett();
  this.processUser();
  this.getAllServices();
  this.getGPSsett();
  removeData();
},
methods: {
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  selectAll(proc){
    switch (proc) {
      case 1:
        document.getElementById('edtiperfserver').select();
        break;
      case 2:
        document.getElementById('edtikey').select();
        break;
      case 3:
        document.getElementById('edtiport').select();
        break;
      case 4:
        document.getElementById('edtipadd').select();
       break;
      case 5:
        document.getElementById('edtigpsport').select();
        break;
      case 6:
        document.getElementById('edtgpstime').select();
        break;
      case 7:
        document.getElementById('edtpath').select();
        break;
      // role
    };
  },
  getiperfSett(){
    axios
      .get(serverurl + "iperf")
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        globalsett.alliperfSett = response.data;
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      }) ;
  },
  updateiperfSett(){
    // console.log(JSON.stringify(this.alliperfSett));
    var tranID = this.alliperfSett[0].id;
    this.curriperfSett.fieldname = this.alliperfSett[0].fieldname;
    this.curriperfSett.settings.iperf_server = this.alliperfSett[0].settings.iperf_server;
    this.curriperfSett.settings.port = this.alliperfSett[0].settings.port;
    this.curriperfSett.settings.spdtest_mode = this.alliperfSett[0].settings.spdtest_mode;

    axios
      // .put(serverurl + "iperf/" + tranID, this.curriperfSett)
      .put(serverurl + "iperf", this.curriperfSett)
      .then(function(response){
        if(JSON.stringify(response.data)){
          swal("", "Successfully updated.", "success");
          globalsett.getiperfSett();
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      }) ;
  },

// for GPS Settings ////////////////////
  getGPSsett(){
    axios
      .get(serverurl + "gps/settings")
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        globalsett.allGPSSett = response.data;
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      }) ;
  },
  updateGPSSett(){
    // console.log(JSON.stringify(this.allGPSSett));
    var tranID = this.allGPSSett[0].id;
    this.currGPSSett.fieldname = this.allGPSSett[0].fieldname;
    this.currGPSSett.settings.term_addr = this.allGPSSett[0].settings.term_addr;
    this.currGPSSett.settings.term_port = this.allGPSSett[0].settings.term_port;
    this.currGPSSett.settings.poll_time = this.allGPSSett[0].settings.poll_time;
    this.currGPSSett.settings.log = this.allGPSSett[0].settings.log;

    axios
      // .put(serverurl + "iperf/" + tranID, this.curriperfSett)
      .put(serverurl + "gps/settings", this.currGPSSett)
      .then(function(response){
        if(JSON.stringify(response.data)){
          swal("", "Successfully updated.", "success");
          globalsett.getGPSsett();
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      }) ;
  },

// for service watchdog ////////////////////
  getAllServices(){
    axios
      .get(localurl + "watchdog.php?action=read")
      .then(function(response){
        if(!response.data.error){
          globalsett.allServices = response.data.appservice;
          globalsett.getDataGrid(response.data.appservice);
        } else {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        globalsett.allServices = globalsett.newServices;
        globalsett.clearGrid();
      })
      .finally(function(){
          globalsett.delBtnShow();
      });
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#watchdogdata").DataTable ({
      "data" : vdata,
      // "scrollX": true,
      // "scrollY": 450,
      "paging": true,
      "responsive": true,
      "searching": true,
      "destroy": true,
      "deferRender": true,
      "pagingType": "input",
      "pageLength": 10,
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

      globalsett.checkUser(2);
      globalsett.selectService(data);
      globalsett.setFocusModal('2');
    });
    $('#watchdogdata tbody').on('click', '.checkid', function () {
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
      globalsett.delBtnShow();
    });
    $("#checkall").on('click', function () {
        $('#watchdogdata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
      globalsett.delBtnShow();
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
    $('#watchdogdata_previous.paginate_button.previous').attr('title', 'Previous');
    $('#watchdogdata_next.paginate_button').attr('title', 'Next');
    $('#watchdogdata_first.paginate_button.first').attr('title', 'First');
    $('#watchdogdata_last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#watchdogdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(){
    var myTable = $('#watchdogdata').DataTable();
    myTable.clear().draw();
  },
  processUser(){
    this.priv.userrights = window.localStorage.getItem('userRights');
    this.priv.useraccess = window.localStorage.getItem('userAccess');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  addService(){
    console.log(JSON.stringify(globalsett.newServices));
    var formData = globalsett.toFormData(globalsett.newServices);
    axios
      .post(localurl + "watchdog.php?action=create", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(response.data.error == false){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD SERVICE"}', globalsett.newServices);
          globalsett.newServices = {serviceid:"", servicedesc: "", servicevalue: ""};
          globalsett.getAllServices();
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
    var formData = globalsett.toFormData(globalsett.currServices);
    axios
      .post(localurl + "watchdog.php?action=update", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('serviceData'), globalsett.currServices);
          removeData();
          globalsett.currServices = {};
          globalsett.getAllServices();
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
    // console.log(JSON.stringify(globalsett.currServices));
    var formData = globalsett.toFormData(globalsett.currServices);
    axios
      .post(localurl + "watchdog.php?action=delete", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE SERVICE"}', globalsett.currServices);
          globalsett.currServices = {};
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
  selectService(sdata){
    globalsett.currServices = sdata;
    window.localStorage.setItem('serviceData', JSON.stringify(globalsett.currServices));
  },
  checkUser(proc){
    if (this.priv.userrights == '1') {
      // console.log(JSON.stringify(this.allServices));
      if ((JSON.stringify(this.allServices) == "[]") && (proc != 1) ){
        // swal("Warning", "Unable to access your request.", "warning");
      } else {
        if (proc == 1) {
          globalsett.showAddModal = true;
        } else if (proc == 2) {
          globalsett.showEditModal = true;
        } else if (proc == 3) {
          var allSelected = $('.checkid:checked')
          if(allSelected.length == 0){
            swal("", "Please select a record.", "warning");
          } else {
            globalsett.delName = [];
            var allSelected = $('.checkid:checked')
            $.each(allSelected, function(i, val){
              var id = $(val).attr("id").match(/\d+/)[0];
              var data = $('#watchdogdata').DataTable().row( id ).data();
              globalsett.delName.push(data.servicedesc);
            });
            globalsett.showDeleteModal = true;
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
        globalsett.selectService(data);
        globalsett.deleteService();
      });

      swal("", "Successfully deleted", "success");
      $('.checkall').each(function(){ this.checked = false; });
      setTimeout(() => { globalsett.getAllServices(); }, 500);
    } else {
      swal("", "Please select a record.", "warning");
    }
  },
  delBtnShow(){
    var allSelected = $('.checkid:checked')
    if(allSelected.length == 0){
      globalsett.btnDelDisable = true;
    } else {
      globalsett.btnDelDisable = false;
    }
  },


}
});
