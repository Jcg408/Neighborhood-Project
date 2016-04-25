 /* Neighborhood Project number 5 for Udacity Nanodegree FEND.
Shenandoah Valley of Virginia.
Updated 4/23/2016. Jessica Gladstone */

 /* I had a lot of help with this project . Special thanks to Heidi Kasemir who guided me through the code integration as well as my sanity.
    I couln't have done this without her unwavering support. Karol David was a great sounding board and helped me as I struggled through my attempt at YELP API
    (which was abandoned after weeks of frustration).  Outside professional help from Jimmy Sambuo and Rich Paulson were also greatly appreciated.
    They would look at my project and encourage  me to look at different perspectives. Of course the usual online resources of Google Developer, Stackoverflow,
    W3Schools, MDN Javascript Guide,  CSS Tricks, Knockout Documentation, Bytespider API reference and Github studend repos for inspiration. */

 var locations = [
     ['Shenandoah National Park', 38.36485, -78.57556, 1,
         'SHENANDOAH NATIONAL PARK <br> The park is best known for Skyline Drive which runs the entire length of the park along the ridge of the mountains.'
     ],
     ['Douthat State Park', 37.89767, -79.80236, 2,
         'DOUTHAT STATE PARK<br> One of the original six state parks of Virginia.It has become a premier mountain biking destination.'
     ],
     ['New Market State Historical Park', 38.6621302, -78.6728907, 3,
         'NEW MARKET STATE HISTORICAL PARK <br> A historic American Civil War battlefield and national historic district.'
     ],
     ['Fincastle Historic District', 38.8490592, -78.3095914, 4,
         'FINCASTLE HISTORIC DISTRICT <br> A virtual museum of architectural history dating from the mid to late 1770s.'
     ],
     ['Luray Caverns', 38.6639791, -78.4861003, 5,
         'LURAY CAVERNS <br> The largest stalagmite & stalactite series of caverns in the East which has drawn many visitors since its discovery in 1878. '
     ],
     ['George Washington National Forest', 38.1117372, -79.6523992, 6,
         'GEORGE WASHINGTON NATIONAL FOREST <br> George Washington National Forest was established on May 16, 1918  as the Shenandoah National Forest.'
     ],
     ['Belle Grove Plantation', 39.0206861, -78.3061767, 7,
         'BELLE GROVE PLANTATION <br>  The headquarters of General Philip Sheridan during the Battle of Cedar Creek in 1864.'
     ],
     ['Woodrow Wilson Presidential Library', 38.1500536, -79.0709651, 8,
         'WOODROW WILSON PRESIDENTIAL LIBRARY & MUSEUM <br> The library is located at the birthplace of President Woodrow Wilson.'
     ],
     ['Smithsonian Conservation Biology Institute', 38.88773, -78.16898, 9,
         'SMITHSONIAN CONSERVATION BIOLOGY INSTITUTE <br> An extension of the National Zoo specializing in veterinary medicine, reproductive physiology and conservation biology.'
     ],
     ['Grand Caverns', 38.2593612670898, -78.8345413208008, 10,
         'GRAND CAVERNS<br> During the Civil War and the Valley Campaign, the cave was visited by both Confederate and Union soldiers.'
     ]
 ];

 //Initialize the map with coordinates  adding drop animation for markers when the map loads. Also sets up infowindow location and size.
 function initMap() {
     var mapDiv = document.getElementById('map');
     vm.map = new google.maps.Map(mapDiv, {
         center: {
             lat: 38.42516,
             lng: -79.82499
         },
         zoom: 8
     });

     vm.infowindow = new google.maps.InfoWindow({
         maxWidth: 160
      
     });
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
             google.maps.event.addDomListener(window, "resize", function() {
                 var center = map.getCenter();
                 google.maps.event.trigger(map, "resize");
                 map.setCenter(center);
             });

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

/* JQUERY AJAX  function for Wikipedia API. After much research online for clear and simple Wikipedia AJAX code, I found this code on StackOverflow and
modified it to suit my application. */

// Set up variables to access Wikipedia data.
 function loadData() {
     var $body = $('body');
     var $wikiElem = $('#wikipedia-links');
     $wikiElem.text("");
     var locStr = $('#site').val();

     // Parameters for request to search data on Media Wiki action API. Return results in JSON format with a limit of 5 articles.
     var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + locStr + '&limit=5&format=json&callback=wikiCallback';
     var wikiRequestTimeout = setTimeout(function() {
         $wikiElem.text("Unfortunately, Wikipedia is unavailable. Please try again later.");
     }, 5000);
//AJAX call to API. Show resulting list as a link to Wikipedia site.
     $.ajax({
         url: wikiUrl,
         dataType: "jsonp",
         jsonp: "callback",
         success: function(response) {
             var articleList = response[1];

             for (var i = 0; i < articleList.length; i++) {
                 articleStr = articleList[i];
                 var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                 $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
             };

             clearTimeout(wikiRequestTimeout);
         }
     });
     return false;
 };

 $('#form-container').submit(loadData);