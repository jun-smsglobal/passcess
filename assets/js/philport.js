var appphilarea = new Vue({
el: '#appphilarea',
data: {
  searchid: "",
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  btnDelDisable: true,
  allArea: [],
  newPort: {portid: 0, portcountry: "", portcity: "", portcode: ""},
  currPort: {},
  delName: [],
  optCountry: [{ text: '', value: '' }],
  priv : {userrights : null, useraccess : null}
},
mounted: function(){
  this.processUser();
  GetISP();
  this.getAllCountry();
  this.getallArea();
  removeData();
},
methods: {
  getallArea(){
    axios
      .get(localurl + "philport.php?action=read")
      .then(function(response){
        if(!response.data.error){
          appphilarea.allArea = response.data.apparea;
          appphilarea.getDataGrid(response.data.apparea);
        } else {
          console.log(JSON.stringify(response.data.message));
          appphilarea.getDataGrid("");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appphilarea.getDataGrid("");
        appphilarea.allArea = appphilarea.newPort;
      })
      .finally(function(){
          appphilarea.delBtnShow();
      });
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#philportdata").DataTable ({
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
              return '<input type="checkbox" value="'+ data.portid + '" class="checkid" id=c-"' + meta.row + '">';
            }},
          { title: "Country", data: "portcountry", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "City", data: "portcity", className: "text-left",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Port Code", data: "portcode", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
      ],
      "order": [[ 2, "asc" ]],
      "retrieve" : true,
    });

    $('#philportdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#philportdata').DataTable().row( id ).data();

      appphilarea.checkUser(2);
      appphilarea.selectArea(data);
      appphilarea.setFocusModal('2');
    });
    $('#philportdata tbody').on('click', '.checkid', function () {
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
      appphilarea.delBtnShow();
    });
    $("#checkall").on('click', function () {
        $('#philportdata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
      appphilarea.delBtnShow();
    });
    $(".dataTables_filter input").on('keyup change', function() {
      $('#philportdata').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });
    // tool tip for page button nav
    $('#philportdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#philportdata_next.next.paginate_button').attr('title', 'Next');
    $('#philportdata_first.first.paginate_button').attr('title', 'First');
    $('#philportdata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#philportdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(id){
    var myTable = $('#philportdata').DataTable();
    myTable.clear().draw();
  },
  processUser(){
    this.priv.userrights = window.localStorage.getItem('userRights');
    this.priv.useraccess = window.localStorage.getItem('userAccess');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  addArea(){
    // console.log(JSON.stringify(appphilarea.newPort));
    var formData = appphilarea.toFormData(appphilarea.newPort);
    axios
      .post(localurl + "philport.php?action=create", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(response.data.error == false){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD AREA"}', appphilarea.newPort);
          appphilarea.newPort = {portid: "", portcountry: "", portcity: "", portcode: ""};
          appphilarea.getallArea();
          swal("", "Successfully added", "success");
        } else {
          console.log(JSON.stringify(response.data.message));
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
  updateArea(){
    var formData = appphilarea.toFormData(appphilarea.currPort);
    axios
      .post(localurl + "philport.php?action=update", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('areaData'), appphilarea.currPort);
          removeData();
          appphilarea.currPort = {};
          appphilarea.getallArea();
          swal("", "Successfully updated", "success");
        } else {
          console.log(JSON.stringify(response.data.message));
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
  deleteArea(){
    // console.log(JSON.stringify(appphilarea.currPort));
    var formData = appphilarea.toFormData(appphilarea.currPort);
    axios
      .post(localurl + "philport.php?action=delete", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE AREA"}', appphilarea.currPort);
          appphilarea.currPort = {};
        } else {
          console.log(JSON.stringify(response.data.message));
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
  selectArea(servicedata){
    appphilarea.currPort = servicedata;
    window.localStorage.setItem('areaData', JSON.stringify(appphilarea.currPort));
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

      if (proc == 1) {
        appphilarea.showAddModal = true;
        if( (localISP.country == '') || (localISP == []) ){
          appphilarea.newPort.portcountry = 'Philippines';
        } else {
          appphilarea.newPort.portcountry = localISP.country;
        };
      } else if (proc == 2) {
        appphilarea.showEditModal = true;
      } else if (proc == 3) {
        var allSelected = $('.checkid:checked')
        if(allSelected.length == 0){
          swal("", "Please select a record.", "warning");
        } else {
          appphilarea.delName = [];
          var allSelected = $('.checkid:checked')
          $.each(allSelected, function(i, val){
            var id = $(val).attr("id").match(/\d+/)[0];
            var data = $('#philportdata').DataTable().row( id ).data();
            appphilarea.delName.push(data.portcity);
          });
          appphilarea.showDeleteModal = true;
        }
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
        var data = $('#philportdata').DataTable().row( id ).data();
        appphilarea.selectArea(data);
        appphilarea.deleteArea();
      });

      swal("", "Successfully deleted", "success");
      $('.checkall').each(function(){ this.checked = false; });
      setTimeout(() => { appphilarea.getallArea(); }, 500);
    } else {
      swal("", "Please select a record.", "warning");
    }
  },
  delBtnShow(){
    var allSelected = $('.checkid:checked')
    if(allSelected.length == 0){
      appphilarea.btnDelDisable = true;
    } else {
      appphilarea.btnDelDisable = false;
    }
  },
  getAllCountry(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=8&id=0")
      .then(function(response){
        if(!response.data.error){
            appphilarea.optCountry = response.data.vessel
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appphilarea.optCountry = [{ text: '', value: '' }];
      });
  },

},
});
