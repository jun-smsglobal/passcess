var editvouch = new Vue({
el: '#editvouch',
data: {
  searchid: "",
  vouchSett:{vouchStatus:"3", vouchid:"",  dateFrom: "", dateTo: ""},
  showEditModal: false,
  showBatchModal: false,
  allVoucher: [],
  allDate: [],
  currVoucherBatch: {from: "", to: "", vouchers:"", voucherdata:"0", vouchertime:"0", voucherpartner:"1"},
  checkSerial: [],
  currVoucher: {},
  optPartner: {},
  priv : {userrights : null, useraccess : null},
  custData:{vtime: "0", vdata: "0", vdataTemp: "0"},
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
  this.processUser();
  this.getDateToday();
  this.getPartner();
  setTimeout(() => { this.getAllVoucher(); }, 300);
  // this.getAllVoucher();
  this.getAllDate();
},
methods: {
  getAllVoucher(){
    $('#myModalProcess').modal('show').off('click');

    if( new Date(this.vouchSett.dateTo) < new Date(this.vouchSett.dateFrom) ){
      swal("", "Invalid Dates.", "warning");
      $('#myModalProcess').modal('hide');
    } else {

    axios
    // .get(localurl + "voucher.php?action=getvoucher&proc="+ this.vouchSett.vouchStatus +"&id=0")
    .get(localurl + "voucher.php?action=getvoucher&proc="+ this.vouchSett.vouchStatus +"&id=0&from=" + this.vouchSett.dateFrom + "&to=" + this.vouchSett.dateTo)
      .then(function(response){
        if(!response.data.error){
          editvouch.allVoucher = response.data.voucher;
          editvouch.getDataGrid(response.data.voucher);
        } else {
          console.log(JSON.stringify(response.data.message));
          editvouch.getDataGrid("");
          editvouch.allVoucher = "";
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        editvouch.getDataGrid("");
        editvouch.allVoucher = "";
      });
    }
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#voucheditdata").DataTable ({
      "data" : vdata,
      "scrollX": true,
      "scrollY": 450,
      "paging": true,
      "responsive": true,
      "searching": true,
      "destroy": true,
      "deferRender": true,
      "pagingType": "input",
      "pageLength": 50,
      "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      "serverSide": false,
      "processing": true,
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
          // "sProcessing": "<span class='fa-stack fa-lg'>\n\ <i class='fa fa-spinner fa-spin fa-stack-2x fa-fw'></i>\n\ </span>&emsp;Processing ...",
          // "Processing": '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>',
          "Search": "Search: ",
          "sZeroRecords": "No matching records found"
        },
      "bInfo" : false,
      // "bLengthChange": false,
      "columns" : [
          { title: '<input type="checkbox" id="checkall" title="Select all" class="checkall"/>', data: null, className: "text-center", orderable: false,
            render: function (data, type, row, meta) {
              return '<input type="checkbox" value="'+ data.voucherserial.replace("NSD", "") + '" class="checkid" id=c-"' + meta.row + '">';
            }},
          { title: "Serial No.", data: "voucherserial", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Voucher Code", data: "vouchercode", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Time (hhmm)", data: "vouchertime", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Data (MB)", data: "voucherdata", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Date Allocated", data: "allocdate", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
            }},
          { title: "Type", data: "tag", className: "text-center",
            render : function ( data, type, row, meta ) {
              return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data.toUpperCase() +'</button>';
            }},
        ],
      "order": [ 5, 'desc' ],
      "retrieve" : true
    });

    $('#voucheditdata tbody').on('click', '.checkid', function () {
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
    });
    $('#voucheditdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#voucheditdata').DataTable().row( id ).data();

      if(data.tag.toLowerCase() === "paid"){
        editvouch.checkUser(2);
        editvouch.selectVoucher(data);
        editvouch.setFocusModal('1');
      }
    });

    $("#checkall").on('click', function () {
        $('#voucheditdata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
    });

    $(".dataTables_filter input").on('keyup change', function() {
      $('#voucheditdata').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });

    // tool tip for page button nav
    $('#voucheditdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#voucheditdata_next.next.paginate_button').attr('title', 'Next');
    $('#voucheditdata_first.first.paginate_button').attr('title', 'First');
    $('#voucheditdata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#voucheditdata').DataTable();
    myTable.clear().rows.add(vdata).draw();

    $('#myModalProcess').modal('hide');
  },
  clearGrid(){
    var myTable = $('#voucheditdata').DataTable();
    myTable.clear().draw();
  },
  processUser(){
    this.priv.userrights = window.localStorage.getItem('userRights');
    this.priv.useraccess = window.localStorage.getItem('userAccess');
  },
  checkUser(proc){
    if (this.priv.userrights === '1') {
      if ( (JSON.stringify(this.allVoucher) == "[]") || (JSON.stringify(this.allVoucher) == "") ){
        // swal("Warning", "Unable to access your request.", "warning");
      } else {
        if (proc == 2) {
          editvouch.showEditModal = true;
        }else if (proc == 3) {
          editvouch.showBatchModal = true;
        } else {
          // swal("", "Unable to access your request.", "warning");
        }
      }
    } else {
      swal("", "Please contact your system administrator.", "warning");
    }
  },
  updateVoucher(){
    var totalTime, hrtosec, mintosec;

    this.currVoucherBatch.from = "";
    this.currVoucherBatch.to = "";
    this.currVoucherBatch.vouchers = this.currVoucherBatch.vouchers.replace("NSD", "");

    if (this.custData.vtime != ""){
      hrtosec = editvouch.custData.vtime * 3600;
      mintosec = 0;
      totalTime = hrtosec + mintosec;
    }
    if (this.currVoucherBatch.vouchertime == ""){
      this.currVoucherBatch.vouchertime = totalTime;
    }
    if (this.currVoucherBatch.voucherdata == ""){
      this.currVoucherBatch.voucherdata = this.custData.vdata * 1048576;
    }
    // console.log(JSON.stringify(this.currVoucherBatch));

    axios
      // .put(serverurl + "vouchers/batchupdate", editvouch.currVoucherBatch)
      .get(localurl + "voucherupdate.php?from="+this.currVoucherBatch.from + "&to=" + this.currVoucherBatch.to + "&vouchers=" + this.currVoucherBatch.vouchers +
        "&vouchdata=" + this.currVoucherBatch.voucherdata + "&vouchtime=" + this.currVoucherBatch.vouchertime + "&partner=" + this.currVoucherBatch.voucherpartner)
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        if(response.data.totalResult != 0){
          addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('voucherDatalog'), editvouch.currVoucherBatch);
          swal("", "Successfully updated", "success");
          editvouch.currVoucherBatch = {from: "", to: "", vouchers:"", voucherdata:"0", vouchertime:"0", voucherpartner:"1"},
          editvouch.getAllVoucher();
          removeData();
        } else {
          swal("", "Unable to update  " + JSON.stringify(editvouch.currVoucherBatch), "warning");
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
  updateVoucherBatch(){
    var totalTime, hrtosec, mintosec;

    if (this.currVoucherBatch.from != "") {
      this.currVoucherBatch.from = Number(this.currVoucherBatch.from.replace("NSD", ""));
    }
    if (this.currVoucherBatch.to != "") {
      this.currVoucherBatch.to = Number(this.currVoucherBatch.to.replace("NSD", ""));
    }

    if((this.currVoucherBatch.from == "") && (this.currVoucherBatch.to == "")){
      if ((JSON.stringify(this.checkSerial) == "") || (JSON.stringify(this.checkSerial) == "[]"))
      {
        swal("", "Invalid voucher serial.", "warning");
      } else {
        this.currVoucherBatch.vouchers = "";
        for(var i = 0; i < this.checkSerial.length; i++) {
          var obj = this.checkSerial[i];
          this.currVoucherBatch.vouchers += obj.replace("NSD", "") + ",";
        };

        if (this.custData.vtime != ""){
          hrtosec = editvouch.custData.vtime * 3600;
          mintosec = 0;
          totalTime = hrtosec + mintosec;
        }
        if (this.currVoucherBatch.vouchertime == ""){
          this.currVoucherBatch.vouchertime = totalTime;
        }
        if (this.currVoucherBatch.voucherdata == ""){
          this.currVoucherBatch.voucherdata = this.custData.vdata * 1048576;
        }

        updateFinalBatch(editvouch.currVoucherBatch);
      }
    } else {
      updateFinalBatch(editvouch.currVoucherBatch);
    }
    // console.log(JSON.stringify(editvouch.currVoucherBatch));

    function updateFinalBatch(finalData){
      console.log(JSON.stringify(finalData));
      axios
        // .put(serverurl + "vouchers/batchupdate", finalData)
        .get(localurl + "voucherupdate.php?from="+ finalData.from + "&to=" + finalData.to + "&vouchers=" + finalData.vouchers +
          "&vouchdata=" + finalData.voucherdata + "&vouchtime=" + finalData.vouchertime + "&partner=" + finalData.voucherpartner)
        .then(function(response){
          // console.log(JSON.stringify(response.data));
          if(response.data.totalResult != 0){
            addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('voucherDatalog'), finalData);

            swal("", "Successfully updated", "success");
            editvouch.checkSerial = [];
            editvouch.currVoucherBatch = {from: "", to: "", vouchers:"", voucherdata:"0", vouchertime:"0", voucherpartner:"1"};

            editvouch.getAllVoucher();
            removeData();
          } else {
            swal("", "Unable to update  " + JSON.stringify(finalData), "warning");
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
            console.log('Error', error.config);
          }
          console.log(JSON.stringify(error.message));
          // swal("", JSON.stringify(error.message), "warning");
        });
    } // end function

  },
  getPartner(){
    axios
      .get(localurl + "vessel.php?action=getvessel&proc=3&id=0")
      .then(function(response){
        if(!response.data.error){
          editvouch.optPartner = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        editvouch.optPartner = [{ text: '', value: '' }];
      });
  },
  getAllDate(){
    this.allDate = "";
    axios
    .get(localurl + "getalldate.php?action=alldate&proc=1")
      .then(function(response){
        if(!response.data.error){
          editvouch.allDate = response.data.alldate;
          // console.log(JSON.stringify(editvouch.allDate));
        }
      })
      .finally(function(){
        if(editvouch.allDate){
          editvouch.selectAllDate("1");
        } else {
          editvouch.selectAllDate("2");
        }
      });
  },
  selectAllDate(proc){
    // console.log(JSON.stringify(this.allDate));
    if(proc == "1"){
      $(document).ready(function() {
        $('#datetimepicker1').datepicker({
            minDate: editvouch.allDate[0].min_allocdate,
            maxDate: editvouch.allDate[0].max_allocdate,
            constrainInput: true,
            dateFormat: "yy-mm-dd",
          });
        $('#datetimepicker1').on('change', function(e){
          $("#datetimepicker1").val(this.value)[0].dispatchEvent(new Event('input'))
        });
      });

      $(document).ready(function() {
        $('#datetimepicker2').datepicker({
            minDate: editvouch.allDate[0].min_allocdate,
            maxDate: 30,
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
  selectVoucher(userdata){
    editvouch.currVoucherBatch.from = "";
    editvouch.currVoucherBatch.to = "";
    editvouch.currVoucherBatch.vouchers = userdata.voucherserial;
    editvouch.currVoucherBatch.voucherdata = userdata.mbdata;
    editvouch.currVoucherBatch.vouchertime = userdata.timedata;
    editvouch.currVoucherBatch.voucherpartner = userdata.partnerid;

    editvouch.currVoucher = userdata;
    window.localStorage.setItem('voucherDatalog', JSON.stringify(editvouch.currVoucher));
  },
  selectMultiVoucher(){
    editvouch.checkSerial = [];
    var allSelected = $('.checkid:checked')
    $.each(allSelected, function(i, val){
      // console.log(val.value);
      editvouch.checkSerial.push(val.value);

      var id = $(val).attr("id").match(/\d+/)[0];
      var data = $('#voucheditdata').DataTable().row( id ).data();
      editvouch.currVoucherBatch.vouchertime = data.timedata;
      editvouch.currVoucherBatch.voucherdata = data.mbdata;
      editvouch.currVoucherBatch.voucherpartner = data.partnerid;
      editvouch.custData.vtime = "0";
      editvouch.custData.vdataTemp = "0";
    });
    editvouch.setFocusModal('2');
  },
  selectTime(){
    var x = document.getElementById("myTime");
    if(editvouch.currVoucherBatch.vouchertime == ""){
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
    if(editvouch.currVoucherBatch.voucherdata == ""){
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
    editvouch.custData.vtime = "0";
    editvouch.custData.vdataTemp = "0";
  },
  formatData(){
    var str = numeral(editvouch.custData.vdataTemp);
    editvouch.custData.vdataTemp = str.format('0,0');
    editvouch.custData.vdata = str.value();
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
    if (this.vouchSett.dateFrom == ""){
      this.vouchSett.dateFrom = last_date;
    }
    if (this.vouchSett.dateTo == ""){
      this.vouchSett.dateTo = today;
    }
  },
  setFocusModal(proc){
    if(proc == "1"){
      $('body').on('shown.bs.modal', '#myModalEdit', function () {
          $('select:visible:enabled:first', this).focus();
          $('input:visible:enabled:first', this).select();
          $('.modal-dialog').draggable({
            handle: ".modal-header"
          });
      })
    } else if (proc == "2") {
      $('body').on('shown.bs.modal', '#myModalBatch', function () {
          $('input:visible:enabled:first', this).focus();
          $('input:visible:enabled:first', this).select();
          $('.modal-dialog').draggable({
            handle: ".modal-header"
          });
      })
    };
  },

},
});
