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
                lat: 38.7125957,
                lng: -78.1645058
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

            google.maps.event.addListener(marker, 'click', function() {
                vm.select(vine);

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

    self.vineList = ko.observableArray(vines);
    self.filter = ko.observable("");
    //   Function to bind to list for marker action.
    self.select = function(loc) {
        toggleBounce(loc.marker);
        vm.infowindow.setContent(loc.description());
        vm.infowindow.open(vm.map, loc.marker);

    }
        //List and marker filter function using the search bar with userinput.
    self.filteredItems = ko.computed(function() {
        var listFilter = self.filter().toLowerCase();
        return ko.utils.arrayFilter(self.vineList(), function(item) {
            //console.log(item);
            if (item.name().toLowerCase().indexOf(listFilter) > -1) {
                if (item.marker) item.marker.setVisible(true);
                return true;
            } else {
                item.marker.setVisible(false);
                return false;
            }
        });
    }, self);
    //console.log(self.filteredItems);

}; //end  old viewmodel. This helps me with bracket and paranthesis reassignment when I have to make changes internally.
var vm = new ViewModel();
ko.applyBindings(vm);

//Yelp function - Hard time trying to find code that works. This code was actually posted  on Forum with the JSFiddle adaptation.
     function nonceGenerate() {
            return (Math.floor(Math.random() * 1e12).toString());
};

  var yelp_url = 'https://api.yelp.com/v2/search';
  
  var parameters = {
    oauth_consumer_key: '80_FbewR0VsirtcxmFlukg',
    oauth_token: 'H1e0dZKyT2b4wym4hMsOB4l1jMG8iv6j',
    oauth_nonce: nonceGenerate(),
    oauth_timestamp: Math.floor(Date.now()/1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    callback: 'cb',            // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    term: 'vineyard',
    location: '22630'
  };
    var consumer_secret = 'j6Nk24lg6lfX2NeTjVV2bBzAKj8',
      token_secret = 'hDBRHUfKhJB3QwAYOqdhLekw2gI';

  var encodedSignature= oauthSignature.generate('GET', yelp_url, parameters, consumer_secret, token_secret);
    parameters.oauth_signature = encodedSignature;

  var settings = {
    url: yelp_url,
    data: parameters,
    cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
    dataType: 'jsonp',
    jsonpCallback: 'cb',
    success: function(results) {
      // Do stuff with results
      console.log("SUCCESS!%o", results);
    },
    error:function(error) {
      alert ("Unfortunately, Yelp is unavailable. Please try again later.")
      console.log(error);
    }
  };
// Send AJAX query via jQuery library.
$.ajax(settings);