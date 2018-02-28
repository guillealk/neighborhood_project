var Location = function(data) {
    this.title = data.title;
    this.location = data.location;
  };

var ViewModel = function() {
    var self = this;

    self.locationsList = ko.observableArray([]);

    locations.forEach(function(location) {
        self.locationsList.push(new Location(location));
    });

    self.mapError = ko.observable(false);

    self.filter = ko.observable("");
    self.filteredLocations = ko.computed(function() {
        var filterResult = self.filter().toLowerCase();
        if (!filterResult) {
            for (var i = 0; i < self.locationsList().length; i++) {
                //Theirst time there are no markers yet,therefore checking
                // whether they defined, if yes set them visible so we are back to
                //square one
                if (self.locationsList()[i].marker) {
                    self.locationsList()[i].marker.setVisible(true);
                }
            }

            return self.locationsList();
        } else {
            return ko.utils.arrayFilter(self.locationsList(), function(location) {
                // test to see if item matches filter and store results as a variable
                var match = location.title.toLowerCase().indexOf(filterResult) >= 0;
                // set marker visibility based on match status
                if (location.marker) {
                    location.marker.setVisible(match);
                }
                // return match status to item in list view if match
                return match;
            });
        }
    }, self);

    self.clearFilter = function() {
        self.filter("");

        for (var i = 0; i < self.locationsList().length; i++) {
            //get all the markers back
            self.locationsList()[i].marker.setVisible(true);
        }
    };

    self.currentLocation = ko.observableArray([this.locationsList()[0]]);

    this.selectLocation = function(clickedLocation) {
        //sets the current location to selected element from the list view
        self.currentLocation(clickedLocation);
        animateUponClick(clickedLocation.marker);
        //populating the info window by clicked marker from list
        populateInfoWindow(clickedLocation.marker, infoWindow);
    };

    //Observable for Menu Button
    self.visibleMenu = ko.observable(false),
    //Showing or hiding the menu
    self.clickMe = function() {
        this.visibleMenu(!this.visibleMenu());
    };
};

  var viewModel = new ViewModel();
  ko.applyBindings(viewModel);