var config = {
    apiKey: "APIKEY",
    authDomain: "AUTHDOMAIN",
    databaseURL: "DATABASEURL",
    projectId: "PROJECTID",
    storageBucket: "",
    messagingSenderId: "MESSAGINGSENDERID"
  };
  firebase.initializeApp(config);


var auth = firebase.auth();
var db   = firebase.database();
