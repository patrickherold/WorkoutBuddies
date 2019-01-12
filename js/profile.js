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
var user

//  THIS IS NEEDED TO GET THE CURRENT USER. AND BECAUSE WE HAVE TO WAIT FOR A REPLY FROM THE DATABASE
firebase.auth().onAuthStateChanged( user => {
    if (user) { 
        this.userId = user.uid 

        // create or update the user in the database using info from Auth.
        firebase.database().ref('users/' + this.userId).update({
            username: user.displayName,
            email: user.email,
            profilePicture: user.photoURL || '/images/profile_placeholder.png'
        });
    }
    else {
        console.log("no user yet")
    }
        var userSnap = firebase.database().ref('users/' + userId);
        userSnap.on('value', function(snap) {

        $("#address").val(snap.val().address);
        $("label[for='address']").addClass("active");
        $("#city").val(snap.val().city);
        $("label[for='city']").addClass("active");
        $("#state").val(snap.val().state);
        $("label[for='state']").addClass("active");
        $("#zipCode").val(snap.val().zipCode);
        $("label[for='zipCode']").addClass("active");
        $("#aboutMe").val(snap.val().aboutMe);
        $("label[for='aboutMe']").addClass("active");

})});


// submit and update values
// BECAUSE THE ON CLICK IS AFTER THE PAGE HAS LOADED WE DON'T NEED THE ON STATE CHANGE
$("#profileButton").on("click", function() {
    event.preventDefault();

    workoutPreferences = $("#workoutPreferences").val();
    aboutMe = $("#aboutMe").val();
    address = $("#address").val();
    city = $("#city").val();
    state = $("#state").val();
    zipCode = $("#zipCode").val();
    dateNow = $.now();
    dateNow = moment(dateNow).format('MMMM Do, h:mm:ss a');

    console.log("Zip " + zipCode);

    var uid = firebase.auth().currentUser.uid;
    // populate form values
    firebase.database().ref('users/' + uid).update({
        aboutMe: aboutMe,
        address: address,
        city: city,
        state: state,
        zipCode: zipCode,
        aboutMe: aboutMe,
        workoutPreferences: workoutPreferences
    });
    window.location.replace("index.html");
});
