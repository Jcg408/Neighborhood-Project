function initMap() {
       var mapDiv = document.getElementById('map');
       var map = new google.maps.Map(mapDiv, {
       center: {lat: 38.92332, lng: -78.1863},
       zoom: 10
       });
 };

var myVineyard= [
    {
    name: 'Cave Ridge Vineyards',
    url: 'https://www.caveridge.com',
    descript: 'Lorem Ipsum',
    latLng:  [38.8171003,-78.6726059]
    },
    
    {
    name: 'Desert Rose Winery',
    url: 'https://www.desertrosewinery.com',
    descript: 'Lorem Ipsum',
    latLng:  [38.8395124, -78.0824622,]
    },

{
    name: 'Linden Vineyards',
    url: 'https://www.lindenvineyards.com',
    descript: 'Lorem Ipsum',
    latLng:  [ 38.880931854248, -78.0654830932617]
    },

{
    name: 'Gray Ghost Vineyards',
    url: 'https://www.grayghostvineyards.com',
    descript: 'Lorem Ipsum',
    latLng:  [38.6777845770121, -78.0031395703554]
    },

{
    name: 'Naked Mountain Winery',
    url: 'https://www.nakedmountainwinery.com',
    descript: 'Lorem Ipsum',
    latLng:  [38.9268762, -77.9996087]
    },

    {
    name: 'Rappahanock Cellars',
    url: 'https://rappahanockcellars.com',
    descript: 'Lorem Ipsum',
    latLng:  [38.8345291, -78.1161845]
    },
    
    {
    name: 'Shenandoah Vineyards',
    url: 'https://www.shenandoahvineyardsva.com',
    descript: 'Lorem Ipsum',
    latLng:  [38.8460883,-78.5607378]
    }
    
];

 var infoWindow = new google.maps.InfoWindow();
    
    for (var i = 0, length = json.length; i < length; i++) {
    var data = json[i],
      latLng = new google.maps.LatLng(data.lat, data.lng); 

  // Creating a marker and putting it on the map
    var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: data.title
    });
    
    (function(marker, data) {

				// Attaching a click event to the current marker
				google.maps.event.addListener(marker, "click", function(e) {
					infoWindow.setContent(data.description);
					infoWindow.open(map, marker);
				});

			})(marker, data);

    };

var Location = function (data) {
    this.name= ko.observable(data.name);
    this.url= ko.observable(data.url);
    this.descript= ko.observable(data.descript);
    this.latLng= ko.observableArray(data.latLng);
    
};
var ViewModel = function () {
    var self=this;
    self.locationList = ko.observable();
    
    myVineyard.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem))
    });
    
    self.currentLocation=ko.observable(self.locationList()[0]);
}

ko.applyBindings(new ViewModel());
