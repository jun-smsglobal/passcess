var announce = new Vue({
el: '#announce',
data: {
  showAddModal: false,
  showEditModal: false,
  showDeleteModal: false,
  btnShow: true,
  vesselSetting : {vesselID: "", vesselName: "", fleetID: "", partnerID: "", dateFrom:"", dateTo:"", newsource:"all"},
  newsList: [],
  newsData:{ vesselid: "", title: "", body: "", author: "", starts_on: "", ends_on: "", username: "", tag: "onshore" },
  newsDataOld: [],
  allDate: [],
  currNewsData: {},
  chckRule : false,
  btnDelDisable: true,
  CombinedID: [],
  delName: [],
  privilage : {userrights : null, useraccess : null, TokenKey : null},
  optVess: [{ text: '', value: '' }],
  optStatus: [
    { text: 'ALL', value: 'all' },
    { text: 'ONSHORE', value: 'onshore' },
    { text: 'ONBOARD', value: 'onboard' }
  ]
},
mounted: function(){
  this.getDateToday();
  this.processPrivilage();
  this.getVessel();
  setTimeout(() => { this.getAllNews(); }, 200);
  this.getAllDate();
  removeData();
},
methods: {
  getAllNews(){
    axios
      .get(serverurl + "news/filter/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo + "/" +
        this.vesselSetting.newsource + "/starts_on")
      .then(function(response){
        announce.newsList = response.data;
        announce.newsDataOld = response.data;
        announce.getDataGrid(response.data);
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        announce.getDataGrid("");
        announce.newsList = [];
      })
      .finally(function(){
          announce.delBtnShow();
      }) ;
    this.checkBtnShow();
  },
  getVessel(){
    var strURL = "";
    if(this.privilage.userrights == '1'){
      strURL = localurl + "vessel.php?action=getvessel&proc=1&id=0";
    } else {
      strURL = localurl + "vessel.php?action=getvessel&proc=1&id=" + this.vesselSetting.partnerID;
    }

    // console.log(strURL);
    axios
      // .get(localurl + "vessel.php?action=getvessel&proc=1&id=0")
      .get(strURL)
      .then(function(response){
        if(!response.data.error){
          announce.optVess = response.data.vessel;
          if (announce.vesselSetting.vesselID == ""){
            announce.vesselSetting.vesselID = announce.optVess[0].value;
            window.localStorage.setItem('vesselID', announce.optVess[0].value);
          };
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        announce.optVess = [{ text: '', value: '' }];
      })
      .finally(function(){
        if ((announce.vesselSetting.vesselID == "") || (announce.vesselSetting.vesselID == "0")){
          window.localStorage.setItem('vesselID', announce.optVess[1].value);
          announce.vesselSetting.vesselID = announce.optVess[1].value;
        }
      });
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#newsdata").DataTable ({
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
            { title: "Title", data: null, className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" title="' + data.body.split("\n", 1) +
                  '" data-toggle="modal" data-target="#myModalEdit">'+ data.title +'</button>';
                // return '<div class="dropdown"><button type="button" class="button-body" style="border:none;padding:0;background:none;" id=n-"' + meta.row + '">'+ data.title +
                // '</button><div class="dropdown-content">' + data.body.split("\n", 1) + '</div></div>';
              }},
            { title: "Author", data: "author", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Starts On", data: "starts_on", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ moment(data).format('YYYY-MM-DD HH:mm') +'</button>';
              }},
            { title: "Ends On", data: "ends_on", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ moment(data).format('YYYY-MM-DD HH:mm') +'</button>';
              }},
            { title: "Posted by", data: "username",  className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Date Created", data: "created_at", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ moment(data).format('YYYY-MM-DD HH:mm') +'</button>';
              }},
            { title: "Date Modified", data: "updated_at", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ moment(data).format('YYYY-MM-DD HH:mm') +'</button>';
              }},
            { title: "Source", data: "tag", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
        ],
        "order": [[ 3, "desc" ]],
        "retrieve" : true,
    });

    $('#newsdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#newsdata').DataTable().row( id ).data();

        announce.selectNews(data);
        announce.checkUser(2);
        if(data.tag.toUpperCase() == 'ONBOARD'){
          announce.chckRule = true;
        } else {
          announce.chckRule = false;
          announce.setFocusModal('2');
        };
    });

    $('#newsdata tbody').on('click', '.checkid', function () {
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
      announce.delBtnShow();
    });
    $("#checkall").on('click', function () {
        $('#newsdata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
        announce.delBtnShow();
    });
    $(".dataTables_filter input").on('keyup change', function() {
      $('#newsdata').DataTable()
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
    var myTable = $('#newsdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(){
    var myTable = $('#newsdata').DataTable();
    myTable.clear().draw();
  },
  AddAnnounce(){
    announce.newsData.vesselid = this.vesselSetting.vesselID;
    announce.newsData.username = window.localStorage.getItem('supportUser');
    axios
      .post(serverurl + "news", announce.newsData)
      .then(function(response){
        console.log(response.data);
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD NEWS OR ANNOUNCEMENT"}', announce.newsData);
        announce.newsData = { id: 0, vesselid: "", title: "", body: "", author: "", starts_on: "", ends_on: "", created_at: "", updated_at: "" };
        announce.getAllNews();
        swal("", "Successfully updated", "success");
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
        console.log(JSON.stringify(error.message));
      }) ;
  },
  UpdateAnnounce(){
    announce.currNewsData.vesselid = announce.vesselSetting.vesselID;
    announce.currNewsData.username = window.localStorage.getItem('supportUser');

    announce.newsDataOld = window.localStorage.getItem('NewsSett');
    axios
      .put(serverurl + "news/" + announce.currNewsData.id, announce.currNewsData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), announce.newsDataOld, announce.currNewsData);
        announce.currNewsData = {};
        announce.newsDataOld = {};
        removeData();
        announce.getAllNews();
        swal("", "Successfully updated", "success");
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
  DeleteAnnounce(){
    announce.currNewsData.vesselid = announce.vesselSetting.vesselID;
    axios
      .delete(serverurl + "news/" + announce.currNewsData.id, announce.currNewsData)
      .then(function(response){
        console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "DELETE NEWS OR ANNOUNCEMENT"}', announce.currNewsData);
        announce.currNewsData = {};
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
  selectNews(currentData){
    announce.currNewsData = currentData;
    window.localStorage.setItem('NewsSett', JSON.stringify(announce.currNewsData));
  },
  processPrivilage(){
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');

    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
    // this.privilage.TokenKey = window.localStorage.getItem('tokenKey');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  changeVesselID(event){
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    this.getVessName();
    this.getAllNews();
  },
  checkUser(proc){
    this.getVessName();
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      if (proc == 1) {
        if((this.vesselSetting.vesselID == "0") || (this.vesselSetting.vesselID == "")) {
            swal("", "Please choose a vessel.", "warning");
        } else {
          announce.showAddModal = true;
          $(document).ready(function() {
            $('#datetimepicker1').datetimepicker({format:'Y-m-d H:i'});
            $('#datetimepicker1').on('change', function(e){
                $("#datetimepicker1").val(this.value)[0].dispatchEvent(new Event('input'))
            });
          });
          $(document).ready(function() {
            $('#datetimepicker2').datetimepicker({format:'Y-m-d H:i'});
            $('#datetimepicker2').on('change', function(e){
                $("#datetimepicker2").val(this.value)[0].dispatchEvent(new Event('input'))
            });
          });
        }
      } else if (proc == 2) {
        announce.showEditModal = true;
        $(document).ready(function() {
          $('#datetimepicker3').datetimepicker({format:'Y-m-d H:i'});
          $('#datetimepicker3').on('change', function(e){
            $("#datetimepicker3").val(this.value)[0].dispatchEvent(new Event('input'))
          });
        });
        $(document).ready(function() {
          $('#datetimepicker4').datetimepicker({format:'Y-m-d H:i'});
          $('#datetimepicker4').on('change', function(e){
            $("#datetimepicker4").val(this.value)[0].dispatchEvent(new Event('input'))
          });
        });
      } else if (proc == 3) {
        var allSelected = $('.checkid:checked')
        if(allSelected.length == 0){
          swal("", "Please select a record.", "warning");
        } else {
          announce.delName = [];
          var allSelected = $('.checkid:checked')
          $.each(allSelected, function(i, val){
            var id = $(val).attr("id").match(/\d+/)[0];
            var data = $('#newsdata').DataTable().row( id ).data();
            announce.delName.push(data.author);
          });
          announce.showDeleteModal = true;
        }
      } else {
        // swal("", "Unable to access your request.", "warning");
      }
    } else {
      swal("", "Please contact your system administrator.", "warning");
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
    if (this.newsData.starts_on == ""){
      this.newsData.starts_on = today;
    }
    if (this.newsData.ends_on == ""){
      this.newsData.ends_on = today;
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
  getDateToday(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd ;
    last_date = yyyy + '-' + mm + '-' + '01' ;
    // console.log(today);
    if (this.vesselSetting.dateFrom == ""){
      this.vesselSetting.dateFrom = last_date;
    }
    if (this.vesselSetting.dateTo == ""){
      this.vesselSetting.dateTo = today;
    }
  },
  GetCheckValue(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    if (this.privilage.userrights <= '2') {
      var allSelected = $('.checkid:checked')
      if(allSelected.length != 0){
        $.each(allSelected, function(i, val){

          var id = $(val).attr("id").match(/\d+/)[0];
          var data = $('#newsdata').DataTable().row( id ).data();
          announce.selectNews(data);
          announce.DeleteAnnounce();
        });

        swal("", "Successfully deleted", "success");
        $('.checkall').each(function(){ this.checked = false; });
        setTimeout(() => { announce.getAllNews(); }, 500);
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
  getAllDate(){
    this.allDate = "";
    axios
    .get(localurl + "getalldate.php?action=alldate&proc=2")
      .then(function(response){
        if(!response.data.error){
          announce.allDate = response.data.alldate;
          // console.log(JSON.stringify(editvouch.allDate));
        }
      })
      .finally(function(){
        if(announce.allDate){
          announce.selectAllDate("1");
        } else {
          announce.selectAllDate("2");
        }
      });
  },
  selectAllDate(proc){
    // console.log(JSON.stringify(announce.allDate));
    if(proc == "1"){
      $(document).ready(function() {
        $('#datetimepicker5').datepicker({
            minDate: announce.allDate[0].min_date,
            maxDate: announce.allDate[0].max_date,
            constrainInput: true,
            dateFormat: "yy-mm-dd",
          });
        $('#datetimepicker5').on('change', function(e){
          $("#datetimepicker5").val(this.value)[0].dispatchEvent(new Event('input'))
        });
      });

      $(document).ready(function() {
        $('#datetimepicker6').datepicker({
            minDate: announce.allDate[0].min_date,
            maxDate: announce.allDate[0].max_date,
            constrainInput: true,
            dateFormat: "yy-mm-dd",
          });
        $('#datetimepicker6').on('change', function(e){
          $("#datetimepicker6").val(this.value)[0].dispatchEvent(new Event('input'))
        });
      });
    } else {
      $(document).ready(function() {
        $('#datetimepicker5').datepicker({
            minDate: -30,
            maxDate: 30,
            constrainInput: true,
            dateFormat: "yy-mm-dd",
          });
        $('#datetimepicker5').on('change', function(e){
          $("#datetimepicker5").val(this.value)[0].dispatchEvent(new Event('input'))
        });
      });

      $(document).ready(function() {
        $('#datetimepicker6').datepicker({
            minDate: -30,
            maxDate: 30,
            constrainInput: true,
            dateFormat: "yy-mm-dd",
          });
        $('#datetimepicker6').on('change', function(e){
          $("#datetimepicker6").val(this.value)[0].dispatchEvent(new Event('input'))
        });
      });
    }
  },
  delBtnShow(){
    var allSelected = $('.checkid:checked')
    if(allSelected.length == 0){
      announce.btnDelDisable = true;
    } else {
      announce.btnDelDisable = false;
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
