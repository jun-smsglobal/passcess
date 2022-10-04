var appgps = new Vue({
el: '#appgps',
data: {
  vesselSetting : {vesselID: "", vesselName: "", fleetID: "", partnerID: "", dateFrom:"", dateTo:""},
  allGPS: [],
  currGPS: {},
  GPSLoc: {lon: 120.9578, lat: 14.6021},
  GPSPoint: [],
  optVess: [{ text: '', value: '' }],
  privilage : {userrights : null, useraccess : null}
},
mounted: function(){
  this.processUser();
  this.getDateToday();
  this.getVessel();
  setTimeout(() => { this.getAllGPS(); }, 500);
},
methods: {
  getAllGPS(){
    axios
      // .get(serverurl + "gpslog" )
      .get(serverurl + "gpslog/" + this.vesselSetting.vesselID + "/" + this.vesselSetting.dateFrom + "/" + this.vesselSetting.dateTo )
      .then(function(response){
        if(!response.data.error){
          appgps.allGPS = response.data;
        } else {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appgps.allGPS = "[]";
      })
      .finally(function(){
        if ((JSON.stringify(appgps.allGPS) != "[]") && (JSON.stringify(appgps.allGPS) != "{}")){
          appgps.myMAP(appgps.allGPS);
        }
      });

    // appgps.myProgress(1);
    // this.allGPS == [];
    // appgps.myProgress(2);
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
          appgps.optVess = response.data.vessel;
        } else {
          console.log(JSON.stringify(response.data.message));
        }
      })
      .catch(function(error){
        console.log(JSON.stringify(error.message));
        appgps.optVess = [{ text: '', value: '' }];
      })
      .finally(function(){
        // if ((appgps.vesselSetting.vesselID == "") || (appgps.vesselSetting.vesselID == "0")){
        //   window.localStorage.setItem('vesselID', appgps.optVess[0].value);
        //   appgps.vesselSetting.vesselID = appgps.optVess[0].value;
        // }
      });
  },
  processUser(){
    this.vesselSetting.vesselID = window.localStorage.getItem('vesselID');
    this.vesselSetting.partnerID = window.localStorage.getItem('partner');

    this.privilage.userrights = window.localStorage.getItem('userRights');
    this.privilage.useraccess = window.localStorage.getItem('userAccess');

    document.getElementById("webusername").innerHTML = "Log Out - " + window.localStorage.getItem('supportUser');
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
  changeVesselID(event){
    window.localStorage.setItem('vesselID', this.vesselSetting.vesselID);
    this.getAllGPS()
    this.getVessName();
  },
  toFormData(obj){
    var fd = new FormData();
    for(var i in obj){
      fd.append(i,obj[i]);
    }
    return fd;
  },
  setFocus(eventid){
    document.getElementById(eventid).focus();
  },
  getVessName(){
    if(this.vesselSetting.vesselID != "0"){
      this.vesselSetting.vesselName = document.getElementById('modeVessel').selectedOptions[0].text;
    };
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

  // myMAP_old(vMapData){
  //   $("#mapdiv").empty();
  //
  //   map = new OpenLayers.Map("mapdiv");
  //   map.addLayer(new OpenLayers.Layer.OSM());
  //   epsg4326 =  new OpenLayers.Projection("EPSG:4326");     //WGS 1984 projection
  //   projectTo = map.getProjectionObject();                  //The map projection (Spherical Mercator)
  //
  //   var lonLat = new OpenLayers.LonLat(this.GPSLoc.lon, this.GPSLoc.lat).transform(epsg4326, projectTo);
  //   var zoom = 8;
  //   var markers = new OpenLayers.Layer.Vector("Overlay");
  //
  //   // main marker point
  //   var feature = new OpenLayers.Feature.Vector(
  //       new OpenLayers.Geometry.Point(this.GPSLoc.lon, this.GPSLoc.lat).transform(epsg4326, projectTo),
  //       {description:"Latitude:" + this.GPSLoc.lat + "</br>" + "Longitude:" + this.GPSLoc.lon + "</br>" + "Date: 2022-05-02 11:11"} ,
  //       {externalGraphic: './assets/css/images/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
  //   );
  //   markers.addFeatures(feature);
  //
  //   // loop through data for additional marker
  //   for (var key of Object.keys(vMapData)) {
  //     var element = {};
  //     element.gpslon = vMapData[key].lng.replace(/\E$/, '');
  //     element.gpslat = vMapData[key].lat.replace(/\N$/, '');
  //     element.gpsdate = vMapData[key].event_time;
  //
  //     var lonLatpoint = new OpenLayers.Geometry.Point(element.gpslon, element.gpslat).transform(epsg4326, projectTo);
  //   };
  //   var feature = new OpenLayers.Feature.Vector(
  //       lonLatpoint,
  //       {description:"Latitude:" + element.gpslat + "</br>" + "Longitude:" + element.gpslon + "</br>" + "Date:" + element.gpsdate} ,
  //       {externalGraphic: './assets/css/images/boat.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
  //   );
  //   markers.addFeatures(feature);
  //
  //   var points = [
  //       new OpenLayers.Geometry.Point(this.GPSLoc.lon, this.GPSLoc.lat).transform(epsg4326, projectTo),
  //       lonLatpoint
  //   ];
  //
  //   var feature = new OpenLayers.Feature.Vector(
  //           new OpenLayers.Geometry.LineString(points),
  //           {description:'voyage' + "</br>" + "Leg" + "</br>"}
  //   );
  //   markers.addFeatures(feature);
  //
  //   //  finally add all markers
  //   map.addLayer(markers);
  //   map.setCenter(lonLat, zoom);
  //
  //   //Add a selector control to the vectorLayer with popup functions
  //   var controls = {
  //     selector: new OpenLayers.Control.SelectFeature(markers, { onSelect: createPopup, onUnselect: destroyPopup, hover: true })
  //   };
  //
  //   function createPopup(feature) {
  //     feature.popup = new OpenLayers.Popup.FramedCloud("pop",
  //         feature.geometry.getBounds().getCenterLonLat(),
  //         null,
  //         '<div class="markerContent">'+feature.attributes.description+'</div>',
  //         null,
  //         true,
  //         function() { controls['selector'].unselectAll(); }
  //     );
  //     //feature.popup.closeOnMove = true;
  //     map.addPopup(feature.popup);
  //   }
  //
  //   function destroyPopup(feature) {
  //     feature.popup.destroy();
  //     feature.popup = null;
  //   }
  //
  //   map.addControl(controls['selector']);
  //   controls['selector'].activate();
  // },

  myMAP(vMapData){
    $("#mapdiv").empty();

    map = new OpenLayers.Map("mapdiv");
    map.addLayer(new OpenLayers.Layer.OSM());
    epsg4326 =  new OpenLayers.Projection("EPSG:4326");     //WGS 1984 projection
    projectTo = map.getProjectionObject();                  //The map projection (Spherical Mercator)

    // var lonLat = new OpenLayers.LonLat(this.GPSLoc.lon, this.GPSLoc.lat).transform(epsg4326, projectTo);
    var lon = vMapData[0].lng.replace(/\E$/, '');
    var lat = vMapData[0].lat.replace(/\N$/, '');
    var lonLat = new OpenLayers.LonLat(lon, lat).transform(epsg4326, projectTo);
    var zoom = 8;
    var markers = new OpenLayers.Layer.Vector("Overlay");
    map.setCenter(lonLat, zoom);

    // //Loop through the markers array
    for (var i=0; i<vMapData.length; i++) {
      var lon = vMapData[i].lng.replace(/\E$/, '');
      var lat = vMapData[i].lat.replace(/\N$/, '');
      var lon_orig = vMapData[i].lng;
      var lat_orig = vMapData[i].lat;
      var heading = vMapData[i].heading;
      var gpsDate = vMapData[i].event_time;

      if(i == 0) {
        var feature = new OpenLayers.Feature.Vector(
              new OpenLayers.Geometry.Point( lon, lat ).transform(epsg4326, projectTo),
              {description:"Heading:" + heading + "</br>" + "Latitude:" + lat_orig + "</br>" + "Longitude:" + lon_orig + "</br>" + "Date:" + gpsDate} ,
              {externalGraphic: './assets/css/images/boat.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
            );
      } else if(i == (vMapData.length - 1))  {
        var feature = new OpenLayers.Feature.Vector(
              new OpenLayers.Geometry.Point( lon, lat ).transform(epsg4326, projectTo),
              {description:"Heading:" + heading + "</br>" + "Latitude:" + lat_orig + "</br>" + "Longitude:" + lon_orig + "</br>" + "Date:" + gpsDate} ,
              {externalGraphic: './assets/css/images/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
            );
      } else {
        var feature = new OpenLayers.Feature.Vector(
              new OpenLayers.Geometry.Point( lon, lat ).transform(epsg4326, projectTo),
              {description:"Heading:" + heading + "</br>" + "Latitude:" + lat_orig + "</br>" + "Longitude:" + lon_orig + "</br>" + "Date:" + gpsDate} ,
              // {externalGraphic: './assets/css/images/circle_sm.png', graphicHeight: 6, graphicWidth: 5, graphicXOffset:-1, graphicYOffset:-2  }
            );
      }

      markers.addFeatures(feature);
    }
    map.addLayer(markers);

    var points = [];
    for (var i=0; i<vMapData.length; i++) {
      var lon = vMapData[i].lng.replace(/\E$/, '');
      var lat = vMapData[i].lat.replace(/\N$/, '');
      points.push(new OpenLayers.Geometry.Point(lon, lat).transform(epsg4326, projectTo) );
    };
    var feature1 = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString(points),
            {description:'voyage' + "</br>" + "Leg" + "</br>"}
    );
    markers.addFeatures(feature1);
    map.addLayer(markers);

    // remove popup
    // map.getOverlays().remove(markers)
    // map.getOverlays().remove(markers.removeFeatures( [ feature1 ] )) ;

    //Add a selector control to the vectorLayer with popup functions
    var controls = {
      selector: new OpenLayers.Control.SelectFeature(markers, { onSelect: createPopup, onUnselect: destroyPopup, hover: true })
    };

    function createPopup(feature) {
      feature.popup = new OpenLayers.Popup.FramedCloud("pop",
          feature.geometry.getBounds().getCenterLonLat(),
          null,
          '<div class="markerContent">'+feature.attributes.description+'</div>',
          null,
          true,
          function() { controls['selector'].unselectAll(); }
      );
      //feature.popup.closeOnMove = true;
      map.addPopup(feature.popup);
    }

    function destroyPopup(feature) {
      feature.popup.destroy();
      feature.popup = null;
    }

    map.addControl(controls['selector']);
    controls['selector'].activate();
  },

}
});
