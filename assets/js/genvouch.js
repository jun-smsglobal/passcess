var vouch = new Vue({
el: '#vouch',
data: {
  voucherList: [],
  vouchData: {count: null},
  vouchSett: {minValue: "29999", defaultValue: "300000", minValuetmp: "29999", defaultValuetmp: "300000"},
  vouchGenSett: [],
  currGenSett: {"fieldname":"","settings":{"genvoucher_minimum":"","genvoucher_trigger":""}},
  priv : {userrights : null, useraccess : null}
},
mounted: function(){
  this.processUser();
  this.getVoucher();
  this.getVoucherSett();
},
methods: {
  getVoucher(){
    if (this.vouchData.count === null){
      this.vouchData.count = 0;
    }
    else if (this.vouchData.count <= 0){
      swal("", "Invalid data entry.", "warning");
    } else {

    $('#myModalProcess').modal('show').off('click');
    var formData = vouch.toFormData(vouch.vouchData);
    axios
      .post(serverurl + "generateVoucher", formData)
      .then(function(response){
        vouch.voucherList = response.data;
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "GENERATE VOUCHER"}', JSON.stringify(vouch.vouchData.count));

        vouch.getDataGrid(response.data);
      })
      .catch(function(error){
        if(error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        // console.log(error.config);
        $('#myModalProcess').modal('hide');
        vouch.getDataGrid("");
        console.log(JSON.stringify(error.message));
      }) ;
      vouch.vouchData.count = 0;
  }},
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#genvouchdata").DataTable ({
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
    });

    // tool tip for page button nav
    $('#genvouchdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#genvouchdata_next.next.paginate_button').attr('title', 'Next');
    $('#genvouchdata_first.first.paginate_button').attr('title', 'First');
    $('#genvouchdata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#genvouchdata').DataTable();
    myTable.clear().rows.add(vdata).draw();

    $('#myModalProcess').modal('hide');
  },
  clearGrid(id){
    var myTable = $('#genvouchdata').DataTable();
    myTable.clear().draw();
  },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  formatMinvalue(){
    var str = numeral(vouch.vouchSett.minValuetmp);
    vouch.vouchSett.minValuetmp = str.format('0,0');
    vouch.vouchSett.minValue = str.value();
  },
  formatDefaultvalue(){
    var str = numeral(vouch.vouchSett.defaultValuetmp);
    vouch.vouchSett.defaultValuetmp = str.format('0,0');
    vouch.vouchSett.defaultValue = str.value();
  },
  setFocus(proc){
    if(proc == "1"){
      document.getElementById('vouchcount').select();
    } else if (proc == "2") {
      document.getElementById('vouchminvalue').select();
    } else if (proc == "3") {
      document.getElementById('vouchdefaultvalue').select();
    }
  },
  getVoucherSett(){
    axios
      .get(serverurl + "defaultsettings/genvoucher")
      .then(function(response){
        vouch.vouchGenSett = response.data;
        // console.log(JSON.stringify(response.data));
      })
      .catch(function(error){
        if(error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        // console.log(error.config);
        console.log(JSON.stringify(error.message));
      }) ;
  },
  updateVoucherSett(){
    var vouchID = this.vouchGenSett[0].id;
    this.currGenSett.fieldname = this.vouchGenSett[0].fieldname;
    this.currGenSett.settings.genvoucher_minimum = this.vouchGenSett[0].settings.genvoucher_minimum;
    this.currGenSett.settings.genvoucher_trigger = this.vouchGenSett[0].settings.genvoucher_trigger;
    // console.log(JSON.stringify(this.currGenSett));

    axios
      .put(serverurl + "defaultsettings/genvoucher/" + vouchID, this.currGenSett)
      .then(function(response){
        if(JSON.stringify(response.data)){
          swal("", "Successfully updated.", "success");
          vouch.getVoucherSett();
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
          console.log('Error', error.message);
        }
        // console.log(error.config);
        console.log(JSON.stringify(error.message));
      }) ;
  },
  processUser(){
    this.priv.userrights = window.localStorage.getItem('userRights');
    this.priv.useraccess = window.localStorage.getItem('userAccess');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
  },

}
});
