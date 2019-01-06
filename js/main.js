
//  Landing page 

// Default welcome with:

  //  Login / logout
  var mainApp = {};
  (function(){
  var mainContainer = document.getElementById("mainContainer");
  
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
            console.log("stay");
            mainContainer.style.display = "none";
          } else {
            // No user is signed in.
            mainContainer.style.display = "block";
            console.log("redirect");
            window.location.replace("login.html");
          }
        });
  }
      
  init();
  
  mainApp.logout = logMeOut;
  })();

  // navigation that connects to:

    // user profile

    // map view

    // workout??

    // other?  possibly messages or connections??


// google analytics??



