var appsupport = new Vue({
el: '#appsupport',
data: {
  vesselSetting : {vesselID: "", vesselName: "", fleetID: "", partnerID: "", dateFrom:"", dateTo:""},
  showModalView: false,
  showEditModal: false,
  allsupport: [],
  currsupport: {},
  newsupport: {id:"", vesselid: "", surveylink: "", author: "", expired_at: ""},
  optFleet: [{ text: '', value: '' }],
  optVess: [{ text: '', value: '' }],
  privilage : {userrights : null, useraccess : null, TokenKey : null}
},
mounted: function(){
  this.getDateToday();
  this.processUser();
  // this.getFleet();
  this.getVessel();
  setTimeout(() => { this.getallsupport(); }, 300);
},
methods: {
  getallsupport(){
    if(this.vesselSetting.vesselID == "0"){
      // console.log(this.vesselSetting.vesselID);
      axios
        .get(serverurl + "contactsupport")
        .then(function(response){
          // get response
          appsupport.allsupport = response.data;
          // populate datatables
          appsupport.getDataGrid(appsupport.allsupport);
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          appsupport.getDataGrid("");
        }) ;
    } else {
      axios
        .get(serverurl + "contactsupport/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
        // .get(serverurl + "contactsupport")
        .then(function(response){
          appsupport.allsupport = response.data;
          appsupport.getDataGrid(appsupport.allsupport);
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          appsupport.getDataGrid("");
        }) ;
    }
  },
  getFleet(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=12&id=" + this.vesselSetting.partnerID)
      .then(function(response){
        if(!response.data.error){
          appsupport.optFleet = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appsupport.optFleet = [{ text: '', value: '' }];
      });
  },
  getVessel(){
    var strURL = "";
    if(this.privilage.userrights == '1'){
      strURL = localurl + "vessel.php?action=getvessel&proc=1&id=0";
    } else {
      strURL = localurl + "vessel.php?action=getvessel&proc=1&id=" + this.vesselSetting.partnerID;
    }

    axios
      // .get(localurl + "vessel.php?action=getvessel&proc=6&id=0")
      .get(strURL)
      .then(function(response){
        if(!response.data.error){
          appsupport.optVess = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appsupport.optVess = [{ text: '', value: '' }];
      })
      .finally(function(){
        // if ((appsupport.vesselSetting.vesselID == "") || (appsupport.vesselSetting.vesselID == "0")){
        //   window.localStorage.setItem('vesselID', appsupport.optVess[0].value);
        //   appsupport.vesselSetting.vesselID = appsupport.optVess[0].value;
        // }
      });
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#supportdata").DataTable({
        "data" : vdata,
        "scrollX": true,
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
            // { title: '<input type="checkbox" id="checkall" title="Select all" class="checkall"/>', data: null, className: "text-center", orderable: false,
            //   render: function (data, type, row, meta) {
            //     return '<input type="checkbox" value="'+ data.id + '" class="checkid" id=c-"' + meta.row + '">';
            //     }},
            { title: "Date Received", data: "created_at", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+
                  moment(data).format('YYYY-MM-DD HH:mm') +'</button>';
              }},
            { title: "Passenger Name", data: null,  className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" title="' + data.message.split("\n", 1) +
                  '" data-toggle="modal" data-target="#myModalView">'+ data.user_name.toUpperCase() +'</button>';
              }},
            { title: "Type of Access", data: "user_type_access",  className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data.toUpperCase() +'</button>';
              }},
            { title: "Voucher Code", data: null,  className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" title="' + data.user_issues.split("\n", 1) +
                  '" data-toggle="modal" data-target="#myModalView">'+ data.user_voucher.toUpperCase() +'</button>';
              }},
            { title: "E-Mail Address", data: "user_email",  className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
            { title: "Contact Number", data: "user_contact_number",  className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
            { title: "Contact Option", data: null,  className: "text-center",
            render : function ( data, type, row, meta ) {
              var objCont = data.user_contact;
              var finalStr = "";
              // return JSON.stringify(objCont);
              for(var i = 0; i < objCont.length; i++) {
                var obj = objCont[i];
                // finalStr += obj.app + " - " + obj.info + "<br>";
                if (obj.app.toUpperCase() == "FACEBOOK") {
                  finalStr += "<a href='https://fb.me/SMSGOppA' target='_blank'>" + obj.app + " - " + obj.info + "</a><br>";
                } else if (obj.app.toUpperCase() == "WHATSAPP") {
                  finalStr += "<a href='https://wa.me/639173116951/' target='_blank'>" + obj.app + " - " + obj.info + "</a><br>";
                } else if (obj.app.toUpperCase() == "VIBER") {
                  finalStr += "<a href='https://viber.me/%2B639173116951/' target='_blank'>" + obj.app + " - " + obj.info + "</a><br>";
                }
              };
              return finalStr;
            }},
            { title: "Onboard User", data: "ob_username",  className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
        ],
        "order": [ 0, "desc" ],
        "retrieve" : true,
    });

    $('#supportdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#supportdata').DataTable().row( id ).data();

      appsupport.selectSupport(data);
      appsupport.checkUser(1);
      appsupport.getVessName();
      appsupport.setFocusModal('1');
    });

    // $('#supportdata tbody').on('click', '.checkid', function () {
    //   var allSelected = $('.checkid:checked')
    //   if(allSelected.length == 0){
    //     $('.checkall').each(function(){ this.checked = false; });
    //   }
    // });
    // $("#checkall").on('click', function () {
    //     $('#supportdata').DataTable()
    //         .column({page: 'current'})
    //         .nodes()
    //         .to$()
    //         .find('input[type=checkbox]')
    //         .prop('checked', this.checked);
    // });
    // $(".dataTables_filter input").on('keyup change', function() {
    //   $('#supportdata').DataTable()
    //       .column(0)
    //       .nodes()
    //       .to$()
    //       .find('input[type=checkbox]')
    //       .prop('checked', false);
    //
    //   $('.checkall').each(function(){ this.checked = false; });
    // });
    // tool tip for page button nav
    $('#supportdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#supportdata_next.next.paginate_button').attr('title', 'Next');
    $('#supportdata_first.first.paginate_button').attr('title', 'First');
    $('#supportdata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#supportdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(id){
    var myTable = $('#supportdata').DataTable();
    myTable.clear().draw();
  },
  processUser(){
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');

    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  changeVesselID(event){
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    this.getallsupport();
  },
  selectSupport(sdata){
    appsupport.currsupport = sdata;
    window.localStorage.setItem('surveyinfo', JSON.stringify(appsupport.currsupport));
  },
  checkUser(proc){
    this.getVessName();
    if (this.privilage.userrights <= '2') {
      if (proc == 1) {
        appsupport.showModalView = true;
      } else if (proc == 2) {
        appsupport.showEditModal = true;
      } else {
        // swal("", "Unable to access your request.", "warning");
      }
    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
  },
  getDateToday(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd ;
    last_date = yyyy + '-' + mm + '-' + dd ;
    // if(dd <= 15){
    //   last_date = yyyy + '-' + mm + '-' + '01' ;
    // } else {
    //   last_date = yyyy + '-' + mm + '-' + '16' ;
    // }
    // console.log(today);
    if (this.vesselSetting.dateFrom == ""){
      this.vesselSetting.dateFrom = last_date;
    }
    if (this.vesselSetting.dateTo == ""){
      this.vesselSetting.dateTo = today;
    }
  },
  setFocus(eventid){
    document.getElementById(eventid).focus();
  },
  setFocusModal(proc){
    if(proc == "1"){
      $('body').on('shown.bs.modal', '#myModalView', function () {
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
  getVessName(){
    if(this.vesselSetting.vesselID == "0"){
      var optVessTmp = [];
      axios
        .get(localurl + "report.php?action=getvesselinfo&id=" +  this.currsupport.vesselid)
        .then(function(response){
          if(!response.data.error){
            appsupport.optVessTmp = response.data;
            // console.log(JSON.stringify(appsupport.optVessTmp));
          }
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          appsupport.vesselSetting.vesselName = "";
        })
        .finally(function(){
          appsupport.vesselSetting.vesselName = appsupport.optVessTmp[0].vesselname;
        });
    } else {
      this.vesselSetting.vesselName = document.getElementById('modeVessel').selectedOptions[0].text;
    };
  },

}
});
