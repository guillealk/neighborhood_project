var  map;
var  infoWindow;

var  locations = [
  {
    title: "Shopping Paris",
    location: {
      lat:-25.5132013,
      lng:-54.6084398
    },
    url: "https://www.shoppingparis.com.py/"
  },  {
    title: "Itaipu Dam",
    location: {
      lat: -25.4080661,
      lng: -54.5914064
    },
    url: "https://www.itaipu.gov.py/en"
  }, {
    title: "Iguazu Fall",
    location: {
      lat: -25.695259,
      lng: -54.4388602
    },
    url: "https://iguazufalls.com/national-park/"
  }, {
    title: "Monday Fall",
    location: {
      lat: -25.5615052,
      lng: -54.6357983
    },
    url: "http://www.bienvenidoaparaguay.com/showdata.php?xmlcity=200&xmldestino=83"
  }, {
    title: "Republic Lake",
    location: {
      lat: -25.5155602,
      lng: -54.6229732
    },
    url:"http://www.bienvenidoaparaguay.com/showdata.php?xmlcity=187&xmldestino=79"
  }, {
    title: "Monalisa Store",
    location: {
      lat: -25.509863,
      lng: -54.612589
    },
    url:"https://www.monalisa.com.py/"
  }, {
    title: "Acaray Dam",
    location: {
      lat: -25.4589255,
      lng: -54.630195
    },
    url:"https://en.wikipedia.org/wiki/Acaray_Dam"
  }, {
    title: "Moises Bertoni Park",
    location: {
      lat: -25.6433279,
      lng: -54.5979819
    },
    url:"http://nationalparksofparaguay.blogspot.com/2013/08/on-banks-of-parana-river-one-finds.html"
  }, {
    title: "Jesuitas Plaza Shopping",
    location: {
      lat: -25.4977297,
      lng: -54.6811623
    },
    url: "http://jesuitasplaza.com/"
  },  {
    title: "Catedral San Blas",
    location: {
      lat: -25.5178505,
      lng: -54.6099758
    },
    url: ""
  }, {
    title: "Hernandarias Coast Park",
    location: {
      lat: -25.3935296,
      lng: -54.6385556
    },
    url: "https://cti.itaipu.gov.py/en/node/340"
  }, {
    title: "Tati Jupi Park",
    location: {
      lat: -25.3665272,
      lng: -54.5819735
    },
    url: "https://cti.itaipu.gov.py/en/node/18"
  }, {
    title: "Guaraní International Airport",
    location: {
      lat: -25.4555,
      lng: -54.843592
    },
    url:""
  }
];

/********************************************
* This function initialize the Google map   *
*********************************************/
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: -25.4933275,
      lng: -54.7410842
    },
    zoom: 13,
    mapTypeControl: false,
  });

  var largeInfowindow = new google.maps.InfoWindow();
  infoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

   // Style the markers a bit. This will be our listing marker icon.
   var defaultIcon = makeMarkerIcon("32CD32");

   // Create a "highlighted location" marker color for when the user
   // mouses over the marker.
   var highlightedIcon = makeMarkerIcon("4682B4");

   // The following group uses the location array to create an
  // array of markers on initialize.
  for (var  i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    // Get the title of the position
    var title = locations[i].title;
    var url = locations[i].url;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({ map: map,
                                          position: position,
                                          title: title,
                                          url: url,
                                          animation: google.maps.Animation.DROP,
                                          icon: defaultIcon,
                                          id:i
                                        });
    //Marker gets to be visible by default
    marker.setVisible(true);
    // markers.push(marker);
    viewModel.locationsList()[i].marker = marker;
    // Create an onclick event to open the large infowindow
    // at each marker and change the animation
    bounds.extend(marker.position);

    // event listener for show the infoWindow
    marker.addListener("click", function() {
        populateInfoWindow(this, infoWindow);
        animateUponClick(this);
    });

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener("mouseover", function() {
        this.setIcon(highlightedIcon);
    });

    marker.addListener("mouseout", function() {
        this.setIcon(defaultIcon);
    });

  }
  map.fitBounds(bounds);
} // end InitMap

/*********************************************************************
* This function takes in a COLOR, and then creates a new marker      *
* icon of that color. The icon will be 21 px wide by 34 high, have   *
* an origin of 0, 0 and be anchored at 10, 34).                      *
**********************************************************************/
function makeMarkerIcon(markerColor) {
var markerImage = new google.maps.MarkerImage(
    "http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|"+ markerColor +
    "|40|_|%E2%80%A2",
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
return markerImage;
}

/*********************************************************************
* Adds two bounces after clicking a specific position.               *
**********************************************************************/
function animateUponClick(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
  }, 1460);
}

/*********************************************************************
* This function populates the infowindow when the marker is clicked. *
* We"ll only allow one infowindow which will open at the marker that *
* is clicked, and populate based on that markers position.           *
* Sample used and modified from the Udacity lectures                 *
**********************************************************************/
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent("");
      infowindow.marker = marker;

      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener("closeclick", function() {
          infowindow.marker = null;
        });

        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        var street = "";
        var city = "";
        var phone = "";
        var windowContent = "<div>" + "<h3>" + marker.title + "</h3>";

         //Foursquare credentials
        var clientID = "MQQPOD3SZLDOT5QGPGVQDYSJ1BKXHB0JHIYWMEOW0XXS1KGT";
        var clientSecret = "21JQGEKBZYJZ4GPOFYE1DI4HCVCKFTQ0B5OISGQTPYSYC54W";

        // get JSON request of foursquare data
        var reqURL = "https://api.foursquare.com/v2/venues/search?ll=" +
                     marker.getPosition().lat() + "," +
                     marker.getPosition().lng() + "&client_id=" + clientID +
                     "&client_secret=" + clientSecret + "&v=20180118"
                     + "&query=" + marker.title;

        $.getJSON(reqURL).done(function(data) {
            var results = data.response.venues[0];
            street = results.location.formattedAddress[0] ? results.location.formattedAddress[0]: "N/A";
            city = results.location.formattedAddress[1] ? results.location.formattedAddress[1]: "N/A";
            phone = results.contact.formattedPhone ? results.contact.formattedPhone : "N/A";
            windowContent = windowContent +
                            "<p>" + street + "<br>" + city + "<br>" + phone + "</p>";
        }).fail(function() {
        alert("Something went wrong with foursquare");
        });

        windowContent = windowContent +
                        "<a href ='" + marker.url + "'>" + marker.url + "</a>";

    /*********************************************************************
    * In case the status is OK, which means the pano was  found, compute *
    * the position of the streetview image, then calculate the heading,  *
    * then get a panorama from that and set the options                  *
    **********************************************************************/
    function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation,
                                                                      marker.position);
          var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                  heading: heading,
                  pitch: 30
                }
            };
            var panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"),
            panoramaOptions);
        }else{
            infowindow.setContent(windowContent + "<div style='color: red'>No Street View Found</div>");
        }
    }

    /*********************************************************************
    * Wikipedia API Ajax request - sampled from udacity lecture, need    *
    * to add additional msg if there are no relevant wiki links to       *
    * selected place.                                                    *
    **********************************************************************/
    var  wikiURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" +
                   marker.title + "&format=json&callback=wikiCallback";
    $.ajax(wikiURL,{
        dataType: "jsonp",
        data: {
            async: true
        }
    }).done(function(response) {
        var  articleStr = response[1];
        var  url = "http://en.wikipedia.org/wiki/" + articleStr;

        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        var contentString = windowContent + "<hr><div id='pano'></div>" +
                            "</div><br><a href = "+ url + ">" + url + "</a>";

        infowindow.setContent(contentString);

                              // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }).fail(function(jqXHR, textStatus) {
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        var contentString = windowContent +
                            "</div><br><p>Sorry. We could not contact "
                            + "Wikipedia! </p><hr><div id='pano'></div>";

        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });

  }

} //end populateInfoWindow

//Handle map error
var googleError = function() {
    viewModel.mapError(true);
};