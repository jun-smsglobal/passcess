var appsched = new Vue({
el: '#appsched',
data: {
  vesselSetting : {vesselID: "", fleetID: "", partnerID: ""},
  schedSetting :{skedid: "", formshow: "", showadd: false, showedit: false},
  allSched: [],
  newSched: {id:"", vesselid: "", voyage: "", leg: "", origin: "", departure_at: "", destination: "", arrival_at: ""},
  currSched: {},
  schedTitle : "",
  privilage : {userrights : null, useraccess : null, TokenKey : null}
},
mounted: function(){
  this.processUser();
  this.getDateToday();
},
methods: {
  getAllSched(){
    axios
      .get(serverurl + "voyageschedule/portal/" + this.schedSetting.skedid, {headers : {Authorization: "bearer " + this.privilage.TokenKey }})
      .then(function(response){
        appsched.allSched = response.data;
        window.localStorage.setItem('scheddata', JSON.stringify(appsched.allSched));
      })
      .catch(function(error){
        console.log(error);
        appsched.allSched = appsched.newSched;
      }) ;
  },
  processUser(){
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');

    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');
    this.privilage.TokenKey = window.localStorage.getItem('tokenKey');

    this.schedSetting.skedid = window.localStorage.getItem('scheduleID');
    this.schedSetting.formshow = window.localStorage.getItem('Schedule');

    if (this.schedSetting.formshow == '1'){
      this.schedSetting.showadd = true;
      this.schedSetting.showedit = false;
      this.schedTitle = "New Voyage Schedule";
    } else {
      this.schedSetting.showadd = false;
      this.schedSetting.showedit = true;
      this.schedTitle = "Edit Voyage Schedule";
    }
  },
  getDateToday(){
    if (this.schedSetting.formshow != '1'){
      this.getAllSched();
    } else {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      var hh = today.getHours();
      // var mm = today.getMinutes()

      today = yyyy + '-' + mm + '-' + dd + " " + hh + ":00" ;
      // console.log(today);
      if (this.newSched.departure_at == ""){
        this.newSched.departure_at = today;
        this.newSched.arrival_at = today;
      }
    }
  },
  addSched(){
    this.newSched.vesselid = this.vesselSetting.vesselID;
    var formData = appsched.toFormData(appsched.newSched);
    axios
      .post(serverurl + "voyageschedule", formData, {headers : {Authorization: "bearer " + this.privilage.TokenKey }} )
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ADD SCHEDULE"}', appsched.newSched);
        appsched.newSched = {id:"", vesselid: "", voyage: "", leg: "", origin: "", departure_at: "", destination: "", arrival_at: ""};

        swal("", "Successfully updated \n\n New schedule added", "success");
        window.localStorage.removeItem('scheduleID');
        window.localStorage.removeItem('Schedule');
        setTimeout(() => { window.location.href = "voyage.html"; }, 500);
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
        console.log(error.config);
        swal("Warning", JSON.stringify(error.message), "warning");
      }) ;
  },
  updateSched(){
    axios
      .put(serverurl + "voyageschedule/" + this.currSched['id'], appsched.currSched, {headers : {Authorization: "bearer " + this.privilage.TokenKey }})
      .then(function(response){
        // console.log(JSON.stringify(response.data));
        addLogUpdate(window.localStorage.getItem('supportUser'), window.localStorage.getItem('scheddata'), appsched.currSched);
        window.localStorage.removeItem('scheddata');
        appsched.allSched = [];
        appsched.currSched = {};

        swal("", "Successfully updated", "success");
        window.localStorage.removeItem('scheduleID');
        window.localStorage.removeItem('Schedule');
        setTimeout(() => { window.location.href = "voyage.html"; }, 500);
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
        console.log(error.config);
        swal("Warning", JSON.stringify(error.message), "warning");
      }) ;
  },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  selectSched(sched){
    appsched.currSched = sched;
    appsched.validateData(sched);
  },
  changeDate(data){
    appsched.allSched.departure_at = data;
  },
  closeSched(){
    window.localStorage.removeItem('scheddata');
    window.localStorage.removeItem('scheduleID');
    window.localStorage.removeItem('Schedule');
    setTimeout(() => { window.location.href = "voyage.html"; }, 500);
  },
  validateData(dataEntry){
    var finalErr = [];
    if(dataEntry.voyage == ""){
      finalErr.push("Invalid Voyage Number");
    }
    if(dataEntry.leg == ""){
      finalErr.push("Invalid Leg Number");
    }
    if(dataEntry.origin == ""){
      finalErr.push("Invalid Origin");
    }
    if(dataEntry.departure_at == ""){
      finalErr.push("Invalid Departure Date");
    }
    if(dataEntry.destination == ""){
      finalErr.push("Invalid Destination");
    }
    if(dataEntry.arrival_at == ""){
      finalErr.push("Invalid Arrival Date");
    }
    // console.log(JSON.stringify(finalErr));
    if((JSON.stringify(finalErr) == "") || (JSON.stringify(finalErr) == "[]")){

      if (this.schedSetting.formshow == '1'){
        appsched.schedSetting.showadd = false;
        appsched.addSched();
      } else {
        appsched.schedSetting.showedit = false;
        appsched.updateSched();
      }

    } else {
      swal("Warning", JSON.stringify(finalErr), "warning");
    }
  },
  setFocus(event){
    if (event == 1) {
      document.getElementById('addvoyageid').focus();
    } else if (event == 2) {
      document.getElementById('addleg').focus();
    } else if (event == 3) {
      document.getElementById('addorigin').focus();
    } else if (event == 4) {
      document.getElementById('datetimepicker1').focus();
    } else if (event == 5) {
      document.getElementById('adddestination').focus();
    } else if (event == 6) {
      document.getElementById('datetimepicker2').focus();
    } else if (event == 7) {
      document.getElementById('addbtn').focus();
    } else if (event == 8) {
      document.getElementById('editvoyageid').focus();
    } else if (event == 9) {
      document.getElementById('editleg').focus();
    } else if (event == 10) {
      document.getElementById('editorigin').focus();
    } else if (event == 11) {
      document.getElementById('datetimepicker3').focus();
    } else if (event == 12) {
      document.getElementById('editdestination').focus();
    } else if (event == 13) {
      document.getElementById('datetimepicker4').focus();
    } else if (event == 14) {
      document.getElementById('editbtn').focus();
    } else {
      document.getElementById('').focus();
    }
  },

}
});
