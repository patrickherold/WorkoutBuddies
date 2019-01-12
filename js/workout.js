// jQuery
$(document).ready(function () {

    // Collapsible Dropdown
    $('.collapsible').collapsible();

    // Variables for Create Workout Form
    var workoutName = $("#workout-name").val().trim();
    var activityDescription = $("#workout-name").val().trim();
    var location = $("#workout-name").val().trim();

    var firstName = $("#workout-name").val().trim();
    var lastName = $("#workout-name").val().trim();
    var email = $("#workout-name").val().trim();
    var phone = $("#workout-name").val().trim();

    $(".workoutCategory").on("click", function () {

        console.log($(this).val());

    })

    $(".recommendedFitnessLevel").on("click", function () {

        console.log($(this).val());

    })


    // Initialize Firebase
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

    database.ref('/Workouts/CreatedWorkouts').set({

        workoutName : workoutName,
        activityDescription : activityDescription,
        location : location,
        firstName : firstName,
        lastName : lastName,
        email : email,
        phone : phone

    })

});