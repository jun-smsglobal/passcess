var voyapprep = new Vue({
el: '#voyapprep',
data: {
  vesselSetting : {vesselID: "", vesselName: "", fleetID: "", partnerID: "", dateFrom:"", dateTo:""},
  vesselsData: [],
  currVessel: {},
  pageVessels: [],
  perPage: 20,
  searchid: "",
  voyid: "",
  legid: "",
  csvStr: "",
  btnValue: true,
  appDatalist: {},
  appDataVoyage: {},
  appCount: 200,
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
    if(this.voyid == ""){ this.voyid = "all" };
    if(this.legid == ""){ this.legid = "all" };
    if(this.searchid == ""){ this.searchid = "all" };

    if(this.searchid == "all"){
      axios
        .get(serverurl + "domainapp/top/" + this.appCount + "/vessel/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
        .then(function(response){
          voyapprep.vesselsData = response.data;
          if(JSON.stringify(voyapprep.vesselsData) == "[]") {
            voyapprep.getDataGrid("");
          } else {
            voyapprep.getDataGrid(voyapprep.vesselsData);
            voyapprep.buttonshowhide("1");
          };
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          voyapprep.getDataGrid("");
          voyapprep.vesselsData = [{}];
          voyapprep.buttonshowhide("2");
        }) ;
    } else {
      axios
        .get(serverurl + "domainapp/top/" + this.appCount  + "/voyagelegid/" + this.searchid)
        .then(function(response){
          voyapprep.vesselsData = response.data;
          if(JSON.stringify(voyapprep.vesselsData) == "[]") {
            voyapprep.getDataGrid("");
          } else {
            voyapprep.getDataGrid(voyapprep.vesselsData);
            voyapprep.buttonshowhide("1");
          };
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          voyapprep.getDataGrid("");
          voyapprep.vesselsData = [{}];
          voyapprep.buttonshowhide("2");
        }) ;
    }
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
          voyapprep.optVess = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        voyapprep.optVess = [{ text: '', value: '' }];
      })
      .finally(function(){
        // if ((voyapprep.vesselSetting.vesselID == "") || (voyapprep.vesselSetting.vesselID == "0")){
        //   window.localStorage.setItem('vesselID', voyapprep.optVess[1].value);
        //   voyapprep.vesselSetting.vesselID = voyapprep.optVess[1].value;
        // }
      });
  },
  getVoyage(){
    axios
      .get(serverurl + "voyagereport/voyagelegs/" + this.vesselSetting.vesselID  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        voyapprep.optVoyage = response.data;
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        voyapprep.optVoyage = [{ voyageid: 'ALL', vid: 'all' }];
      })
      .finally(function(){
        if(JSON.stringify(voyapprep.optVoyage) !== "[]"){
          voyapprep.voyid = voyapprep.optVoyage[0].voyage;
          voyapprep.getLeg();
        }
      });
  },
  getLeg(){
    // console.log(this.vesselSetting.vesselID + "^" + this.voyid);
    var finalVess = this.vesselSetting.vesselID + "_" + this.voyid;
    if (finalVess != "") {
      axios
        .get(serverurl + "voyagelist/" +  finalVess + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
        .then(function(response){
          voyapprep.optLeg = response.data;
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          voyapprep.optLeg = [{ legid: 'all', journey: 'ALL' }];
        })
        .finally(function(){
          if(JSON.stringify(voyapprep.optLeg) !== "[]"){
            voyapprep.legid = voyapprep.optLeg[0].legid;
          }
        });
    }
  },
  printReport(){
    // setTimeout(() => { window.open(localPrint + "voyage_report.php?strFile=voyagereport/" + this.vesselSetting.vesselID  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo, "_blank"); }, 500);
  },
  processPrivilage(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
  },
  changeVesselID(event){
    // console.log(this.vesselSetting.vesselID);
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    this.getAllReports();
    this.getVessName();
},
  changeVoyage(event){
    // console.log("LEG " + voyapprep.legid + " == VOYAGE " + voyapprep.voyid);
    if(voyapprep.legid != "all"){
      voyapprep.searchid = voyapprep.legid;
    } else {
      voyapprep.searchid = "";
    }
    this.getAllReports();
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
    JsonArray = voyapprep.vesselsData;
    JsonFields = ["Applications","Total Domain Visited","Setting"];

    voyapprep.csvStr = JsonFields.join(",") + "\n";
    JsonArray.forEach(element => {
      appnew = element.app;
      count = element.count;
      allow = element.allowed;

      if(allow == "1"){
        voyapprep.csvStr += appnew + ',' + count + ',ALLOWED' + "\n";
      } else {
        voyapprep.csvStr += appnew + ',' + count + ',BLOCKED' + "\n";
      }
    });
    // console.log(vouch.csvStr);
    return voyapprep.csvStr;
  },
  downloadCSV() {
    this.getVessName();
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(voyapprep.csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'AppUsageReport_' + this.vesselSetting.vesselName + '_' + this.vesselSetting.dateFrom + '_' + this.vesselSetting.dateTo + '.txt';
    hiddenElement.click();
  },
  copyData(){
      const input = document.createElement('textarea');
      document.body.appendChild(input);
      input.value = voyapprep.csvStr;
      input.focus();
      input.select();
      const isSuccessful = document.execCommand('copy');
      document.body.removeChild(input);
      if (!isSuccessful) {
        console.error('Failed to copy data.');
      }
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#voyageapprepdata").DataTable ({
      "data" : vdata,
      // "scrollX": true,
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
            { title: "Applications", data: "app", className: "text-center" },
            { title: "Total Requested", data: "count", className: "text-center" },
            { title: "Setting", data: null, className: "text-center",
            render : function ( data, type, row, meta ) {
              return data.allowed === "1" ? "ALLOWED" : "BLOCKED" ;
            }},
        ],
      "order": [ 1, 'desc' ],
      "retrieve" : true,
    });

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#voyageapprepdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(){
    var myTable = $('#voyageapprepdata').DataTable();
    myTable.clear().draw();

    voyapprep.buttonshowhide("2");
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

},
});
