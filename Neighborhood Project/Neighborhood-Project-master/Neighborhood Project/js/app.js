 //Neighborhood Project number 5 for Udacity Nanodegree FEND.
 
 //Location data for Google Map api and list filter.
 var locations = [
    ['Barrel Oak Winery', 38.885308, -77.905710, 1,
         'BARREL OAK WINERY, <br>3623 Grove Lane, Delaplane, VA 20144'
     ],
     ['Bluestone Vineyard', 38.386584, -79.009248, 2,
        'BLUESTONE VIINEYARD,<br> 4828 Spring Creek Rd, Bridgewater, VA 22812'
     ],
    ['Cave Ridge Vineyards', 38.8171003, -78.6726059, 3,
         'CAVE RIDGE VINEYARD,<br> 1476 Conicville Rd, Mt. Jackson, VA 22842'
     ],
     ['Desert Rose Winery', 38.8395124, -78.0824622, 4,
         'DESERT ROSE WINERY, <br>13726 Hume Rd, Hume, VA 22639'
     ],
     ['Gray Ghost Vineyards', 38.6777845770121, -78.0031395703554, 5,
         'GRAY GHOST VIINEYARDS, <br>14706 Lee Hwy, Amissville, VA 20106'
     ],
     ['Linden Vineyards', 38.880931854248, -78.0654830932617, 6,
         'LINDEN VINEYARDS, <br>3708 Harrels Corner Rd, Linden VA, 22632'
     ],
     ['Naked Mountain Winery', 38.9268762, -77.9996087, 7,
         'NAKED MOUNTAIN WINERY, <br>2747 Leeds Manor Rd., Markham, VA 22643 '
     ],
     ['Rappahanock Cellars', 38.8345291, -78.1161845, 8,
         'RAPPAHANOCK CELLARS, <br>14437 Hume Rd, Huntly, VA 22640 '
     ],
     ['Shenandoah Vineyards', 38.8460883, -78.5607378, 9,
         'SHENANDOAH VINEYARDS, <br>3659 S. Ox Rd, Edinburg, VA 22824 '
     ],
     ['Wicked Oak Farms & Vineyard', 39.077974,-78.4536407, 10,
        'WICKED OAK FARMS & VINEYARD,<br> 2121 S. Pifer Rd, Star Tannery, VA 22654',
     ]
 ];
//Initialize the map with coordinates  adding drop animation for markers when the map loads. Also sets up infowindow for marker locations.
function initMap() {
        var mapDiv = document.getElementById('map');
        vm.map = new google.maps.Map(mapDiv, {
            center: {
                lat: 38.80748,
                lng: -78.78989
            },
            zoom: 9
        });
        vm.infowindow = new google.maps.InfoWindow();
        var marker, i;
        vm.vineList().forEach(function(vine) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(vine.lat(), vine.lng()),
                animation: google.maps.Animation.DROP,
                map: vm.map
            });
            vine.marker = marker
                // click function for markers to open Wine.com API with error handling if fail.
            google.maps.event.addListener(marker, 'click', function() {
                vm.select(vine);
                //open new window for wine.com if marker is clicked.
                window.open("http://www.wine.com/v6/giftcenter/", "_blank",
                    "toolbar=yes,scrollbars=yes,resizable=yes,top=20,left=20,width=450,height=450");
                if (typeof window.open === 'undefined') {
                    alert("Unfortunately, Wine.com is currently")
                }
            });
        });
    }
    //Animation for markers after loaded on the map. Direct click or list click will animate the markers for 1250ms.
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
// Error handling for the Google Map api. This will pop up alert advising user that map is unavailable.
var googleError = function() {
    alert('Unfortunately, Google Maps is currently unavailable.')
};
// variable for string input for search parameters.
var userInput = (" ");
//Set  up knockout observables for data.
var Vine = function(data) {
        this.name = ko.observable(data[0]),
        this.description = ko.observable(data[4]),
        this.imgsrc = ko.observable(data[5])
        this.lat = ko.observable(data[1]),
        this.lng = ko.observable(data[2]),
        this.LatLng = ko.computed(function() {
            return this.lat() + "," + this.lng();
            }, this);
    }
    //ViewModel is liason between  view and model information.
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
        //List and marker filter function using the search bar with userinput.
    self.filteredItems = ko.computed(function() {
        var listFilter = self.filter().toLowerCase();
        return ko.utils.arrayFilter(self.vineList(), function(item) {
            console.log(item);
            if (item.name().toLowerCase().indexOf(listFilter) > -1 || item.description().toLowerCase().indexOf(
                listFilter) > -1) {
                if (item.marker) item.marker.setVisible(true);
                return true;
            } else {
                item.marker.setVisible(false);
                return false;
            }
        });
    }, self);
    console.log(self.filteredItems);
}; //end  old viewmodel. This helps me with bracket and paranthesis reassignment when I have to make changes internally.
var vm = new ViewModel();
ko.applyBindings(vm);