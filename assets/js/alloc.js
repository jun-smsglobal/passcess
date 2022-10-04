var vouch = new Vue({
el: '#vouch',
data: {
  voucherList: [],
  vouchData: {tag:"paid", count:"500", partner:"1", fleet:"0", username:"", vouchervalue:"0", vouchertime:"0",
    promovalue:"0", effectivity_from:"", effectivity_to:"", issued_to:"0", promo_title:"", remarks:""},
  custData:{vtime: "0", vdata: "0", vCount: "500", vdataTemp:"0", vCountTmp: "500", vPromo: "10", vDateFrom:"", vDateTo:"" },
  currData: {},
  vouchAvailAlloc: "0",
  csvStr: "",
  // btnValue: true,
  fileformat: {filePartner: "", fileFleet: "", fileVessel: ""},
  optpartner: [{ text: '', value: '' }],
  optFleet: [{ text: '', value: '' }],
  optVess: [{ text: '', value: '' }],
  optTag: [
    { text: 'PAID', value: 'paid' },
    { text: 'FREE', value: 'free' },
    { text: 'PROMO', value: 'promo' }
  ],
  optRem: [
    { text: 'REBATE', value: 'rebate' },
    { text: 'REFUND', value: 'refund' },
    { text: 'OTHERS', value: 'others' }
  ],
  optvouch: [
    { text: '500', value: '500' },
    { text: '1000', value: '1000' },
    { text: '1500', value: '1500' },
    { text: '2000', value: '2000' },
    { text: 'Other', value: '' }
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
  ]
},
mounted: function(){
  this.getPartner();
  this.getDateToday();
},
methods: {
  getVoucher(){
    if ((this.currData.count == 0) && (this.custData.vCount == 0)) {
      vouch.buttonshowhide("2");
      swal("", "Invalid number of voucher", "warning");
    } else if ((this.currData.vouchertime == "") && (this.custData.vtime == "")) {
      vouch.buttonshowhide("2");
      swal("", "Invalid field time", "warning");
    } else if ((this.currData.vouchervalue == "") && (this.custData.vdata == "")) {
      vouch.buttonshowhide("2");
      swal("", "Invalid field data", "warning");
    } else {
      var totalTime, hrtosec, mintosec;

      if (vouch.custData.vtime != ""){
        // hrtosec = vouch.custData.vtime.substring(2, 0) * 3600;
        // mintosec = vouch.custData.vtime.substring(vouch.custData.vtime.length - 2, vouch.custData.vtime.length) * 60;
        // totalTime = hrtosec + mintosec;

        hrtosec = vouch.custData.vtime * 3600;
        mintosec = 0;
        totalTime = hrtosec + mintosec;
      }

      var supportuser =  window.localStorage.getItem('supportUser');
      if (vouch.currData.username == ""){
        vouch.currData.username = supportuser;
      }
      if (vouch.currData.vouchertime == ""){
        vouch.currData.vouchertime = totalTime;
      }
      if (vouch.currData.vouchervalue == ""){
        vouch.currData.vouchervalue = vouch.custData.vdata * 1048576;
      }
      if (vouch.currData.count == ""){
        vouch.currData.count = vouch.custData.vCount;
      }
      if (vouch.vouchData.tag == "promo"){
        vouch.currData.promovalue = vouch.custData.vPromo;
        vouch.currData.effectivity_from = vouch.custData.vDateFrom;
        vouch.currData.effectivity_to = vouch.custData.vDateTo;
      } else if (vouch.vouchData.tag == "free"){
        vouch.currData.promovalue = "0";
        vouch.currData.effectivity_from = "";
        vouch.currData.effectivity_to = "";
      } else {
        vouch.currData.promovalue = "0";
        vouch.currData.effectivity_from = "";
        vouch.currData.effectivity_to = "";
        vouch.currData.promo_title = "";
        vouch.currData.remarks = "";
      }

      // console.log(JSON.stringify(vouch.currData));
      // delete fleet temporary
      delete vouch.currData['fleet'];

      $('#myModalProcess').modal('show').off('click');
      var formData = vouch.toFormData(vouch.currData);
      axios
        .post(serverurl + "allocatevoucher", formData)
        .then(function(response){
          if (JSON.stringify(response.data) != "[]"){
            // vouch.btnValue = false;
            vouch.buttonshowhide("1");
            vouch.voucherList = response.data;
            addLogUpdate(supportuser, '{"status": "ALLOCATE VOUCHER"}', vouch.voucherList);

            vouch.getDataGrid(response.data);
          } else {
            swal("", "Please generate a voucher", "info");
          }
        })
        .catch(function(error){
          if(error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log(error);
          }
          $('#myModalProcess').modal('hide');
          vouch.getDataGrid("");
          swal("", JSON.stringify(error.message), "warning");
        }) ;

      document.getElementById("myPromoTitle").style.display = "none";
      document.getElementById("myRems").style.display = "none";

      document.getElementById("myDateFrom").style.display = "none";
      document.getElementById("myDateTo").style.display = "none";
      document.getElementById("myRemarks").style.display = "none";

      document.getElementById("myVouchCount").style.display = "none";
      document.getElementById("myTime").style.display = "none";
      document.getElementById("myData").style.display = "none";

      vouch.showOtherField();
      vouch.showDateField();

      vouch.vouchData.tag = "paid";
      vouch.vouchData.count = "500";
      vouch.vouchData.partner = "1",
      vouch.vouchData.fleet = "0";
      vouch.vouchData.username= "";
      vouch.vouchData.vouchervalue = "0";
      vouch.vouchData.vouchertime = "0";
      vouch.vouchData.promovalue = "0";
      vouch.vouchData.effectivity_from = "0";
      vouch.vouchData.effectivity_to = "0";
      vouch.vouchData.issued_to = "0";
      vouch.vouchData.promo_title = "";
      vouch.vouchData.remarks = "";

      vouch.custData.vtime = "0";
      vouch.custData.vdata = "0";
      vouch.custData.vCount = "500";
      vouch.custData.vdataTemp = "0";
      vouch.custData.vCountTmp = "500";
      vouch.custData.vPromo = "10";

      vouch.currData = {};

  }},
  getPartner(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=3&id=0")
      .then(function(response){
        if(!response.data.error){
          vouch.optpartner = response.data.vessel;
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        vouch.optpartner = [{ text: '', value: '' }];
      });
    this.getFleet();
  },
  getFleet(){
    if( (this.vouchData.partner != "") && (this.vouchData.partner != "0")){
      axios
        .get(localurl + "vessel.php?action=getvessel&proc=12&id="+ this.vouchData.partner)
        .then(function(response){
          if(!response.data.error){
            vouch.optFleet = response.data.vessel;
          }
      })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          vouch.optFleet = [{ text: '', value: '' }];
      });
    } else {
      axios
        .get(localurl + "vessel.php?action=getvessel&proc=2&id=0")
        .then(function(response){
          if(!response.data.error){
            vouch.optFleet = response.data.vessel;
          }
      })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          vouch.optFleet = [{ text: '', value: '' }];
      });
    }
    this.vouchData.fleet = 0;
    this.getVessel();
  },
  getVessel(){
    var finalURL = "";
    if( (this.vouchData.partner != "") && (this.vouchData.partner != "0") ) {
      finalURL = localurl + "vessel.php?action=getvessel&proc=16&id=" + this.vouchData.partner
    } else if( (this.vouchData.fleet != "") && (this.vouchData.fleet != "0") ) {
      finalURL = localurl + "vessel.php?action=getvessel&proc=15&id=" + this.vouchData.fleet
    } else {
      finalURL = localurl + "vessel.php?action=getvessel&proc=6&id=0"
    }

    axios
      .get(finalURL)
      .then(function(response){
        if(!response.data.error){
          vouch.optVess = response.data.vessel;
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        vouch.optVess = [{ text: '', value: '' }];
      });
  },
  getSelectedPartner(){
    if (this.vouchData.fleet != ""){
      axios
        .get(localurl + "vessel.php?action=getvessel&proc=14&id="+ this.vouchData.fleet)
        .then(function(response){
          if(!response.data.error){
            // console.log(response.data.vessel[0].value);
            if (vouch.vouchSett.fleet != 0) {
              document.getElementById('modepartner').value = response.data.vessel[0].value;
            }
          }
      })
        .catch(function(error){
          console.log(JSON.stringify(error.message));
          vouch.partner = "";
      });
    }
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#allocdata").DataTable ({
        "data" : vdata,
        "scrollY": 450,
        "paging": true,
        "responsive": true,
        "searching": false,
        "destroy": true,
        "deferRender": true,
        "pagingType": "input",
        "pageLength": 50,
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "processing": true,
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
            { title: "Serial Number", data: "voucherserial", className: "text-center" },
            { title: "Voucher Code", data: "vouchercode", className: "text-center" },
        ],
        // "order": [ 0, "asc" ],
        "retrieve" : true,
    });

    // tool tip for page button nav
    $('#allocdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#allocdata_next.next.paginate_button').attr('title', 'Next');
    $('#allocdata_first.first.paginate_button').attr('title', 'First');
    $('#allocdata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#allocdata').DataTable();
    myTable.clear().rows.add(vdata).draw();

    $('#myModalProcess').modal('hide');
  },
  clearGrid(){
    var myTable = $('#allocdata').DataTable();
    myTable.clear().draw();

    // vouch.buttonshowhide("2");
  },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  selectData(frmData){
    vouch.currData = frmData;

    var selpartner = document.getElementById("modepartner");
    vouch.fileformat.filePartner = selpartner.options[selpartner.selectedIndex].text;
    var selfleet = document.getElementById("modefleet");
    vouch.fileformat.fileFleet = selfleet.options[selfleet.selectedIndex].text;
  },
  selectVouchCount(){
    // console.log(vouch.vouchData.count);
    var x = document.getElementById("myVouchCount");
    if(vouch.vouchData.count == ""){
      if (x.style.display === "none") {
        x.style.display = "block";
      }
    } else {
      x.style.display = "none";
    }
    vouch.showOtherField();
    document.getElementById('setVCount').select();
  },
  selectTime(){
    // console.log(vouch.vouchData.vouchertime);
    var x = document.getElementById("myTime");
    if(vouch.vouchData.vouchertime == ""){
      if (x.style.display === "none") {
        x.style.display = "block";
      }
    } else {
      x.style.display = "none";
    }
    vouch.showOtherField();
    document.getElementById('setTime').select();
  },
  selectMBData(){
    // console.log(vouch.vouchData.vouchervalue);
    var x = document.getElementById("myData");
    if(vouch.vouchData.vouchervalue == ""){
      if (x.style.display === "none") {
        x.style.display = "block";
      }
    } else {
      x.style.display = "none";
    }
    vouch.showOtherField();
    document.getElementById('setData').select();
  },
  selectTag(){
    var x1 = document.getElementById("myPromoTitle");
    var x2 = document.getElementById("myRems");

    var x3 = document.getElementById("myDateFrom");
    var x4 = document.getElementById("myDateTo");
    var x5 = document.getElementById("myRemarks");

    if(vouch.vouchData.tag == "promo"){
      x1.style.display = "block";
      x2.style.display = "block";
      x3.style.display = "block";
      x4.style.display = "block";
      x5.style.display = "block";

      vouch.vouchData.promo_title = "";
      vouch.vouchData.remarks = "";
    }else if(vouch.vouchData.tag == "free"){
      x1.style.display = "block";
      x2.style.display = "block";
      x3.style.display = "none";
      x4.style.display = "none";
      x5.style.display = "none";

      vouch.vouchData.promo_title = "rebate";
      vouch.vouchData.remarks = "";
      // document.getElementById('moderem').select();
    } else {
      x1.style.display = "none";
      x2.style.display = "none";
      x3.style.display = "none";
      x4.style.display = "none";
      x5.style.display = "none";
    }
    vouch.showDateField();
  },
  showOtherField(){
    var x = document.getElementById("myField");
    var x1 = document.getElementById("myVouchCount");
    var x2 = document.getElementById("myTime");
    var x3 = document.getElementById("myData");
    if ((x1.style.display === "none") && (x2.style.display === "none") &&
      (x3.style.display === "none") ) {
        x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  },
  showDateField(){
    // console.log("dumaan");
    var x = document.getElementById("myFieldDate");
    var x1 = document.getElementById("myDateFrom");
    var x2 = document.getElementById("myDateTo");
    var x3 = document.getElementById("myRemarks");
    if ((x1.style.display === "none") && (x2.style.display === "none") &&
      (x3.style.display === "none") ) {
        x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  },
  getDateToday(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd ;

    if (this.custData.vDateFrom == ""){
      this.custData.vDateFrom = today;
    }
    if (this.custData.vDateTo == ""){
      this.custData.vDateTo = today;
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
  formatData(){
    var str = numeral(vouch.custData.vdataTemp);
    vouch.custData.vdataTemp = str.format('0,0');
    vouch.custData.vdata = str.value();
  },
  formatCntData(){
    var str = numeral(vouch.custData.vCountTmp);
    vouch.custData.vCountTmp = str.format('0,0');
    vouch.custData.vCount = str.value();
  },
  JsonToCSV() {
    JsonArray = vouch.voucherList;
    JsonFields = ["serial no","voucher code"];

    vouch.csvStr = JsonFields.join(",") + "\n";
    JsonArray.forEach(element => {
      voucherserial = element.voucherserial;
      vouchercode   = element.vouchercode;
      vouch.csvStr += voucherserial + ',' + vouchercode + "\n";
    });
    // console.log(vouch.csvStr);
    return vouch.csvStr;
  },
  downloadCSV() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '_' + mm + '_' + dd;

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(vouch.csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download =  "voucher_" + this.fileformat.filePartner + "_" + this.fileformat.fileFleet + "_" + today + '.txt';
    hiddenElement.click();
  },
  copyData(){
      const input = document.createElement('textarea');
      document.body.appendChild(input);
      input.value = vouch.csvStr;
      input.focus();
      input.select();
      const isSuccessful = document.execCommand('copy');
      document.body.removeChild(input);

      if (!isSuccessful) {
        console.log('Failed to copy.');
        vouch.setTooltip('','Failed to copy.');
      } else {
        console.log('Copied');
        vouch.setTooltip('Copied')
      }
      vouch.hideTooltip();
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
  getAvailAlloc(){
    this.vouchAvailAlloc = "0";
    axios
      .get(serverurl + "unallocatedvoucher/count")
      .then(function(response){
        if (JSON.stringify(response.data) != "[]"){
          console.log(response.data);
          vouch.vouchAvailAlloc = response.data;
        } else {
          swal("", "Please generate a voucher", "info");
        }
      })
      .catch(function(error){
        console.log('Error', JSON.stringify(error.message));
      })
      .finally(function(){
        var tempCount = 0;
        if (vouch.currData.count == ""){
          tempCount = vouch.custData.vCount;
        } else {
          tempCount = vouch.currData.count;
        }

        if (vouch.vouchAvailAlloc >= tempCount) {
          vouch.getVoucher();
        } else {
          swal("", "Please generate a voucher", "info");
        }
      }) ;
  },

}
});
