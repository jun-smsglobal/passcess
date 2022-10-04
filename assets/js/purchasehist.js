var apppurchase = new Vue({
el: '#apppurchase',
data: {
  vesselSetting : {vesselID: "", vesselName: "", fleetID: "", partnerID: "", dateFrom:"", dateTo:""},
  vessSett : {vesselID: "", vesselName: "", fleetID: "", partnerID: "", dateFrom:"", dateTo:""},
  allpremium: [],
  allbasic: [],
  reportOpt: {vtranno:1, vvouchcode:1,vvouchtype:1,vpurchasedate:1,vcustname:1,vLayoutO:'1',mlayout:'A4'},
  printLayout: {},
  printOrient: [{ text:'Portrait',value:'1' }, { text:'Landscape',value:'2'}],
  showReport: false,
  csvStr: "",

  currpremium: [],
  currbasic: [],
  privilage : {userrights : null, useraccess : null, TokenKey : null},
  optVess: [{ text: '', value: '' }],
  showReport_basic: false,
  reportOpt_basic: {btranno:1,bvouchcode:1,bmacadd:1,bpurchasedate:1,bcustname:1,bLayoutO:'1',blayout:'A4'}
},
mounted: function(){
  this.getDateToday();
  this.processPrivilage();
  this.getVessel();
  setTimeout(() => { this.getAllPremium(); this.getAllBasic(); }, 300);
},
methods: {
  getAllPremium(){
    axios
      // .get(serverurl + "premiumvouchers")
      .get(serverurl + "premiumvouchers/purchasehistory/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo )
      .then(function(response){
        if(!response.data.error){
          apppurchase.allpremium = response.data;
          if(JSON.stringify(apppurchase.allpremium) == "[]") {
            apppurchase.getDataGrid("");
            apppurchase.buttonshowhide("2");
          } else {
            apppurchase.getDataGrid(response.data);
            apppurchase.buttonshowhide("1");
          };
        } else {
          apppurchase.buttonshowhide("2");
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        apppurchase.buttonshowhide("2");
        apppurchase.allpremium = "[]";
        apppurchase.getDataGrid("");
      })
      .finally(function(){
          // apppurchase.delBtnShow();
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
          apppurchase.optVess = response.data.vessel;
          if (apppurchase.vesselSetting.vesselID == ""){
            apppurchase.vesselSetting.vesselID = apppurchase.optVess[0].value;
            apppurchase.vessSett.vesselID = apppurchase.optVess[0].value;
            window.localStorage.setItem('vesselID', apppurchase.optVess[0].value);
          };
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        apppurchase.optVess = [{ text: '', value: '' }];
      })
      .finally(function(){
        // if ((apppurchase.vesselSetting.vesselID == "") || (apppurchase.vesselSetting.vesselID == "0")){
        //   window.localStorage.setItem('vesselID', apppurchase.optVess[1].value);
        //   apppurchase.vesselSetting.vesselID = apppurchase.optVess[1].value;
        //   apppurchase.vessSett.vesselID = apppurchase.optVess[1].value;
        // }
      });
  },
  changeVesselID(event){
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    this.getAllPremium();
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
  selectPremium(pdata){
    apppurchase.currServices = pdata;
    window.localStorage.setItem('serviceData', JSON.stringify(apppurchase.currServices));
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
      this.vessSett.dateFrom = last_date;
    }
    if (this.vesselSetting.dateTo == ""){
      this.vesselSetting.dateTo = today;
      this.vessSett.dateTo = today;
    }
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#premiumdata").DataTable ({
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
          { title: "Tran No.", data: "transaction_no", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Voucher Code", data: "premium_vouchercode", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Type", data: "premium_vouchertype", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data.toUpperCase(); +'</button>';
            }},
          { title: "Purchase Date", data: "transaction_created", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Control Panel User", data: "ob_username", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
      ],
      "order": [[ 3, "desc" ]],
    });

    $('#premiumdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#premiumdata').DataTable().row( id ).data();

      // apppurchase.checkUser(2);
      apppurchase.selectPremium(data);
    });

    // tool tip for page button nav
    $('#premiumdata_previous.paginate_button.previous').attr('title', 'Previous');
    $('#premiumdata_next.paginate_button').attr('title', 'Next');
    $('#premiumdata_first.paginate_button.first').attr('title', 'First');
    $('#premiumdata_last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#premiumdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(){
    var myTable = $('#premiumdata').DataTable();
    myTable.clear().draw();

    apppurchase.buttonshowhide("2");
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
      // console.log(JSON.stringify(this.allpremium));
      if ((JSON.stringify(this.allpremium) == "[]") && (proc != 1) ){
        // swal("Warning", "Unable to access your request.", "warning");
      } else {
        if (proc == 1) {
          apppurchase.showAddModal = true;
        } else if (proc == 2) {
          apppurchase.showEditModal = true;
        } else if (proc == 3) {
          var allSelected = $('.checkid:checked')
          if(allSelected.length == 0){
            swal("", "Please select a record.", "warning");
          } else {
            apppurchase.delName = [];
            var allSelected = $('.checkid:checked')
            $.each(allSelected, function(i, val){
              var id = $(val).attr("id").match(/\d+/)[0];
              var data = $('#premiumdata').DataTable().row( id ).data();
              apppurchase.delName.push(data.servicedesc);
            });
            apppurchase.showDeleteModal = true;
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
    JsonArray = apppurchase.allpremium;
    JsonFields = ["Tran No.","Voucher Code","Type","Purchase Date","Control Panel User"];

    apppurchase.csvStr = JsonFields.join(",") + "\n";
    JsonArray.forEach(element => {
      tranno = element.transaction_no;
      premiumcode = element.premium_vouchercode;
      vouchtype = element.premium_vouchertype;
      purchasedate = element.transaction_created;
      passname = element.ob_username;

      apppurchase.csvStr += tranno + ',' + premiumcode + "," + vouchtype + "," + purchasedate + "," + passname + "\n";
    });
    return apppurchase.csvStr;
  },
  downloadCSV() {
    this.getVessName();
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(apppurchase.csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'premiumvoucher_' + this.vesselSetting.vesselName + '_' + this.vesselSetting.dateFrom + '_' + this.vesselSetting.dateTo + '.txt';
    hiddenElement.click();
  },
  getVessName(){
    if(this.vesselSetting.vesselID != "0"){
      this.vesselSetting.vesselName = document.getElementById('modeVesselPremium').selectedOptions[0].text;
    };

    if(this.vesselSetting.vesselID != "0"){
      this.vessSett.vesselName = document.getElementById('modeVesselBasic').selectedOptions[0].text;
    };
  },
  getPageLayout(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=20&id=0")
      .then(function(response){
        if(!response.data.error){
          apppurchase.printLayout = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        apppurchase.printLayout = [{ text: 'A4' }] ;
      });
  },
  printReport(){

    var str1 = "premiumvouchers/purchasehistory/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo;
    var str2 = JSON.stringify(this.reportOpt);
    var str3 = window.localStorage.getItem('supportUser');

    setTimeout(() => { window.open(localPrint + "purchase_report.php?strFile=" + str1 + "&strOption=" + str2 + "&strUser=" + str3, "_blank"); }, 300);
  },

///////////////////     BASIC              ///////////////////////
  getAllBasic(){
    if(this.vessSett.vesselID == ""){
      this.vessSett.vesselID = this.vesselSetting.vesselID;
    }
    axios
      .get(serverurl + "voucherbasicstore/purchasehistory/" + this.vessSett.vesselID + "/" + this.vessSett.dateFrom + "/" + this.vessSett.dateTo )
      .then(function(response){
        if(!response.data.error){
          apppurchase.allbasic = response.data;
          if(JSON.stringify(apppurchase.allbasic) == "[]") {
            apppurchase.getDataGridBasic("");
            apppurchase.buttonshowhide_basic("2");
          } else {
            apppurchase.getDataGridBasic(response.data);
            apppurchase.buttonshowhide_basic("1");
          };
        } else {
          swal("Warning", response.data.message, "warning");
          apppurchase.getDataGridBasic("");
          apppurchase.buttonshowhide_basic("2");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        apppurchase.allbasic = "[]";
        apppurchase.getDataGridBasic("");
        apppurchase.buttonshowhide_basic("2");
      })
      .finally(function(){
          // apppurchase.delBtnShow();
      });
  },
  selectBasic(pdata){
    apppurchase.currServices = pdata;
    window.localStorage.setItem('serviceData', JSON.stringify(apppurchase.currServices));
  },
  changeBasic(event){
    // window.localStorage.setItem('vesselID', this.vessSett.vesselID);
    this.getAllBasic();
    this.getVessName();
  },
  getDataGridBasic(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#basicdata").DataTable ({
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
          { title: "Tran No.", data: "transaction_no", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Voucher Code", data: "vouchercode", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Purchase Date", data: "created_at", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ moment(data).format('YYYY-MM-DD HH:mm') +'</button>';
            }},
          { title: "Control Panel User", data: "ob_username", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
      ],
      "order": [[ 2, "desc" ]],
    });

    $('#basicdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#basicdata').DataTable().row( id ).data();

      // apppurchase.checkUser(2);
      apppurchase.selectBasic(data);
    });

    // tool tip for page button nav
    $('#basicdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#basicdata_next.next.paginate_button').attr('title', 'Next');
    $('#basicdata_first.first.paginate_button').attr('title', 'First');
    $('#basicdata_last.last.paginate_button').attr('title', 'Last');

    this.clearGridBasic();
    this.RefreshDataBasic(vdata);
  },
  RefreshDataBasic(vdata){
    var myTable = $('#basicdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGridBasic(){
    var myTable = $('#basicdata').DataTable();
    myTable.clear().draw();

    apppurchase.buttonshowhide_basic("2");
  },
  JsonToCSV_basic() {
    JsonArray = apppurchase.allbasic;
    JsonFields = ["Tran No.","Voucher Code","Purchase Date","Control Panel User"];

    apppurchase.csvStr = JsonFields.join(",") + "\n";
    JsonArray.forEach(element => {
      tranno = element.transaction_no;
      vouchcode = element.vouchercode;
      purchasedate = element.created_at;
      passname = element.ob_username;

      apppurchase.csvStr += tranno + ',' + vouchcode + ',' + purchasedate + "," + passname + "\n";
    });
    return apppurchase.csvStr;
  },
  downloadCSV_basic() {
    this.getVessName();
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(apppurchase.csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'basicvoucher_' + this.vessSett.vesselName + '_' + this.vessSett.dateFrom + '_' + this.vessSett.dateTo + '.txt';
    hiddenElement.click();
  },
  printReport_basic(){
    var str1 = "voucherbasicstore/purchasehistory/" + this.vessSett.vesselID + "/" + this.vessSett.dateFrom + "/" + this.vessSett.dateTo;
    var str2 = JSON.stringify(this.reportOpt_basic);
    var str3 = window.localStorage.getItem('supportUser');

    setTimeout(() => { window.open(localPrint + "basic_report.php?strFile=" + str1 + "&strOption=" + str2 + "&strUser=" + str3, "_blank"); }, 300);
  },
  buttonshowhide_basic(proc){
    var x = document.getElementById("myButtonsBasic");
    if (proc == 1){
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  },

}
});
