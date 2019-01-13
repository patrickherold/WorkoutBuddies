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
firebase.auth().onAuthStateChanged(user => {

    if (user) {
        this.userId = user.uid;

        // Collapsible Dropdown
        $('.collapsible').collapsible();


        // Create/Submit New Workout

        // Write Created Workouts To Firebase=
        // var workoutid = [];
        // var workoutCounter = 0;

        

        $("#submitButton").on("click", function (e) {
            e.preventDefault();

            // Variables for Create Workout Form
            var workoutName = $("#workout-name").val().trim();
            var activityDescription = $("#activity-description").val().trim();
            var address = $("#address").val().trim();
            var email = $("#email").val().trim();
            var username = $("#username").val().trim();
            var category = $(".workoutCategory").val().trim();
            var recommendedFitnessLevel = $(".recommendedFitnessLevel").val().trim();

        
            var workoutIdCounter = database.workoutIdCounter.val();
            console.log(workoutIdCounter);

            // populate form values
            firebase.database().ref('createdWorkoutCount/' + workoutCounter).update({
                workoutCount: workoutCounter
            })

            console.log(workoutid);


            // populate form values
            firebase.database().ref('workouts/' + workoutid).update({
                workoutName: workoutName,
                activityDescription: activityDescription,
                category: category,
                recommendedFitnessLevel: recommendedFitnessLevel,
                address: address,
                email: email,
                username: username
            })
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
