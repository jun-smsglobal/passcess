var trackApp = new Vue({
el: '#trackApp',
data: {
  vesselSetting : {vesselID: "", vesselName: "", fleetID: "", partnerID: "", dateFrom:"", dateTo:""},
  allTrack: [],
  reportOpt: {vtranno:1, vvouchcode:1,vvouchtype:1,vpurchasedate:1,vcustname:1,vLayoutO:'1',mlayout:'A4'},
  printLayout: {},
  printOrient: [{ text:'Portrait',value:'1' }, { text:'Landscape',value:'2'}],
  showGraphModal: false,
  showReport: false,
  csvStr: "",

  currTrack: [],
  privilage : {userrights : null, useraccess : null, TokenKey : null},
  optVess: [{ text: '', value: '' }],
},
mounted: function(){
  this.getDateToday();
  this.processPrivilage();
  this.getVessel();
  setTimeout(() => { this.getAllTrack(); }, 300);
},
methods: {
  getAllTrack(){
    axios
      // .get(serverurl + "speedtest")
      .get(serverurl + "speedtest/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo )
      .then(function(response){
        if(!response.data.error){
          trackApp.allTrack = response.data;
          if(JSON.stringify(trackApp.allTrack) == "[]") {
            trackApp.getDataGrid("");
            trackApp.buttonshowhide("2");
          } else {
            trackApp.getDataGrid(response.data);
            trackApp.buttonshowhide("1");
          };
        } else {
          trackApp.buttonshowhide("2");
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        trackApp.buttonshowhide("2");
        trackApp.allTrack = "[]";
        trackApp.getDataGrid("");
      })
      .finally(function(){
        trackApp.getGraphData();
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
      .get(strURL)
      .then(function(response){
        if(!response.data.error){
          trackApp.optVess = response.data.vessel;
          if (trackApp.vesselSetting.vesselID == ""){
            trackApp.vesselSetting.vesselID = trackApp.optVess[0].value;
            window.localStorage.setItem('vesselID', trackApp.optVess[0].value);
          };
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        trackApp.optVess = [{ text: '', value: '' }];
      })
      .finally(function(){
        // if ((trackApp.vesselSetting.vesselID == "") || (trackApp.vesselSetting.vesselID == "0")){
        //   window.localStorage.setItem('vesselID', trackApp.optVess[1].value);
        //   trackApp.vesselSetting.vesselID = trackApp.optVess[1].value;
        // }
      });
  },
  changeVesselID(event){
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    this.getAllTrack();
    this.getVessName();
  },
  processPrivilage(){
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');

    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
    // this.privilage.TokenKey = window.localStorage.getItem('tokenKey');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  selectTrack(pdata){
    trackApp.currServices = pdata;
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
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#trackdata").DataTable ({
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
          // { title: '<input type="checkbox" id="checkall" title="Select all" class="checkall"/>', data: null, className: "text-center", orderable: false,
          //   render: function (data, type, row, meta) {
          //     return '<input type="checkbox" value="'+ data.serviceid + '" class="checkid" id=c-"' + meta.row + '">';
          //   }},
          { title: "Event Time", data: "event_time", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Download (Mbps)", data: "download", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Upload (Mbps)", data: "upload", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Latency", data: "ping", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          // { title: "IMO", data: "imo", className: "text-center",
          //   render : function ( data, type, row, meta ) {
          //     return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
          //   }},
      ],
      "order": [[ 3, "desc" ]],
    });

    $('#trackdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#trackdata').DataTable().row( id ).data();

      // trackApp.checkUser(2);
      trackApp.selectTrack(data);
    });

    // tool tip for page button nav
    $('#trackdata_previous.paginate_button.previous').attr('title', 'Previous');
    $('#trackdata_next.paginate_button').attr('title', 'Next');
    $('#trackdata_first.paginate_button.first').attr('title', 'First');
    $('#trackdata_last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#trackdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(){
    var myTable = $('#trackdata').DataTable();
    myTable.clear().draw();

    trackApp.buttonshowhide("2");
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
      // console.log(JSON.stringify(this.allTrack));
      if ((JSON.stringify(this.allTrack) == "[]") && (proc != 1) ){
        // swal("Warning", "Unable to access your request.", "warning");
      } else {
        if (proc == 1) {
          trackApp.showAddModal = true;
        } else if (proc == 2) {
          trackApp.showEditModal = true;
        } else if (proc == 3) {
          var allSelected = $('.checkid:checked')
          if(allSelected.length == 0){
            swal("", "Please select a record.", "warning");
          } else {
            trackApp.delName = [];
            var allSelected = $('.checkid:checked')
            $.each(allSelected, function(i, val){
              var id = $(val).attr("id").match(/\d+/)[0];
              var data = $('#trackdata').DataTable().row( id ).data();
              trackApp.delName.push(data.servicedesc);
            });
            trackApp.showDeleteModal = true;
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
  buttonshowhide(proc){
    var x = document.getElementById("myButtons");
    if (proc == 1){
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  },
  JsonToCSV() {
    JsonArray = trackApp.allTrack;
    JsonFields = ["Tran No.","Voucher Code","Type","Purchase Date","Control Panel User"];

    trackApp.csvStr = JsonFields.join(",") + "\n";
    JsonArray.forEach(element => {
      tranno = element.transaction_no;
      premiumcode = element.premium_vouchercode;
      vouchtype = element.premium_vouchertype;
      purchasedate = element.transaction_created;
      passname = element.ob_username;

      trackApp.csvStr += tranno + ',' + premiumcode + "," + vouchtype + "," + purchasedate + "," + passname + "\n";
    });
    return trackApp.csvStr;
  },
  downloadCSV() {
    this.getVessName();
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(trackApp.csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'premiumvoucher_' + this.vesselSetting.vesselName + '_' + this.vesselSetting.dateFrom + '_' + this.vesselSetting.dateTo + '.txt';
    hiddenElement.click();
  },
  getVessName(){
    if(this.vesselSetting.vesselID != "0"){
      this.vesselSetting.vesselName = document.getElementById('modeVessel').selectedOptions[0].text;
    };
  },
  getPageLayout(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=20&id=0")
      .then(function(response){
        if(!response.data.error){
          trackApp.printLayout = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        trackApp.printLayout = [{ text: 'A4' }] ;
      });
  },
  printReport(){

    var str1 = "premiumvouchers/purchasehistory/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo;
    var str2 = JSON.stringify(this.reportOpt);
    var str3 = window.localStorage.getItem('supportUser');

    setTimeout(() => { window.open(localPrint + "purchase_report.php?strFile=" + str1 + "&strOption=" + str2 + "&strUser=" + str3, "_blank"); }, 300);
  },
  viewGraph(proc){
    if (proc == 1) {
      trackApp.getGraphData();
      trackApp.showGraphModal = true;
    } else if (proc == 2) {
      trackApp.getPageLayout();
      trackApp.showReport = true;
    } else {
      swal("Warning", "Unable to access your request.", "warning");
    }
  },
  getGraphData(){
    if((this.vesselSetting.vesselID == "0") || (this.vesselSetting.vesselID == "")) {
      return;
    } else {
      google.charts.load("current", {packages:["corechart"]});
      setTimeout(() => { google.charts.setOnLoadCallback(drawChartLine); }, 200);
    }

    function drawChartLine() {
      var dataline = new google.visualization.DataTable();
        dataline.addColumn("datetime", "Date");
        dataline.addColumn("number", "Upload (Mbps)");
        dataline.addColumn("number", "Download (Mbps)");
        if (trackApp.allTrack.length >= 1) {
          for(var i = 0; i < trackApp.allTrack.length; i++) {
            var obj = trackApp.allTrack[i];
            dataline.addRow([new Date(obj.event_time), Number(obj.upload.replace(" Mbyte/s", "")), Number(obj.download.replace(" Mbyte/s", "")) ]);
            // console.log(Number(obj.upload.replace(" Mbyte/s", "")) + "=" + Number(obj.download.replace(" Mbyte/s", "")));
          };
        };

      var optionline = {
        title: "Network Availability",
        // colors: ["003559","b9d6f2","0353a4","061a40","b9d6f2"],
        colors: ["b9d6f2", "003559"],
        lineWidth: 2,
        width: 550,
        height: 200,
        isStacked: 'relative',
        curveType: "function",
        legend: { position: "bottom", textStyle: { fontSize: 8 }  },
        hAxis: { format: "dd"},
        vAxis: {minValue: 0,  title: 'Upload and Download Speed', textStyle: { fontSize: 8 }, titleTextStyle: { bold: true, italic: false} },
        series: {
          0: {targetAxisIndex: 0},
          1: {targetAxisIndex: 1}
        },
        vAxes: {
          // Adds titles to each axis.
          0: {title: 'Upload (Mbps)'},
          1: {title: 'Download (Mbps)'}
        },
      };
      var chartline = new google.visualization.LineChart(document.getElementById("linechart"));
      chartline.draw(dataline, optionline);

      // insert into database
      if (trackApp.showReport == true) {
        var options_usage = {
          title: "Network Availability",
          colors: ["b9d6f2", "003559"],
          lineWidth: 3,
  			  width: 550,
  			  height: 400,
          //isStacked: 'relative',
          curveType: "function",
          legend: { position: "right", textStyle: { fontSize: 10 }  },
          hAxis: { format: "dd" },
          vAxis: {minValue: 0,  title: 'Upload and Download Speed', textStyle: { fontSize: 12 }, titleTextStyle: { bold: true, italic: false} },
          series: {
            0: {targetAxisIndex: 0},
            1: {targetAxisIndex: 1}
          },
          vAxes: {
            // Adds titles to each axis.
            0: {title: 'Upload (Mbps)'},
            1: {title: 'Download (Mbps)'}
          },
  		  };
        trackApp.myGraphClasss(4, 1);
  		  var chart_usage = new google.visualization.LineChart(document.getElementById("div_graph"));
  		  google.visualization.events.addListener(chart_usage, 'ready', function () {
          div_graph.innerHTML = '<img src="' + chart_usage.getImageURI() + '">';
  			  trackApp.insertGraph('insgraphdata21', window.localStorage.getItem('supportUser'), div_graph.innerHTML );
  		  });
  		  chart_usage.draw(dataline, options_usage);
        trackApp.myGraphClasss(4, 2);
      };

      if (trackApp.showGraphModal == true) {
        var optionsline1 = {
          title: "Network Availability \n for the period " + trackApp.vesselSetting.dateFrom + " to " + trackApp.vesselSetting.dateTo,
          colors: ["b9d6f2", "003559"],
          lineWidth: 3,
          width: 550,
          height: 400,
          curveType: "function",
          legend: { position: "bottom", textStyle: { fontSize: 10 }  },
          hAxis: { format: "dd-MMM", slantedText:true, slantedTextAngle: 45 },
          vAxis: {minValue: 0,  title: 'Upload and Download Speed', textStyle: { fontSize: 12 }, titleTextStyle: { bold: true, italic: false} },
          series: {
            0: {targetAxisIndex: 0},
            1: {targetAxisIndex: 1}
          },
          vAxes: {
            // Adds titles to each axis.
            0: {title: 'Upload (Mbps)'},
            1: {title: 'Download (Mbps)'}
          },
        };
        var chartline1 = new google.visualization.LineChart(document.getElementById("linechartmodal"));
        chartline1.draw(dataline, optionsline1);
      }
    };

  },
  insertGraph(str1, str2, str3) {
    tackApp.vessGraphData.imgdata = str3
    var formData = tackApp.toFormData(tackApp.vessGraphData);
    axios
      // .get(localurl + "graphdata.php?action=" + str1 + "&webuser=" + str2 + "&imgdata=" + encodeURIComponent(str3))
      .post(localurl + "graphdata.php?action=" + str1 + "&webuser=" + str2, formData)
      .then(function(response){
        console.log(response.data);
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      });
  },
  myGraphClasss(vProc){
      var element1 = document.getElementById("div_graph");
      if(vProc === 1){
        element1.classList.remove("hidden");
      } else if (vProc === 2) {
        element1.classList.add("hidden");
      };
  },
}
});
