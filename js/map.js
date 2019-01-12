// firebase setup and config
var config = {
    apiKey: "AIzaSyD-Rni68sV7NSl1a_nRI5QtDZ-GazqCcYg",
    authDomain: "workoutbuddies-a9eb5.firebaseapp.com",
    databaseURL: "https://workoutbuddies-a9eb5.firebaseio.com",
    projectId: "workoutbuddies-a9eb5",
    storageBucket: "workoutbuddies-a9eb5.appspot.com",
    messagingSenderId: "25982813153"
};
firebase.initializeApp(config);

function initMap(user) 
    var uid = user.uid;
    console.log(uid)
    var userSnap = firebase.database().ref('users/' + userId);
        userSnap.on('value', function(snap) {

        $("#address").val(snap.val().address);

        });
    // The location of Uluru
    var uluru = { lat: 33.748997, lng: -84.387985 };
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 10, center: uluru });
    // The marker, positioned at Uluru
    //var marker = new google.maps.Marker({position: uluru, map: map});

    var geocoder = new google.maps.Geocoder();
    
    document.getElementById('submit').addEventListener('click', function () {
        geocodeAddress(user, geocoder, map);
    });

    // HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var long = Number(position.coords.longitude);
            var lati = Number(position.coords.latitude)
            var pos = {
                lat: lati,
                lng: long
            };

            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                animation: google.maps.Animation.DROP,
            });

            var infowindow = new google.maps.InfoWindow({
                content: "This is your current location"
            });

            // When you click the marker, the description will pop up
            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });

            // Centering the current location
            map.setCenter(pos);

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

};

waitForCurrentUser();

async function waitForCurrentUser() {
    await firebase.auth().onAuthStateChanged(user => {
        initMap(user)
    });
  };


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    }

// Entering an address in the search box
function geocodeAddress(user, geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);

            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });

            var infowindow = new google.maps.InfoWindow({
                content: address
            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });

        } 
        else {
            alert('Address was not successful for the following reason: ' + status);
        };
    });
}


console.log("hi max")