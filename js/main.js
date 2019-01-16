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
var database = firebase.database();

// most things about a user need to happen inside of one of the state change listeners
// this is how we can find out the user id 
firebase.auth().onAuthStateChanged( user => {
    if (user) { 

        // get the user ID from the auth system to start pulling user from database
        userId = user.uid 

        // this is getting the database info for the current user
        // it needs to be inside of the OnStateChange listener so that we have access to the user id.
        var userSnap = firebase.database().ref('users/' + user.uid);
        userSnap.on('value', function(snap) {

            // setup the variables about the current user to populate the Profile Page Section
            var currentPersonUsername = snap.val().username;
            var currentPersonAboutMe = snap.val().aboutMe;
            var currentPersonWorkoutCounter = snap.val().workoutCounter;
            var currentPersonProfilePicture = snap.val().profilePicture;

            // populate the profile of the current user
            $("#currentPersonUsername").text(currentPersonUsername);
            $("#currentPersonAboutMe").text(currentPersonAboutMe);
            $("#currentPersonWorkoutCounter").text(currentPersonWorkoutCounter);
            $("#currentPersonProfilePicture").attr('src', currentPersonProfilePicture);

        });

// USER REQUEST    USER REQUEST    USER REQUEST    USER REQUEST    USER REQUEST    USER REQUEST    USER REQUEST    USER REQUEST   

        var requestList = firebase.database().ref("users/" + user.uid + "/workoutRequests").orderByKey();
        requestList.once("value")
          .then(function(requestSnapshot) {
            // for each user in the list do the stuff below
            requestSnapshot.forEach(function(requestSnap) {

                // setup the user of the user for the user list
                requestId = requestSnap.key;
                console.log("This is the request ID: " + requestId);

                // display pending workout buddy requests
                // setup the variables for the user; this will be used to create the user button listing
                // this is not the current person, but the button person
                var requestUsername = requestSnap.val().requestUsername;
                var requestAboutMe = requestSnap.val().requestAboutMe;
                var requestPicture = requestSnap.val().requestPicture;
                var requestZipCode = requestSnap.val().requestZipCode;
                
                var requestsLi = $('<li/>', {
                    "id": requestId,
                    "class": "collection-item avatar",
                    "data-status": status
                });

                var spanTitle = $('<div/>', {
                    "class": "title",
                    text: requestUsername
                });

                var spanZip = $('<div/>', {
                    "class": "zipCode ultra-small",
                    text: requestZipCode
                });

                var buddyIcon = ("<img src='" + requestPicture + "' class='profilePicture circle deep-orange accent-2 responsive-img right-align' />");

                var connectButton = $('<button/>', {
                    text: "CONFIRM",
                    "id": userId,
                    "class": "approveRequest waves-effect waves-light btn",
                    "data-status": "status",
                    "data-buddyid": requestId,
                    "data-buddyname": requestUsername,
                    "data-buddypic": requestPicture,
                    "data-buddyzip": requestZipCode,
                    "data-buddyabout": requestAboutMe
                });

                $(requestsLi).append(connectButton);
                $(requestsLi).append(buddyIcon);            
                $(requestsLi).append(spanTitle);
                $(requestsLi).append(spanZip);
                // add the buttons to the list of users
                $("#buddyRequests").append(requestsLi);
            });

            // if you click on the connect button
            $(".approveRequest").on("click", function() {
                event.preventDefault();
                var approveBuddyName = $(this).attr('data-buddyname');
                var approveBuddyPic = $(this).attr('data-buddypic');
                var approveBuddyAbout = $(this).attr('data-buddyabout');
                var approveBuddyZip = $(this).attr('data-buddyzip');
                var approveBuddyId = $(this).attr('data-buddyid');
                var requestingUserId = $(this).attr('id');

                // remove the pending request
                console.log("users/" + userId + "/workoutRequests/" + approveBuddyId);
                
                firebase.database().ref().child('users/' + userId + '/workoutRequests/' + approveBuddyId).remove();

                // update the current user to include the clicked user as a workout buddy
                firebase.database().ref('users/' + requestingUserId + '/workoutBuddies/' + approveBuddyId).update ({
                    buddyName: approveBuddyName,
                    buddyPic: approveBuddyPic,
                    buddyZip: approveBuddyAbout,
                    buddyAbout: approveBuddyZip,
                    status: "connected"
                });

                // now we change the status of the requesting person for this buddy to connected
                var thisSnap = firebase.database().ref('users/' + buddyId);
                thisSnap.on('value', function(requestSnap) {
                    // update the requested Buddy to include a buddy request from the current user
                    firebase.database().ref('users/' + approveBuddyId + "/workoutBuddies/" + userId).update({
                        status: "connected"
                    });
                });

                // change the buttons to show what happened.
                $("li#" + approveBuddyId).css("display", "none");
                window.location.replace("index.html");
            });
        });

        
//  LIST OF USERS   LIST OF USERS   LIST OF USERS   LIST OF USERS   LIST OF USERS   LIST OF USERS   LIST OF USERS 

        var userList = firebase.database().ref("users").orderByKey();
        userList.once("value")
          .then(function(snapshot) {
            // for each user in the list do the stuff below
            snapshot.forEach(function(childData) {
                // setup the user of the user for the user list
                buddyId = childData.key;

                // setup the variables for the user; this will be used to create the user button listing
                // this is not the current person, but the button person
                var personUsername = childData.val().username;
                var personAboutMe = childData.val().aboutMe;
                var profilePicture = childData.val().profilePicture;
                var personZipCode = childData.val().zipCode;
                var status = childData.val().status;

                var connectedUserListLi = $('<li/>', {
                    "id": buddyId,
                    "class": "collection-item avatar",
                    "data-status": status
                });

                var spanTitle = $('<div/>', {
                    "class": "title",
                    text: personUsername
                });

                var spanZip = $('<div/>', {
                    "class": "zipCode ultra-small",
                    text: personZipCode
                });

                var buddyIcon = ("<img src='" + profilePicture + "' class='profilePicture circle deep-orange accent-2 responsive-img right-align' />");

                var connectButton = $('<button/>', {
                    text: "CONNECT",
                    "id": userId,
                    "class": "connectUser waves-effect waves-light btn",
                    "data-status": "status",
                    "data-buddyid": buddyId,
                    "data-buddyname": personUsername,
                    "data-buddypic": profilePicture,
                    "data-buddyzip": personZipCode,
                    "data-buddyabout": personAboutMe
                });

                $(connectedUserListLi).append(connectButton);
                $(connectedUserListLi).append(buddyIcon);            
                $(connectedUserListLi).append(spanTitle);
                $(connectedUserListLi).append(spanZip);      
                $("#connectedUserList").append(connectedUserListLi);

                $("li#" + userId).css("display", "none");

            });
            //  this end the for each of the users, but keeps us in the 

            // if you click on the connect button
            $(".connectUser").on("click", function() {
                event.preventDefault();
                var buddyName = $(this).attr('data-buddyname');
                var buddyPic = $(this).attr('data-buddyPic');
                var buddyAbout = $(this).attr('data-buddyAbout');
                var buddyZip = $(this).attr('data-buddyZip');
                var buddyId = $(this).attr('data-buddyid');

                // update the current user to include the clicked user as a workout buddy
                firebase.database().ref('users/' + userId + '/workoutBuddies/' + buddyId).update({
                    buddyName: buddyName,
                    buddyPic: buddyPic,
                    buddyZip: buddyAbout,
                    buddyAbout: buddyZip,
                    status: "pending"
                });

                // now we need to add a workout request to the person that was clicked on
                var thisSnap = firebase.database().ref('users/' + user.uid);
                console.log("this is person requested: " + thisSnap.key);

                thisSnap.on('value', function(requestSnap) {
                    var requestUsername = requestSnap.val().username;
                    var requestPicture = requestSnap.val().profilePicture;
                    var requestZipCode = requestSnap.val().zipCode;
                    var requestAboutMe = requestSnap.val().aboutMe;
    
                    // update the requested Buddy to include a buddy request from the current user
                    firebase.database().ref('users/' + buddyId + "/workoutRequests/" + user.uid).update({
                        requestUsername: requestUsername,
                        requestPicture: requestPicture,
                        requestZipCode: requestZipCode,
                        requestAboutMe: requestAboutMe,
                        requestId: userId,
                        status: "pending"
                    });
                });
                // change the buttons to show what happened.
                $("li#" + buddyId).css("display", "none");
                window.location.replace("index.html");
            });
        });


// BUDDY LIST   BUDDY LIST     BUDDY LIST     BUDDY LIST     BUDDY LIST     BUDDY LIST     BUDDY LIST     BUDDY LIST     BUDDY LIST  



        var myBuddyList = firebase.database().ref("users/" + user.uid + "/workoutBuddies").orderByKey();
        myBuddyList.once("value")
        .then(function(myBuddiesSnapshot) {
            // for each user in the list do the stuff below
            myBuddiesSnapshot.forEach(function(myBuddySnap) {
                buddyId = myBuddySnap.key;

                // setup the variables for the user; this will be used to create the user button listing
                // this is not the current person, but the button person
                var buddyUsername = myBuddySnap.val().buddyName;
                var buddyAboutMe = myBuddySnap.val().buddyAbout;
                var buddyPicture = myBuddySnap.val().buddyPic;
                var buddyZipCode = myBuddySnap.val().buddyZip;
                var status = myBuddySnap.val().status;
               
                var buddyListLi = $('<li/>', {
                    "id": buddyId,
                    "class": "collection-item avatar",
                    "data-status": status
                });

                var spanTitle = $('<div/>', {
                    "class": "title",
                    text: buddyUsername
                });

                var spanZip = $('<div/>', {
                    "class": "zipCode ultra-small",
                    text: buddyZipCode
                });

                var buddyIcon = ("<img src='" + buddyPicture + "' class='profilePicture circle deep-orange accent-2 responsive-img right-align' />");

                var buddyButton = $('<button/>', {
                    text: "DISCONNECT",
                    "id": buddyId,
                    "class": "endBuddy waves-effect waves-light btn",
                    "data-status": "status",
                    "data-buddyid": userId,
                    "data-buddyname": buddyUsername,
                    "data-buddypic": buddyPicture,
                    "data-buddyzip": buddyZipCode,
                    "data-buddyabout": buddyAboutMe
                });

                $(buddyListLi).append(buddyIcon);            
                $(buddyListLi).append(spanTitle);
                $(buddyListLi).append(spanZip);      
                $(buddyListLi).append(buddyButton);
                $("#myBuddies").append(buddyListLi);
            });

            $(".endBuddy").on("click", function() {
                thisId = $(this).attr('id');
                console.log("This ID: " + thisId);
                firebase.database().ref().child('users/' + userId + '/workoutBuddies/' + thisId).remove();
                window.location.replace("index.html");
            });

        });
        
// WORKOUTS AREA  WORKOUTS AREA  WORKOUTS AREA  WORKOUTS AREA  WORKOUTS AREA  WORKOUTS AREA  WORKOUTS AREA

        //  get a snapshot of all the users
        var workoutList = firebase.database().ref("workouts").orderByKey();
        workoutList.once("value")
          .then(function(snapshot) {
            // for each user in the list do the stuff below
            snapshot.forEach(function(childData) {
                // setup the user of the user for the user list
                workoutId = childData.key;

                // setup the variables for the user; this will be used to create the user button listing
                // this is not the current person, but the button person
                var workoutName = childData.val().workoutName;
                var workoutCreator = childData.val().username;
                var workoutRecommendedFitnessLevel = childData.val().recommendedFitnessLevel;
                var workoutEmail = childData.val().email;
                var workoutCategory = childData.val().category;
                var workoutAddress = childData.val().address;
                var workoutActivityDescription = childData.val().activityDescription;
                var workoutDays = "Mon, Tue, Wed"
               
                var workoutList = $('<li/>', {
                    "id": workoutId,
                    "class": "collection-item avatar"
                });

                var spanTitle = $('<div/>', {
                    "class": "title",
                    text: workoutName
                });

                var spanDays = $('<div/>', {
                    "class": "workoutDays",
                    text: workoutDays
                });

                var spanZip = $('<div/>', {
                    "class": "zipCode small",
                    text: workoutAddress
                });
                var spanEmail = $("<div/><a href='mailto:" + workoutEmail + " '", {
                    "class": "zipCode small",
                    text: workoutEmail
                });
                
                var buddyIcon = ("<img src='" + workoutCategory + "' class='profilePicture circle deep-orange accent-2 responsive-img right-align' />");

                var joinButton = $('<button/>', {
                    text: "JOIN",
                    "id": workoutId,
                    "class": "joinWorkout waves-effect waves-light btn",
                    "data-status": "status",
                    "data-workoutid": user.Id,
                    "data-workoutname": workoutName,
                    "data-workoutaddress": workoutAddress,
                    "data-workoutcategory": workoutCategory,
                    "data-workoutemail": workoutEmail,
                    "data-workoutcreator": workoutCreator,
                    "data-workoutdays": "Mon, Tue, Wed"
                });

                $(workoutList).append(joinButton);
                $(workoutList).append(buddyIcon);            
                $(workoutList).append(spanTitle);
                $(workoutList).append(spanDays);            
                $(workoutList).append(spanZip);      
                $(workoutList).append(spanEmail);      
                $("#availableWorkouts").append(workoutList);

            });
            //  this end the for each of the users, but keeps us in the 

            // if you click on the connect button
            $(".joinWorkout").on("click", function() {
                event.preventDefault();
                var workoutId = $(this).attr('id');
                var workoutName = $(this).attr('data-workoutname');
                var workoutCreator = $(this).attr('data-workoutcreator');
                var workoutEmail = $(this).attr('data-workoutEmail');
                var workoutCategory = $(this).attr('data-workoutcategory');
                var workoutAddress = $(this).attr('data-workoutaddress');
                var workoutDays = "Mon, Tue, Wed"

                // update the current user to include the clicked user as a workout buddy
                firebase.database().ref('users/' + userId + '/workouts/' + workoutId).update({
                    workoutName: workoutName,
                    workoutCreator: workoutCreator,
                    workoutEmail: workoutEmail,
                    workoutCategory: workoutCategory,
                    workoutAddress: workoutAddress,
                    workoutDays: workoutDays,
                    status: "joined"
                });

                // change the buttons to show what happened.
                $("li#" + workoutId).css("display", "none");
                window.location.replace("index.html");
            });
        });

        var myWorkoutList = firebase.database().ref("users/" + user.uid + "/workouts").orderByKey();
        myWorkoutList.once("value")
          .then(function(workoutsSnapshot) {
            // for each user in the list do the stuff below
            workoutsSnapshot.forEach(function(workoutSnap) {

                // setup the user of the user for the user list
                workoutId = workoutSnap.key;
                console.log("My workouts ID: "  + workoutId);
                // display pending workout buddy requests
                // setup the variables for the user; this will be used to create the user button listing
                // this is not the current person, but the button person
                var workoutName = workoutSnap.val().workoutName;
                var workoutCreator = workoutSnap.val().workoutCreator;
                var workoutEmail = workoutSnap.val().workoutEmail;
                var workoutAddress = workoutSnap.val().workoutAddress;
                var workoutDays = workoutSnap.val().workoutDays;

                var workoutLi = $('<li/>', {
                    "class": "collection-item"
                });

                var workoutName = $('<h5/>', {
                    "class": "title",
                    text: workoutName
                });

                var workoutDays = ("<div><h6><b>Schedule: </b></h6>" + workoutDays + "</div>");

                var workoutAddress = ("<div><h6><b>Get Diretions: </b></h6><a href='https://maps.google.com/?q=" + workoutAddress + "' target='_blank'>" + workoutAddress + "</a></div>");

                var workoutEmail = ("<hr><div><h6><b>Email Leader: </b></h6><a href='mailto:" + workoutEmail + "'>" + workoutEmail + "</a></div>");

                var endButton = $('<button/>', {
                    text: "QUIT",
                    "id": workoutId,
                    "class": "endWorkout waves-effect waves-light btn"
                });

                $(workoutLi).append(workoutName);
                $(workoutLi).append(workoutDays);
                $(workoutLi).append(workoutAddress);
                $(workoutLi).append(workoutEmail)
                $(workoutLi).append(endButton)

                // add the buttons to the list of users
                $("#myWorkouts").append(workoutLi);
            });

            $(".endWorkout").on("click", function() {
                thisId = $(this).attr('id');
                console.log("This ID: " + thisId);
                firebase.database().ref().child('users/' + userId + '/workouts/' + thisId).remove();
                window.location.replace("index.html");
            });
        });

//  WEATHER   WEATHER   WEATHER   WEATHER   WEATHER   WEATHER   WEATHER   WEATHER   WEATHER 
        
        
        var weatherSnap = firebase.database().ref('users/' + userId);
        weatherSnap.on('value', function(weatherSnap) {
            var address = weatherSnap.val().address;
            var city = weatherSnap.val().city;
            var state = weatherSnap.val().state;
            var zipCode = weatherSnap.val().zipCode;
            var geoURL = "https://api.opencagedata.com/geocode/v1/json?key=000be1b151fb4863a869b6bc420760eb&pretty=1&q=" + address + "," + city + "," + state + "," + zipCode;
            console.log("address: " + geoURL);
            //Ajax call to get the weather results using geoURL
            $.ajax({
                url: geoURL,
                method: "GET"
            }).then(function(response) {
                console.log(response);
                var lat = response.results[0].geometry.lat;
                var lon = response.results[0].geometry.lng;
                $("p.currentWeatherLocation").text(response.results[0].formatted);
                var weatherURL = "https://cors-anywhere.herokuapp.com/" + "https://api.darksky.net/forecast/7d164bcd822a2ece7033b1a27d4a6e4e/" + lat + "," + lon;
                console.log(lat);
                console.log(lon);
                //ajax call to use the response
                $.ajax({
                    url: weatherURL,
                    method: "GET"
                }).then(function(response) {
                    $("p.currentWeather").text(response.currently.summary);
                    $("p.currentForecast0").text(response.daily.data[0].summary);
                    $("p.currentForecast1").text(response.daily.data[1].summary);
                });
            });
        });
    }
    // if there is not a user then we're looking at the not logged in page area.
    // Right now if redirects to the login screen
    // this could be removed and used to display not logged in content on the homepage
    // perhaps some reason why to create an account, etc. 
    else {
        window.location.replace("login.html");
    }
});
