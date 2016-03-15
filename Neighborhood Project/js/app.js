 
 
 
 //My Note:
 //I am trying very hard to work through this. I really don't think I am cut out for this. I obviously don't have the skills to
// handle cleaning this up. // I really think I should quit this course and go back to learning one thing at a time. I should learn
// Javascript thoroughly and then learn Knockout because this is now all just GREEK to me!  I have noticed the information 
//coming back from console.log - it looks like something is happening but I have no idea how to get the events to actually happen.
//Question - Did I just go backwards or am I progressing towards an end??
 
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


 function initMap() {
       var mapDiv = document.getElementById('map');
       var map = new google.maps.Map(mapDiv, {
       center: {lat: 38.92332, lng: -78.1863},
       zoom: 10
       });
      
     
        var infowindow = new google.maps.InfoWindow();
		var marker, i;

		 
		
        for (i = 0; i < locations.length; i++) {  
            marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			animation: google.maps.Animation.DROP,   
            map: map
      });
         marker.addListener('click', toggleBounce);
         //COACH NOTES:
//          instead of using locations array and a for loop above -
//          since we made the vm variable down at the bottom, we have access to the vm.vineList() observable array here.
//          we can make the markers using a forEach() method on it :)
//          
    //My notes:
    // I tried eliminating the for loop above and moving marker information into vm vineList here with no success. 
      vm.vineList().forEach(function(vine){
          vine.marker = ko.observable(marker);
       console.log('what');
         });
          
      
        //COACH NOTES: 
//           once you've built out the vm.select function, you can assign the marker's listener function to
//          vm.select instead of toggleBounce. Because of the way that adding a function to a listener 
//          works, you'll have to use a lot of console logs to be sure you know what kind of object you're
//          passing here, and make sure the function can handle that object correctly
  
//My notes: 
//I'm not quite sure what is meant my "assign" . I tried moving the marker.addListener('click', toggleBounce) below and again to success with click action. Am I using the correct event? 
// Should I be focusing on using the google.maps.event below? 
		
	  google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][4]);
                infowindow.open(map, marker);
                }
           })(marker, i));
		   
		}
		
 };
 //My note:
 //     Moved  toggleBounce outside initMap so  it can be accessed from vm.select(loc). However, now the bounce doesn't work when I click marker directly.
		var toggleBounce = function() {
			if (this.getAnimation() !== null) {
			this.setAnimation(null);
			} else {
			this.setAnimation(google.maps.Animation.BOUNCE);
			}
        };
       
  var userInput=(" ");
     
     console.log('hi');
 
    
   var Vine= function (data) {
        this.name=ko.observable(data[0]),
        this.description=ko.observable(data[4]),
        this.lat=ko.observable(data[1]),
        this.lng=ko.observable(data[2]),
        this.LatLng=ko.computed(function() {
            return  this.lat() + "," + this.lng();
        }, this);
   
    //console.log(Vine);  
	}

var ViewModel = function () {
	var self=this; 
    
 	var vines= ko.utils.arrayMap(locations, function(location) {
		return new Vine(location); 
	});
    console.log(locations);
	
	self.vineList = ko.observableArray(vines);
	self.filter= ko.observable("");
	self.search=ko.observable("");
  
  //COACH NOTES:
//   make a new function to select the locations:

//My notes: still can't figure out what do put in here. I know it is supposed to link to the data-bind for the list. It clicks but no animation occurs.
 self.select = function(loc){
     
     google.maps.event.addListener(this.marker, 'click', function() {
         
         infowindow.setContent(locations[i][4]);
         infowindow.open(map,this.marker);
        });
    console.log(loc);
     
    google.maps.event.trigger(this.marker,"click"); 
     }
  
 
    //    COACH NOTES:
//  this select function should do everything you need to do when selecting a place
//    - open the infowindow
//    - make the marker bounce (so the function toggleBounce can be used, but will need to be moved
//                             outside the initMap function so it can be accessed here)
//  
  
	self.filteredItems = ko.computed(function() {
        var listFilter = self.filter().toLowerCase();
		if (!listFilter) {
			return self.vineList();
		} else {
			return ko.utils.arrayFilter(self.vineList(), function(item) {
				 var stringStartsWith = function (string, startsWith) {          
					string = string || "";
					if (startsWith.length > string.length)
						return false;
					return string.substring(0, startsWith.length) === startsWith;
				};
				return stringStartsWith(item.name().toLowerCase(), listFilter);
			});
		}
	},self);	
    
   console.log(self.filteredItems);
  //COACH NOTES:
//  when you are ready and have associated the markers in the vine object, you can use the same logic here
//  to filter your markers. As in, if the search string matches, item.marker.setVisible(true); otherwise
//  item.marker.setVisible(false);
//  
//  The setVisible method on google maps markers is better than using setMap(map) and setMap(null) because setMap()
//  actually recreates the markers rather than just showing/hiding them
};	

// here is where we want to take a different approach:
var vm = new ViewModel(); 

ko.applyBindings(vm);


    
    
