var reguser = new Vue({
el: '#reguser',
data: {
  newUser: {name:"", email:"", password:"", company:"", position:"", vessel:""},
  newUser: {},
  optVessel: [{ text: '', value: '' }]
},
mounted: function(){
  // this.getVessel();
},
methods: {
  CreateNewUser(){
      var formData = reguser.toFormData(reguser.newUser);
      axios
        .post(serverurl + "user/register", formData)
        .then(function(response){
          if (JSON.stringify(response.data) != "[]"){
            reguser.regusererList = response.data;
            // addLogUpdate(window.localStorage.getItem('supportUser'), '{"status": "ALLOCATE reguserER"}', reguser.regusererList);

            reguser.getDataGrid(response.data);
          } else {
            swal("Info", "Please generate a reguserer", "info");
          }
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
          console.log(error.config);
          swal("Warning", JSON.stringify(error.message), "warning");
        }) ;
  }},
  // getVessel(){
  //   axios
  //     .get(localurl + "vessel.php?action=getvessel&proc=1&id=0")
  //     .then(function(response){
  //       if(!response.data.error){
  //         reguser.optVessel = response.data.vessel;
  //       } else {
  //         swal("Warning", response.data.message, "warning");
  //       }
  //     })
  //     .catch(function(error){
  //       console.log(JSON.stringify(error.message));
  //       reguser.optVessel = [{ text: '', value: '' }];
  //     });
  // },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },


});
