 //My Note:
 //I am trying very hard to work through this. Unfortunately, I missed the March 7 deadline on this project. I have never missed a deadline 
 //before but this is really, really hard. Blank canvases are always impossible to get my head around. Anyway - as of today(3/20/16) I have all functionality 
 //except filtering the markers with the list. I have seen probably 20-25 ways to get this done. However, none pertain exactly to how I have started. I know
 //I need to use item.marker.setVisible but how? Where? I have tried many different ways with no luck.
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
     self.search = ko.observable("");
     //   Function to bind to list for marker action.
     self.select = function(loc) {
             toggleBounce(loc.marker);
             vm.infowindow.setContent(loc.description());
             vm.infowindow.open(vm.map, loc.marker);
             console.log(loc.description());
         }
         // Need to set markers to filter with list. I know I have to use item.marker and setVisible but clueless as to where or how. I have tried a for (var i=0......) loop, 
         // I have tried  if (item.name=== stringStartsWith), (item.name != stringStartsWith)... I have placed the item.marker.setVisible inside the filteredItems function, inside
         // the arrayFilter(self.vineList) function, inside the var stringStartsWith function.
         // The one thing I am sure of is that item refers to the vine array.
     self.filteredItems = ko.computed(function() {
         var listFilter = self.filter().toLowerCase();
         if (!listFilter) {
             return self.vineList();
         } else {
             return ko.utils.arrayFilter(self.vineList(), function(
                 item) {
                 var stringStartsWith = function(string,
                     startsWith) {
                     string = string || "";
                     if (startsWith.length > string.length)
                         return false;
                     return string.substring(0,
                             startsWith.length) ===
                         startsWith;
                 };
                 return stringStartsWith(item.name().toLowerCase(),
                     listFilter);
             });
         }
     }, self);
     console.log(self.filteredItems);
 }; //end  old viewmodel
 var vm = new ViewModel();
 ko.applyBindings(vm);