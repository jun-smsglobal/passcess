var vessrep = new Vue({
el: '#vessrep',
data: {
  vesselSetting : {vesselID: "", vesselName: "", fleetID: "", partnerID: "", dateFrom:"", dateTo:""},
  vesselsData: [],
  currVessel: {},
  pageVessels: [],
  totalName1: "Basic Vouchers Used: ",
  totalName2: "Premium Connections: ",
  totalName3: "Total Data Basic Consumption: ",
  totalName4: "Total Time Usage: ",
  vouchName: "",
  HeaderTitle: {mode1: "", mode2: "", mode3: "", mode4: "", mode5: "", mode6: ""},
  reportOpt: {Voyage:1,Journey:1,DepDate:1,ArrDate:1,TimeUsage:1,DataUsage:1,Voucher:1,Fullname:0,emailAdd:0,mobileno:0,Phone:1,Platform:1,MACAdd:1,
    Source:"all",graph1:1,graph2:1,graph3:1,graph4:1,vLayoutO:1,mlayout:'A4'},
  dataOpt: {allgraphdata:1,allfieldddata:1},
  reportSource: [{text: "ALL", value: "all"}, {text: "PREMIUM", value: "premium"}, {text: "BASIC", value: "basic"}],
  voyGraphData: {imgdata:""},
  totalBasic: 0,
  totalData: 0,
  totalTime: 0,
  totalPremium: 0,
  totalCapacity: 0,
  showGraphModal1: false,
  showGraphModal2: false,
  showGraphModal3: false,
  showGraphModal4: false,
  showModalView: false,
  showReport: false,
  searchid : "",
  voyid : "",
  legid : "",
  csvStr: "",
  appDataAllow: {},
  appDataVoyage: {},
  printLayout: {},
  appCount: 8,
  printOrient: [{ text:'Portrait',value:'1' }, { text:'Landscape',value:'2'}],
  optVess: [{ text: '', value: '' }],
  optVoyage: [],
  optLeg: [],
  privilage : {userrights : null, useraccess : null}
},
mounted: function(){
  this.getDateToday();
  this.processPrivilage();
  this.getVessel();
  setTimeout(() => { this.getVoyage(); }, 100);
  setTimeout(() => { this.getAllReports(); }, 500);
},
methods: {
  getAllReports(){
    if(this.vesselSetting.vesselID == ""){
      this.vesselSetting.vesselID = this.optVess[1].value;
    };

    vessrep.myProgress(1);

    if(this.voyid == ""){ this.voyid = "all" };
    if(this.legid == ""){ this.legid = "all" };
    // console.log(this.vesselSetting.vesselID + "_" + this.voyid + "_" + this.legid);
    var finalVess = this.vesselSetting.vesselID + "_" + this.voyid + "_" + this.legid;
    axios
      .get(serverurl + "voyagereport/" + finalVess + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        vessrep.vesselsData = response.data;
        if(JSON.stringify(vessrep.vesselsData) == "[]") {
          vessrep.getDataGrid("");
          vessrep.myProgress(2);
        } else {
          vessrep.getDataGrid(vessrep.vesselsData);
          vessrep.buttonshowhide("1");
        };
      })
      .catch(function(error){
        vessrep.myProgress(2);
        console.log(JSON.stringify(error.message));
        vessrep.getDataGrid("");
        vessrep.vesselsData = [{}];
        vessrep.buttonshowhide("2");
    }) ;
    this.getPassCapacity();
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
          vessrep.optVess = response.data.vessel;
        } else {
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
        //   };
        // }
      });
  },
  getVoyage(){
    axios
      .get(serverurl + "voyagereport/voyagelegs/" + this.vesselSetting.vesselID  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        vessrep.optVoyage = response.data;
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        vessrep.myProgress(2);
        vessrep.optVoyage = [{ voyageid: 'ALL', voyage: 'all' }];
      })
      .finally(function(){
        if(JSON.stringify(vessrep.optVoyage) !== "[]"){
          vessrep.voyid = vessrep.optVoyage[0].voyage;
          vessrep.getLeg();
        }
      });
  },
  getLeg(){
    // console.log(this.vesselSetting.vesselID + "_" + this.voyid);
    var finalVess = this.vesselSetting.vesselID + "_" + this.voyid;
    if (finalVess != "") {
      axios
        .get(serverurl + "voyagelist/" +  finalVess + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
        .then(function(response){
          vessrep.optLeg = response.data;
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          vessrep.optLeg = [{ legid: 'all', journey: 'ALL' }];
        })
        .finally(function(){
          if(JSON.stringify(vessrep.optLeg) !== "[]"){
            vessrep.legid = vessrep.optLeg[0].legid;
          }
        });
    }
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
    var finalVess = this.vesselSetting.vesselID + "_" + this.voyid + "_" + this.legid;

    var str1 = "voyagereport/" + finalVess + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo;
    var str2 = JSON.stringify(this.reportOpt);
    var str3 = window.localStorage.getItem('supportUser');
    var str4 = JSON.stringify(this.dataOpt);

    if ((this.dataOpt.allgraphdata == 0)  && (this.dataOpt.allfieldddata == 0)  ){
      console.log("No data to print");
    } else {
      setTimeout(() => { window.open(localPrint + "voyage_report.php?strFile=" + str1 + "&strOption=" + str2 + "&strUser=" + str3 + "&strData=" + str4, "_blank"); }, 500);
    };
  },
  getGraphData(){
    // get allowed domains
    if((this.vesselSetting.vesselID == '0') || (this.vesselSetting.vesselID == '')) {
      return ;
    }
    axios
      .get(serverurl + "domainapp/allowed/" + this.appCount + "/vessel/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        vessrep.appDataAllow = response.data;
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
      });

    vessrep.totalBasic = 0;
    vessrep.totalData = 0;
    vessrep.totalTime = 0;
    vessrep.totalPremium = 0;
    // get total usage
    axios
      .get(serverurl + "vesselreport/" + this.vesselSetting.vesselID  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        vessrep.appDataVoyage = response.data;

        if (vessrep.searchid != "") {
          for(var i = 0; i < response.data.length; i++) {
            var obj = response.data[i];
            if (obj.voyageids == vessrep.searchid) {
              vessrep.totalBasic = Number(vessrep.totalBasic) + Number(obj.totalVoucher);
              vessrep.totalData = Number(vessrep.totalData) + Number(obj.DataUsage);
              vessrep.totalTime = Number(vessrep.totalTime) + Number(obj.vTimeUsage);
              vessrep.totalPremium = Number(vessrep.totalPremium) + Number(obj.totalPremium);
            }
          }
        } else {
          for(var i = 0; i < response.data.length; i++) {
            var obj = response.data[i];
            vessrep.totalBasic = Number(vessrep.totalBasic) + Number(obj.totalVoucher);
            vessrep.totalData = Number(vessrep.totalData) + Number(obj.DataUsage);
            vessrep.totalTime = Number(vessrep.totalTime) + Number(obj.vTimeUsage);
            vessrep.totalPremium = Number(vessrep.totalPremium) + Number(obj.totalPremium);
          };
        }
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
        data.addRow(["Basic Vouchers Used - " + vessrep.totalBasic, Number(vessrep.totalBasic)]);
        data.addRow(["Premium Connections - " + vessrep.totalPremium, Number(vessrep.totalPremium)]);

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
  			  // console.log(div_services.innerHTML);
  			  vessrep.insertGraph('insgraphdata14', window.localStorage.getItem('supportUser'), div_services.innerHTML );
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
          // is3D: true,
          legend: { position: "right", textStyle: { fontSize: 12 }  }
        };
        var chart1 = new google.visualization.PieChart(document.getElementById("piechartmodal"));
        chart1.draw(data, options1);
      }
    };

    function drawChartLine() {
      var dataline = new google.visualization.DataTable();
        if (vessrep.searchid != "") {
          dataline.addColumn("string", "Voucher");
          dataline.addColumn("number", "Time Used");
          dataline.addColumn("number", "Data Usage");
          for(var i = 0; i < vessrep.vesselsData.length; i++) {
            var obj = vessrep.vesselsData[i];
            if (obj.voyageid == vessrep.searchid) {
              // console.log(obj.TimeUsage + " === " + obj.DataUsage);
              dataline.addRow([obj.voucher_used, Number(obj.vTimeUsage), Number(obj.DataUsage)]);
            }
          }
        } else {
          dataline.addColumn("datetime", "Date");
          dataline.addColumn("number", "Time Used");
          dataline.addColumn("number", "Data Usage");
          for(var i = 0; i < vessrep.appDataVoyage.length; i++) {
            var obj = vessrep.appDataVoyage[i];
            dataline.addRow([new Date(obj.departure_at), Number(obj.vTimeUsage), Number(obj.DataUsage)]);
          }
        }

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
        hAxis: { format: "dd" },
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
  			  // console.log(div_usage.innerHTML);
  			  vessrep.insertGraph('insgraphdata17', window.localStorage.getItem('supportUser'), div_usage.innerHTML );
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
        if (vessrep.searchid != "") {
          dataservice.addColumn("string", "Voucher");
          dataservice.addColumn("number", "Premium Connections");
          dataservice.addColumn("number", "Basic Vouchers Used");
          //dataservice.addColumn("number", "Passenger Capacity");
          //dataservice.addColumn("number", "Passenger Manifest");
          for(var i = 0; i < vessrep.vesselsData.length; i++) {
            var obj = vessrep.vesselsData[i];
            if (obj.voyageid == vessrep.searchid) {
              dataservice.addRow([obj.voucher_used, Number(obj.totalPremium), Number(obj.totalVoucher)]);
              //dataservice.addRow([obj.voucher_used, Number(obj.totalPremium), Number(obj.totalVoucher), Number(obj.totalPassenger), Number(obj.totalPassenger)]);
            }
          }
        } else {
          dataservice.addColumn("datetime", "Date");
          dataservice.addColumn("number", "Basic Vouchers Used");
          dataservice.addColumn("number", "Premium Connections");
          //dataservice.addColumn("number", "Passenger Capacity");
          //dataservice.addColumn("number", "Passenger Manifest");
          for(var i = 0; i < vessrep.appDataVoyage.length; i++) {
            var obj = vessrep.appDataVoyage[i];
            dataservice.addRow([new Date(obj.departure_at), Number(obj.totalVoucher), Number(obj.totalPremium) ]);
            //dataservice.addRow([new Date(obj.departure_at), Number(obj.totalPremium), Number(obj.totalVoucher), Number(obj.totalPassenger), Number(obj.totalPassenger)]);
          }
        }

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
          //isStacked: 'percent',
          curveType: "function",
          legend: { position: "right", textStyle: { fontSize: 10 }  },
          hAxis: { format: "dd" },
          vAxis: {minValue: 0,  title: 'QTY', textStyle: { fontSize: 12 }, titleTextStyle: { bold: true, italic: false} }
  		  };
        vessrep.myGraphClasss(3, 1);
  		  var chart_conn = new google.visualization.LineChart(document.getElementById("div_conn"));
  		  google.visualization.events.addListener(chart_conn, 'ready', function () {
          div_conn.innerHTML = '<img src="' + chart_conn.getImageURI() + '">';
  			  // console.log(div_conn.innerHTML);
  			  vessrep.insertGraph('insgraphdata16', window.localStorage.getItem('supportUser'), div_conn.innerHTML );
  		  });
  		  chart_conn.draw(dataservice, options_conn);
        vessrep.myGraphClasss(3, 2);
      };

      if (vessrep.showGraphModal3 == true) {
        vessrep.HeaderTitle.mode3 = "Basic Vouchers Used & Premium Connections \n for the period " + vessrep.vesselSetting.dateFrom + " to " + vessrep.vesselSetting.dateTo;
        var optionsservice1 = {
          title: vessrep.HeaderTitle.mode3,
          lineWidth: 3,
          width: 550,
          height: 400,
          curveType: "function",
          legend: { position: "bottom", textStyle: { fontSize: 10 }  },
          hAxis: { format: "dd-MMM", slantedText:true, slantedTextAngle: 45 },
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
        // colors: ["256AE5","5C8FEC","92B4F2","abc4ff","b6ccfe","c1d3fe","ccdbfd","d7e3fc","e2eafc","edf2fb"],
        width: 282,
        height: 200,
        chartArea : { left: 5, top: 40, width:"80%", height:"80%" },
        pieHole: 0,
        legend: { position: "right", textStyle: { fontSize: 8 }  },
      };
      var chartpie = new google.visualization.PieChart(document.getElementById("piechart_apps"));
      chartpie.draw(data1, options);

      // insert into database
      if (vessrep.showReport == true) {
        var options_freq = {
          title: "Frequently Used Apps",
  			  width: 550,
  			  height: 400,
  			  chartArea : { left: 40, top: 40, width:"80%", height:"80%" },
          pieHole: 0,
  			  legend: { position: "right", textStyle: { fontSize: 12 }  }
  		  };
        vessrep.myGraphClasss(2, 1);
  		  var chart_freq = new google.visualization.PieChart(document.getElementById("div_freq"));
  		  google.visualization.events.addListener(chart_freq, 'ready', function () {
          div_freq.innerHTML = '<img src="' + chart_freq.getImageURI() + '">';
  			  // console.log(div_freq.innerHTML);
  			  vessrep.insertGraph('insgraphdata15', window.localStorage.getItem('supportUser'), div_freq.innerHTML );
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
          pieHole: 0
        };
        var chartpie1 = new google.visualization.PieChart(document.getElementById("piechart_appsmodal"));
        chartpie1.draw(data1, options1);

        var csv = google.visualization.dataTableToCsv(data1);
        console.log(csv);
      }

    };
  },
  insertGraph(str1, str2, str3) {
    vessrep.voyGraphData.imgdata = str3
    var formData = vessrep.toFormData(vessrep.voyGraphData);
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
  // similar(a,b) {
  //     var equivalency = 0;
  //     var minLength = (a.length > b.length) ? b.length : a.length;
  //     var maxLength = (a.length < b.length) ? b.length : a.length;
  //     for(var i = 0; i < minLength; i++) {
  //         if(a[i] == b[i]) {
  //             equivalency++;
  //         }
  //     }
  //     var weight = equivalency / maxLength;
  //     return (weight * 100);
  // },
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
    this.getAllReports();
    this.getVessName();
  },
  changeVoyage(event){
    // console.log("LEG " + vessrep.legid + " == VOYAGE " + vessrep.voyid);
    if(vessrep.legid != "all"){
      vessrep.searchid = vessrep.legid;
    } else {
      vessrep.searchid = "";
    }
    this.getAllReports();
  },
  newfilter(){
    vessrep.searchid = "";
    vessrep.voyid = vessrep.optVoyage[0].voyage;
    vessrep.legid = vessrep.optLeg[0].legid;
  },
  viewGraph(proc){
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
      setTimeout(() => { this.checkalldata(); this.checkshowhide(); }, 200);
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
    JsonArray = vessrep.vesselsData;
    JsonFields = ["Voyage & Leg","Journey","Departure Date","Arrival Date","Time Usage (hhmm)","Data Usage (MB)","Voucher","Full Name","E-Mail Address","Mobile Number","Mobile Phone","OS Platform","MAC Address"];

    vessrep.csvStr = JsonFields.join(",") + "\n";
    JsonArray.forEach(element => {
      voyage = element.voyageid;
      port = element.journey;
      departure = element.departure_at;
      arrival = element.arrival_at;
      timeused = element.TimeUsage;
      dataused = element.DataUsage;
      vouch = element.voucher_used;
      username = element.username;
      user_email = element.user_email;
      user_mobile = element.user_mobile;
      detected_mobile = element.detected_mobile;
      detected_platform = element.detected_platform;
      // detected_devicename = element.detected_devicename;
      mac_address = element.mac_address;

      vessrep.csvStr += voyage + ',' + port + "," + departure + "," + arrival + "," + timeused + "," + dataused + "," + vouch + "," + username + "," + user_email + "," + user_mobile + "," + detected_mobile + "," +
        detected_platform + "," + mac_address + "\n";
    });
    // console.log(vouch.csvStr);
    return vessrep.csvStr;
  },
  downloadCSV() {
    this.getVessName();
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(vessrep.csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'voyagereport_' + this.vesselSetting.vesselName + '_' + this.vesselSetting.dateFrom + '_' + this.vesselSetting.dateTo + '.txt';
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
        console.error('Failed to copy voucher code.');
      }
  },
  getDataGrid(vdata){
    if(vessrep.privilage.userrights >= 4){
      var col = [7,8,9];
    } else {
      var col = [];
    };

    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#voyagerepdata").DataTable ({
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
      "aoColumnDefs": [{ "bVisible": false, "aTargets": col }],
      // "bLengthChange": false,
      "columns" : [
            { title: "Voyage", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                return data.voucher_used === 'PREMIUM' ? data.voyageid : data.voucher_used === 'NOVOUCHER' ? data.voyageid :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data.voyageid +'</button>';
              }},
            { title: "Journey", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                return data.voucher_used === 'PREMIUM' ? data.journey : data.voucher_used === 'NOVOUCHER' ? data.journey :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data.journey +'</button>';
              }},
            { title: "Departure Date", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                return data.voucher_used === 'PREMIUM' ? moment(data.departure_at).format('YYYY-MM-DD HHmm') + 'H' :
                  data.voucher_used === 'NOVOUCHER' ? moment(data.departure_at).format('YYYY-MM-DD HHmm') + 'H' :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+
                  moment(data.departure_at).format('YYYY-MM-DD HHmm') +'H</button>';
              }},
            { title: "Arrival Date", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                return data.voucher_used === 'PREMIUM' ? moment(data.arrival_at).format('YYYY-MM-DD HHmm') + 'H' :
                  data.voucher_used === 'NOVOUCHER' ? moment(data.arrival_at).format('YYYY-MM-DD HHmm') + 'H' :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+
                  moment(data.arrival_at).format('YYYY-MM-DD HHmm') +'H</button>';
              }},
            { title: "Time Usage <br> (hhmm)", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                return data.voucher_used === 'PREMIUM' ? data.TimeUsage : data.voucher_used === 'NOVOUCHER' ? data.TimeUsage :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data.TimeUsage +'</button>';
              }},
            { title: "Data Usage <br> (MB)", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                return data.voucher_used === 'PREMIUM' ? data.DataUsage : data.voucher_used === 'NOVOUCHER' ? data.DataUsage :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ Number(data.DataUsage).toLocaleString(); +'</button>';
              }},
            { title: "Voucher", data: "voucher_used", className: "text-center",
              render : function ( data, type, row, meta ) {
                return data === 'PREMIUM' ? data : data === 'NOVOUCHER' ? data :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
            { title: "Full Name", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                return data.voucher_used === 'PREMIUM' ? data.username : data.voucher_used === 'NOVOUCHER' ? data.username :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data.username +'</button>';
              }},
            { title: "E-Mail <br> Address", data: null, className: "text-left",
              render : function ( data, type, row, meta ) {
                return data.voucher_used === 'PREMIUM' ? data.user_email : data.voucher_used === 'NOVOUCHER' ? data.user_email :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data.user_email +'</button>';
              }},
            { title: "Mobile Number", data: null, className: "text-left",
              render : function ( data, type, row, meta ) {
                return data.voucher_used === 'PREMIUM' ? data.user_mobile : data.voucher_used === 'NOVOUCHER' ? data.user_mobile :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data.user_mobile +'</button>';
              }},
            { title: "Device Used", data: null, className: "text-left",
              render : function ( data, type, row, meta ) {
                return data.voucher_used === 'PREMIUM' ? data.detected_mobile : data.voucher_used === 'NOVOUCHER' ? data.detected_mobile :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data.detected_mobile +'</button>';
              }},
            { title: "OS Platform", data: null, className: "text-left",
              render : function ( data, type, row, meta ) {
                return data.voucher_used === 'PREMIUM' ? data.detected_platform : data.voucher_used === 'NOVOUCHER' ? data.detected_platform :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data.detected_platform +'</button>';
              }},
            { title: "MAC Address", data: null, className: "text-left",
              render : function ( data, type, row, meta ) {
                return data.voucher_used === 'PREMIUM' ? data.mac_address : data.voucher_used === 'NOVOUCHER' ? data.mac_address :
                '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data.mac_address +'</button>';
              }},
        ],
      "order": [ 2, 'desc' ],
      "retrieve" : true,
    });

    $('#voyagerepdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#voyagerepdata').DataTable().row( id ).data();

      // console.log(JSON.stringify(data));
      vessrep.vouchName = data.voucher_used;
      vessrep.getAppUsageData(data.voucher_used);
      vessrep.showModalView = true;
    });

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#voyagerepdata').DataTable();
    myTable.clear().rows.add(vdata).draw();

    vessrep.myProgress(2);
  },
  clearGrid(){
    var myTable = $('#voyagerepdata').DataTable();
    myTable.clear().draw();

    vessrep.buttonshowhide("2");
  },
  buttonshowhide(proc){
    var x = document.getElementById("myButtons");
    if (proc == 1){
      x.style.display = "block";
    } else {
      x.style.display = "none";
    };
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
          } else {
            console.log(JSON.stringify(response.data.message));
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
  checkshowhide(){
    if (this.reportOpt.Source == "premium") {
      this.reportOpt.TimeUsage = 0;
      this.reportOpt.DataUsage = 0;
      document.getElementById("chckTimeUsage").disabled = true;
      document.getElementById("chckDataUsage").disabled = true;
    } else {
      this.reportOpt.TimeUsage = 1;
      this.reportOpt.DataUsage = 1;
      document.getElementById("chckTimeUsage").disabled = false;
      document.getElementById("chckDataUsage").disabled = false;
    }
  },
  checkalldata(){
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
    };

    if(this.dataOpt.allfieldddata == "0"){
      this.reportOpt.Voyage = 0;
      this.reportOpt.Journey = 0;
      this.reportOpt.DepDate = 0;
      this.reportOpt.ArrDate = 0;
      document.getElementById("chckDepDate").disabled = true;
      document.getElementById("chckArrDate").disabled = true;

      this.reportOpt.TimeUsage = 0;
      this.reportOpt.DataUsage = 0;
      this.reportOpt.Voucher = 0;
      this.reportOpt.Fullname = 0;
      this.reportOpt.emailAdd = 0;
      this.reportOpt.mobileno = 0;
      this.reportOpt.Phone = 0;
      this.reportOpt.Platform = 0;
      this.reportOpt.MACAdd = 0;

      document.getElementById("chckTimeUsage").disabled = true;
      document.getElementById("chckDataUsage").disabled = true;
      document.getElementById("chckVoucher").disabled = true;
      document.getElementById("chckFullname").disabled = true;
      document.getElementById("chckemailAdd").disabled = true;
      document.getElementById("chckmobileno").disabled = true;
      document.getElementById("chckPhone").disabled = true;
      document.getElementById("chckPlatform").disabled = true;
      document.getElementById("chckMACAdd").disabled = true;
    } else {
      this.reportOpt.Voyage = 1;
      this.reportOpt.Journey = 1;
      this.reportOpt.DepDate = 1;
      this.reportOpt.ArrDate = 1;
      document.getElementById("chckDepDate").disabled = false;
      document.getElementById("chckArrDate").disabled = false;

      this.reportOpt.TimeUsage = 1;
      this.reportOpt.DataUsage = 1;
      this.reportOpt.Voucher = 1;

      if(this.privilage.userrights >= 4){
        this.reportOpt.Fullname = 0;
        this.reportOpt.emailAdd = 0;
        this.reportOpt.mobileno = 0;
      } else {
        this.reportOpt.Fullname = 1;
        this.reportOpt.emailAdd = 1;
        this.reportOpt.mobileno = 1;
        document.getElementById("chckFullname").disabled = false;
        document.getElementById("chckemailAdd").disabled = false;
        document.getElementById("chckmobileno").disabled = false;
      };

      this.reportOpt.Phone = 1;
      this.reportOpt.Platform = 1;
      this.reportOpt.MACAdd = 1;
      document.getElementById("chckTimeUsage").disabled = false;
      document.getElementById("chckDataUsage").disabled = false;
      document.getElementById("chckVoucher").disabled = false;
      document.getElementById("chckPhone").disabled = false;
      document.getElementById("chckPlatform").disabled = false;
      document.getElementById("chckMACAdd").disabled = false;

      this.checkshowhide();
    };
    if((this.dataOpt.allgraphdata == "0") && (this.dataOpt.allfieldddata == "0")){
      document.getElementById("reportbtn").disabled = true;
    } else {
      document.getElementById("reportbtn").disabled = false;
    }
  },
  getAppUsageData(finalVoucher){
    axios
      .get(serverurl + "domainapp/user/" + finalVoucher  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        var appUsageData = response.data;
        if(JSON.stringify(appUsageData) == "[]") {
          vessrep.getAppUsageDataGrid("");
        } else {
          vessrep.getAppUsageDataGrid(appUsageData);
        };
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        vessrep.getAppUsageDataGrid("");
      }) ;
  },
  getAppUsageDataGrid(vvdata){
    var oTblDataView = null;
    oTblDataView = $("#appusagedetails").DataTable ({
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
          { title: "Applications", data: "app", className: "text-center" },
          { title: "Total Requested", data: "count", className: "text-center" },
          { title: "Setting", data: null, className: "text-center",
          render : function ( data, type, row, meta ) {
            return data.allowed === "1" ? "ALLOWED" : "BLOCKED" ;
          }},
      ],
      "order": [[ 1, "desc" ]],
      "retrieve" : true,
    });
    this.clearAppUsageGrid();
    this.RefreshAppUsageData(vvdata);
  },
  RefreshAppUsageData(vvvdata){
    var myTable = $('#appusagedetails').DataTable();
    myTable.clear().rows.add(vvvdata).draw();
    myTable.columns.adjust().draw();
  },
  clearAppUsageGrid(){
    var myTable = $('#appusagedetails').DataTable();
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

},
});
