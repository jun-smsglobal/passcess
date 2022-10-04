var appsurvey = new Vue({
el: '#appsurvey',
data: {
  vesselSetting : {vesselID: "", vesselName: "", fleetID: "", partnerID: ""},
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  btnDelDisable: true,
  btnShow: true,
  allSurvey: [],
  currSurvey: {},
  delName: [],
  newSurvey: {id:"", vesselid: "", surveylink: "", author: "", expired_at: "", description: ""},
  optFleet: [{ text: '', value: '' }],
  optVess: [{ text: '', value: '' }],
  privilage : {userrights : null, useraccess : null, TokenKey : null}
},
mounted: function(){
  this.processUser();
  this.getFleet();
  this.getVessel();
  setTimeout(() => { this.getAllSurvey(); }, 300);
},
methods: {
  getAllSurvey(){
    axios
      .get(serverurl + "survey/all/" + this.vesselSetting.vesselID )
      .then(function(response){
        appsurvey.allSurvey = response.data;
        appsurvey.getDataGrid(appsurvey.allSurvey);
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appsurvey.getDataGrid("");
      })
      .finally(function(){
          appsurvey.delBtnShow();
      }) ;
    this.checkBtnShow();
  },
  getFleet(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=12&id=" + this.vesselSetting.partnerID)
      .then(function(response){
        if(!response.data.error){
          appsurvey.optFleet = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appsurvey.optFleet = [{ text: '', value: '' }];
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
          appsurvey.optVess = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appsurvey.optVess = [{ text: '', value: '' }];
      })
      .finally(function(){
        if ((appsurvey.vesselSetting.vesselID == "") || (appsurvey.vesselSetting.vesselID == "0")){
          window.localStorage.setItem('vesselID', appsurvey.optVess[0].value);
          appsurvey.vesselSetting.vesselID = appsurvey.optVess[0].value;
        }
      });
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#surveydata").DataTable({
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
            { title: '<input type="checkbox" id="checkall" title="Select all" class="checkall"/>', data: null, className: "text-center", orderable: false,
              render: function (data, type, row, meta) {
                return '<input type="checkbox" value="'+ data.id + '" class="checkid" id=c-"' + meta.row + '">';
                }},
            { title: "Link", data: "surveylink", className: "text-left",
              render : function ( data, type, row, meta ) {
                  return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Description", data: "description", className: "text-left",
              render : function ( data, type, row, meta ) {
                  return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Author", data: "author", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Expiry Date", data: "expired_at", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+
                  moment(data).format('YYYY-MM-DD HH:mm') +'</button>';
              }},
        ],
        "order": [ 3, "desc" ],
        "retrieve" : true,
    });

    $('#surveydata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#surveydata').DataTable().row( id ).data();

      appsurvey.selectSurvey(data);
      appsurvey.checkUser(2);
      appsurvey.setFocusModal('2');
    });

    $('#surveydata tbody').on('click', '.checkid', function () {
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
      appsurvey.delBtnShow();
    });
    $("#checkall").on('click', function () {
        $('#surveydata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
      appsurvey.delBtnShow();
    });

    $(".dataTables_filter input").on('keyup change', function() {
      $('#surveydata').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });
    // tool tip for page button nav
    $('#surveydata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#surveydata_next.next.paginate_button').attr('title', 'Next');
    $('#surveydata_first.first.paginate_button').attr('title', 'First');
    $('#surveydata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#surveydata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(id){
    var myTable = $('#surveydata').DataTable();
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
    this.getAllSurvey();
    this.getVessName();
  },
  deleteSurvey(){
    axios
      // .delete(serverurl + "voyageschedule/" + this.currSurvey['id'], appsurvey.currSurvey, {headers : {Authorization: "bearer " + this.privilage.TokenKey }})
      .delete(serverurl + "survey/" + this.currSurvey['id'] )
      .then(function(response){
        // console.log(response.data);
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE SURVEY"}', appsurvey.currSurvey);
        appsurvey.currSurvey = {};
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
  selectSurvey(sched){
    appsurvey.currSurvey = sched;
    window.localStorage.setItem('surveyinfo', JSON.stringify(appsurvey.currSurvey));
  },
  addSurvey(){
    this.newSurvey.vesselid = this.vesselSetting.vesselID;
    // console.log(JSON.stringify(appsurvey.newSurvey));
    var formData = appsurvey.toFormData(appsurvey.newSurvey);
    axios
      .post(serverurl + "survey", formData )
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD SURVEY"}', appsurvey.newSurvey);

        appsurvey.newSurvey = {id:"", vesselid: "", surveylink: "", author: "", expired_at: ""};
        appsurvey.getAllSurvey();
        swal("", "Successfully added", "success");
        window.localStorage.removeItem('surveyinfo');
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
  updateSched(){
    axios
      .put(serverurl + "survey/" + this.currSurvey['id'], appsurvey.currSurvey)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('surveyinfo'), appsurvey.currSurvey);
        appsurvey.allSched = [];
        appsurvey.currSurvey = {};

        appsurvey.getAllSurvey();
        swal("", "Successfully updated", "success");
        window.localStorage.removeItem('surveyinfo');
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
            appsurvey.showAddModal = true;

            $(document).ready(function() {
              $('#datetimepicker1').datetimepicker({format:'Y-m-d H:i', autoclose: true, minDate:0, minTime:0});
              $('#datetimepicker1').on('change', function(e){
                  $("#datetimepicker1").val(this.value)[0].dispatchEvent(new Event('input'))
              });
            });
        } else if (proc == 2) {
          appsurvey.showEditModal = true;

          $(document).ready(function() {
            $('#datetimepicker3').datetimepicker({format:'Y-m-d H:i', autoclose: true});
            $('#datetimepicker3').on('change', function(e){
                $("#datetimepicker3").val(this.value)[0].dispatchEvent(new Event('input'))
            });
          });
        } else if (proc == 3) {
          var allSelected = $('.checkid:checked')
          if(allSelected.length == 0){
            swal("", "Please select a record.", "warning");
          } else {
            appsurvey.delName = [];
            var allSelected = $('.checkid:checked')
            $.each(allSelected, function(i, val){
              var id = $(val).attr("id").match(/\d+/)[0];
              var data = $('#surveydata').DataTable().row( id ).data();
              appsurvey.delName.push(data.author);
            });
            appsurvey.showDeleteModal = true;
          }
        }

      }
    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
  },
  validateData(dataEntry, proc){
    var finalErr = [];
    if(dataEntry.surveylink == ""){
      finalErr.push("Invalid Link");
    }
    if(dataEntry.author == ""){
      finalErr.push("Invalid Author");
    }
    if(dataEntry.expired_at == ""){
      finalErr.push("Invalid Expiry Date");
    }
    if((JSON.stringify(finalErr) == "") || (JSON.stringify(finalErr) == "[]")){

      if (proc == '1'){
        appsurvey.showAddModal=false;
        appsurvey.addSurvey();
      } else {
        appsurvey.showEditModal=false;
        appsurvey.updateSched();
      }

    } else {
      swal("Please Check", JSON.stringify(finalErr), "warning");
    }
  },
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
    if (this.newSurvey.expired_at == ""){
      this.newSurvey.expired_at = today;
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
          var data = $('#surveydata').DataTable().row( id ).data();
          appsurvey.selectSurvey(data);
          appsurvey.deleteSurvey();
        });

        swal("", "Successfully deleted", "success");
        $('.checkall').each(function(){ this.checked = false; });
        setTimeout(() => { appsurvey.getAllSurvey(); }, 500);
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
  delBtnShow(){
    var allSelected = $('.checkid:checked')
    if(allSelected.length == 0){
      appsurvey.btnDelDisable = true;
    } else {
      appsurvey.btnDelDisable = false;
    }
  },
  checkBtnShow(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      this.btnShow = true;
    } else {
      this.btnShow = false;
    }
  },

}
});
