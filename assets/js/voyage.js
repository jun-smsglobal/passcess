var appvoyage = new Vue({
el: '#appvoyage',
data: {
  vesselSetting : {vesselID: "", vesselName: "", fleetID: "", partnerID: "", vessStatus: "0", dateFrom:"", dateTo:""},
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  btnDelDisable: true,
  btnInputDisable: false,
  btnShow: true,
  allVoyage: [],
  currVoyage: {},
  valVoyage: 0,
  newSched: {id:"", vesselid: "", voyage: "", leg: "", origin: "", departure_at: "", destination: "", arrival_at: "", status: "", passenger_count: ""},
  optFleet: [{ text: '', value: '' }],
  optVess: [{ text: '', value: '' }],
  optArea: [{ text: '', value: '' }],
  optCountry: [{ text: '', value: '' }],
  optStatus: [{ text:'ALL', value:'0' },{ text:'COMPLETED', value:'completed' },{ text:'ONGOING', value:'ongoing' },
    { text:'NOT STARTED', value:'notstarted' },{ text:'CANCELLED', value:'cancelled' },{ text:'POSTPONED', value: 'Postponed'}],
  newPort: {portid: 0, portcountry: "", portcity: "", portcode: ""},
  delName: [],
  privilage : {userrights : null, useraccess : null, TokenKey : null}
},
mounted: function(){
  this.getDateToday();
  this.processUser();
  this.getFleet();
  this.getVessel();
  GetISP();
  setTimeout(() => { this.getAllSched(); }, 500);
},
methods: {
  getAllSched(){
    if(window.localStorage.getItem('tokenKey') == ""){
      getTokenKey("");
    };

    setTimeout(() => { }, 500);
    this.privilage.TokenKey = window.localStorage.getItem('tokenKey');
    console.log(this.privilage.TokenKey);

    appvoyage.myProgress(1);

    if(this.vesselSetting.vessStatus == "0"){
      axios
        // .get(serverurl + "voyageschedule/" + this.vesselSetting.vesselID, {headers : {Authorization: "bearer " + this.privilage.TokenKey }} )
        .get(serverurl + "voyageschedule/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo, {headers : {Authorization: "bearer " + this.privilage.TokenKey }} )
        .then(function(response){
          // get response
          appvoyage.allVoyage = response.data;
          // populate datatables
          appvoyage.getDataGrid(response.data);
        })
        .catch(function(error){
          appvoyage.myProgress(2);
          console.log(JSON.stringify(error.message));
          appvoyage.getDataGrid("");
        })
        .finally(function(){
            appvoyage.delBtnShow(JSON.stringify(appvoyage.allVoyage));
            // appvoyage.FilterJsonData(appvoyage.allVoyage, "Not Started")
        }) ;
    } else {
      axios
        // .get(serverurl + "voyageschedule/vesselstatus/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.vessStatus, {headers : {Authorization: "bearer " + this.privilage.TokenKey }} )
        .get(serverurl + "voyageschedule/vesselstatus/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.vessStatus + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo, {headers : {Authorization: "bearer " + this.privilage.TokenKey }} )
        .then(function(response){
          // get response
          appvoyage.allVoyage = response.data;
          // populate datatables
          appvoyage.getDataGrid(response.data);
        })
        .catch(function(error){
          // swal("Warning", "Unauthorized", "warning");
          console.log(JSON.stringify(error.message));
          appvoyage.getDataGrid("");
        })
        .finally(function(){
            appvoyage.delBtnShow();
        }) ;
    }

    this.checkBtnShow();
  },
  getFleet(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=12&id=" + this.vesselSetting.partnerID)
      .then(function(response){
        if(!response.data.error){
          appvoyage.optFleet = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appvoyage.optFleet = [{ text: '', value: '' }];
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
      // .get(localurl + "vessel.php?action=getvessel&proc=1&id=0")
      .get(strURL)
      .then(function(response){
        if(!response.data.error){
          appvoyage.optVess = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appvoyage.optVess = [{ text: '', value: '' }];
      })
      .finally(function(){
        // if ((appvoyage.vesselSetting.vesselID == "") || (appvoyage.vesselSetting.vesselID == "0")){
        //   window.localStorage.setItem('vesselID', appvoyage.optVess[0].value);
        //   appvoyage.vesselSetting.vesselID = appvoyage.optVess[0].value;
        // }
      });
  },
  getAllPort(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=7&id=0")
      .then(function(response){
        if(!response.data.error){
            appvoyage.optArea = response.data.vessel
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appvoyage.optArea = [{ text: '', value: '' }];
      })
      .finally(function(){
        if(appvoyage.privilage.userrights >= '2'){
          appvoyage.remItemPort();
        }
      });
  },
  getAllCountry(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=8&id=0")
      .then(function(response){
        if(!response.data.error){
            appvoyage.optCountry = response.data.vessel
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appvoyage.optCountry = [{ text: '', value: '' }];
      });
  },
  getDateToday(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd ;
    if(dd <= 15){
      last_date = yyyy + '-' + mm + '-' + '01' ;
    } else {
      last_date = yyyy + '-' + mm + '-' + '16' ;
    }

    if (this.vesselSetting.dateFrom == ""){
      this.vesselSetting.dateFrom = last_date;
    }
    if (this.vesselSetting.dateTo == ""){
      this.vesselSetting.dateTo = today;
    }
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#voyageskeddata").DataTable({
      "data" : vdata,
      // "scrollX": true,
      // "scrollY": '50vh',
      // "scrollCollapse": true,
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
              return '<input type="checkbox" value="'+ data.id + '" class="checkid" id=c-"' + meta.row + '">';
              }},
          { title: "Voyage", data: null, className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data.voyage + " - " + data.leg +'</button>';
            }},
          { title: "Origin", data: "origin", className: "text-center",
            render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Destination", data: "destination", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "ETD", data: "departure_at", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+
                moment(data).format('YYYY-MM-DD HHmm') +'H</button>';
            }},
          { title: "ETA", data: "arrival_at", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+
                moment(data).format('YYYY-MM-DD HHmm') +'H</button>';
            }},

          { title: "ATD", data: null, className: "text-center",
            render : function ( data, type, row, meta ) {
              return data.actual_departure_at === null ? "" :
              '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+
                moment(data.actual_departure_at).format('YYYY-MM-DD HHmm') +'H</button>';
            }},
          { title: "ATA", data: null, className: "text-center",
            render : function ( data, type, row, meta ) {
              return data.actual_arrival_at === null ? "" :
              '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+
                moment(data.actual_arrival_at).format('YYYY-MM-DD HHmm') +'H</button>';
            }},
          { title: "Status", data: "status", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">' + data + '</button>';
            }},
          { title: "Passenger <br> Manifest", data: "passenger_count", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
            // { title: "Date Entry", data: "passenger_count_at", className: "text-center",
            //   render : function ( data, type, row, meta ) {
            //     if(data !== null){
            //       return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+
            //         moment(data).format('YYYY-MM-DD HHmm') +'H</button>';
            //     } else {
            //       return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit"></button>';
            //     }
            //   }},
      ],
      "order": [ 4, "desc" ],
      "retrieve" : true,
    });

    $('#voyageskeddata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#voyageskeddata').DataTable().row( id ).data();

      appvoyage.getAllPort();
      appvoyage.selectSched(data);
      appvoyage.checkUser(2);
      appvoyage.checkSked();
      appvoyage.setFocusModal('2');
    });

    $('#voyageskeddata tbody').on('click', '.checkid', function () {
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
      appvoyage.delBtnShow();
    });
    $("#checkall").on('click', function () {
        $('#voyageskeddata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
      appvoyage.delBtnShow();
    });

    $(".dataTables_filter input").on('keyup change', function() {
      $('#voyageskeddata').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });

    // tool tip for page button nav
    $('#voyageskeddata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#voyageskeddata_next.next.paginate_button').attr('title', 'Next');
    $('#voyageskeddata_first.first.paginate_button').attr('title', 'First');
    $('#voyageskeddata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#voyageskeddata').DataTable();
    myTable.clear().rows.add(vdata).draw();
    myTable.columns.adjust().draw();

    appvoyage.myProgress(2);
  },
  clearGrid(id){
    var myTable = $('#voyageskeddata').DataTable();
    myTable.clear().draw();
  },
  processUser(){
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');

    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
    this.privilage.TokenKey = window.localStorage.getItem('tokenKey');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  changeVesselID(event){
    // console.log(event);
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    this.getAllSched()
    this.getVessName();
  },
  deleteSched(){
    axios
      // .delete(serverurl + "voyageschedule/" + this.currVoyage['id'], appvoyage.currVoyage, {headers : {Authorization: "bearer " + this.privilage.TokenKey }})
      .delete(serverurl + "voyageschedule/" + this.currVoyage['id'], {headers : {Authorization: "bearer " + this.privilage.TokenKey }} )
      .then(function(response){
        // console.log(response.data);
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE VOYAGE"}', appvoyage.currVoyage);
        appvoyage.currVoyage = {};
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
  selectSched(sched){
    appvoyage.currVoyage = sched;
    window.localStorage.setItem('scheddata', JSON.stringify(appvoyage.currVoyage));
  },
  addSched(){
    this.newSched.vesselid = this.vesselSetting.vesselID;
    console.log(JSON.stringify(appvoyage.newSched));
    var formData = appvoyage.toFormData(appvoyage.newSched);
    axios
      .post(serverurl + "voyageschedule", formData, {headers : {Authorization: "bearer " + this.privilage.TokenKey }} )
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD SCHEDULE"}', appvoyage.newSched);
        appvoyage.newSched = {id:"", vesselid: "", voyage: "", leg: "", origin: "", departure_at: "", destination: "", arrival_at: ""};

        appvoyage.getAllSched();
        swal("", "Successfully added", "success");
        window.localStorage.removeItem('scheddata');
      })
      .catch(function(error){
        if(error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(JSON.stringify(error.response.headers));
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.config);
        }
        console.log(JSON.stringify(error.message));
      }) ;
  },
  updateSched(){
    axios
      .put(serverurl + "voyageschedule/" + this.currVoyage['id'], appvoyage.currVoyage, {headers : {Authorization: "bearer " + this.privilage.TokenKey }})
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('scheddata'), appvoyage.currVoyage);
        appvoyage.allSched = [];
        appvoyage.currVoyage = {};

        appvoyage.getAllSched();
        swal("", "Successfully updated", "success");
        window.localStorage.removeItem('scheddata');
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
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  checkUser(proc){
    this.getVessName();
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      if((this.vesselSetting.vesselID == "0") || (this.vesselSetting.vesselID == "")) {
        swal("", "Please choose a vessel.", "warning");
      } else {

        if (proc == 1) {
          appvoyage.showAddModal = true;

          $(document).ready(function() {
            $('#datetimepicker1').datetimepicker({format:'Y-m-d H:i', autoclose: true, minDate:0});
            $('#datetimepicker1').on('change', function(e){
                $("#datetimepicker1").val(this.value)[0].dispatchEvent(new Event('input'))
            });
          });
          $(document).ready(function() {
            $('#datetimepicker2').datetimepicker({format:'Y-m-d H:i', autoclose: true, minDate:0});
            $('#datetimepicker2').on('change', function(e){
                $("#datetimepicker2").val(this.value)[0].dispatchEvent(new Event('input'))
            });
          });
        } else if (proc == 2) {
          appvoyage.showEditModal = true;

          $(document).ready(function() {
            $('#datetimepicker3').datetimepicker({format:'Y-m-d H:i', autoclose: true});
            $('#datetimepicker3').on('change', function(e){
                $("#datetimepicker3").val(this.value)[0].dispatchEvent(new Event('input'))
            });
          });
          $(document).ready(function() {
            $('#datetimepicker4').datetimepicker({format:'Y-m-d H:i', autoclose: true});
            $('#datetimepicker4').on('change', function(e){
                $("#datetimepicker4").val(this.value)[0].dispatchEvent(new Event('input'))
            });
          });
        } else if (proc == 3) {
          var allSelected = $('.checkid:checked')
          if(allSelected.length == 0){
            swal("", "Please select a record.", "warning");
          } else {
            appvoyage.delName = [];
            var allSelected = $('.checkid:checked')
            $.each(allSelected, function(i, val){
              var id = $(val).attr("id").match(/\d+/)[0];
              var data = $('#voyageskeddata').DataTable().row( id ).data();
              appvoyage.delName.push(data.voyage + " - " + data.leg);
            });
            appvoyage.showDeleteModal = true;
          }
        } else {
          // swal("", "Unable to access your request.", "warning");
        }
      }
    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
  },
  validateData(dataEntry, proc){
    var finalErr = [];
    if(dataEntry.voyage == ""){
      finalErr.push("Invalid Voyage Number");
    }
    // if(dataEntry.leg == ""){
    //   finalErr.push("Invalid Leg Number");
    // }
    if(dataEntry.origin == ""){
      finalErr.push("Invalid Origin");
    }
    if(dataEntry.departure_at == ""){
      finalErr.push("Invalid Departure Date");
    }
    if(dataEntry.destination == ""){
      finalErr.push("Invalid Destination");
    }
    if(dataEntry.arrival_at == ""){
      finalErr.push("Invalid Arrival Date");
    }
    if(dataEntry.origin == dataEntry.destination){
      finalErr.push("Invalid Origin and Destination");
    }

      // console.log(appvoyage.valVoyage);
      if((appvoyage.valVoyage != 0) && (proc == '1')){
        finalErr.push("Duplicate Voyage and Leg");
      }

    if( (dataEntry.departure_at != "") && (dataEntry.arrival_at != "") ){
      if(dataEntry.departure_at == dataEntry.arrival_at){
        finalErr.push("Invalid ETD and ETA");
      }
      if(new Date(dataEntry.arrival_at) < new Date(dataEntry.departure_at)){
        finalErr.push("Invalid ETD and ETA");
      }
    }

    // console.log(JSON.stringify(finalErr));
    if((JSON.stringify(finalErr) == "") || (JSON.stringify(finalErr) == "[]")){
      if (proc == '1'){
        appvoyage.showAddModal=false;
        appvoyage.addSched();
      } else {
        appvoyage.showEditModal=false;
        appvoyage.updateSched();
      }
    } else {
      swal("", JSON.stringify(finalErr), "warning");
    }
  },
  // validateVoyage(dataEntry){
  //   if( (dataEntry.voyage != "") && (dataEntry.voyage != "") ) {
  //     axios
  //       .get(localurl + "vessel.php?action=validate&proc=1&id="+this.vesselSetting.vesselID + "_" + dataEntry.voyage + "_" + dataEntry.leg)
  //       .then(function(response){
  //         if(!response.data.error){
  //           // console.log(JSON.stringify(response.data.vessel));
  //           appvoyage.valVoyage = response.data.vessel[0].retvalue;
  //         } else {
  //           appvoyage.valVoyage = '0';
  //         }
  //       })
  //       .catch(function(error){
  //         console.log(JSON.stringify(error.message));
  //         appvoyage.valVoyage = '0';
  //       });
  //   }
  // },
  getNewDate()
  {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();
    today = yyyy + '-' + mm + '-' + dd + " " + hh + ":00" ;
    // console.log(today);
    if (this.newSched.departure_at == ""){
      this.newSched.departure_at = today;
    }
    if (this.newSched.arrival_at == ""){
      this.newSched.arrival_at = today;
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
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      var allSelected = $('.checkid:checked')
      if(allSelected.length != 0){
        $.each(allSelected, function(i, val){

          var id = $(val).attr("id").match(/\d+/)[0];
          var data = $('#voyageskeddata').DataTable().row( id ).data();
          appvoyage.selectSched(data);
          appvoyage.deleteSched();
        });

        swal("", "Successfully deleted", "success");
        $('.checkall').each(function(){ this.checked = false; });
        setTimeout(() => { appvoyage.getAllSched(); }, 500);
      } else {
        swal("", "Please select a record.", "warning");
      }

    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
  },
  getVessName(){
    if(this.vesselSetting.vesselID != "0"){
      this.vesselSetting.vesselName = document.getElementById('modeVessel').selectedOptions[0].text;
    };
  },
  addArea(){
    var formData = appvoyage.toFormData(appvoyage.newPort);
    axios
      .post(localurl + "philport.php?action=create", formData)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(response.data.error == false){
          addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD AREA"}', appvoyage.newPort);
          appvoyage.newPort = {portid: 0, portcountry: "", portcity: "", portcode: ""};
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      })
      .finally(function(){
        appvoyage.getAllPort();
      });
  },
  delBtnShow(){
    var allSelected = $('.checkid:checked')
    if(allSelected.length == 0){
      appvoyage.btnDelDisable = true;
    } else {
      appvoyage.btnDelDisable = false;
    }
  },
  checkSked(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();
    today = yyyy + '-' + mm + '-' + dd + " " + hh + ":" + min ;

    if (this.privilage.userrights >= '2') {
      if(new Date(appvoyage.currVoyage.arrival_at) >= new Date(today)) {
        this.btnInputDisable = false;
      } else {
        this.btnInputDisable = true;
      };
    } else {
      this.btnInputDisable = false ;
    };    
  },
  checkBtnShow(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      this.btnShow = true;
    } else {
      this.btnShow = false;
    }
  },
  showAddPort(sProc){
    if (this.privilage.userrights <= '2') {
      switch (sProc) {
        case 1:
          this.showPortFields(this.newSched.origin);
          // this.newSched.origin = "";
        break
        case 2:
          this.showPortFields(this.newSched.destination);
          // this.newSched.destination = "";
        break
        case 3:
          this.showPortFields(this.currVoyage.origin);
          // this.currVoyage.origin = "";
        break
        case 4:
          this.showPortFields(this.currVoyage.destination);
          // this.currVoyage.destination = "";
        break
        default:
          console.log("Something went wrong");
        };
    };
  },
  showPortFields(sData){
    if(sData == '0'){
      this.getAllCountry();
      $('#myModalAddPort').modal('show');
      if((localISP.country == '') || (localISP == [])){
        appvoyage.newPort.portcountry = 'Philippines';
      } else {
        appvoyage.newPort.portcountry = localISP.country;
      }
    }
  },
  remItemPort(){
    var select1 = document.getElementById('modeArea1')
    select1.removeChild(select1.querySelector('option[value="0"]'))

    var select2 = document.getElementById('modeArea2')
    select2.removeChild(select2.querySelector('option[value="0"]'))

    var select3 = document.getElementById('modeArea3')
    select3.removeChild(select3.querySelector('option[value="0"]'))

    var select4 = document.getElementById('modeArea4')
    select4.removeChild(select4.querySelector('option[value="0"]'))
  },
  myProgress(vProc) {
    var x = document.getElementById("myModalProcess");
    if(vProc == 1){
      if (x.style.display == "none") {
        x.style.display = "block";
      }
    } else if (vProc == 2) {
        x.style.display = "none";
    };
  },
  FilterJsonData(data, dvalue){
    console.log(JSON.stringify(data));
    var result = data.filter((x)=>x.status === dvalue);
    console.log(JSON.stringify(result));
  },

}
});
