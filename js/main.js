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


// Check to see if Logged in / logout
var loginContainer = document.getElementById("loginContainer");

logMeOut = function () {
    firebase.auth().signOut().then(function () {
        console.log('success logout');
        window.location.replace("login.html");
    }, function () { })
};

initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            console.log(firebase.auth().currentUser.displayName);
            $("#currentUser").append(firebase.auth().currentUser.displayName);

            document.getElementById('accountDetails').textContent = JSON.stringify({
                displayName: displayName,
                email: email,
                emailVerified: emailVerified,
                phoneNumber: phoneNumber,
                photoURL: photoURL,
                uid: uid
            }, null, '  ');

            // write user data to firebase
            function writeUserData(userId, username, email, profilePicture) {
                firebase.database().ref('users/' + firebase.auth().currentUser.userId).set({
                    username: firebase.auth().currentUser.displayName,
                    email: firebase.auth().currentUser.email,
                    profilePicture: firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png'
                });
            }

            loginContainer.style.display = "none";
            return;
        } else {
            // No user is signed in.
            loginContainer.style.display = "block";
            console.log("redirect");
            window.location.replace("login.html");
        }
    });
};
// start it up
window.addEventListener('load', function () {
    initApp()
});



