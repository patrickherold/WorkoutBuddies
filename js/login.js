

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

// Firebase pre-built UI
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return function writeUserData(username, email, profilePicUrl) {
                firebase.database().ref('users/').set({
                    username: firebase.auth().currentUser.displayName,
                    email: firebase.auth().currentUser.email,
                    profilePicUrl: firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png'
                })
            };
            function storeLoginSession(loginSession) {
                firebase.database().ref('users/').set({
                    loginSession: Date($.now())
                })
            };

        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: 'index.html',
    // Privacy policy url.
    privacyPolicyUrl: 'index.html'
};


// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

