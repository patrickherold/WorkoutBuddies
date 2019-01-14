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
        this.userId = user.uid 

        // create or update the user in the database using info from Auth.
        firebase.database().ref('users/' + this.userId).update({
            username: user.displayName,
            email: user.email
        });
        
        // this is getting the database info for the current user
        // it needs to be inside of the OnStateChange listener so that we have access to the user id.
        var userSnap = firebase.database().ref('users/' + user.uid);

        // this is creating a snapshot of the current user
        userSnap.on('value', function(snap) {

            var currentPersonUsername = snap.val().username;
            var currentPersonAboutMe = snap.val().aboutMe;
            var currentPersonWorkoutCounter = snap.val().workoutCounter;
            var currentPersonProfilePicture = snap.val().profilePicture;
            var currentPersonZipCode = snap.val().zipCode;


            $("#currentPersonUsername").text(currentPersonUsername);
            $("#currentPersonAboutMe").text(currentPersonAboutMe);
            $("#currentPersonWorkoutCounter").text(currentPersonWorkoutCounter);
            $("#currentPersonProfilePicture").attr('src', currentPersonProfilePicture);

            // this spits out an arrary of the data from the database. (as opposed to the auth() which has much less info)
            // you could replace this section with jquery to populate page content or grab values for API calls. 

            document.getElementById('accountDetails').textContent = JSON.stringify({
                displayName: snap.val().username,
                email: snap.val().email,
                address: snap.val().address,
                city: snap.val().city,
                state: snap.val().state,
                zipCode: snap.val().zipCode,
                photoURL: snap.val().profilePicture,
                aboutMe: snap.val().aboutMe,
                uid: snap.val().userId
            }, null, '  ')


        });


        var userList = firebase.database().ref("users").orderByKey();
        userList.once("value")
          .then(function(snapshot) {
            snapshot.forEach(function(childData) {
                userId = childData.key;
    
                var personUsername = childData.val().username;
                var personAboutMe = childData.val().aboutMe;
                var personWorkoutCounter = childData.val().workoutCounter || "0";
                var profilePicture = childData.val().profilePicture;
                var personZipCode = childData.val().zipCode;
    
                $("#personUsername").text(personUsername);
                $("#personAboutMe").text(personAboutMe);
                $("#personWorkoutCounter").text(personWorkoutCounter);
    
                var userListLi = "<li id='userID" + userId + "' class='collection-item avatar'><img src='" + profilePicture + "' class='profilePicture circle deep-orange accent-2 responsive-img'><span class='title'>" + personUsername + "</span><br><span class='userZipCode ultra-small'>" + personZipCode + "</span><br><button id='" + userId + "' class='connectUser' data-userId='" + userId + "disconnect' data-buddyname='" + personUsername + "' data-buddyPic='" + profilePicture + "' data-buddyZip='" + personZipCode + "' data-buddyAbout='" + personAboutMe + "'>CONNECT</button><button id='" + userId + "connect' class='disconnectUser' data-userId='" + userId + "' data-buddyname='" + personUsername + "'>DISCONNECT</button></p></li>";
    
                $("#userList").append(userListLi);
                $("#userID" + user.uid).hide();
    
          });
            
            $(".connectUser").on("click", function() {
                var buddyName = $(this).attr('data-buddyname');
                var buddyPic = $(this).attr('data-buddyPic');
                var buddyAbout = $(this).attr('data-buddyAbout');
                var buddyZip = $(this).attr('data-buddyZip');
                var buddyId = $(this).attr('data-userId');
                console.log(buddyId);
    
                // update the user to include the clicked user as a workout buddy
                firebase.database().ref('users/' + userId + '/workoutBuddies/' + $(this).attr('data-userId')).update({
                    buddyName: buddyName,
                    buddyPic: buddyPic,
                    buddyZip: buddyAbout,
                    buddyAbout: buddyZip
                });
    

                // update the requested buddy so that they have workout buddy request.
                var requestor = firebase.auth().currentUser.uid;
                var requestee = buddyId;
                console.log("Requestor " + requestor);
                console.log("Requestee " + requestee);

                var thisSnap = firebase.database().ref('users/' + requestee);
                console.log("Request thisSnap " + thisSnap);
                // this is creating a snapshot of the current user
                thisSnap.on('value', function(requestSnap) {
                    // update the Buddy to include a buddy request from the current user
                    console.log("Request Zip " + requestSnap.val().zipCode);
                    firebase.database().ref('users/' + requestee + "/workoutRequests/" + requestor).update({
                        requestName: requestSnap.val().username,
                        requestPic: requestSnap.val().profilePicture,
                        requestZip: requestSnap.val().zipCode,
                        requestAbout: requestSnap.val().aboutMe
                    });
                });

                $("#userID" + $(this).attr('data-userId') + "connect").css("background-color", "#7FFF00");
                $("button#" + $(this).attr('data-userId') + "connect").hide();
    
                alert("You and " + buddyName + " are now connected.")
                return
            });
    
            
            $(".disconnectUser").on("click", function() {
                var buddyName = $(this).attr('data-buddyname');
    
                $("#userID" + $(this).attr('data-userId') + "disconnect").css("background-color", "#fffff");
                $("button#" + $(this).attr('data-userId') + "disconnect").hide();

                $("button#" + $(this).attr('data-userId')).attr('class', 'connectUser');
    
                // update the user to include the clicked user as a workout buddy
                firebase.database().ref('users/' + user.uid + '/workoutBuddies/' + $(this).attr('data-userId')).remove();
    
    
                alert("You and " + buddyName + " are disconnected.")
                return
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
