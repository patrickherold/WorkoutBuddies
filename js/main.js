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
    if (user) { this.userId = user.uid };
    // this is updating fields to the database.
    // this is needed here so that we can write the User Auth info to the database to create a collection for this users.
    firebase.database().ref('users/' + user.uid).update({
        username: user.displayName,
        email: user.email,
        profilePicture: user.photoURL || '/images/profile_placeholder.png'
    });

    // this is getting the database info for the current user
    // it needs to be inside of here so that we have access to the user id.
    var userSnap = firebase.database().ref('users/' + userId);
    userSnap.on('value', function(snap) {

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
    }, null, '  ');
})});



// Check to see if Logged in / logout
var loginContainer = document.getElementById("loginContainer");
