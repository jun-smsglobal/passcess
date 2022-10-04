var apppartner = new Vue({
el: '#apppartner',
data: {
  searchid: "",
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  btnDelDisable: false,
  allPartner: [],
  newPartner: {partnerid:"", partnername: "", emailadd: "", contactno: ""},
  currPartner: {},
  delName: [],
  priv : {userrights : null, useraccess : null}
},
mounted: function(){
  this.processUser();
  this.getAllPartners();
  removeData();
},
methods: {
  getAllPartners(){
    axios
      .get(localurl + "partnermngt.php?action=read")
      .then(function(response){
        if(!response.data.error){
          apppartner.allPartner = response.data.partner;
          apppartner.getDataGrid(response.data.partner);
        } else {
          console.log(JSON.stringify(response.data.message));
          apppartner.getDataGrid("");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        apppartner.getDataGrid("");
        apppartner.allPartner = apppartner.newPartner;
      })
      .finally(function(){
          apppartner.delBtnShow();
      });
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#partnermngtdata").DataTable ({
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
            // { title: "ID", data: "partnerid", className: "text-center" },
            { title: '<input type="checkbox" id="checkall" title="Select all" class="checkall"/>', data: null, className: "text-center", orderable: false,
              render: function (data, type, row, meta) {
                return '<input type="checkbox" value="'+ data.partnerid + '" class="checkid" id=c-"' + meta.row + '">';
              }},
            { title: "Partner Name", data: "partnername", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "E-Mail Address", data: "emailadd", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Contact Number", data: "contactno", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
        ],
        "order": [[ 1, "asc" ]],
        "retrieve" : true
    });

    $('#partnermngtdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#partnermngtdata').DataTable().row( id ).data();

        apppartner.selectPartner(data);
        apppartner.checkUser(2);
        apppartner.setFocusModal('2');
    });
    $('#partnermngtdata tbody').on('click', '.checkid', function () {
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
      apppartner.delBtnShow();
    });
    $("#checkall").on('click', function () {
        $('#partnermngtdata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
      apppartner.delBtnShow();
    });
    $(".dataTables_filter input").on('keyup change', function() {
      $('#partnermngtdata').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });
    // tool tip for page button nav
    $('#partnermngtdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#partnermngtdata_next.next.paginate_button').attr('title', 'Next');
    $('#partnermngtdata_first.first.paginate_button').attr('title', 'First');
    $('#partnermngtdata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#partnermngtdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(id){
    var myTable = $('#partnermngtdata').DataTable();
    myTable.clear().draw();
  },
  processUser(){
    this.priv.userrights = window.localStorage.getItem('userRights');
    this.priv.useraccess = window.localStorage.getItem('userAccess');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  addPartner(){
    var formData = apppartner.toFormData(apppartner.newPartner);
    axios
      .post(localurl + "partnermngt.php?action=create", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(response.data.error == false){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD PARTNER"}', apppartner.newPartner);
          apppartner.newPartner = {partnerid:"", partnername: "", emailadd: "", contactno: ""};
          apppartner.getAllPartners();
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
  updatePartner(){
    var formData = apppartner.toFormData(apppartner.currPartner);
    axios
      .post(localurl + "partnermngt.php?action=update", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('partnerData'), apppartner.currPartner);
          removeData();
          apppartner.currPartner = {};
          apppartner.getAllPartners();
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
  deletePartner(){
    // console.log(JSON.stringify(apppartner.currPartner));
    var formData = apppartner.toFormData(apppartner.currPartner);
    axios
      .post(localurl + "partnermngt.php?action=delete", formData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        if(!response.data.error){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE PARTNER"}', apppartner.currPartner);
          apppartner.currPartner = {};
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
  selectPartner(userdata){
    apppartner.currPartner = userdata;
    window.localStorage.setItem('partnerData', JSON.stringify(apppartner.currPartner));
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

      // console.log(JSON.stringify(this.allPartner));
      if (proc == 1) {
        apppartner.showAddModal = true;
      } else if (proc == 2) {
        apppartner.showEditModal = true;
      } else if (proc == 3) {
        var allSelected = $('.checkid:checked')
        if(allSelected.length == 0){
          swal("", "Please select a record.", "warning");
        } else {
          apppartner.delName = [];
          var allSelected = $('.checkid:checked')
          $.each(allSelected, function(i, val){
            var id = $(val).attr("id").match(/\d+/)[0];
            var data = $('#partnermngtdata').DataTable().row( id ).data();
            apppartner.delName.push(data.partnername);
          });

          apppartner.showDeleteModal = true;
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
        var data = $('#partnermngtdata').DataTable().row( id ).data();

        apppartner.selectPartner(data);
        apppartner.deletePartner();
      });

      swal("", "Successfully deleted", "success");
      $('.checkall').each(function(){ this.checked = false; });
      setTimeout(() => { apppartner.getAllPartners(); }, 500);
    } else {
      swal("", "Please select a record.", "warning");
    }
  },
  delBtnShow(){
    var allSelected = $('.checkid:checked')
    if(allSelected.length == 0){
      apppartner.btnDelDisable = true;
    } else {
      apppartner.btnDelDisable = false;
    }
  },

},
});
