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

// The map
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    // center: uluru,
    zoom: 4
    });
    
    infoWindow = new google.maps.InfoWindow;
    
    // user's current location if they allow
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent('Current Location');
          infoWindow.open(map);
          map.setZoom(9);
          map.setCenter(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
    }
    // if they block it will go to their profile location
    else {
        handleLocationError(false, map.getCenter());
      }

      function handleLocationError() {
        firebase.auth().onAuthStateChanged( user => {
            if (user) { 
        
                // get the user ID from the auth system to start pulling user from database
                userId = user.uid 
        
                // this is getting the database info for the current user
                var userSnap = firebase.database().ref('users/' + user.uid);
                userSnap.on('value', function(snap) {
        
                    // setup the variable of the address concatenated
                    var profileLocation = snap.val().address + " " + snap.val().city + ", " + snap.val().state;
                    
                    // geocode the address
                    var geocoder = new google.maps.Geocoder();
                    geocodeAddress(geocoder, map);
                    
                    function geocodeAddress(geocoder, resultsMap) {
                    geocoder.geocode({ 'address': profileLocation }, function (results, status) {
                    if (status === 'OK') {
                        resultsMap.setCenter(results[0].geometry.location);
                        map.setZoom(9);
                        infoWindow.setPosition(results[0].geometry.location);
                        infoWindow.setContent('Profile Location');
                        infoWindow.open(map);
                    }
                })
            };
                })
            }
            else {
                window.location.replace("login.html");
            }
        })
    };

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
            var workoutDay1 = childData.val().scheduledDayOne;
            var workoutDay2 = childData.val().scheduledDayTwo;
            var workoutTime1 = childData.val().dayOneTime;
            var workoutTime2 = childData.val().dayTwoTime;
            var workoutCreator = childData.val().username;
            var creatorEmail = childData.val().email;

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

                        // var contentString = "<b>Name: </b>" + workoutName + "<br><b>Description: </b>" + 
                        // workoutDescription + "<br><b>Day/Time: </b>" + workoutDay1 + " " + workoutTime1 + " " + 
                        // workoutDay2 + " " + workoutTime2 + "<br><b>Category: </b>" + workoutCategory + 
                        // "<br><b>Level: </b>" + workoutLevel + "<br><b>Address: </b>" + workoutAddress

                        var contentString;

                        if (workoutDay1 === "" && workoutTime1 === "" && 
                        workoutDay2 === "" && workoutTime2 === "") {
                            contentString = "<b>Name: </b>" + workoutName + "<br><b>Description: </b>" + 
                            workoutDescription + 
                            "<br><b>Category: </b>" + workoutCategory + 
                            "<br><b>Level: </b>" + workoutLevel + "<br><b>Location: </b>" + workoutAddress +
                            "<br><b>Creator: </b>" + workoutCreator + " <a href=mailto:" + 
                            creatorEmail + "><i class='fas fa-envelope'></i></a>"
                        }
                        else if (workoutDay1 === "" && workoutTime1 === "") {
                            contentString = "<b>Name: </b>" + workoutName + "<br><b>Description: </b>" + 
                            workoutDescription + "<br><b>Day/Time: </b>" + workoutDay2 + " at " + workoutTime2 + 
                            "<br><b>Category: </b>" + workoutCategory + 
                            "<br><b>Level: </b>" + workoutLevel + "<br><b>Location: </b>" + workoutAddress + 
                            "<br><b>Creator: </b>" + workoutCreator + " <a href=mailto:" + 
                            creatorEmail + "><i class='fas fa-envelope'></i></a>"
                        }
                        else if (workoutDay2 === "" && workoutTime2 === "") {
                            contentString = "<b>Name: </b>" + workoutName + "<br><b>Description: </b>" + 
                            workoutDescription + "<br><b>Day/Time: </b>" + workoutDay1 + " at " + workoutTime1 + 
                            "<br><b>Category: </b>" + workoutCategory + 
                            "<br><b>Level: </b>" + workoutLevel + "<br><b>Location: </b>" + workoutAddress +
                            "<br><b>Creator: </b>" + workoutCreator + " <a href=mailto:" + 
                            creatorEmail + "><i class='fas fa-envelope'></i></a>"
                        }
                        else { 
                            contentString = "<b>Name: </b>" + workoutName + "<br><b>Description: </b>" + 
                            workoutDescription + "<br><b>Day/Time: </b>" + workoutDay1 + " at " + workoutTime1 + 
                            " and " + 
                            workoutDay2 + " at " + workoutTime2 + "<br><b>Category: </b>" + workoutCategory + 
                            "<br><b>Level: </b>" + workoutLevel + "<br><b>Location: </b>" + workoutAddress +
                            "<br><b>Creator: </b>" + workoutCreator + " <a href=mailto:" + 
                            creatorEmail + "><i class='fas fa-envelope'></i></a>"
                        }

                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });

                        marker.addListener('mouseover', function () {
                            infowindow.open(map, marker);
                        });

                        marker.addListener('mouseout', function() {
                            infowindow.close();
                        });
                    } 
                    // else {
                    //     alert('Address was not successful for the following reason: ' + status);
                    // };
                });
            }


        });
    });
};