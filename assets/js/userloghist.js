var userhist = new Vue({
el: '#userhist',
data: {
  userSett:{userid:"0", dateFrom:"", dateTo:""},
  allUser: [],

  privilage : {userrights : null, useraccess : null, TokenKey : null},
},
mounted: function(){
  this.processUser();
  this.getDateToday();
  this.getallUser();
},
methods: {
  getallUser(){
    var strURL = "";
    if(this.userSett.userid == "0"){
      strURL = localurl + "voucher.php?action=userhist&proc=2&id=0&from=" + this.userSett.dateFrom + "&to=" + this.userSett.dateTo;
    } else {
      strURL = localurl + "voucher.php?action=userhist&proc=2&id=" + this.userSett.userid + "&from=" + this.userSett.dateFrom + "&to=" + this.userSett.dateTo;
    };

    axios
      .get(strURL)
      .then(function(response){
        if(!response.data.error){
          userhist.allUser = response.data.voucher;
          userhist.getDataGrid(response.data.voucher);
          userhist.arrangeData(response.data.voucher)
        } else {
          console.log(JSON.stringify(response.data.message));
          userhist.getDataGrid("");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        userhist.getDataGrid("");
        userhist.allUser = [];
      });
  },
  processUser(){
    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
  },
  getDateToday(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    // var last_mm = String(today.getMonth()).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd ;
    last_date = yyyy + '-' + mm + '-01' ;
    if (this.userSett.dateFrom == ""){
      this.userSett.dateFrom = last_date;
    }
    if (this.userSett.dateTo == ""){
      this.userSett.dateTo = today;
    }
  },
  getDataGrid(vdata){
    // Load  datatable
    var oTblReport = null;
    oTblReport = $("#userlogdata").DataTable ({
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
        "columns" : [
            { title: '<input type="checkbox" id="checkall" title="Select all" class="checkall"/>', data: null, className: "text-center", orderable: false,
              render: function (data, type, row, meta) {
                return '<input type="checkbox" value="'+ data.username + '" class="checkid" id=c-"' + meta.row + '">';
              }},
            { title: "Username", data: "username", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "OLD Data", data: "old_data", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "NEW Data", data: "new_data", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
            { title: "Date", data: "trandate", className: "text-left",
              render : function ( data, type, row, meta ) {
                return '<button type="button" class="borderless-button" id=n-"' + meta.row + '" data-toggle="modal" data-target="#myModalEdit">'+ data +'</button>';
              }},
        ],
        "order": [[ 1, "asc" ]],
        "retrieve" : true
    });

    $('#userlogdata tbody').on('click', '.borderless-button', function () {
      var id = $(this).attr("id").match(/\d+/)[0];
      var data = $('#userlogdata').DataTable().row( id ).data();
        appfleet.selectFleet(data);
        appfleet.checkUser(2);
        appfleet.setFocusModal('2');
    });
    $('#userlogdata tbody').on('click', '.checkid', function () {
      var allSelected = $('.checkid:checked')
      if(allSelected.length == 0){
        $('.checkall').each(function(){ this.checked = false; });
      }
    });
    $("#checkall").on('click', function () {
        $('#userlogdata').DataTable()
            .column({page: 'current'})
            .nodes()
            .to$()
            .find('input[type=checkbox]')
            .prop('checked', this.checked);
    });

    $(".dataTables_filter input").on('keyup change', function() {
      $('#userlogdata').DataTable()
          .column(0)
          .nodes()
          .to$()
          .find('input[type=checkbox]')
          .prop('checked', false);

      $('.checkall').each(function(){ this.checked = false; });
    });
    // tool tip for page button nav
    $('#userlogdata_previous.previous.paginate_button').attr('title', 'Previous');
    $('#userlogdata_next.next.paginate_button').attr('title', 'Next');
    $('#userlogdata_first.first.paginate_button').attr('title', 'First');
    $('#userlogdata_last.last.paginate_button').attr('title', 'Last');

    this.clearGrid();
    this.RefreshData(vdata);
  },
  RefreshData(vdata){
    var myTable = $('#userlogdata').DataTable();
    myTable.clear().rows.add(vdata).draw();
  },
  clearGrid(id){
    var myTable = $('#userlogdata').DataTable();
    myTable.clear().draw();
  },
  arrangeData(tempData){
    var vtempData = [];

    for(var i = 0; i < tempData.length; i++) {
      var strTemp = "";
      var obj = tempData[i];
      var oldData = JSON.parse(obj.old_data);
      var newData = JSON.parse(obj.new_data);

      for (const aKey in oldData) {
        if(aKey == 'status') {
          vtempData.push({"old_data":oldData[aKey], "new_data": obj.new_data, "trandate":obj.trandate });
        } else {
          if(oldData[aKey] != newData[aKey]){
            strTemp = strTemp + aKey + " = " + "from: " + oldData[aKey] + " to: " + newData[aKey] + "</br> \n"
          }
        };
      }; // end for loop
      if(strTemp != ""){
        vtempData.push({"old_data":"Edit Record", "new_data": strTemp, "trandate":obj.trandate});
      }
    }; // end for loop
    console.log(JSON.stringify(vtempData));
  },

},
});
