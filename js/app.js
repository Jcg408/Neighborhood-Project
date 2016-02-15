  var locations = [
          ['Cave Ridge Vineyards', 38.8171003,-78.6726059, 1, 'www.caveridge.com'],
          ['Desert Rose Winery', 38.8395124, -78.0824622, 2, 'www.desertrosewinery.com'],
          ['Linden Vineyards', 38.880931854248, -78.0654830932617, 3, 'www.lindenvineyards.com'],
          ['Gray Ghost Vineyards', 38.6777845770121, -78.0031395703554, 4, 'www.grayghostvineyards.com'],
          ['Naked Mountain Winery', 38.9268762, -77.9996087, 5, 'www.nakedmountainwinery.com'],
          ['Rappahanock Cellars', 38.8345291, -78.1161845, 6, 'www.rappahanockcellars.com'],
          ['Shenandoah Vineyards',38.8460883,-78.5607378 ,7, 'www.shenandoahvineyardsva.com']
       ];

 // function to designate map
 function initMap() {
       var mapDiv = document.getElementById('map');
       var map = new google.maps.Map(mapDiv, {
       center: {lat: 38.92332, lng: -78.1863},
       zoom: 10
       });
       
 // set markers with animations. Drop and Bounce.
        var infowindow = new google.maps.InfoWindow();

        var marker, i;

        for (i = 0; i < locations.length; i++) {  
            marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			animation: google.maps.Animation.DROP,   
            map: map
      });
		
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
                toggleBounce();
  };
            function toggleBounce() 
            {
                if (marker.getAnimation() != null) {marker.setAnimation(null);} 
                else {marker.setAnimation(google.maps.Animation.BOUNCE);}
                }
    
            })(marker, i));
        } 
 
 };
  
var ViewModel= function () {
        var self = this;
        self.vineList=ko.observableArray([]);
       
    var Vine = function (locations) { 
        this.name= ko.observableArray([0]),
        this.latLng= ko.observableArray(locations[1,2])

    }  ; 
    
};
ko.applyBindings(new ViewModel());
 
    
    
    
