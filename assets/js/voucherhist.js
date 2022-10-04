var vouchhist = new Vue({
el: '#vouchhist',
data: {
  searchid: "",
  vouchSett: {vouchStatus:"1", vouchid:"", dateFrom:"", dateTo:"", partner: "0", fleet:"0"},
  showModalView: false,
  showModalUsed: false,
  showEditModal: false,
  chckRule : false,
  vouchInfo: {vtitle : "History Information"},
  allVoucher: [],
  allDate: [],
  currViewVoucher: {},
  currVoucher: {from: "0", to: "0", vouchers:"", voucherdata:"0", vouchertime:"0", voucherpartner:"1"},
  optData: { dataGen : 0, dataAlloc : 0, dataUsed : 0, dataTotal : 0 },
  custData:{vtime: "0", vdata: "0", vdataTemp: "0"},
  priv : {userrights : null, useraccess : null},
  optPartnerEdit: {},
  optpartner: [{ text: '', value: '' }],
  optFleet: [{ text: '', value: '' }],
  optStatus: [
    { text: 'ALL', value: '1' },
    { text: 'ALLOCATED', value: '3' },
    { text: 'UNALLOCATED', value: '2' },
    { text: 'USED', value: '4' }
  ],
  opttime: [
    { text: 'Unlimited', value: '0' },
    { text: '10', value: '36000' },
    { text: '15', value: '54000' },
    { text: '20', value: '72000' },
    { text: 'Other', value: '' }
  ],
  optdata: [
    { text: 'Unlimited',  value: '0' },
    { text: '5', value: '5242880' },
    { text: '10', value: '10485760' },
    { text: '20', value: '20971520' },
    { text: '50', value: '52428800' },
    { text: '100', value: '104857600' },
    { text: 'Other', value: '' }
  ],

  allPremium: [],
  curPremium: {},
  vesselSetting : {vesselID: "", fleetID: "", partnerID: "", dateFrom:"", dateTo:""},
  optVess: [{ text: '', value: '' }]
},
mounted: function(){
  this.getAllDate();
  this.processUser();
  this.getDateToday();
  this.getPartner();
  // setTimeout(() => { this.getAllVoucher(); }, 300);
  this.getAllPremium();

  this.getAllVoucher();
  this.getVessel();
},
methods: {
  getAllVoucher(){
    this.myProgress(1);

    axios
      .get(localurl + "voucher.php?action=getvoucher&proc="+ this.vouchSett.vouchStatus +"&id=" + this.vouchSett.partner +
        "&from=" + this.vouchSett.dateFrom + "&to=" + this.vouchSett.dateTo)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(!response.data.error){
          vouchhist.allVoucher = response.data.voucher;

          vouchhist.getDataGrid(response.data.voucher);
        } else {
          vouchhist.myProgress(2);
          console.log(JSON.stringify(response.data.message));
          vouchhist.getDataGrid("");
        }
      })
      .catch(function(error){
        vouchhist.myProgress(2);
        console.log(JSON.stringify(error.message));
        vouchhist.getDataGrid("");
      });
      // this.getDataGraph(this.vouchSett.vouchStatus, this.vouchSett.partner, this.vouchSett.dateFrom, this.vouchSett.dateTo);
  },
  getVoucherQry(dataproc, datapartner){
    vouchhist.myProgress(1);

    if(new Date(this.vouchSett.dateTo) < new Date(this.vouchSett.dateFrom)){
      swal("", "Invalid Dates.", "warning");
      vouchhist.myProgress(2);
    } else {
      if ((dataproc != "") && (datapartner != "")) {
        axios
          .get(localurl + "voucher.php?action=getvoucher&proc=" + dataproc + "&id=" + datapartner + "&from=" + this.vouchSett.dateFrom + "&to=" + this.vouchSett.dateTo)
          .then(function(response){
            if(!response.data.error){
              if (JSON.stringify(response.data.voucher) != "[]"){
                vouchhist.allVoucher = response.data.voucher;
                vouchhist.getDataGrid(response.data.voucher);
              } else {
                vouchhist.myProgress(2);
                vouchhist.getDataGrid("");
              }
            } else {
              vouchhist.myProgress(2);
              console.log(JSON.stringify(response.data.message));
              vouchhist.getDataGrid("");
            }
          })
          .catch(function(error){
            vouchhist.myProgress(2);
            console.log(JSON.stringify(error.message));
            vouchhist.allVoucher = [];
            vouchhist.getDataGrid("");
          })
          .finally(function(){
          });
      }
      // this.getDataGraph(dataproc, datapartner, this.vouchSett.dateFrom, this.vouchSett.dateTo);
    }
  },
  getPartner(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=4&id=0")
      .then(function(response){
        if(!response.data.error){
          vouchhist.optpartner = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        vouchhist.optpartner = [{ text: '', value: '' }];
      });
      this.getFleet();
  },
  getFleet(){
    var finalURL = "";
    if (this.vouchSett.partner != "0"){
      finalURL = localurl + "vessel.php?action=getvessel&proc=12&id="+ this.vouchSett.partner;
    } else {
      finalURL = localurl + "vessel.php?action=getvessel&proc=5&id=0";
    }

    axios
      .get(finalURL)
      .then(function(response){
        if(!response.data.error){
          vouchhist.optFleet = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        vouchhist.optFleet = [{ text: '', value: '' }];
      });
    this.vouchSett.fleet = 0;
  },
  getSelectedPartner(){
    if (this.vouchSett.fleet != ""){
      axios
        .get(localurl + "vessel.php?action=getvessel&proc=14&id="+ this.vouchSett.fleet)
        .then(function(response){
          if(!response.data.error){
            // console.log(response.data.vessel[0].value);
            if (vouchhist.vouchSett.fleet != 0) {
              document.getElementById('modepartner').value = response.data.vessel[0].value;
            }
          } else {
            console.log(JSON.stringify(response.data.message));
          }
      })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          vouchhist.partner = "";
      });
    }
  },
  getDataGrid(vdata){
    // Load only once for datatable
    var oTblReport = null;
    oTblReport = $("#vouchdatahist").DataTable ({
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
      "processing": true,
      "serverSide": false,
      "language": {
          "paginate": {
            first: "<<",
            last: ">>",
            next: ">",
            previous: "<"
          },
          "sEmptyTable": "No data available in table",
          "sLoadingRecords": "Please wait - loading...",
          "sProcessing": "Processing...",
          "sSearch": "Search: ",
          "sZeroRecords": "No matching records found"
        },
        "bInfo" : false,
        // "bLengthChange": false,
        "columns" : [
            { title: "Serial No.", data: "voucherserial",  className: "text-center" },
            { title: "Voucher Code", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                var prev = vouchhist.priv.userrights;
                return prev === '1' ? data.vouchercode : data.voucher_code;
              }},
            { title: "Time (hhmm)", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                // return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
                return data.useddate === "" ?
                  '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data.vouchertime +'</button>'
                  : data.vouchertime ;
              }},
            { title: "Data (MB)", data: null, className: "text-center",
              render : function ( data, type, row, meta ) {
                // return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
                return data.useddate === "" ?
                  '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ Number(data.voucherdata).toFixed(0) +'</button>'
                  : Number(data.voucherdata).toFixed(0);
              }},
            { title: "Date Generated", data: "voucherdate", className: "text-center" },
            { title: "Date Allocated", data: "allocdate", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="button-alloc" style="border:none;padding:0;background:none;" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalView">'+ data +'</button>';
              }},
            { title: "Date Used", data: "useddate", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="button-used" style="border:none;padding:0;background:none;" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalUsed">'+ data +'</button>';
                // return '<button type="button" class="button-vouchused" style="border:none;padding:0;background:none;" id=n-"' + meta.row + '">'+ data +'</button>';
              }},
            { title: "Partner", data: "partner", className: "text-center" },
            { title: "Type", data: "tag", className: "text-center",
              render : function ( data, type, row, meta ) {
                return data != null ? data.toUpperCase() : data ;
            }},
        ],
        "order": [ 6, "desc" ],
        "retrieve" : true
    });

    $('#vouchdatahist tbody').on('click', '.button-alloc', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#vouchdatahist').DataTable().row( id ).data();

      vouchhist.currViewVoucher = data;
      vouchhist.setFocusModal();
      vouchhist.showModalView = true;
    });

    $('#vouchdatahist tbody').on('click', '.button-used', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#vouchdatahist').DataTable().row( id ).data();

      vouchhist.currViewVoucher = data;
      vouchhist.setFocusModal();
      vouchhist.showModalUsed = true;
    });

    $('#vouchdatahist tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#vouchdatahist').DataTable().row( id ).data();

      // console.log(JSON.stringify(data));
      vouchhist.getPartnerEdit();

      vouchhist.currVoucher.vouchers = data.voucherserial;
      vouchhist.currVoucher.voucherdata = data.mbdata;
      vouchhist.currVoucher.vouchertime = data.timedata;
      vouchhist.currVoucher.voucherpartner = data.partnerid;

      if ((data.allocdate != "") && (data.useddate == "")){
        vouchhist.chckRule = false;
        window.localStorage.setItem('voucherDatalog', JSON.stringify(data));
      } else {
        vouchhist.chckRule = true;
      }
      vouchhist.setFocusModal();
      vouchhist.showEditModal = true;
    });
    // tool tip for page button nav
    $('#vouchdatahist_previous.previous.paginate_button').attr('title', 'Previous');
    $('#vouchdatahist_next.next.paginate_button').attr('title', 'Next');
    $('#vouchdatahist_first.first.paginate_button').attr('title', 'First');
    $('#vouchdatahist_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  // getDataGraph(dataproc, dataid, datafrom, datato){
  //   axios
  //     .get(localurl + "voucher.php?action=vouchgraph&proc=" + dataproc + "&id=" + dataid  + "&from=" + datafrom + '&to=' + datato)
  //     .then(function(response){
  //       // vouchhist.optData.dataGen = response.data[0].Unused;
  //       vouchhist.optData.dataAlloc = response.data[0].Allocated;
  //       vouchhist.optData.dataUsed = response.data[0].Used;
  //       // vouchhist.optData.dataTotal = response.data[0].Total_Serial;
  //
  //       google.charts.load('current', {'packages':['bar']});
  //       google.charts.setOnLoadCallback(drawChartBar);
  //     })
  //     .catch(function(error){
  //       console.log(JSON.stringify(error.message));
  //     }) ;
  //
  //     function drawChartBar() {
  //       var data = new google.visualization.DataTable();
  //         data.addColumn("string", "Vouchers");
  //         data.addColumn("number", "Total Number");
  //         data.addRow(["Used - " + vouchhist.optData.dataUsed, Number(vouchhist.optData.dataUsed)]);
  //         // data.addRow(["Unused - " + vouchhist.optData.dataGen, Number(vouchhist.optData.dataGen)]);
  //         data.addRow(["Allocated - " + vouchhist.optData.dataAlloc, Number(vouchhist.optData.dataAlloc)]);
  //
  //       // var data = google.visualization.arrayToDataTable([
  //       //   ["Vouchers","Total Number"],
  //       //   ["Used - " + vouchhist.optData.dataUsed, vouchhist.optData.dataUsed],
  //       //   ["Unused - " + vouchhist.optData.dataGen, vouchhist.optData.dataGen],
  //       //   ["Allocated - " + vouchhist.optData.dataAlloc, vouchhist.optData.dataAlloc]
  //       // ]);
  //
  //       var options = {
  //         chart: {
  //           title: 'Summary of Vouchers',
  //           subtitle: 'For the period ' + vouchhist.vouchSett.dateFrom + " to " + vouchhist.vouchSett.dateTo,
  //         },
  //         legend: {position: 'none'},
  //         bars: 'horizontal' // Required for Material Bar Charts.
  //       };
  //
  //       var chart = new google.charts.Bar(document.getElementById('barchart'));
  //       chart.draw(data, google.charts.Bar.convertOptions(options));
  //     };
  // },
  RefreshData(vdata){
    var myTable = $('#vouchdatahist').DataTable();
    myTable.clear().rows.add(vdata).draw();

    vouchhist.myProgress(2);
  },
  clearGrid(){
    var myTable = $('#vouchdatahist').DataTable();
    myTable.clear().draw();
  },
  processUser(){
    this.priv.userrights = window.localStorage.getItem('userRights');
    this.priv.useraccess = window.localStorage.getItem('userAccess');

    this.vesselSetting.partnerID = window.localStorage.getItem('partner');
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
  },
  changeVesselID(event){
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    // this.getAllLogs("2");
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
    if (this.vouchSett.dateFrom == ""){
      this.vouchSett.dateFrom = last_date;
      this.vesselSetting.dateFrom = last_date;
    }
    if (this.vouchSett.dateTo == ""){
      this.vouchSett.dateTo = today;
      this.vesselSetting.dateTo = today;
    }
  },
  updateVoucher(){
    var totalTime, hrtosec, mintosec;

    this.currVoucher.from = 0;
    this.currVoucher.to = 0;
    this.currVoucher.vouchers = this.currVoucher.vouchers.replace("NSD", "");

    if (this.custData.vtime != ""){
      hrtosec = vouchhist.custData.vtime * 3600;
      mintosec = 0;
      totalTime = hrtosec + mintosec;
    }
    if (this.currVoucher.vouchertime == ""){
      this.currVoucher.vouchertime = totalTime;
    }
    if (this.currVoucher.voucherdata == ""){
      this.currVoucher.voucherdata = this.custData.vdata * 1048576;
    }

    axios
      .get(localurl + "voucherupdate.php?from="+this.currVoucher.from + "&to=" + this.currVoucher.to + "&vouchers=" + this.currVoucher.vouchers +
        "&vouchdata=" + this.currVoucher.voucherdata + "&vouchtime=" + this.currVoucher.vouchertime + "&partner=" + this.currVoucher.voucherpartner)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(response.data.totalResult != 0){
          addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('voucherDatalog'), vouchhist.currVoucher);
          removeData();
          vouchhist.currVoucher = {from: "0", to: "0", vouchers:"", voucherdata:"0", vouchertime:"0", voucherpartner:"1"};
          vouchhist.getVoucherQry(vouchhist.vouchSett.vouchStatus, vouchhist.vouchSett.partner);
          swal("", "Successfully updated", "success");
        } else {
          swal("", "Unable to update \n\n " + JSON.stringify(vouchhist.currVoucher), "warning");
        };
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
      });
  },
  selectTime(){
    var x = document.getElementById("myTime");
    if(vouchhist.currVoucher.vouchertime == ""){
      if (x.style.display === "none") {
        x.style.display = "block";
        document.getElementById('setTime').select();
      }
    } else {
      x.style.display = "none";
    }
  },
  selectMBData(){
    var x = document.getElementById("myData");
    if(vouchhist.currVoucher.voucherdata == ""){
      if (x.style.display === "none") {
        x.style.display = "block";
        document.getElementById('setData').select();
      }
    } else {
      x.style.display = "none";
    }
  },
  hideAllCust(){
    document.getElementById("myTime").style.display = "none";
    document.getElementById("myData").style.display = "none";
    vouchhist.custData.vtime = "0";
    vouchhist.custData.vdataTemp = "0";
  },
  formatData(){
    var str = numeral(vouchhist.custData.vdataTemp);
    vouchhist.custData.vdataTemp = str.format('0,0');
    vouchhist.custData.vdata = str.value();
  },
  getPartnerEdit(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=3&id=0")
      .then(function(response){
        if(!response.data.error){
          vouchhist.optPartnerEdit = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        vouchhist.optPartnerEdit = [{ text: '', value: '' }];
      });
  },
  getAllDate(){
    this.allDate = "";
    axios
    .get(localurl + "getalldate.php?action=alldate&proc=1")
      .then(function(response){
        if(!response.data.error){
          vouchhist.allDate = response.data.alldate;
          // console.log(JSON.stringify(editvouch.allDate));
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .finally(function(){
        if(vouchhist.allDate){
          vouchhist.selectAllDate("1");
        } else {
          vouchhist.selectAllDate("2");
        }
      });
  },
  selectAllDate(proc){
    // console.log(JSON.stringify(vouchhist.allDate));
    if(proc == "1"){
      $(document).ready(function() {
        $('#datetimepicker1').datepicker({
            minDate: vouchhist.allDate[0].min_voucherdate,
            maxDate: vouchhist.allDate[0].max_useddate,
            constrainInput: true,
            dateFormat: "yy-mm-dd",
          });
        $('#datetimepicker1').on('change', function(e){
          $("#datetimepicker1").val(this.value)[0].dispatchEvent(new Event('input'))
        });
      });

      $(document).ready(function() {
        $('#datetimepicker2').datepicker({
            minDate: vouchhist.allDate[0].min_voucherdate,
            maxDate: vouchhist.allDate[0].max_useddate,
            constrainInput: true,
            dateFormat: "yy-mm-dd",
          });
        $('#datetimepicker2').on('change', function(e){
          $("#datetimepicker2").val(this.value)[0].dispatchEvent(new Event('input'))
        });
      });
    } else {
      $(document).ready(function() {
        $('#datetimepicker1').datepicker({
            minDate: -30,
            maxDate: 30,
            constrainInput: true,
            dateFormat: "yy-mm-dd",
          });
        $('#datetimepicker1').on('change', function(e){
          $("#datetimepicker1").val(this.value)[0].dispatchEvent(new Event('input'))
        });
      });

      $(document).ready(function() {
        $('#datetimepicker2').datepicker({
            minDate: -30,
            maxDate: 30,
            constrainInput: true,
            dateFormat: "yy-mm-dd",
          });
        $('#datetimepicker2').on('change', function(e){
          $("#datetimepicker2").val(this.value)[0].dispatchEvent(new Event('input'))
        });
      });
    }
  },
  setFocusModal(){
    $('body').on('shown.bs.modal', '#myModalEdit', function () {
        $('input:visible:enabled:first', this).focus();
        $('input:visible:enabled:first', this).select();
        $('.modal-dialog').draggable({
          handle: ".modal-header"
        });
    })

    $('body').on('shown.bs.modal', '#myModalView', function () {
        $('input:visible:enabled:first', this).focus();
        $('input:visible:enabled:first', this).select();
        $('.modal-dialog').draggable({
          handle: ".modal-header"
        });
    })

    $('body').on('shown.bs.modal', '#myModalUsed', function () {
        $('input:visible:enabled:first', this).focus();
        $('input:visible:enabled:first', this).select();
        $('.modal-dialog').draggable({
          handle: ".modal-header"
        });
    })
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

////////////// for premium voucher //////////////
  getVessel(){
    var strURL = "";
    if(this.priv.userrights == '1'){
      strURL = localurl + "vessel.php?action=getvessel&proc=1&id=0";
    } else {
      strURL = localurl + "vessel.php?action=getvessel&proc=1&id=" + this.vesselSetting.partnerID;
    }

    axios
      .get(strURL)
      .then(function(response){
        if(!response.data.error){
          vouchhist.optVess = response.data.vessel;
          if (vouchhist.vesselSetting.vesselID == ""){
            vouchhist.vesselSetting.vesselID = vouchhist.optVess[0].value;
            window.localStorage.setItem('vesselID', vouchhist.optVess[0].value);
          };
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        vouchhist.optVess = [{ text: '', value: '' }];
      });
  },
  getAllPremium(){
    axios
      // .get(serverurl + "premiumvouchers")
      .get(serverurl + "premiumvouchers/" + this.vesselSetting.vesselID  + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo)
      .then(function(response){
        vouchhist.allPremium = response.data;
        if(JSON.stringify(vouchhist.allPremium) == "[]") {
          // swal("Warning", "No Data", "warning");
        } else {
          vouchhist.getDataGridPremium(response.data);
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        vouchhist.allPremium = [];
        vouchhist.getDataGridPremium("");
      }) ;
  },
  getDataGridPremium(vdata){
    // Load only once for datatable
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
            { title: "Voucher Code", data: "premium_vouchercode", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Voucher Value", data: "premium_vouchervalue", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Date Generated", data: "created_at", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ moment(data).format('YYYY-MM-DD HH:mm') +'</button>';
              }},
            { title: "Date Allocated", data: "created_at", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ moment(data).format('YYYY-MM-DD HH:mm') +'</button>';
              }},
            { title: "Type", data: "premium_vouchertype", className: "text-center",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data.toUpperCase() +'</button>';
              }},
        ],
        "order": [[ 3, "desc" ]],
      });

      $('#premiumdata tbody').on('click', '.borderless-button', function () {
        var id = $(this).attr("id").match(/\d+/)[0];
        var data = $('#premiumdata').DataTable().row( id ).data();

        // apppurchase.checkUser(2);
        // apppurchase.selectPremium(data);
      });

      // tool tip for page button nav
      $('#premiumdata_previous.paginate_button.previous').attr('title', 'Previous');
      $('#premiumdata_next.paginate_button').attr('title', 'Next');
      $('#premiumdata_first.paginate_button.first').attr('title', 'First');
      $('#premiumdata_last.paginate_button').attr('title', 'Last');

      this.clearGridPremium();
      this.RefreshDataPremium(vdata);
    },
  RefreshDataPremium(vdata){
    var myTable = $('#premiumdata').DataTable();
    myTable.clear().rows.add(vdata).draw();

    vouchhist.myProgress(2);
  },
  clearGridPremium(){
    var myTable = $('#premiumdata').DataTable();
    myTable.clear().draw();
  },

},
});
