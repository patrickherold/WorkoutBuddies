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

// most things about a user need to happen inside of one of the state change listeners
// this is how we can find out the user id 
firebase.auth().onAuthStateChanged(user => {

    if (user) {
        this.userId = user.uid;

        var userSnap = firebase.database().ref('users/' + userId);
            userSnap.on('value', function(snap) {
            email = snap.val().email;
            username = snap.val().username;
        });


        // Create/Submit New Workout
        // Write Created Workouts To Firebase
        $("#submitButton").on("click", function (e) {
            e.preventDefault();
                           
            // Variables for Create Workout Form
            var workoutName = $("#workout-name").val();
            var activityDescription = $("#activity-description").val();
            var address = $("#address").val();
            var email = "";
            var username = "";
            var category = $(".workoutCategory").val();
            var recommendedFitnessLevel = $(".recommendedFitnessLevel").val();


            console.log(workoutName);
            console.log(activityDescription);
            console.log(address);
            console.log(email);
            console.log(username);
            console.log(category);
            console.log(recommendedFitnessLevel);
            

            // push a new workout to the workout collection
            firebase.database().ref('workouts/').push({
                workoutName: workoutName,
                activityDescription: activityDescription,
                category: category,
                recommendedFitnessLevel: recommendedFitnessLevel,
                address: address,
                email: email,
                username: username
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
