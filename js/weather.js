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
    //Grabbing users address
    //Having an issue with firebase pulling the users address
    if (user) {

        ref.set("hello")
            .then(
            function () {
                return ref.once("value");
            })
            .then(
            function (snapshot) {
                var data = snapshot.val(); // data === "hello"
            });

        var userId = firebase.auth().currentUser.uid;
        var address = database.ref('users/' + userId + "address").val();
        var geoURL = "https://api.opencagedata.com/geocode/v1/json?key=000be1b151fb4863a869b6bc420760eb&pretty=1&q=atlanta,ga" + address;
        console.log("address" + userSnap.val().address);

        var lat = "";
        var lon = "";
        //Ajax call to get the weather results using geoURL
        $.ajax({
            url: geoURL,
            method: "GET"
        }).then(function (response) {

            lat = response.results.geometry.lat;
            lon = response.results.geometry.lat;

            var weatherURL = "https://cors-anywhere.herokuapp.com/" + "https://api.darksky.net/forecast/7d164bcd822a2ece7033b1a27d4a6e4e/" + lat + "," + lon;
            console.log(lat);
            console.log(lon);
            //ajax call to use the response
            $.ajax({
                url: weatherURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
            });

        });

    }
    else {
        console.log("no user yet")
    }
});
