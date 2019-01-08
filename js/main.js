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




//  Landing page 

// Default welcome with:


  // navigation that connects to:

    // user profile

    // map view

    // workout??

    // other?  possibly messages or connections??


// google analytics??


// USER AUTH ETC

      


  // Check to see if Logged in / logout
  var mainApp = {};
  (function(){
  var loginContainer = document.getElementById("loginContainer");
  
      var logMeOut =  function(){
          firebase.auth().signOut().then(function(){
              console.log('success');
              window.location.replace("login.html");
          },function(){})
      }
  
  var init = function(){
      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            console.log(firebase.auth().currentUser.displayName);
            $("#currentUser").append(firebase.auth().currentUser.displayName)
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
init();

mainApp.logout = logMeOut;
})();

  