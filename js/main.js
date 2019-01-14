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

                console.log("This is inside the snap: " + requestUsername);
                // create a connect/disconnect button for each user
                var requestsLi = "<li id='"
                + requestId 
                + "' class='collection-item avatar'><img src='" 
                + requestPicture
                + "' class='requestPicture circle deep-orange accent-2 responsive-img'><span class='title'>" 
                + requestUsername + "</span><br><span class='zipCode ultra-small'>" 
                + requestZipCode + "</span><br><button id='" 
                + requestId + "approveRequest' class='approveRequest waves-effect waves-light btn' data-buddyid='" 
                + requestId + "' data-buddyname='" 
                + requestUsername + "' data-buddypic='" 
                + requestPicture + "' data-buddyzip='" 
                + requestZipCode + "' data-buddyabout='" 
                + requestAboutMe + "'>APPROVE</button>";
                                
                // add the buttons to the list of users
                $("#buddyRequests").append(requestsLi);

            });

            // if you click on the connect button
            $(".approveRequest").on("click", function() {
                var approveBuddyName = $(this).attr('data-buddyname');
                var approveBuddyPic = $(this).attr('data-buddypic');
                var approveBuddyAbout = $(this).attr('data-buddyabout');
                var approveBuddyZip = $(this).attr('data-buddyzip');
                var approveBuddyId = $(this).attr('data-buddyid');
                
                console.log(approveBuddyId);

                // update the current user to include the clicked user as a workout buddy
                firebase.database().ref('users/' + userId + '/workoutBuddies/' + approveBuddyId).update ({
                    buddyName: approveBuddyName,
                    buddyPic: approveBuddyPic,
                    buddyZip: approveBuddyAbout,
                    buddyAbout: approveBuddyZip
                });
            
                // update the current user to include the clicked user as a workout buddy
                firebase.database().ref('users/' + userId + '/workoutRequests/' + approveBuddyId).remove();
                location.reload();
            });


        });

        
        //  get a snapshot of all the users
        var userList = firebase.database().ref("users").orderByKey();
        userList.once("value")
          .then(function(snapshot) {
            // for each user in the list do the stuff below
            snapshot.forEach(function(childData) {
                // setup the user of the user for the user list
                buddyId = childData.key;

                console.log("this is the User Id of the person clicking: " + buddyId);
                console.log("this is the id of the person request: " + userId);
    
                // setup the variables for the user; this will be used to create the user button listing
                // this is not the current person, but the button person
                var personUsername = childData.val().username;
                var personAboutMe = childData.val().aboutMe;
                var profilePicture = childData.val().profilePicture;
                var personZipCode = childData.val().zipCode;
    
                // create a connect/disconnect button for each user
                var connectedUserListLi = "<li id='userID" 
                + userId 
                + "' class='collection-item avatar'><img src='" 
                + profilePicture 
                + "' class='profilePicture circle deep-orange accent-2 responsive-img'><span class='title'>" 
                + personUsername + "</span><br><span class='zipCode ultra-small'>" 
                + personZipCode + "</span><br><button id='" 
                + userId + "connectUser' class='connectUser waves-effect waves-light btn' data-buddyid='" 
                + buddyId + "' data-buddyname='" 
                + personUsername + "' data-buddypic='" 
                + profilePicture + "' data-buddyzip='" 
                + personZipCode + "' data-buddyabout='" 
                + personAboutMe + "'>CONNECT</button><button id='" 
                + userId + "' class='disconnectUser waves-effect waves-light btn' data-buddyid='" 
                + buddyId + "' data-buddyname='"
                + personUsername + "' data-buddyzip='" 
                + personZipCode + "' data-buddyabout='" 
                + personAboutMe + "'>DISCONNECT</button></p></li>";

                // add the buttons to the list of users
                $("#connectedUserList").append(connectedUserListLi);
                // don't display the current user in the list of other users
                $("#userID" + user.uid).hide();
            });
            //  this end the for each of the users, but keeps us in the 


            // if you click on the connect button
            $(".connectUser").on("click", function() {
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
                    buddyAbout: buddyZip
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
                        requestId: userId
                    });
                });

                // change the buttons to show what happened.
                $("button#" + buddyId + "connectUser").css("display", "none");
                $("button#" + buddyId + "disconnectUser").css("display", "block");

                alert("You and " + buddyName + " are now connected.")
                location.reload();
            });

            
            $(".disconnectUser").on("click", function() {
                var buddyName = $(this).attr('data-buddyname');
                var buddyId = $(this).attr('data-userId');

                $("button#" + buddyId + "disconnectUser").css("display", "none");
                $("button#" + buddyId + "connectUser").css("display", "block");

                // update the user to include the clicked user as a workout buddy
                firebase.database().ref('users/' + user.uid + '/workoutBuddies/' + $(this).attr('data-userId')).remove();


                alert("You and " + buddyName + " are disconnected.")
                location.reload();
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
