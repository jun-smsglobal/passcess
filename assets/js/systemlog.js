var syslog = new Vue({
el: '#syslog',
data: {
  vesselSetting : {vesselID: "", fleetID: "", partnerID: "", dateFrom:"", dateTo:""},
  logData: [],
  logWatchdogData: [],
  // pageLogs: [],
  // perPage: 50,
  // searchid : "",
  fileformat: {filePartner: "", fileFleet: "", fileVessel: ""},
  csvStr: "",
  btnValue: true,
  optVess: [{ text: '', value: '' }],
  privilage : {userrights : null, useraccess : null}
},
mounted: function(){
  this.processPrivilage();
  this.getVessel();
  this.getDateToday();
  setTimeout(() => { this.getAllLogs(); this.getWatchdogLogs(); }, 300);
},
methods: {
  getAllLogs(){
    axios
      .get(serverurl + "systemlog/" + this.vesselSetting.vesselID  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        syslog.logData = response.data;
        if(JSON.stringify(syslog.logData) == "[]") {
          // swal("Warning", "No Data", "warning");
        } else {
          syslog.getDataGrid1(response.data);
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        syslog.logData = [{}];
        syslog.clearGrid1("");
      }) ;
  },
  getWatchdogLogs(){
    axios
      .get(serverurl + "watchdoglog/" + this.vesselSetting.vesselID  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      // .get(serverurl + "watchdoglog/" + this.vesselSetting.vesselID )
      .then(function(response){
        syslog.logWatchdogData = response.data;
        if(JSON.stringify(syslog.logWatchdogData) == "[]") {
          // swal("Warning", "No Data", "warning");
        } else {
          syslog.getDataGrid2(response.data);
          syslog.buttonshowhide("1");
        };
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        syslog.logWatchdogData = [{}];
        syslog.clearGrid2();
      }) ;
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
          syslog.optVess = response.data.vessel;
          if (syslog.vesselSetting.vesselID == ""){
            syslog.vesselSetting.vesselID = syslog.optVess[0].value;
            window.localStorage.setItem('vesselID', syslog.optVess[0].value);
          };
        } else {
          // swal("Warning", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        syslog.optVess = [{ text: '', value: '' }];
      });
  },
  getDataGrid1(vdata){
    // Load  datatable
    var oTblReport1 = null;
    oTblReport1 = $("#httpdata").DataTable ({
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
        "columns" : [
            { title: "HTTP", data: "httpservice" },
            { title: "Active Since", data: "httpserviceactivesince" },
            { title: "Status", data: "httpservicestatus" },
        ],
    });
    // var myTable = $('#httpdata').DataTable();
    oTblReport1.clear().rows.add(vdata).draw();
    // tool tip for page button nav
    $('#httpdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#httpdata_next.next.paginate_button').attr('title', 'Next');
    $('#httpdata_first.first.paginate_button').attr('title', 'First');
    $('#httpdata_last.last.paginate_button').attr('title', 'Last');

    var oTblReport2 = null;
    oTblReport2 = $("#mysqldata").DataTable ({
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
        "columns" : [
            { title: "MYSQL", data: "mysqlservice" },
            { title: "Active Since", data: "mysqlserviceactivesince" },
        ],
    });
    // var myTable = $('#mysqldata').DataTable();
    oTblReport2.clear().rows.add(vdata).draw();
    // tool tip for page button nav
    $('#mysqldata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#mysqldata_next.next.paginate_button').attr('title', 'Next');
    $('#mysqldata_first.first.paginate_button').attr('title', 'First');
    $('#mysqldata_last.last.paginate_button').attr('title', 'Last');

    var oTblReport3 = null;
    oTblReport3 = $("#radiusdata").DataTable ({
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
        "columns" : [
            { title: "RADIUS", data: "radiusservice" },
            { title: "Active Since", data: "radiusserviceactivesince" },
        ],
    });
    // var myTable = $('#radiusdata').DataTable();
    oTblReport3.clear().rows.add(vdata).draw();
    // tool tip for page button nav
    $('#radiusdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#radiusdata_next.next.paginate_button').attr('title', 'Next');
    $('#radiusdata_first.first.paginate_button').attr('title', 'First');
    $('#radiusdata_last.last.paginate_button').attr('title', 'Last');

    var oTblReport4 = null;
    oTblReport4 = $("#sysdata").DataTable ({
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
            { title: "SYSTEM", data: "top" },
            { title: "Task", data: "tasks" },
            { title: "CPU", data: "cpu" },
            { title: "Memory", data: null,
              render : function ( data, type, row, meta ) {
                return data.KiBMem + " " + data.KiBSwap;
              }},
            { title: "Date Log", data: "created_at" },
        ],
        "order": [[ 4, "desc" ]],
        "retrieve" : true,
    });
    // var myTable = $('#sysdata').DataTable();
    oTblReport4.clear().rows.add(vdata).draw();

    // tool tip for page button nav
    $('#sysdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#sysdata_next.next.paginate_button').attr('title', 'Next');
    $('#sysdata_first.first.paginate_button').attr('title', 'First');
    $('#sysdata_last.last.paginate_button').attr('title', 'Last');
  },
  getDataGrid2(vdata){
    // Load  datatable
    var oTblReport1 = null;
    oTblReport1 = $("#watchdata").DataTable ({
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
            { title: "Service", data: "services" },
            { title: "Status", data: "status" },
            { title: "Monitored at", data: "monitored_at" },
        ],
        "order": [[ 2, "desc" ]],
        "retrieve" : true,
    });
    // var myTable = $('#watchdata').DataTable();
    oTblReport1.clear().rows.add(vdata).draw();
    // tool tip for page button nav
    $('#watchdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#watchdata_next.next.paginate_button').attr('title', 'Next');
    $('#watchdata_first.first.paginate_button').attr('title', 'First');
    $('#watchdata_last.last.paginate_button').attr('title', 'Last');
  },
  clearGrid1(){
    var myTable = $('#httpdata').DataTable();
    myTable.clear().draw();

    var myTable = $('#mysqldata').DataTable();
    myTable.clear().draw();

    var myTable = $('#radiusdata').DataTable();
    myTable.clear().draw();

    var myTable = $('#sysdata').DataTable();
    myTable.clear().draw();
  },
  clearGrid2(){
    var myTable = $('#watchdata').DataTable();
    myTable.clear().draw();

    syslog.buttonshowhide("2");
  },
  processPrivilage(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  changeVesselID(event){
    // console.log(this.vesselSetting.vesselID);
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    this.getAllLogs("2");
    this.getWatchdogLogs("2");

    var selvessel = document.getElementById("modeVessel");
    syslog.fileformat.fileVessel = selvessel.options[selvessel.selectedIndex].text;
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
  buttonshowhide(proc){
    var x = document.getElementById("myButtons");
    if (proc == 1){
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  },
  JsonToCSV() {
    JsonArray = syslog.logWatchdogData;
    JsonFields = ["ID","Service","Status","Date Monitored"];

    syslog.csvStr = JsonFields.join(",") + "\n";
    JsonArray.forEach(element => {
      watchid = element.id;
      watchsrvce = element.services;
      watchstatus = element.status;
      watchdate = element.monitored_at;

      syslog.csvStr += watchid + ',' + watchsrvce + "," + watchstatus + "," + watchdate + "\n";
    });
    return syslog.csvStr;
  },
  // JsonToCSV() {
  //   JsonArray = syslog.logData;
  //   JsonFields = ["HTTP","Active Since","Status","MYSQL","Active Since","RADIUS","Active Since","SYSTEM","Task","CPU","Memory","Date Log"];
  //
  //   syslog.csvStr = JsonFields.join(",") + "\n";
  //   JsonArray.forEach(element => {
  //     httpsrvce = element.httpservice;
  //     httpactive = element.httpserviceactivesince;
  //     httpstatus = element.httpservicestatus;
  //     vmysql = element.mysqlservice;
  //     vmysqlactive = element.mysqlserviceactivesince;
  //     vradius = element.radiusservice;
  //     vradiusactive = element.radiusserviceactivesince;
  //
  //     sysname = element.top;
  //     systask = element.task;
  //     syscpu = element.cpu;
  //     sysmemory = element.KiBMem + ' : ' + element.KiBSwap;
  //     datelog = element.created_at;
  //
  //     syslog.csvStr += httpsrvce + ',' + httpactive + "," + httpstatus + "," + vmysql + "," + vmysqlactive + "," + vradius + "," + vradiusactive + "," +
  //       sysname + "," + systask + "," + syscpu + "," + sysmemory + "," + datelog + "\n";
  //   });
  //   return syslog.csvStr;
  // },
  downloadCSV() {
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(syslog.csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download = "systemlog_" + this.fileformat.fileVessel + "_" +
      this.vesselSetting.dateFrom + '_to_' + this.vesselSetting.dateTo + '.txt';
    hiddenElement.click();
  },
  copyData(){
      const input = document.createElement('textarea');
      document.body.appendChild(input);
      input.value = syslog.csvStr;
      input.focus();
      input.select();
      const isSuccessful = document.execCommand('copy');
      document.body.removeChild(input);
      if (!isSuccessful) {
        console.error('Failed to copy voucher code.');
      }
  },

},
});
