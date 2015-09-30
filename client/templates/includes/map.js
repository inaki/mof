///////////////////////////////////////////////////////////////////////////////
// Map display

Template.map.created = function() {
  Markets.find({}).observe({
    added: function(market) {
      var marker = new L.Marker(market.latlng, {
        _id: market._id,
        icon: createIcon(market)
      }).on('click', function(e) {
        Session.set("selected", e.target.options._id);
      });
      addMarker(marker);
    },
    changed: function(market) {
      var marker = markers[market._id];
      if (marker) marker.setIcon(createIcon(market));
    },
    removed: function(market) {
      removeMarker(market._id);
    }
  });
}

Template.map.rendered = function () {
  // basic housekeeping
  $(window).resize(function () {
    var h = $(window).height(), offsetTop = 90; // Calculate the top offset
    $('#map_canvas').css('height', (h - offsetTop));
  }).resize();

  // initialize map events
  if (!map) {
    initialize($("#map_canvas")[0], [ 38.58038, -121.5305 ], 13);

    map.on("dblclick", function(e) {
      if (! Meteor.userId()) // must be logged in to create parties
        return;

      openCreateDialog(e.latlng);
    });

    var self = this;
    Meteor.autorun(function() {
      var selectedParty = Markets.findOne(Session.get("selected"));
      if (selectedParty) {
        if (!self.animatedMarker) {
          var line = L.polyline([[selectedParty.latlng.lat, selectedParty.latlng.lng]]);
          self.animatedMarker = L.animatedMarker(line.getLatLngs(), {
            autoStart: false,
            distance: 3000,  // meters
            interval: 200, // milliseconds
            icon: L.divIcon({
              iconSize: [50, 50],
              className: 'leaflet-animated-div-icon'
            })
          });
          map.addLayer(self.animatedMarker);
        } else {
          // animate to here
          var line = L.polyline([[self.animatedMarker.getLatLng().lat, self.animatedMarker.getLatLng().lng],
            [selectedParty.latlng.lat, selectedParty.latlng.lng]]);
          self.animatedMarker.setLine(line.getLatLngs());
          self.animatedMarker.start();
        }
      }
    })
  }
}

var map, markers = [ ];



var initialize = function(element, centroid, zoom, features) {
  map = L.map(element, {
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false
  }).setView(new L.LatLng(centroid[0], centroid[1]), zoom);

  L.tileLayer('http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png').addTo(map);

  map.attributionControl.setPrefix('');

	var attribution = new L.Control.Attribution();
  attribution.addAttribution("Geocoding data &copy; 2013 <a href='http://open.mapquestapi.com'>MapQuest, Inc.</a>");
  attribution.addAttribution("Map tiles by <a href='http://stamen.com'>Stamen Design</a> under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>.");
  attribution.addAttribution("Data by <a href='http://openstreetmap.org'>OpenStreetMap</a> under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.");

  map.addControl(attribution);
}

var addMarker = function(marker) {
  map.addLayer(marker);
  markers[marker.options._id] = marker;
}

var removeMarker = function(_id) {
  var marker = markers[_id];
  if (map.hasLayer(marker)) map.removeLayer(marker);
}

var createIcon = function(market) {
  var className = 'leaflet-div-icon ';
  className += market.public ? 'public' : 'private';
  return L.divIcon({
    iconSize: [30, 30],
    html: '<b>' + attending(market) + '</b>',
    className: className
  });
}

var openCreateDialog = function (latlng) {
  Session.set("createCoords", latlng);
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};
