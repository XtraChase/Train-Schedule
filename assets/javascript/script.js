// Initialize Firebase (YOUR OWN APP)
var config = {
  apiKey: "AIzaSyCqZhXcOpX3OtWdZ5Jpd1nWgljec0QI0pM",
  authDomain: "test-app-6d8a0.firebaseapp.com",
  databaseURL: "https://test-app-6d8a0.firebaseio.com",
  projectId: "test-app-6d8a0",
  storageBucket: "",
  messagingSenderId: "406074917795",
  appId: "1:406074917795:web:bc53a8273d566bd0459016",
  measurementId: "G-37K6H9VS0H"
};

firebase.initializeApp(config);

// Variable to reference the database
var database = firebase.database();

var train = "";
var destination = "";
var frequency = 0;
var arrival = "";

// Capture Button Click
$("#add-user").on("click", function(event) {
  event.preventDefault();

  // Grabbed values from text boxes
  train = $("#train-input")
    .val()
    .trim();
  destination = $("#destination-input")
    .val()
    .trim();
  frequency = $("#frequency-input")
    .val()
    .trim();
  arrival = $("#arrival-input")
    .val()
    .trim();

  // Code for handling the push
  database.ref().push({
    train: train,
    destination: destination,
    frequency: frequency,
    arrival: arrival
  });
});

// Firebase watcher .on("child_added"
database.ref().on(
  "child_added",
  function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Change the HTML to reflect
    var row = document.createElement("tr");

    $("#trainName").text(sv.train);
    $("#destination").text(sv.destination);
    $("#frequency").text(sv.frequency);
    $("#arrival").text(sv.arrival);

    // Handle the errors
  },
  function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }
);

//Create Table
// var table = "";
// var rows = 1;
// var cols = 5;
// for (var r = 0; r < rows; r++) {
//   table += "<tr>";
//   for (var c = 1; c <= cols; c++) {
//     table += "<td>" + "</td>";
//   }
//   table += "</tr>";
// }
// $(".schedule").html("<table border=1>" + table + "</table>");
