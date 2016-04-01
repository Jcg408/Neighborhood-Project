 //My Note:
 //I am spending what seems like decades on this seemingly easy project. Hah! I am now stuck on getting the markers to reappear when I backspace or clear the search bar. 
 //I am also having problems with error handling. There is so little resource on the best way to handle the google maps error handling. Actually any error handling at all. I tried to use 
 //onerror on the google api in the html file and a function here but doesn't seem to work for me. I had someone else look at it and they were confused as well. 
 var locations = [
     ['Cave Ridge Vineyards', 38.8171003, -78.6726059, 1,
         'Cave Ridge Vineyard, 1476 Conicville Rd, Mt. Jackson, VA 22842'
     ],
     ['Desert Rose Winery', 38.8395124, -78.0824622, 2,
         'Desert Rose Winery, 13726 Hume Rd, Hume, VA 22639'
     ],
     ['Linden Vineyards', 38.880931854248, -78.0654830932617, 3,
         'Linden Vineyards, 3708 Harrels Corner Rd, Linden VA, 22632'
     ],
     ['Gray Ghost Vineyards', 38.6777845770121, -78.0031395703554, 4,
         'Gray Ghost Viineyards, 14706 Lee Hwy, Amissville, VA 20106'
     ],
     ['Naked Mountain Winery', 38.9268762, -77.9996087, 5,
         'Naked Mountain Winery, 2747 Leeds Manor Rd., Markham, VA 22643 '
     ],
     ['Rappahanock Cellars', 38.8345291, -78.1161845, 6,
         'Rappahanock Cellars, 14437 Hume Rd, Huntly, VA 22640 '
     ],
     ['Shenandoah Vineyards', 38.8460883, -78.5607378, 7,
         'Shenandoah Vineyards, 3659 S. Ox Rd, Edinburg, VA 22824 '
     ],
     ['Barrel Oak Winery', 38.885308, -77.905710, 8,
         'Barrel Oak Winery, 3623 Grove Lane, Delaplane, VA 20144'
     ]
 ];
//Need to set error handling for google maps. I tried the onerror method on html link but didn't seem to work.
 function initMap() {
     var mapDiv = document.getElementById('map');
     vm.map = new google.maps.Map(mapDiv, {
         center: {
             lat: 38.92332,
             lng: -78.1863
         },
         zoom: 10
     });
     vm.infowindow = new google.maps.InfoWindow();
     var marker, i;
     vm.vineList().forEach(function(vine) {
         var marker = new google.maps.Marker({
             position: new google.maps.LatLng(vine.lat(),
                 vine.lng()),
             animation: google.maps.Animation.DROP,
             map: vm.map
         });
         vine.marker = marker
         console.log('what');
         google.maps.event.addListener(marker, 'click', function() {
             vm.select(vine);
         });
     });
 }
 //     Moved  toggleBounce outside initMap so  it can be accessed from vm.select(loc).  Set markers to stop after 1250ms.
 var toggleBounce = function(marker) {
     if (marker.getAnimation() !== null) {
         marker.setAnimation(null);
     } else {
         marker.setAnimation(google.maps.Animation.BOUNCE);
         setTimeout(function() {
             marker.setAnimation(null);
         }, 1250);
     }
 };
 var Vine = function(data) {
         this.name = ko.observable(data[0]),
         this.description = ko.observable(data[4]),
         this.lat = ko.observable(data[1]),
         this.lng = ko.observable(data[2]),
         this.LatLng = ko.computed(function() {
             return this.lat() + "," + this.lng();
         }, this);
 }
 var userInput = (" ");
 var ViewModel = function() {
     var self = this;
     var vines = ko.utils.arrayMap(locations, function(location) {
         return new Vine(location);
     });
     console.log(locations);
     self.vineList = ko.observableArray(vines);
     self.filter = ko.observable("");
  
     //   Function to bind to list for marker action.
     self.select = function(loc) {
             toggleBounce(loc.marker);
             vm.infowindow.setContent(loc.description());
             vm.infowindow.open(vm.map, loc.marker);
             console.log(loc.description());
         }
         //filter the list to show appropriate markers and list item. Somehow I have to fix the backspace to show markers re-appearing.
    self.filteredItems = ko.computed(function() {
         var listFilter = self.filter().toLowerCase();
         if (!listFilter) {
             return self.vineList();
             item.marker.setVisible(true);
         } else {
             if (self.vineList().length>0) {
                    return ko.utils.arrayFilter(self.vineList(), function (item) {
                        console.log(item);
                            if (item.name().toLowerCase().indexOf(listFilter) > -1 ||
                                item.description().toLowerCase().indexOf(listFilter) > -1) {
                                item.marker.setVisible(true);
                                return true;
                        } else {
                                item.marker.setVisible(false);
                                return false;
                        }
                    });
            } 
        };
               
    }, self);
     console.log(self.filteredItems);
     //reset vineList when search is empty. How?
 }; //end  old viewmodel
 var vm = new ViewModel();
 ko.applyBindings(vm);