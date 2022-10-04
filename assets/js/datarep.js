var datarep = new Vue({
el: '#datarep',
data: {
  vesselSetting : {vesselID: "", vesselName: "", fleetID: "", partnerID: "", dateFrom:"", dateTo:""},
  vesselsData: [],
  currVessel: {},
  pageVessels: [],
  perPage: 1000,
  totalName: "Total Allowed Apps and Blocked Domains: ",
  HeaderTitle: {mode1: "", mode2: "", mode3: ""},
  showGraphModal1: false,
  showGraphModal2: false,
  showGraphModal3: false,
  showReport: false,
  totalData: 0,
  csvStr: "",
  btnValue: true,
  voyGraphData: {imgdata:""},
  appDatalist: {},
  appDataAllow: {},
  appDataBlock: {},
  appCount: 8,
  reportOpt: {graph1: 1, graph2: 1, graph3: 1, Source: "all"},
  reportSource: [{text: "ALL", value: "all"}, {text: "ALLOWED", value: "allow"}, {text: "BLOCKED", value: "block"}],
  optVess: [{ text: '', value: '' }],
  privilage : {userrights : null, useraccess : null}
},
mounted: function(){
  this.processPrivilage();
  this.getVessel();
  this.getDateToday();
  this.getAllReports();
},
methods: {
  getAllReports(){
    axios
      .get(serverurl + "domainapp/top/0/vessel/" + this.vesselSetting.vesselID  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        datarep.vesselsData = response.data;
        // console.log(JSON.stringify(datarep.vesselsData));
        if(JSON.stringify(datarep.vesselsData) == "[]") {
          datarep.getDataGrid("");
        } else {
          datarep.getDataGrid(response.data);
          datarep.buttonshowhide("1");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        datarep.getDataGrid("");
        datarep.vesselsData = [{}];
      }) ;
    this.getGraphData();
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
          datarep.optVess = response.data.vessel;
          // if (datarep.vesselSetting.vesselID == ""){
          //   datarep.vesselSetting.vesselID = datarep.optVess[0].value;
          //   window.localStorage.setItem('vesselID', datarep.optVess[0].value);
          // };
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        datarep.optVess = [{ text: '', value: '' }];
      });
  },
  printReport(){
    if (this.reportOpt.Source == "all") {
      var str1 = "0/vessel/" +  this.vesselSetting.vesselID  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo;
    } else {
      var str1 = this.appCount + "/vessel/" +  this.vesselSetting.vesselID  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo;
    };
    var str2 = JSON.stringify(this.reportOpt);
    var str3 = window.localStorage.getItem('supportUser');

    setTimeout(() => { window.open(localPrint + "apps_report.php?strFile=" + str1 + "&strOption=" + str2 + "&strUser=" + str3, "_blank"); }, 300);
  },
  getGraphData(){
    // get all top domains
    axios
      .get(serverurl + "domainapp/top/" + this.appCount + "/vessel/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        datarep.appDatalist = response.data;
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      });

    // get block domains
    axios
      .get(serverurl + "domainapp/notallowed/" + this.appCount + "/vessel/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        datarep.appDataBlock = response.data;
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      });

    // get allowed domains
    axios
      .get(serverurl + "domainapp/allowed/" + this.appCount + "/vessel/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        datarep.appDataAllow = response.data;
        // console.log(JSON.stringify(response.data));
        google.charts.load("current", {packages:["corechart"]});
        setTimeout(() => { google.charts.setOnLoadCallback(drawChartPie_appsallow); }, 500);
        setTimeout(() => { google.charts.setOnLoadCallback(drawChartPie_appsblock); }, 500);
        setTimeout(() => { google.charts.setOnLoadCallback(drawChartPie_appsall); }, 500);
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      });

    function drawChartPie_appsallow() {
      // allowed apps
      var data = new google.visualization.DataTable();
        data.addColumn("string", "Apps");
        data.addColumn("number", "Total Usage");
        if (datarep.appDataAllow.length >= 1) {
          for(var i = 0; i < datarep.appDataAllow.length; i++) {
            var obj = datarep.appDataAllow[i];
            data.addRow([obj.app + " - " + (obj.count).toLocaleString(), Number(obj.count)]);
          };
        } else {
          data.addRow(["No App Available " , 0]);
        };

      var options = {
        title: "Allowed Apps",
        // colors: ["256AE5","5C8FEC","92B4F2","abc4ff","b6ccfe","c1d3fe","ccdbfd","d7e3fc","e2eafc","edf2fb"],
        width: 282,
        height: 200,
        chartArea : { left: 5, top: 40, width:"80%", height:"80%" },
        pieHole: 0,
        legend: { position: "right", textStyle: { fontSize: 8 }  }
      };
      var chartpie = new google.visualization.PieChart(document.getElementById("piechart_apps1"));
      chartpie.draw(data, options);

      // insert into database
      if (datarep.showReport == true) {
        var options_allow = {
  			  title: "Allowed Apps",
  			  width: 900,
  			  height: 600,
  			  chartArea : { left: 40, top: 40, width:"80%", height:"80%" },
  			  pieHole: 0,
  			  legend: { position: "right", textStyle: { fontSize: 12 }  }
  		  };
  		  var chart_allow = new google.visualization.PieChart(document.getElementById("div_allow"));
  		  google.visualization.events.addListener(chart_allow, 'ready', function () {
          div_allow.innerHTML = '<img src="' + chart_allow.getImageURI() + '">';
  			  // console.log(div_allow.innerHTML);
  			  datarep.insertGraph('insgraphdata11', window.localStorage.getItem('supportUser'), div_allow.innerHTML );
  		  });
  		  chart_allow.draw(data, options_allow);
      };

      // allowed apps in modal form
      if (datarep.showGraphModal1 == true) {
        datarep.HeaderTitle.mode1 = "Allowed Apps";
        var options1 = {
          title: datarep.HeaderTitle.mode1,
          width: 550,
          height: 400,
          // is3D: true,
          pieHole: 0,
          legend: { position: "right", textStyle: { fontSize: 12 }  },
        };
        var chartpie1 = new google.visualization.PieChart(document.getElementById("piechart_appsmodal1"));
        chartpie1.draw(data, options1);
      } // end if modal true
    };

    function drawChartPie_appsblock() {
      // not allowed apps
      var data = new google.visualization.DataTable();
        data.addColumn("string", "Apps");
        data.addColumn("number", "Total Usage");
        if (datarep.appDataBlock.length >= 1) {
          for(var i = 0; i < datarep.appDataBlock.length; i++) {
            var obj = datarep.appDataBlock[i];
            data.addRow([obj.app + " - " + (obj.count).toLocaleString(), Number(obj.count)]);
          };
        } else {
          data.addRow(["No App Available " , 0]);
        };

      var options = {
        title: "Blocked Domains" ,
        colors: ["ff1f20","DC1C13","A62C2B","C44841","E36359","FF7E72","FF998B","FFB5A6","FFD2C1","FFEFDD"],
        width: 282,
        height: 200,
        chartArea : { left: 5, top: 40, width:"80%", height:"80%" },
        pieHole: 0,
        legend: { position: "right", textStyle: { fontSize: 8 } }
      };
      var chartpie = new google.visualization.PieChart(document.getElementById("piechart_apps2"));
      chartpie.draw(data, options);

      // insert into database
      if (datarep.showReport == true) {
        var options_block = {
  			  title: "Blocked Domains",
  			  colors: ["ff1f20","DC1C13","A62C2B","C44841","E36359","FF7E72","FF998B","FFB5A6","FFD2C1","FFEFDD"],
  			  width: 900,
  			  height: 600,
  			  chartArea : { left: 40, top: 40, width:"80%", height:"80%" },
  			  pieHole: 0,
  			  legend: { position: "right", textStyle: { fontSize: 12 } }
        };
  		  var chart_block = new google.visualization.PieChart(document.getElementById('div_block'));
  		  google.visualization.events.addListener(chart_block, 'ready', function () {
  			  div_block.innerHTML = '<img src="' + chart_block.getImageURI() + '">';
  			  // console.log(div_block.innerHTML);
  			  datarep.insertGraph('insgraphdata12', window.localStorage.getItem('supportUser'), div_block.innerHTML );
  		  });
  		  chart_block.draw(data, options_block);
      };

      // block apps in modal form
      if (datarep.showGraphModal2 == true) {
        datarep.HeaderTitle.mode2 = "Blocked Domains";
        var options1 = {
          title: datarep.HeaderTitle.mode2,
          colors: ["ff1f20","DC1C13","A62C2B","C44841","E36359","FF7E72","FF998B","FFB5A6","FFD2C1","FFEFDD"],
          width: 550,
          height: 400,
          // is3D: true,
          pieHole: 0,
          legend: { position: "right", textStyle: { fontSize: 12 }  },
        };
        var chartpie1 = new google.visualization.PieChart(document.getElementById("piechart_appsmodal2"));
        chartpie1.draw(data, options1);
      } // end if modal true
    }

    function drawChartPie_appsall() {
      // alll apps
      var data = new google.visualization.DataTable();
        data.addColumn("string", "Apps");
        data.addColumn("number", "Total Usage");
        if (datarep.appDatalist.length >= 1) {
          for(var i = 0; i < datarep.appDatalist.length; i++) {
            var obj = datarep.appDatalist[i];
            data.addRow([obj.app + " - " + (obj.count).toLocaleString(), Number(obj.count)]);
          };
        } else {
          data.addRow(["No App Available " , 0]);
        };

      var options = {
        title: "Frequently Allowed Apps and Blocked Domains",
        colors: ["5C8FEC","256AE5","1034a6","412f88","722b6a","a2264b","d3212d","f62d2d","FFD2C1","FFEFDD"],
        width: 282,
        height: 200,
        chartArea : { left: 5, top: 40, width:"80%", height:"80%" },
        pieHole: 0,
        legend: { position: "right", textStyle: { fontSize: 8 }  }
      };
      var chartpie = new google.visualization.PieChart(document.getElementById("piechart_apps3"));
      chartpie.draw(data, options);

      if (datarep.showReport == true) {
        var options_all = {
  			  title: "Frequently Allowed Apps and Blocked Domains",
  			  colors: ["5C8FEC","256AE5","1034a6","412f88","722b6a","a2264b","d3212d","f62d2d","FFD2C1","FFEFDD"],
  			  width: 900,
  			  height: 600,
  			  chartArea : { left: 40, top: 40, width:"80%", height:"80%" },
  			  pieHole: 0,
  			  legend: { position: "right", textStyle: { fontSize: 12 }  }
  		  };
  		  var chart_all = new google.visualization.PieChart(document.getElementById('div_all'));
  		  google.visualization.events.addListener(chart_all, 'ready', function () {
  			  div_all.innerHTML = '<img src="' + chart_all.getImageURI() + '">';
  			  // console.log(div_all.innerHTML);
  			  datarep.insertGraph('insgraphdata13', window.localStorage.getItem('supportUser'), div_all.innerHTML );
  		  });
    	  chart_all.draw(data, options_all);
      };

      // allowed apps in modal form
      if (datarep.showGraphModal3 == true) {
        datarep.HeaderTitle.mode3 = "Frequently Allowed Apps and Blocked Domains";

        var options1 = {
          title: datarep.HeaderTitle.mode3,
          // colors: ["1034A6","412F88","722B6A","769FCA","A2D1E6","C44841","FF998B","FFB5A6","FFD2C1","FFEFDD"],
          colors: ["5C8FEC","256AE5","1034a6","412f88","722b6a","a2264b","d3212d","f62d2d","FFD2C1","FFEFDD"],
          width: 550,
          height: 400,
          // is3D: true,
          pieHole: 0,
          legend: { position: "right", textStyle: { fontSize: 12 }  },
        };
        var chartpie1 = new google.visualization.PieChart(document.getElementById("piechart_appsmodal3"));
        chartpie1.draw(data, options1);
      } // end if modal true
    };

  },
  insertGraph(str1, str2, str3) {
    datarep.voyGraphData.imgdata = str3
    var formData = datarep.toFormData(datarep.voyGraphData);
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
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = $("#vesselappData")
    oTblReport.DataTable ({
        "data" : vdata,
        // "scrollX": true,
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
            { title: "Applications", data: "app", className: "text-center" },
            { title: "Total Requested", data: "count", className: "text-center" },
            // { title: "TAG", data: "allowed", className: "text-center" },
            { title: "Setting", data: null, className: "text-center",
            render : function ( data, type, row, meta ) {
              return data.allowed === "1" ? "ALLOWED" : "BLOCKED" ;
            }},
        ],
        "order": [[ 1, "desc" ]],
        "retrieve" : true,
    });

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#vesselappData').DataTable();
    myTable.clear().rows.add(vdata).draw();
    myTable.columns.adjust().draw();
  },
  clearGrid(){
    var myTable = $('#vesselappData').DataTable();
    myTable.clear().draw();

    datarep.buttonshowhide("2");
  },
  processPrivilage(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
  },
  buttonshowhide(proc){
    var x = document.getElementById("myButtons");
    if (proc == 1){
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  },
  changeVesselID(event){
    // console.log(this.vesselSetting.vesselID);
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    this.getAllReports();
    this.getVessName();
  },
  viewGraph(proc){
    if (proc == 1) {
      datarep.showGraphModal1 = true;
    } else if (proc == 2) {
      datarep.showGraphModal2 = true;
    } else if (proc == 3) {
      datarep.showGraphModal3 = true;
    } else if (proc == 5) {
      datarep.showReport = true;
      setTimeout(() => { this.checkshowhide(); }, 200);
    } else {
      // swal("Warning", "Unable to access your request.", "warning");
    }
    this.getGraphData();
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
  JsonToCSV() {
    JsonArray = datarep.vesselsData;
    JsonFields = ["Applications","Total Domain Visited","Setting"];

    datarep.csvStr = JsonFields.join(",") + "\n";
    JsonArray.forEach(element => {
      appnew = element.app;
      count = element.count;
      allow = element.allowed;

      if(allow == "1"){
        datarep.csvStr += appnew + ',' + count + ',ALLOWED' + "\n";
      } else {
        datarep.csvStr += appnew + ',' + count + ',BLOCKED' + "\n";
      }
    });
    // console.log(vouch.csvStr);
    return datarep.csvStr;
  },
  downloadCSV() {
    this.getVessName();
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(datarep.csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'appusagereport_' + this.vesselSetting.vesselName + '_' + this.vesselSetting.dateFrom + '_' + this.vesselSetting.dateTo + '.txt';
    hiddenElement.click();
  },
  copyData(){
      const input = document.createElement('textarea');
      document.body.appendChild(input);
      input.value = datarep.csvStr;
      input.focus();
      input.select();
      const isSuccessful = document.execCommand('copy');
      document.body.removeChild(input);

      if (!isSuccessful) {
        console.log('Failed to copy data.');
        datarep.setTooltip('','Failed to copy data.');
      } else {
        console.log('Copied!');
        datarep.setTooltip('Copied')
      }
      datarep.hideTooltip();
  },
  setTooltip(message) {
    $('#btnCopy').attr('data-original-title', message);
    $('#btnCopy').tooltip('toggle');
    $('#btnCopy').tooltip('show');
  },
  hideTooltip() {
    setTimeout(() => {
      $('#btnCopy').tooltip('destroy');
      $('#btnCopy').tooltip('hide');
    }, 2000);
  },
  getVessName(){
    if(this.vesselSetting.vesselID != "0"){
      this.vesselSetting.vesselName = document.getElementById('modeVessel').selectedOptions[0].text;
    };
  },
  checkshowhide(){
    if (this.reportOpt.Source == "allow") {
      this.reportOpt.graph1 = 1;
      this.reportOpt.graph2 = 0;
      this.reportOpt.graph3 = 0;
      document.getElementById("chckGraph1").disabled = false;
      document.getElementById("chckGraph2").disabled = true;
      document.getElementById("chckGraph3").disabled = true;
    } else if (this.reportOpt.Source == "block") {
        this.reportOpt.graph1 = 0;
        this.reportOpt.graph2 = 1;
        this.reportOpt.graph3 = 0;
        document.getElementById("chckGraph1").disabled = true;
        document.getElementById("chckGraph2").disabled = false;
        document.getElementById("chckGraph3").disabled = true;
    } else {
      this.reportOpt.graph1 = 1;
      this.reportOpt.graph2 = 1;
      this.reportOpt.graph3 = 1;
      document.getElementById("chckGraph1").disabled = false;
      document.getElementById("chckGraph2").disabled = false;
      document.getElementById("chckGraph3").disabled = false;
    }
  },

  // PrintContent(divModal){
  //   var DocumentContainer = document.getElementById(divModal);
  //   var WindowObject = window.open("", "PrintWindow", "width=950,height=650,top=50,left=50,scrollbars=yes");
  //     WindowObject.document.writeln("<title>" + 'Print Graph' + "</title>");
  //     WindowObject.document.writeln("<body>" + DocumentContainer.innerHTML + "</body>");
  //     WindowObject.document.close();
  //     setTimeout(function(){
  //       WindowObject.focus();
  //       WindowObject.print();
  //       WindowObject.close();
  //     }, 300);
  // },
},
});
