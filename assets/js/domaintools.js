var appdomain = new Vue({
el: '#appdomain',
data: {
  vesselSetting : {vesselID: "", fleetID: "", partnerID: ""},
  showEditModaldomain: false,
  showDeleteModaldomain: false,
  btnDelDisable: true,
  allDomain: [],
  currDomain: {},
  currAppEdit: {app: ""},
  newAppEdit: {app: "", appurl_ids: ""},
  checkApp : 0,
  enableText: true,
  FinalURL: "",
  CombinedID: [],
  // SearchAppID: "",
  // pageDomain: [],
  // perPage: 50,
  optAppDomain: {},
  privilage : {userrights : null, useraccess : null}
},
mounted: function(){
  this.processUser();
  this.getAppList();
  setTimeout(() => { this.getDomainList(); }, 200);
},
methods: {
  getDomainList(){
    axios
      .get(serverurl + "domainapp" )
      .then(function(response){
        appdomain.allDomain = response.data;
        appdomain.getDataGrid(response.data);
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appdomain.getDataGrid("");
      }) ;
  },
  getAppList(){
    axios
      .get(serverurl + "domainappfilter" )
      .then(function(response){
        appdomain.optAppDomain = response.data;
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      }) ;
  },
  // searchAppList(){
  //   if (appdomain.SearchAppID == "") {
  //     appdomain.getDomainList();
  //   } else {
  //     axios
  //       .get(serverurl + "domainapp/search/" + this.SearchAppID)
  //       .then(function(response){
  //         appdomain.allDomain = response.data;
  //         appdomain.pageCount(appdomain.allDomain, 1);
  //       })
  //       .catch(function(error){
  //         console.log(JSON.stringify(error.message));
  //       }) ;
  //   }
  // },
  processUser(){
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');
    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
  },
  updateDomain(){
    if (appdomain.checkApp == 0) {
      appdomain.FinalURL = appdomain.currAppEdit;
    } else {
      if (appdomain.newAppEdit.app == ""){
        swal("", "Invalid Group App.", "warning");
      } else {
        appdomain.FinalURL["app"] = appdomain.newAppEdit;
      }
    }

    if ((JSON.stringify(appdomain.CombinedID) == "") || (JSON.stringify(appdomain.CombinedID) == "[]"))
    {
      if (JSON.stringify(appdomain.currDomain) != "[]"){
        // console.log(appdomain.currDomain['id'] + " == " + JSON.stringify(appdomain.FinalURL) );
        updateAppDomain(this.currDomain['id'], appdomain.FinalURL);
        setTimeout(() => { this.getDomainList(); }, 500);
      } else {
        swal("", "Invalid ID.", "warning");
      }
    } else {
      // // array loop
      // for(var i = 0; i < appdomain.CombinedID.length; i++) {
      //   var obj = appdomain.CombinedID[i];
      //   setTimeout(() => { updateAppDomain(obj, appdomain.FinalURL); }, 500);
      //   // console.log(obj + " == " + JSON.stringify(appdomain.FinalURL) );
      // };
      if (appdomain.CombinedID.length >= 1) {
        var finalString = Object.keys(appdomain.CombinedID)
          .map(key => appdomain.CombinedID[key])
          .join(',');
        if (finalString == "") {
          swal("", "Invalid ID.", "warning");
        } else {
          appdomain.FinalURL["appurl_ids"] = finalString;
          // console.log(JSON.stringify(appdomain.FinalURL));
          updateAllAppDomain(appdomain.FinalURL);
          setTimeout(() => { this.getDomainList(); }, 500);
        };
      };
    }
    appdomain.currDomain = {};
    appdomain.currAppEdit.app = "";
    appdomain.newAppEdit.app = "";
    appdomain.CombinedID = [],
    appdomain.FinalURL = "";
    appdomain.checkApp = 0;
    appdomain.enableText = true;
    this.getAppList();

    function updateAppDomain(finalID, vdata) {
      axios
        .put(serverurl + "domainapp/app/" + finalID, vdata)
        .then(function(response){
          console.log(JSON.stringify(response.data) + " = " + finalID + " = " + JSON.stringify(vdata) );
          // swal("Successfully updated", "ID :" + response.data, "success");
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
          swal("", JSON.stringify(error.message), "warning");
        }) ;
      } // end function

      function updateAllAppDomain(vAlldata) {
        axios
          .put(serverurl + "domainapp/app/multiupdate", vAlldata)
          .then(function(response){
            console.log(JSON.stringify(response.data) + " = " + JSON.stringify(vAlldata) );
            // swal("Successfully updated", "ID :" + response.data, "success");
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
            swal("", JSON.stringify(error.message), "warning");
          }) ;
        } // end function
  },
  selectDomain(domainData){
    appdomain.currDomain = domainData;
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = $("#appdomaindata")
    oTblReport.DataTable ({
        "data" : vdata,
        // "scrollX": true,
        // "scrollY": 450,
        "paging": true,
        "responsive": true,
        "searching": true,
        "destroy": true,
        "deferRender": true,
        "pagingType": "input",
        "pageLength": 25,
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
                return '<input type="checkbox" value="'+ data.id + '" class="checkid" id=c-' + meta.row + '>';
              }},
            // { title: "", data: "id", className: "text-center",
            //   render: function ( data, type, row, meta ) {
            //     return '<input type="checkbox" class="checkid" id=c-"' + meta.row + '">';
            //   }},
            { title: "ID", data: "id", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEditdomain">'+ data +'</button>';
              }},
            { title: "Domain / URL", data: "app", className: "text-left" },
            // { title: "Domain / URL", data: "app",
            //   render : function ( data, type, row, meta ) {
            //     return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEditdomain">'+ data +'</button>';
            //   }},
        ],
        "columnDefs": [
          { targets: 3,
            orderable: false,
            className: "text-center",
            render: function (data, type, row, meta) {
              return '<button type="button" class="btn-delete" id=d-"' + meta.row +
              '" data-toggle="modal" data-target="#myModalDeldomain"><i class="glyphicon glyphicon-trash"></i></button>';
            }
          }
        ],
        "order": [ 1, 'asc' ],
        "retrieve": true,
    });

    $('#appdomaindata tbody').on('click', '.checkid', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#appdomaindata').DataTable().row( id ).data().id;

      if(this.checked) {
        if(data != ""){
          appdomain.CombinedID.push(data);
        }
      } else {
        for( var i = 0; i < appdomain.CombinedID.length; i++){
            if ( appdomain.CombinedID[i] === data) {
                appdomain.CombinedID.splice(i, 1);
            };
        };
      }
      // console.log(JSON.stringify( appdomain.CombinedID ));
    });
    $('#appdomaindata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#appdomaindata').DataTable().row( id ).data();

      appdomain.checkUser(2);
      appdomain.selectDomain(data);
    });
    $('#appdomaindata tbody').on('click', '.btn-delete', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#appdomaindata').DataTable().row( id ).data();

      appdomain.checkUser(3);
      appdomain.selectDomain(data);
    });
    $('#appdomaindata tbody').on('click', '.checkid', function () {
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
    });
    $("#checkall").on('click', function () {
        $('#appdomaindata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
        appdomain.GetCheckValue();
    });

    $(".dataTables_filter input").on('keyup change', function() {
      $('#appdomaindata').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      for( var i = 0; i < appdomain.CombinedID.length; i++){
        appdomain.CombinedID.splice(i, 1);
      };
    });

    // tool tip for page button nav
    $('#appdomaindata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#appdomaindata_next.next.paginate_button').attr('title', 'Next');
    $('#appdomaindata_first.first.paginate_button').attr('title', 'First');
    $('#appdomaindata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#appdomaindata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(id){
    var myTable = $('#appdomaindata').DataTable();
    myTable.clear().draw();
  },
  checkUser(proc){
    if (this.privilage.userrights == '1') {
      if (proc == 2) {
        appdomain.showEditModaldomain = true;
      } else if (proc == 3) {
        appdomain.showDeleteModaldomain = true;
      } else {
        swal("", "Unable to access your request.", "warning");
      }
    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
  },
  checkAppDomain(infodata){
    if (appdomain.checkApp == 0) {
      appdomain.enableText = true;
      appdomain.newAppEdit.app = "";
    } else {
      document.getElementById('editnewDomain').focus();
      appdomain.enableText = false;
    }
  },
  deleteDomain(){
    axios
      .delete(serverurl + "domainapp/app/delete/" + this.currDomain['id'], appdomain.currDomain)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE DOMAIN APP"}', appdomain.currDomain);
        appdomain.getDomainList();
        appdomain.getAppList();
        swal("", "Successfully deleted", "success");
        appdomain.currDomain = {};
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
      }) ;
  },
  multiSelectID(proc){
    if (proc == 1) {
      console.log(JSON.stringify(appdomain.CombinedID));
    } else if (proc == 2) {
      if (JSON.stringify(appdomain.CombinedID) != "[]"){
        for(var i = 0; i < appdomain.CombinedID.length; i++) {
          var obj = appdomain.CombinedID[i];
          // editvouch.currVoucherBatch.vouchers += obj + "^";
        };
      } else {
        // editvouch.currVoucherBatch.vouchers = "";
      }
    }
  },
  GetCheckValue(){
    var allSelected = $('.checkid:checked')
    if(allSelected.length != 0){
      $.each(allSelected, function(i, val){

        var id = $(val).attr("id").match(/\d+/)[0];
        var data = $('#appdomaindata').DataTable().row( id ).data().id;
        if(data != ""){
          appdomain.CombinedID.push(data);
        }
      });
    } else {
      appdomain.CombinedID = [];
    }
  },

}
});
