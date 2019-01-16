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

// The location of Uluru
var uluru = { lat: 33.748997, lng: -84.387985 };
// The map, centered at Uluru
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: uluru,
    zoom: 9
    });

    var workoutList = firebase.database().ref("workouts").orderByKey();
    workoutList.once("value").then(function(snapshot) {
        // for each user in the list do the stuff below
        snapshot.forEach(function(childData) {
            // setup the user of the user for the user list
            workoutId = childData.key;
            var workoutAddress = childData.val().address;
            var workoutName = childData.val().workoutName;
            var workoutDescription = childData.val().activityDescription;
            var workoutCategory = childData.val().category;
            var workoutLevel = childData.val().recommendedFitnessLevel;

            console.log("workoutAddress line 30 : " + workoutAddress);

            var geocoder = new google.maps.Geocoder();

            geocodeAddress(geocoder, map);

            function geocodeAddress(geocoder, resultsMap) {
                geocoder.geocode({ 'address': workoutAddress }, function (results, status) {
                    if (status === 'OK') {
                        resultsMap.setCenter(results[0].geometry.location);
                        console.log("in geocode: " + resultsMap);
                        var marker = new google.maps.Marker({
                            map: resultsMap,
                            position: results[0].geometry.location
                        });

                        var contentString = "<b>Name: </b>" + workoutName + "<br><b>Description: </b>" + workoutDescription + "<br><b>Category: </b>" + workoutCategory + "<br><b>Level: </b>" + workoutLevel + "<br><b>Address: </b>" + workoutAddress

                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
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


        });
    });
};