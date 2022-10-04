var vessrep = new Vue({
el: '#vessrep',
data: {
  vesselSetting : {vesselID: "", vesselName: "", fleetID: "", partnerID: "", dateFrom:"", dateTo:""},
  vesselsData: [],
  pageVessels: [],
  // perPage: 10,
  totalName1: "Basic Vouchers Used: ",
  totalName2: "Premium Connections: ",
  totalName3: "Total Data Basic Consumption: ",
  totalName4: "Total Time Usage: ",
  HeaderTitle: {mode1: "", mode2: "", mode3: "", mode4: "", mode5: "", mode6: ""},
  reportOpt: {Voyage:1,Journey:1,DepDate:1,ArrDate:1,TimeUsage:1,DataUsage:1,vPaid:1,vPromo:1,vFree:1,Basic:1,
      vlite:1,vlitefree:1,vlong:1,vlongfree:1,Premium:1,Source:"all",graph1:1,graph2:1,graph3:1,graph4:1,
      vTotTakeup:1,vTotFree:1,vTotPaid:1,pManifest:1,vCapacity:1,vLayoutO:'1',mlayout:'A4'},
  dataOpt: {allgraphdata:1,allfieldddata:1},
  reportSource: [{text: "ALL", value: "all"}, {text: "PREMIUM", value: "premium"}, {text: "BASIC", value: "basic"}],
  reportChck: {chckprem:false,chckbasic:false},
  vessGraphData: {imgdata:""},
  totalBasic: 0,
  totalData: 0,
  totalTime: 0,
  totalPremium: 0,
  totalCapacity: 0,
  totalPassenger: 0,
  showGraphModal1: false,
  showGraphModal2: false,
  showGraphModal3: false,
  showGraphModal4: false,
  showModalView: false,
  showReport: false,
  csvStr: "",
  voyageName: "",
  journeyName: "",
  optData: { dataBasic : 0, dataPremium : 0 },
  appDatalist:{},
  appDataAllow: {},
  appDataBlock: {},
  printLayout: {},
  printOrient: [{ text:'Portrait',value:'1' }, { text:'Landscape',value:'2'}],
  appCount: 8,
  optVess: [{ text: '', value: '' }],
  privilage : {userrights : null, useraccess : null}
},
mounted: function(){
  this.getDateToday();
  this.processPrivilage();
  this.getVessel();
  setTimeout(() => { this.getAllReports(); }, 500);
},
methods: {
  getAllReports(){
    // if((this.vesselSetting.vesselID == "") || (this.vesselSetting.vesselID == "0")){
    //   // this.vesselSetting.vesselID = this.optVess[1].value;
    //   return;
    // };

    vessrep.totalBasic = 0;
    vessrep.totalData = 0;
    vessrep.totalTime = 0;
    vessrep.totalPremium = 0;
    // vessrep.totalPassenger = 0;

    vessrep.myProgress(1);
    axios
      .get(serverurl + "vesselreport/" + this.vesselSetting.vesselID  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        vessrep.vesselsData = response.data;
        // console.log(JSON.stringify(response.data));
        if(JSON.stringify(vessrep.vesselsData) == "[]") {
          vessrep.getDataGrid("");
          vessrep.myProgress(2);
        } else {
          vessrep.getDataGrid(vessrep.vesselsData);
          vessrep.buttonshowhide("1");

          for(var i = 0; i < response.data.length; i++) {
            var obj = response.data[i];
            // console.log(obj.totalVoucher);
            vessrep.totalBasic = vessrep.totalBasic + Number(obj.totalVoucher);
            vessrep.totalData = vessrep.totalData + Number(obj.DataUsage);
            vessrep.totalTime = vessrep.totalTime + Number(obj.vTimeUsage);
            vessrep.totalPremium = vessrep.totalPremium + Number(obj.totalPremium);
            // vessrep.totalPassenger = vessrep.totalPassenger + Number(obj.passenger_count);
          };

          // format decimal places
          if (vessrep.totalData == 0){
            vessrep.totalData = Number(vessrep.totalData).toFixed(0);
          } else {
            vessrep.totalData = Number(vessrep.totalData).toFixed(2);
          };
          if (vessrep.totalTime == 0){
            vessrep.totalTime = Number(vessrep.totalTime).toFixed(0);
          } else {
            vessrep.totalTime = Number(vessrep.totalTime).toFixed(2);
          };
          // vessrep.totalBasic = Number(vessrep.totalBasic).toLocaleString();
          // vessrep.totalPremium = Number(vessrep.totalPremium).toLocaleString();
          vessrep.totalData = Number(vessrep.totalData).toLocaleString();
          vessrep.totalTime = Number(vessrep.totalTime).toLocaleString();
        };
      })
      .catch(function(error){
        vessrep.myProgress(2);
        console.log(JSON.stringify(error.message));
        vessrep.getDataGrid("");
        vessrep.vesselsData = [{}];
        vessrep.buttonshowhide("2");
      })
      .finally(function(){
        // console.log(vessrep.totalBasic + " == " + vessrep.totalPremium);
        vessrep.getPassCapacity();
        vessrep.getGraphData();
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
          vessrep.optVess = response.data.vessel;
        } else {
          vessrep.myProgress(2);
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        vessrep.myProgress(2);
        vessrep.optVess = [{ text: '', value: '' }];
      })
      .finally(function(){
        // if ((vessrep.vesselSetting.vesselID == "") || (vessrep.vesselSetting.vesselID == "0")){
        //   if (vessrep.optVess.length > 1) {
        //     window.localStorage.setItem('vesselID', vessrep.optVess[1].value);
        //     vessrep.vesselSetting.vesselID = vessrep.optVess[1].value;
        //   } else {
        //     vessrep.myProgress(2);
        //   }
        // }
      });
  },
  getPageLayout(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=20&id=0")
      .then(function(response){
        if(!response.data.error){
          vessrep.printLayout = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        vessrep.printLayout = [{ text: 'A4' }] ;
      });
  },
  printReport(){
    var str1 = "vesselreport/" +  this.vesselSetting.vesselID  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo;
    var str2 = JSON.stringify(this.reportOpt);
    var str3 = window.localStorage.getItem('supportUser');
    var str4 = JSON.stringify(this.dataOpt);

    if ((this.dataOpt.allgraphdata == 0)  && (this.dataOpt.allfieldddata == 0) ){
      console.log("No data to print");
    } else {
      setTimeout(() => { window.open(localPrint + "vessel_report.php?strFile=" + str1 + "&strOption=" + str2 + "&strUser=" + str3 + "&strData=" + str4, "_blank"); }, 500);
    };
  },
  getGraphData(){
    if((this.vesselSetting.vesselID == "0") || (this.vesselSetting.vesselID == "")) {
      return;
    }
    // get allowed domains
    axios
      .get(serverurl + "domainapp/allowed/" + this.appCount + "/vessel/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        vessrep.appDataAllow = response.data;
        google.charts.load("current", {packages:["corechart"]});

        setTimeout(() => { google.charts.setOnLoadCallback(drawChartPie); }, 500);
        setTimeout(() => { google.charts.setOnLoadCallback(drawChartPie_apps); }, 500);
        setTimeout(() => { google.charts.setOnLoadCallback(drawChartLine_service); }, 500);
        setTimeout(() => { google.charts.setOnLoadCallback(drawChartLine); }, 500);
      })
      .catch(function(error){
        vessrep.myProgress(2);
        console.log(JSON.stringify(error.message));
      });

    function drawChartPie() {
      var data = new google.visualization.DataTable();
        data.addColumn("string", "Service");
        data.addColumn("number", "Total Voucher");
        if ((vessrep.totalBasic == 0) && (vessrep.totalPremium == 0)) {
          data.addRow(["No Data",0]);
        } else {
          data.addRow(["Basic Vouchers Used - " + vessrep.totalBasic, Number(vessrep.totalBasic)]);
          data.addRow(["Premium Connections - " + vessrep.totalPremium, Number(vessrep.totalPremium)]);
        }

      var options = {
        title: "Summary of Services",
        pieHole: 0.4,
        width: 282,
        height: 200,
        chartArea : { left: 5, top: 40, width:"80%", height:"80%" },
        legend: { position: "right", textStyle: { fontSize: 8 }  }
      };
      var chart = new google.visualization.PieChart(document.getElementById("piechart"));
      chart.draw(data, options);

      // insert into database
      if (vessrep.showReport == true) {
        var options_services = {
          title: "Summary of Services",
          pieHole: 0.4,
  			  width: 550,
  			  height: 400,
  			  chartArea : { left: 40, top: 40, width:"80%", height:"80%" },
  			  legend: { position: "right", textStyle: { fontSize: 12 }  }
  		  };
        vessrep.myGraphClasss(1, 1);
  		  var chart_services = new google.visualization.PieChart(document.getElementById("div_services"));
  		  google.visualization.events.addListener(chart_services, 'ready', function () {
          div_services.innerHTML = '<img src="' + chart_services.getImageURI() + '">';
  			  vessrep.insertGraph('insgraphdata18', window.localStorage.getItem('supportUser'), div_services.innerHTML );
  		  });
  		  chart_services.draw(data, options_services);
        vessrep.myGraphClasss(1, 2);
      };

      if (vessrep.showGraphModal1 == true) {
        vessrep.HeaderTitle.mode1 = "Summary of Services \n for the period " + vessrep.vesselSetting.dateFrom + " to " + vessrep.vesselSetting.dateTo;
        var options1 = {
          title: vessrep.HeaderTitle.mode1,
          pieHole: 0.4,
          width: 550,
          height: 400,
          legend: { position: "right", textStyle: { fontSize: 12 }  }
        };
        var chart1 = new google.visualization.PieChart(document.getElementById("piechartmodal"));
        chart1.draw(data, options1);
      }
    };

    function drawChartLine() {
      var dataline = new google.visualization.DataTable();
        dataline.addColumn("datetime", "Date");
        dataline.addColumn("number", "Time Used");
        dataline.addColumn("number", "Data Usage");
        if (vessrep.vesselsData.length >= 1) {
          for(var i = 0; i < vessrep.vesselsData.length; i++) {
            var obj = vessrep.vesselsData[i];
            dataline.addRow([new Date(obj.departure_at), Number(obj.vTimeUsage), Number(obj.DataUsage)]);
          };
        };

      var optionline = {
        title: "Time & Data Usage",
        // colors: ["003559","b9d6f2","0353a4","061a40","b9d6f2"],
        colors: ["b9d6f2", "003559"],
        lineWidth: 2,
        width: 282,
        height: 200,
        isStacked: 'relative',
        curveType: "function",
        legend: { position: "bottom", textStyle: { fontSize: 8 }  },
        hAxis: { format: "dd"},
        vAxis: {minValue: 0,  title: 'MB and Hours', textStyle: { fontSize: 8 }, titleTextStyle: { bold: true, italic: false} },
        series: {
          0: {targetAxisIndex: 0},
          1: {targetAxisIndex: 1}
        },
        vAxes: {
          // Adds titles to each axis.
          0: {title: 'Hours'},
          1: {title: 'MB'}
        },
      };
      var chartline = new google.visualization.LineChart(document.getElementById("linechart"));
      chartline.draw(dataline, optionline);

      // insert into database
      if (vessrep.showReport == true) {
        var options_usage = {
          title: "Time & Data Usage",
          colors: ["b9d6f2", "003559"],
          lineWidth: 3,
  			  width: 550,
  			  height: 400,
          //isStacked: 'relative',
          curveType: "function",
          legend: { position: "right", textStyle: { fontSize: 10 }  },
          hAxis: { format: "dd" },
          vAxis: {minValue: 0,  title: 'MB and Hours', textStyle: { fontSize: 12 }, titleTextStyle: { bold: true, italic: false} },
          series: {
            0: {targetAxisIndex: 0},
            1: {targetAxisIndex: 1}
          },
          vAxes: {
            // Adds titles to each axis.
            0: {title: 'Hours'},
            1: {title: 'MB'}
          },
  		  };
        vessrep.myGraphClasss(4, 1);
  		  var chart_usage = new google.visualization.LineChart(document.getElementById("div_usage"));
  		  google.visualization.events.addListener(chart_usage, 'ready', function () {
          div_usage.innerHTML = '<img src="' + chart_usage.getImageURI() + '">';
  			  vessrep.insertGraph('insgraphdata21', window.localStorage.getItem('supportUser'), div_usage.innerHTML );
  		  });
  		  chart_usage.draw(dataline, options_usage);
        vessrep.myGraphClasss(4, 2);
      };

      if (vessrep.showGraphModal4 == true) {
        vessrep.HeaderTitle.mode4 = "Time & Data Usage \n for the period " + vessrep.vesselSetting.dateFrom + " to " + vessrep.vesselSetting.dateTo;
        var optionsline1 = {
          title: vessrep.HeaderTitle.mode4,
          colors: ["b9d6f2", "003559"],
          lineWidth: 3,
          width: 550,
          height: 400,
          curveType: "function",
          legend: { position: "bottom", textStyle: { fontSize: 10 }  },
          hAxis: { format: "dd-MMM", slantedText:true, slantedTextAngle: 45 },
          vAxis: {minValue: 0,  title: 'MB and Hours', textStyle: { fontSize: 12 }, titleTextStyle: { bold: true, italic: false} },
          series: {
            0: {targetAxisIndex: 0},
            1: {targetAxisIndex: 1}
          },
          vAxes: {
            // Adds titles to each axis.
            0: {title: 'Hours'},
            1: {title: 'MB'}
          },
        };
        var chartline1 = new google.visualization.LineChart(document.getElementById("linechartmodal"));
        chartline1.draw(dataline, optionsline1);
      }
    };

    function drawChartLine_service() {
      var dataservice = new google.visualization.DataTable();
        dataservice.addColumn("datetime", "Date");
        dataservice.addColumn("number", "Basic Vouchers Used");
        dataservice.addColumn("number", "Premium Connections");
        //dataservice.addColumn("number", "Passenger Capacity");
        //dataservice.addColumn("number", "Passenger Manifest");
        if (vessrep.vesselsData.length >= 1) {
          for(var i = 0; i < vessrep.vesselsData.length; i++) {
              var obj = vessrep.vesselsData[i];
              dataservice.addRow([new Date(obj.departure_at), Number(obj.totalVoucher), Number(obj.totalPremium)]);
              //dataservice.addRow([new Date(obj.departure_at), Number(obj.totalPremium), Number(obj.totalVoucher), Number(obj.totalPassenger), Number(obj.totalPassenger) ]);
          };
        };

      var optionservice = {
        title: "Basic Vouchers Used & Premium Connections",
        lineWidth: 2,
        width: 282,
        height: 200,
        isStacked: 'percent',
        curveType: "function",
        legend: { position: "bottom", textStyle: { fontSize: 8 }  },
        hAxis: { format: "dd" },
        vAxis: {minValue: 0,  title: 'QTY', textStyle: { fontSize: 8 }, titleTextStyle: { bold: true, italic: false} }
        // tooltip: {trigger:'selection'}
      };
      var chartservice = new google.visualization.LineChart(document.getElementById("linechart_app"));
      chartservice.draw(dataservice, optionservice);

      // insert into database
      if (vessrep.showReport == true) {
        var options_conn = {
          title: "Basic Vouchers Used & Premium Connections",
          lineWidth: 3,
  			  width: 550,
  			  height: 400,
          curveType: "function",
          legend: { position: "right", textStyle: { fontSize: 10 }  },
          hAxis: { format: "dd" },
          vAxis: {minValue: 0,  title: 'QTY', textStyle: { fontSize: 12 }, titleTextStyle: { bold: true, italic: false} }
          // chartArea: { width: '50%' }
  		  };
        vessrep.myGraphClasss(3, 1);
  		  var chart_conn = new google.visualization.LineChart(document.getElementById("div_conn"));
  		  google.visualization.events.addListener(chart_conn, 'ready', function () {
          div_conn.innerHTML = '<img src="' + chart_conn.getImageURI() + '">';
          vessrep.insertGraph('insgraphdata20', window.localStorage.getItem('supportUser'), div_conn.innerHTML );
  		  });
        chart_conn.draw(dataservice, options_conn);
        vessrep.myGraphClasss(3, 2);
      };

      if (vessrep.showGraphModal3 == true) {
        vessrep.HeaderTitle.mode3 = "Basic Vouchers Used & Premium Connections \n for the period  " + vessrep.vesselSetting.dateFrom + " to " + vessrep.vesselSetting.dateTo;
        var optionsservice1 = {
          title: vessrep.HeaderTitle.mode3,
          lineWidth: 3,
          width: 550,
          height: 400,
          curveType: "function",
          legend: { position: "bottom", textStyle: { fontSize: 10 }  },
          hAxis: { format: "dd-MMM", slantedText:true, slantedTextAngle: 45 },
          // vAxis: {minValue: 0,  title: 'QTY', textStyle: { fontSize: 12 }}
          vAxis: {minValue: 0,  title: 'QTY', textStyle: { fontSize: 12 }, titleTextStyle: { bold: true, italic: false} }
        };
        var chartservice1 = new google.visualization.LineChart(document.getElementById("linechart_appmodal"));
        chartservice1.draw(dataservice, optionsservice1);
      }
    };

    function drawChartPie_apps() {
      // allowed apps
      var data1 = new google.visualization.DataTable();
        data1.addColumn("string", "Allowed");
        data1.addColumn("number", "Total Usage");
        if (vessrep.appDataAllow.length >= 1) {
          for(var i = 0; i < vessrep.appDataAllow.length; i++) {
            var obj = vessrep.appDataAllow[i];
            data1.addRow([obj.app + " - " + (obj.count).toLocaleString(), Number(obj.count)]);
          };
        } else {
          data1.addRow(["No Data " , 0]);
        };

      var options = {
        title: "Frequently Used Apps",
        width: 282,
        height: 200,
        chartArea : { left: 5, top: 40, width:"80%", height:"80%" },
        pieHole: 0,
        legend: { position: "right", textStyle: { fontSize: 8 }  }
      };
      var chartpie = new google.visualization.PieChart(document.getElementById("piechart_apps"));
      chartpie.draw(data1, options);

      // insert into database
      if (vessrep.showReport == true) {
        var options_freq = {
          title: "Frequently Used Apps",
  			  width: 550,
  			  height: 400,
  			  chartArea : { left: 40, top: 40, width:"75%", height:"75%" },
          pieHole: 0,
  			  legend: { position: "right", textStyle: { fontSize: 12 }  }
  		  };
        vessrep.myGraphClasss(2, 1);
  		  var chart_freq = new google.visualization.PieChart(document.getElementById("div_freq"));
  		  google.visualization.events.addListener(chart_freq, 'ready', function () {
          div_freq.innerHTML = '<img src="' + chart_freq.getImageURI() + '">';
  			  vessrep.insertGraph('insgraphdata19', window.localStorage.getItem('supportUser'), div_freq.innerHTML );
  		  });
  		  chart_freq.draw(data1, options_freq);
        vessrep.myGraphClasss(2, 2);
      };

      // allowed and block apps in modal form
      if (vessrep.showGraphModal2 == true) {
        vessrep.HeaderTitle.mode2 = "Frequently Used Apps \n for the period " + vessrep.vesselSetting.dateFrom + " to " + vessrep.vesselSetting.dateTo;
        var options1 = {
          title: vessrep.HeaderTitle.mode2,
          width: 550,
          height: 400,
          // is3D: true,
          legend: { position: "right", textStyle: { fontSize: 12 }  },
          // slices: {  1: {offset: 0.05},
          //            2: {offset: 0.05},
          //            3: {offset: 0.05},
          //            4: {offset: 0.05},
          //            5: {offset: 0.05},
          //            6: {offset: 0.05},
          //            7: {offset: 0.05},
          //            8: {offset: 0.05},
          //           },
          pieHole: 0
        };
        var chartpie1 = new google.visualization.PieChart(document.getElementById("piechart_appsmodal"));
        chartpie1.draw(data1, options1);
      }
    }
  },
  insertGraph(str1, str2, str3) {
    vessrep.vessGraphData.imgdata = str3
    var formData = vessrep.toFormData(vessrep.vessGraphData);
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
  processPrivilage(){
    this.privilage.userrights = window.localStorage.getItem("userRights");
    this.privilage.useraccess = window.localStorage.getItem("userAccess");
    this.vesselSetting.partnerID = window.localStorage.getItem("partner");
    this.vesselSetting.vesselID = window.localStorage.getItem("vesselID");

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },
  changeVesselID(event){
    // console.log(this.vesselSetting.vesselID);
    window.localStorage.setItem("vesselID", this.vesselSetting.vesselID);
    this.getAllReports();
    this.getVessName();
  },
  formatDateData(data){
    var todayDate = new Date(data).toLocaleDateString('en-CA').slice(0, 10);
    console.log(todayDate);
  },
  viewGraph(proc){
    this.getGraphData();
    if (proc == 1) {
      vessrep.showGraphModal1 = true;
    } else if (proc == 2) {
      vessrep.showGraphModal2 = true;
    } else if (proc == 3) {
      vessrep.showGraphModal3 = true;
    } else if (proc == 4) {
      vessrep.showGraphModal4 = true;
    } else if (proc == 5) {
      vessrep.getPageLayout();
      vessrep.showReport = true;
      setTimeout(() => { this.checkalldata('3'); }, 200);
    } else {
      swal("Warning", "Unable to access your request.", "warning");
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
    if (this.vesselSetting.dateFrom == ""){
      this.vesselSetting.dateFrom = last_date;
    }
    if (this.vesselSetting.dateTo == ""){
      this.vesselSetting.dateTo = today;
    }
  },
  JsonToCSV() {
    JsonArray = vessrep.vesselsData;
    JsonFields = ["Voyage","Journey","Departure Date","Arrival Date","Time Usage (hhmm)","Data Usage (MB)","Basic Paid","Basic Promo","Basic Free","Basic Vouchers Total",
      "Lite","Lite Free","Long","Long Free","Premium Connections Total", "Passenger Manifest", "Passenger Capacity"];

    vessrep.csvStr = JsonFields.join(",") + "\n";
    JsonArray.forEach(element => {
      voyage = element.voyageid;
      port = element.journey;
      depture = element.departure_at;
      arrival = element.arrival_at;
      timeused = element.TimeUsage;
      dataused = element.DataUsage;
      totPaid = element.totalPaid;
      totPromo = element.totalPromo;
      totFree = element.totalFree;
      totVoucher = element.totalVoucher;
      totLite = 0;
      totLiteFree = element.totalPremium;
      totLong = 0;
      totLongFree = 0;
      totPremium = element.totalPremium;
      totPassCnt = element.passenger_count;
      totPassCapacity = element.vessCapacity;
      // totInvalid = element.totalInvalid;
      totTakeup = element.totalPremium + element.totalVoucher;
      totAllFree = element.totalPromo + element.totalFree + 0 + 0 ;
      totAllPaid = element.totalPaid + 0 + 0 ;

      vessrep.csvStr += voyage + ',' + port + "," + depture + "," + arrival + "," + timeused + "," + dataused + "," +
        totPaid + "," + totPromo + "," + totFree + "," + totVoucher + "," + totLite + "," + totLiteFree + "," + totLong + "," + totLongFree + "," + totPremium + ","  +
        totAllFree + "," + totAllPaid + "," + totTakeup + "," + totPassCnt + "," + totPassCapacity + "\n";
    });
    return vessrep.csvStr;
  },
  downloadCSV() {
    this.getVessName();
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(vessrep.csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'vesselreport_' + this.vesselSetting.vesselName + '_' + this.vesselSetting.dateFrom + '_' + this.vesselSetting.dateTo + '.txt';
    hiddenElement.click();
  },
  copyData(){
      const input = document.createElement('textarea');
      document.body.appendChild(input);
      input.value = vessrep.csvStr;
      input.focus();
      input.select();
      const isSuccessful = document.execCommand('copy');
      document.body.removeChild(input);
      if (!isSuccessful) {
        console.error('Failed to copy vessel report.');
      }
  },
  // exportF(elem) {
  //   var table = document.getElementById("myTable");
  //   var html = table.outerHTML;
  //   var url = 'data:application/vnd.ms-excel,' + escape(html); // Set your html table into url
  //   elem.setAttribute("href", url);
  //   elem.setAttribute("download", "export.xls"); // Choose the file name
  //   return false;
  // },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#vesselrepdata").DataTable ({
      "data" : vdata,
      "scrollX": true,
      "scrollY": 450,
      "paging": true,
      "responsive": true,
      "searching": false,
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
            { title: "Voyage", data: "voyageid", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
            { title: "Journey", data: "journey", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
            { title: "Departure Date", data: "departure_at", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+
                  moment(data).format('YYYY-MM-DD HHmm') +'H' +'</button>';
              }},
            { title: "Arrival Date", data: "arrival_at", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+
                  moment(data).format('YYYY-MM-DD HHmm') +'H' +'</button>';
              }},
            { title: "Time Usage <br> (hhmm)", data: "TimeUsage", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
            { title: "Data Usage <br> (MB)", data: "DataUsage", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ Number(data).toLocaleString();  +'</button>';
              }},
            { title: "Paid", data: "totalPaid", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" style="font-style: italic" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
            { title: "Promo", data: "totalPromo", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" style="font-style: italic" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
            { title: "Free", data: "totalFree", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" style="font-style: italic" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
            { title: "Total", data: "totalVoucher", className: "text-center",
              render : function ( data, type, row, meta ) {
                return data <= 0 ?
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>' :
                '<button type="button" class="borderless-button" style="font-weight:bold;" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>' ;
              }},

            // { title: "Lite", data: null, className: "text-center",
            //   render : function ( data, type, row, meta ) {
            //     return '<button type="button" class="borderless-button" style="font-style: italic" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ 0 +'</button>';
            //   }},
            // { title: "Lite Free", data: "totalPremium", className: "text-center",
            //   render : function ( data, type, row, meta ) {
            //     return '<button type="button" class="borderless-button" style="font-style: italic" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">' + data + '</button>';
            //   }},
            // { title: "Long", data: null, className: "text-center",
            //   render : function ( data, type, row, meta ) {
            //     return '<button type="button" class="borderless-button" style="font-style: italic" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">0</button>';
            //   }},
            // { title: "Long Free", data: null, className: "text-center",
            //   render : function ( data, type, row, meta ) {
            //     return '<button type="button" class="borderless-button" style="font-style: italic" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">0</button>';
            //   }},
            { title: "Total", data: "totalPremium", className: "text-center",
              render : function ( data, type, row, meta ) {
                return data <= 0 ?
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>' :
                '<button type="button" class="borderless-button" style="font-weight:bold;" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},

            { title: "Free", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+
                  (data.totalPromo + data.totalFree + data.totalPremium) +'</button>';
              }},
            { title: "Paid", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+
                  (data.totalPaid) +'</button>';
              }},
            { title: "Take-up", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                return (data.totalPremium + data.totalVoucher) <= 0 ?
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ (data.totalPremium + data.totalVoucher) +'</button>' :
                '<button type="button" class="borderless-button" style="font-weight:bold;" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ (data.totalPremium + data.totalVoucher) +'</button>';
              }},

            { title: "Passenger <br> Number", data: "passenger_count", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
            { title: "Passenger <br> Capacity", data: "vessCapacity", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
            // { title: "Invalid Vouchers", data: "totalInvalid", className: "text-center" },
        ],
      "order": [ 2, 'desc' ],
      "retrieve" : true,
      "AutoWidth": true
    });

    $('#vesselrepdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#vesselrepdata').DataTable().row( id ).data();

      // console.log(JSON.stringify(data));
      // console.log(JSON.stringify(data.vesselid + '_' + data.voyageids + '_' + data.voyageids));
      vessrep.voyageName = data.voyageid;
      vessrep.journeyName = data.journey;
      vessrep.getVoyageData(data.vesselid + '_' + data.voyageids + '_' + data.voyageids);
      vessrep.showModalView = true;
    });

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#vesselrepdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
    myTable.columns.adjust().draw();

    vessrep.myProgress(2);
  },
  clearGrid(){
    var myTable = $('#vesselrepdata').DataTable();
    myTable.clear().draw();

    vessrep.buttonshowhide("2");
  },
  buttonshowhide(proc){
    var x = document.getElementById("myButtons");
    if (proc == 1){
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  },
  getVessName(){
    if(this.vesselSetting.vesselID != "0"){
      this.vesselSetting.vesselName = document.getElementById('modeVessel').selectedOptions[0].text;
    };
  },
  getPassCapacity(){
    if(this.vesselSetting.vesselID != "0"){
      var optVessTmp = [];
      axios
        .get(localurl + "report.php?action=getvesselinfo&id=" +  this.vesselSetting.vesselID)
        .then(function(response){
          if(!response.data.error){
            vessrep.optVessTmp = response.data;
          }
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          vessrep.totalCapacity = '0';
        })
        .finally(function(){
          vessrep.totalCapacity =  Number(vessrep.optVessTmp[0].capacity).toLocaleString();
        });
    };
  },
  checkalldata(proc){
    if((proc == "1") || (proc == "3")){
      if(this.dataOpt.allgraphdata == "0"){
        this.reportOpt.graph1 = 0;
        this.reportOpt.graph2 = 0;
        this.reportOpt.graph3 = 0;
        this.reportOpt.graph4 = 0;
        document.getElementById("chckGraph1").disabled = true;
        document.getElementById("chckGraph2").disabled = true;
        document.getElementById("chckGraph3").disabled = true;
        document.getElementById("chckGraph4").disabled = true;
      } else {
        this.reportOpt.graph1 = 1;
        this.reportOpt.graph2 = 1;
        this.reportOpt.graph3 = 1;
        this.reportOpt.graph4 = 1;
        document.getElementById("chckGraph1").disabled = false;
        document.getElementById("chckGraph2").disabled = false;
        document.getElementById("chckGraph3").disabled = false;
        document.getElementById("chckGraph4").disabled = false;
      }
    };

    if((proc == "2") || (proc == "3")){
      if(this.dataOpt.allfieldddata == "0"){
        this.reportOpt.Voyage = 0;
        this.reportOpt.Journey = 0;
        this.reportOpt.DepDate = 0;
        this.reportOpt.ArrDate = 0;
        this.reportOpt.TimeUsage = 0;
        this.reportOpt.DataUsage = 0;
        this.reportOpt.pManifest = 0;
        this.reportOpt.vCapacity = 0;
        document.getElementById("chckDepDate").disabled = true;
        document.getElementById("chckArrDate").disabled = true;
        document.getElementById("chckTimeUsage").disabled = true;
        document.getElementById("chckDataUsage").disabled = true;
        document.getElementById("chckPassenger").disabled = true;
        document.getElementById("chckCapacity").disabled = true;

        this.reportOpt.vPaid = 0;
        this.reportOpt.vPromo = 0;
        this.reportOpt.vFree = 0;
        this.reportOpt.Basic = 0;
        document.getElementById("chckPaid").disabled = true;
        document.getElementById("chckPromo").disabled = true;
        document.getElementById("chckFree").disabled = true;
        // document.getElementById("chckBasic").disabled = true;

        this.reportOpt.vlite = 0;
        this.reportOpt.vlitefree = 0;
        this.reportOpt.vlong = 0;
        this.reportOpt.vlongfree = 0;
        this.reportOpt.Premium = 0;
        document.getElementById("chckLite").disabled = true;
        document.getElementById("chckLiteFree").disabled = true;
        document.getElementById("chckLong").disabled = true;
        document.getElementById("chckLongFree").disabled = true;
        // document.getElementById("chckPremium").disabled = true;

        this.reportOpt.vTotTakeup = 0;
        this.reportOpt.vTotFree = 0;
        this.reportOpt.vTotPaid = 0;
        document.getElementById("chckGrandTotal").disabled = true;
        document.getElementById("chckTotalFree").disabled = true;
        document.getElementById("chckTotalPaid").disabled = true;
      } else {
        if(this.reportOpt.Source == "all"){
          this.reportOpt.Voyage = 1;
          this.reportOpt.Journey = 1;
          this.reportOpt.DepDate = 1;
          this.reportOpt.ArrDate = 1;
          this.reportOpt.TimeUsage = 1;
          this.reportOpt.DataUsage = 1;
          this.reportOpt.pManifest = 1;
          this.reportOpt.vCapacity = 1;
          document.getElementById("chckDepDate").disabled = false;
          document.getElementById("chckArrDate").disabled = false;
          document.getElementById("chckTimeUsage").disabled = false;
          document.getElementById("chckDataUsage").disabled = false;
          document.getElementById("chckPassenger").disabled = false;
          document.getElementById("chckCapacity").disabled = false;

          this.reportOpt.vPaid = 1;
          this.reportOpt.vPromo = 1;
          this.reportOpt.vFree = 1;
          this.reportOpt.Basic = 1;
          document.getElementById("chckPaid").disabled = false;
          document.getElementById("chckPromo").disabled = false;
          document.getElementById("chckFree").disabled = false;
          document.getElementById("chckBasic").disabled = false;

          this.reportOpt.vlite = 1;
          this.reportOpt.vlitefree = 1;
          this.reportOpt.vlong = 1;
          this.reportOpt.vlongfree = 1;
          this.reportOpt.Premium = 1;
          document.getElementById("chckLite").disabled = false;
          document.getElementById("chckLiteFree").disabled = false;
          document.getElementById("chckLong").disabled = false;
          document.getElementById("chckLongFree").disabled = false;
          document.getElementById("chckPremium").disabled = false;

          this.reportOpt.vTotTakeup = 1;
          this.reportOpt.vTotFree = 1;
          this.reportOpt.vTotPaid = 1;
          document.getElementById("chckGrandTotal").disabled = false;
          document.getElementById("chckTotalFree").disabled = false;
          document.getElementById("chckTotalPaid").disabled = false;

        } else if (this.reportOpt.Source == "premium") {
          this.reportOpt.Voyage = 1;
          this.reportOpt.Journey = 1;
          this.reportOpt.DepDate = 1;
          this.reportOpt.ArrDate = 1;
          this.reportOpt.TimeUsage = 0;
          this.reportOpt.DataUsage = 0;
          this.reportOpt.pManifest = 1;
          this.reportOpt.vCapacity = 1;
          document.getElementById("chckDepDate").disabled = false;
          document.getElementById("chckArrDate").disabled = false;
          document.getElementById("chckTimeUsage").disabled = true;
          document.getElementById("chckDataUsage").disabled = true;
          document.getElementById("chckPassenger").disabled = false;
          document.getElementById("chckCapacity").disabled = false;

          this.reportOpt.vPaid = 0;
          this.reportOpt.vPromo = 0;
          this.reportOpt.vFree = 0;
          this.reportOpt.Basic = 0;
          document.getElementById("chckPaid").disabled = true;
          document.getElementById("chckPromo").disabled = true;
          document.getElementById("chckFree").disabled = true;
          document.getElementById("chckBasic").disabled = true;

          this.reportOpt.vlite = 1;
          this.reportOpt.vlitefree = 1;
          this.reportOpt.vlong = 1;
          this.reportOpt.vlongfree = 1;
          this.reportOpt.Premium = 1;
          document.getElementById("chckLite").disabled = false;
          document.getElementById("chckLiteFree").disabled = false;
          document.getElementById("chckLong").disabled = false;
          document.getElementById("chckLongFree").disabled = false;
          document.getElementById("chckPremium").disabled = false;

          this.reportOpt.vTotTakeup = 0;
          this.reportOpt.vTotFree = 0;
          this.reportOpt.vTotPaid = 0;
          document.getElementById("chckGrandTotal").disabled = true;
          document.getElementById("chckTotalFree").disabled = true;
          document.getElementById("chckTotalPaid").disabled = true;
        } else {
          this.reportOpt.Voyage = 1;
          this.reportOpt.Journey = 1;
          this.reportOpt.DepDate = 1;
          this.reportOpt.ArrDate = 1;
          this.reportOpt.TimeUsage = 1;
          this.reportOpt.DataUsage = 1;
          this.reportOpt.pManifest = 1;
          this.reportOpt.vCapacity = 1;
          document.getElementById("chckDepDate").disabled = false;
          document.getElementById("chckArrDate").disabled = false;
          document.getElementById("chckTimeUsage").disabled = false;
          document.getElementById("chckDataUsage").disabled = false;
          document.getElementById("chckPassenger").disabled = false;
          document.getElementById("chckCapacity").disabled = false;

          this.reportOpt.vPaid = 1;
          this.reportOpt.vPromo = 1;
          this.reportOpt.vFree = 1;
          this.reportOpt.Basic = 1;
          document.getElementById("chckPaid").disabled = false;
          document.getElementById("chckPromo").disabled = false;
          document.getElementById("chckFree").disabled = false;
          document.getElementById("chckBasic").disabled = false;

          this.reportOpt.vlite = 0;
          this.reportOpt.vlitefree = 0;
          this.reportOpt.vlong = 0;
          this.reportOpt.vlongfree = 0;
          this.reportOpt.Premium = 0;
          document.getElementById("chckLite").disabled = true;
          document.getElementById("chckLiteFree").disabled = true;
          document.getElementById("chckLong").disabled = true;
          document.getElementById("chckLongFree").disabled = true;
          document.getElementById("chckPremium").disabled = true;

          this.reportOpt.vTotTakeup = 0;
          this.reportOpt.vTotFree = 0;
          this.reportOpt.vTotPaid = 0;
          document.getElementById("chckGrandTotal").disabled = true;
          document.getElementById("chckTotalFree").disabled = true;
          document.getElementById("chckTotalPaid").disabled = true;
        }
      };
    };

    if((this.dataOpt.allgraphdata == "0") && (this.dataOpt.allfieldddata == "0")){
      document.getElementById("reportbtn").disabled = true;
    } else {
      document.getElementById("reportbtn").disabled = false;
    }

  },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  getVoyageData(finalVess){
    axios
      .get(serverurl + "voyagereport/" + finalVess + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        var voyData = response.data;
        // console.log(JSON.stringify(voyData));
        if(JSON.stringify(voyData) == "[]") {
          vessrep.getVoyageDataGrid("");
        } else {
          vessrep.getVoyageDataGrid(voyData);
        };
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        vessrep.getVoyageDataGrid("");
    }) ;
  },
  getVoyageDataGrid(vvdata){
    var oTblDataView = null;
    oTblDataView = $("#voyagedetails").DataTable ({
      "data" : vvdata,
      "scrollX": true,
      "scrollY": 450,
      "paging": true,
      "responsive": true,
      "searching": true,
      "destroy": true,
      "deferRender": true,
      "pagingType": "input",
      "pageLength": 50,
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
            { title: "Departure Date", data: "departure_at", className: "text-center",
              render : function ( data, type, row, meta ) {
                return moment(data).format('YYYY-MM-DD HHmm') +'H';
              }},
            { title: "Arrival Date", data: "arrival_at", className: "text-center",
              render : function ( data, type, row, meta ) {
                return moment(data).format('YYYY-MM-DD HHmm') +'H';
              }},
            { title: "Time Usage <br> (hhmm)", data: "TimeUsage", className: "text-center" },
            { title: "Data Usage <br> (MB)", data: "DataUsage", className: "text-center",
              render : function ( data, type, row, meta ) {
                return Number(data).toLocaleString();
              }},
            { title: "Voucher", data: "voucher_used", className: "text-center" },
            { title: "Full Name", data: "username", className: "text-center" },
            { title: "E-Mail <br> Address", data: "user_email", className: "text-left" },
            { title: "Mobile Number", data: "user_mobile", className: "text-left" },
            { title: "Device Used", data: "detected_mobile", className: "text-left" },
            { title: "OS Platform", data: "detected_platform", className: "text-left" },
            { title: "MAC Address", data: "mac_address", className: "text-left" },
        ],
      "order": [ 4, 'desc' ],
      "retrieve" : true,
    });

    this.clearVoyageGrid();
    this.RefreshVoyageData(vvdata);
  },
  RefreshVoyageData(vvvdata){
    var myTable = $('#voyagedetails').DataTable();
    myTable.clear().rows.add(vvvdata).draw();
    myTable.columns.adjust().draw();
  },
  clearVoyageGrid(){
    var myTable = $('#voyagedetails').DataTable();
    myTable.clear().draw();
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
  myGraphClasss(vGraph, vProc){
    if(vGraph === 1){
      var element1 = document.getElementById("div_services");
      if(vProc === 1){
        element1.classList.remove("hidden");
      } else if (vProc === 2) {
        element1.classList.add("hidden");
      };
    } else if (vGraph === 2) {
      var element2 = document.getElementById("div_freq");
      if(vProc === 1){
        element2.classList.remove("hidden");
      } else if (vProc === 2) {
        element2.classList.add("hidden");
      };
    } else if (vGraph === 3) {
      var element3 = document.getElementById("div_conn");
      if(vProc === 1){
        element3.classList.remove("hidden");
      } else if (vProc === 2) {
        element3.classList.add("hidden");
      };
    } else if (vGraph === 4) {
      var element4 = document.getElementById("div_usage");
      if(vProc === 1){
        element4.classList.remove("hidden");
      } else if (vProc === 2) {
        element4.classList.add("hidden");
      };
    };
  },
  myVoucherPrint(vProc){
    if(vProc === '1'){
      if (this.reportOpt.Basic == 1){
        this.reportOpt.vPaid = 1;
        this.reportOpt.vPromo = 1;
        this.reportOpt.vFree = 1;
      } else {
        this.reportOpt.vPaid = 0;
        this.reportOpt.vPromo = 0;
        this.reportOpt.vFree = 0;
      }
    };
    if(vProc === '2'){
      if (this.reportOpt.Premium == 1){
        this.reportOpt.vlite = 1;
        this.reportOpt.vlitefree = 1;
        this.reportOpt.vlong = 1;
        this.reportOpt.vlongfree = 1;
      } else {
        this.reportOpt.vlite = 0;
        this.reportOpt.vlitefree = 0;
        this.reportOpt.vlong = 0;
        this.reportOpt.vlongfree = 0;
      }
    };
  },
  checkTotalVouch(vProc){
    if(vProc === '1'){
      if( (this.reportOpt.vPaid == 1) || (this.reportOpt.vPromo == 1) || (this.reportOpt.vFree == 1) ){
        this.reportOpt.Basic = 1;
      } else {
        this.reportOpt.Basic = 0;
      }
    };
    if(vProc === '2'){
      if( (this.reportOpt.vlite == 1) || (this.reportOpt.vlitefree == 1) || (this.reportOpt.vlong == 1) || (this.reportOpt.vlongfree == 1) ){
        this.reportOpt.Premium = 1;
      } else {
        this.reportOpt.Premium = 0;
      }
    };

  },
  // PrintContent(divModal){
  //   var DocumentContainer = document.getElementById(divModal);
  //   // var WindowObject = window.open("", "PrintWindow", "width=950,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
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
