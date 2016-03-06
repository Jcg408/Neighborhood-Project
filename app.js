  var locations = [
          ['Cave Ridge Vineyards', 38.8171003,-78.6726059, 1,'Cave Ridge Vineyard, 1476 Conicville Rd, Mt. Jackson, VA 22842'],
          ['Desert Rose Winery', 38.8395124, -78.0824622, 2, 'Desert Rose Winery, 13726 Hume Rd, Hume, VA 22639'],
          ['Linden Vineyards', 38.880931854248, -78.0654830932617, 3, 'Linden Vineyards, 3708 Harrels Corner Rd, Linden VA, 22632'],
          ['Gray Ghost Vineyards', 38.6777845770121, -78.0031395703554, 4, 'Gray Ghost Viineyards, 14706 Lee Hwy, Amissville, VA 20106'],
          ['Naked Mountain Winery', 38.9268762, -77.9996087, 5, 'Naked Mountain Winery, 2747 Leeds Manor Rd., Markham, VA 22643 '],
          ['Rappahanock Cellars', 38.8345291, -78.1161845, 6, 'Rappahanock Cellars, 14437 Hume Rd, Huntly, VA 22640 '],
          ['Shenandoah Vineyards',38.8460883,-78.5607378 ,7, 'Shenandoah Vineyards, 3659 S. Ox Rd, Edinburg, VA 22824 '],
          ['Barrel Oak Winery',38.885308,-77.905710, 8, 'Barrel Oak Winery, 3623 Grove Lane, Delaplane, VA 20144']
       ];

 // function to designate map
 function initMap() {
       var mapDiv = document.getElementById('map');
       var map = new google.maps.Map(mapDiv, {
       center: {lat: 38.92332, lng: -78.1863},
       zoom: 10
       });
      
 //longitute and latitude of vineyards in array for marker display
     
    //set markers and infowindow on map
        var infowindow = new google.maps.InfoWindow();
		var marker, i;
		marker=[];
		 
		var toggleBounce = function() {
			if (this.getAnimation() !== null) {
			this.setAnimation(null);
			} else {
			this.setAnimation(google.maps.Animation.BOUNCE);
			}
		}
       

        for (i = 0; i < locations.length; i++) {  
            marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			animation: google.maps.Animation.DROP,   
            map: map
      });
		marker.addListener('click', toggleBounce);
		
	  google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][4]);
                infowindow.open(map, marker);
                }
           })(marker, i));
		   
		}
		
 };
  console.log('hi');
       
 // create observables for filtering.
	var userInput=(" ");
    


// Put functionality into ViewModel
var ViewModel = function () {
	var self=this;
    
	var Vine= function (data) {
	this.name=ko.observable(data[0]),
	this.lat=ko.observable(data[1]),
	this.lng=ko.observable(data[2])
	};	

	var vines= ko.utils.arrayMap(locations, function(location) {
		return new Vine(location); 
	
	});
	this.vineList = ko.observableArray(vines);
	this.filter= ko.observable("");
	this.search=ko.observable("");
	myClicker= function() {
        this.marker=new google.maps.Marker ();
        google.map.event.trigger(this.marker, 'click'); 
        console.log('hello');
    };
    
	
	this.filteredItems = ko.computed(function() {
        
		var listFilter = this.filter().toLowerCase();
		if (!listFilter) {
			return this.vineList();
		} else {
			return ko.utils.arrayFilter(this.vineList(), function(item) {
				 var stringStartsWith = function (string, startsWith) {          
					string = string || "";
					if (startsWith.length > string.length)
						return false;
					return string.substring(0, startsWith.length) === startsWith;
				};
				return stringStartsWith(item.name().toLowerCase(), listFilter);
			});
		}
	},this);	
}
	
console.log ('hey');
ko.applyBindings(new ViewModel());

    
    
