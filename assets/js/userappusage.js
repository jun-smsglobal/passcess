var userapp = new Vue({
el: '#userapp',
data: {
  userSett : {userCode: "", dateFrom:"", dateTo:""},
  userData: [],
  currUser: {},
  csvStr: "",
  // appCount: 20,
  privilage : {userrights : null, useraccess : null}
},
mounted: function(){
  this.processPrivilage();
  this.getDateToday();
},
methods: {
  getAllData(){
    if (this.userSett.userCode == "") {
      // swal("Warning", "No Data", "warning");
      userapp.getDataGrid("");
    } else {
      axios
        .get(serverurl + "domainapp/user/" + this.userSett.userCode  + "/" + this.userSett.dateFrom + "/" + this.userSett.dateTo)
        .then(function(response){
          userapp.userData = response.data;
          if(JSON.stringify(userapp.userData) == "[]") {
            userapp.getDataGrid("");
          } else {
            userapp.getDataGrid(response.data);
            userapp.buttonshowhide("1");
          };
        })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          userapp.getDataGrid("");
          userapp.userData = [{}];
        }) ;
    }
  },
  // printReport(){
    // setTimeout(() => { window.open(localPrint + "voyage_report.php?strFile=voyagereport/" + this.userSett.vesselID  + "/" + this.userSett.dateFrom + "/" + this.userSett.dateTo, "_blank"); }, 500);
  // },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = $("#userappData")
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
    var myTable = $('#userappData').DataTable();
    myTable.clear().rows.add(vdata).draw();
    myTable.columns.adjust().draw();
  },
  clearGrid(){
    var myTable = $('#userappData').DataTable();
    myTable.clear().draw();
    userapp.buttonshowhide("2");
  },
  processPrivilage(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
  },
  buttonshowhide(proc){
    var x = document.getElementById("myButtons");
    if (proc == 1){
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  },
  getDateToday(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd ;
    last_date = yyyy + '-' + mm + '-' + '01' ;
    // console.log(today);
    if (this.userSett.dateFrom == ""){
      this.userSett.dateFrom = last_date;
    }
    if (this.userSett.dateTo == ""){
      this.userSett.dateTo = today;
    }
  },
  JsonToCSV() {
    JsonArray = userapp.userData;
    JsonFields = ["Applications","Total Domain Visited","Setting"];

    userapp.csvStr = JsonFields.join(",") + "\n";
    JsonArray.forEach(element => {
      appnew = element.app;
      count = element.count;
      allow = element.allowed;

      if(allow == "1"){
        userapp.csvStr += appnew + ',' + count + ',ALLOWED' + "\n";
      } else {
        userapp.csvStr += appnew + ',' + count + ',BLOCKED' + "\n";
      }
    });
    // console.log(vouch.csvStr);
    return userapp.csvStr;
  },
  downloadCSV() {
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(userapp.csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download =  'AppUsageReport_' + this.userSett.userCode + '_' + this.userSett.dateFrom + '_' + this.userSett.dateTo + '.txt';
    hiddenElement.click();
  },
  copyData(){
      const input = document.createElement('textarea');
      document.body.appendChild(input);
      input.value = userapp.csvStr;
      input.focus();
      input.select();
      const isSuccessful = document.execCommand('copy');
      document.body.removeChild(input);
      if (!isSuccessful) {
        console.error('Failed to copy data.');
      }
  },

},
});
