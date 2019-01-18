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
        userId = user.uid;


        // confirm Firebase workout ID in LocalStorage
        // console.log(window.localStorage.WorkoutId);

        // store FB workout ID in variable, JSON.parse to remove surrounding quotes 
        var workoutKeyString = JSON.parse(localStorage.getItem("WorkoutId"));

        var workoutEditFlag = JSON.parse(localStorage.getItem("workoutEdit"));


        // get values from database and add them to the form
        var workSnap = firebase.database().ref('workouts/' + workoutKeyString);
        workSnap.on('value', function (snap) {

            // console.log(category + " : Level " + recommendedFitnessLevel);

            // var name = snap.val();
            // console.log(name);

            // Populate Workout input fields with existing Workout data
            $("#workout-name").val(snap.val().workoutName);
            $("label[for='workout-name']").addClass("active");

            $("#activity-description").val(snap.val().activityDescription);
            $("label[for='activity-description']").addClass("active");

            $("#address").val(snap.val().address);
            $("label[for='address']").addClass("active");

            // $(".workoutCategory").val(snap.val().category).attr("checked", "checked");
            // $(".workoutCategory[value = '" + category + "']").attr("checked", "checked");
            // $(".workoutCategory").val(snap.val().category);

            // $(".recommendedFitnessLevel").val(snap.val().recommendedFitnessLevel).attr("checked", "checked");
            // $(".workoutCategory[value = '" + recommendedFitnessLevel + "']").attr("checked", "checked");
            // $(".recommendedFitnessLevel").val(snap.val().recommendedFitnessLevel);

            $("#workout-date-one").val(snap.val().scheduledDayOne);
            $("label[for='workout-date-one']").addClass("active");

            $("#time-one").val(snap.val().dayOneTime);
            $("label[for='time-one']").addClass("active");

            $("#workout-date-two").val(snap.val().scheduledDayTwo);
            $("label[for='workout-date-two']").addClass("active");

            $("#time-two").val(snap.val().dayTwoTime);
            $("label[for='time-two']").addClass("active");

            // localStorage.removeItem('workoutEdit');

            // Write Created Workouts To Firebase


            if (workoutEditFlag == true) {
                $("#updateButton").removeClass("hidden");
                $("#submitButton").addClass("hidden");

                $("#updateButton").on("click", function (e) {

                    e.preventDefault();

                    // Variables for Create Workout Form
                    var workoutName = $("#workout-name").val();
                    var activityDescription = $("#activity-description").val();
                    var address = $("#address").val();
                    var email = "";
                    var username = "";
                    var category = $(".workoutCategory:checked").val();
                    var recommendedFitnessLevel = $(".recommendedFitnessLevel:checked").val();
                    var scheduledDayOne = $("#workout-date-one").val();
                    var dayOneTime = $("#time-one").val();
                    var scheduledDayTwo = $("#workout-date-two").val();
                    var dayTwoTime = $("#time-two").val();

                    console.log(workoutName);


                    firebase.database().ref('workouts/' + workoutKeyString).update({
                        workoutName: workoutName,
                        activityDescription: activityDescription,
                        address: address,
                        category: category,
                        recommendedFitnessLevel: recommendedFitnessLevel,
                        scheduledDayOne: scheduledDayOne,
                        dayOneTime: dayOneTime,
                        scheduledDayTwo: scheduledDayTwo,
                        dayTwoTime: dayTwoTime
                    });

                    function redirect() {
                        localStorage.removeItem('WorkoutId');
                        window.location.replace("index.html");
                    }
        
                    setTimeout(redirect, 3000);
                    

                    // function redirect() {
                    //     window.location.replace("index.html");
                    // }

                    // setTimeout(redirect, 5000);

                });
            }
            workoutEditFlag = false;
        })


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
            var category = $(".workoutCategory:checked").val();
            var recommendedFitnessLevel = $(".recommendedFitnessLevel:checked").val();
            var scheduledDayOne = $("#workout-date-one").val();
            var dayOneTime = $("#time-one").val();
            var scheduledDayTwo = $("#workout-date-two").val();
            var dayTwoTime = $("#time-two").val();

            console.log("workout name variable test " + workoutName);

            console.log("Category = " + category);
            console.log("Fitness Level = " + recommendedFitnessLevel);

            var userSnap = firebase.database().ref('users/' + userId);
            // On Firebase data change, retrieve snapshot of database
            userSnap.on('value', function (snap) {

                email = snap.val().email;
                username = snap.val().username;

                // push a new workout to the workout collection

                firebase.database().ref('workouts/').push({
                    workoutName: workoutName,
                    activityDescription: activityDescription,
                    category: category,
                    recommendedFitnessLevel: recommendedFitnessLevel,
                    scheduledDayOne: scheduledDayOne,
                    dayOneTime: dayOneTime,
                    scheduledDayTwo: scheduledDayTwo,
                    dayTwoTime: dayTwoTime,
                    address: address,
                    email: email,
                    username: username

                });

                // Clear Create Workout Form
                workoutName = $("#workout-name").val("");
                activityDescription = $("#activity-description").val("");
                address = $("#address").val("");
                category = $(".workoutCategory").val("");
                recommendedFitnessLevel = $(".recommendedFitnessLevel").val("");
                scheduledDayOne = $("#workout-date-one").val("");
                dayOneTime = $("#time-one").val("");
                scheduledDayTwo = $("#workout-date-two").val("");
                dayTwoTime = $("#time-two").val("");


            });

            function redirect() {
                window.location.replace("index.html");
            }

            setTimeout(redirect, 5000);

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
