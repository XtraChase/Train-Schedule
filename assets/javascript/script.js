//Header Clock
var timeInteger;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateClock() {
  var t;
  var clock = document.getElementById("clock");
  while ((t = moment().format("h:mm"))) {
    clock.innerHTML = t; // updates time
    await sleep(1000); // sleeps for 1 second

    //get time converted to integer and store it in timeInteger
    var s = t;
    var seg = s.split(":");
    var hours = parseInt(seg[0]);
    var minutes = parseInt(seg[1]);

    timeInteger = hours * 60 + minutes;
    console.log(timeInteger);
  }
}
updateClock();

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

var trainName = "";
var trainDestination = "";
var arrivalFrequency = 0;
var arrivalTime;
var minutesAway;

let trainData = [];

// Capture Button Click
$("#add-user").on("click", function(event) {
  event.preventDefault();

  // Grabbed values from text boxes
  trainName = $("#train-input")
    .val()
    .trim();
  trainDestination = $("#destination-input")
    .val()
    .trim();
  arrivalFrequency = $("#frequency-input")
    .val()
    .trim();
  arrivalTime = $("#arrival-input")
    .val()
    .trim();

  //convert arrival time to minutes
  var s = arrivalTime;
  var seg = s.split(":");
  var hours = parseInt(seg[0]);
  var minutes = parseInt(seg[1]);

  var arrivalInteger = hours * 60 + minutes;
  var minutesAway = arrivalInteger - timeInteger;

  if (minutesAway < 0) {
    minutesAway = "Departed";
  }

  // Code for handling the push
  var trainObject = {
    train: trainName,
    destination: trainDestination,
    frequency: arrivalFrequency,
    arrival: arrivalTime,
    away: minutesAway
  };
  database.ref().push(trainObject);
});

// Firebase watcher .on("child_added")
database.ref().on(
  "child_added",
  function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    addTrainRow(sv, snapshot.ref.key);

    // Handle the errors
  },
  function(errorObject) {
    console.log("Error: " + errorObject.code);
  }
);

database.ref().on(
  "child_removed",
  function(snapshot) {
    removeTrainRow(snapshot.ref.key);
  },
  function(errorObject) {
    console.log("Error: " + errorObject.code);
  }
);

//dynamic table
//tutorial source: https://youtu.be/ri5Nqe_IK50
function addTrainRow(element, uniqueID) {
  const tableBody = document.getElementById("tableData");
  let dataHtml = `<tr id=${uniqueID}>
        <td>${element.train}</td>
        <td>${element.destination}</td>
        <td><time>${element.frequency}</time></td>
        <td><time>${element.arrival}</time></td>
        <td><time>${element.away}</time></td>
        <td><a onclick="removeTrainFromDatabase('${uniqueID}');">X</a></td>
      </tr>`;
  tableBody.innerHTML += dataHtml;
}

function removeTrainFromDatabase(uniqueID) {
  database
    .ref()
    .child(uniqueID)
    .remove();
}

function removeTrainRow(uniqueID) {
  var trainRow = document.getElementById(uniqueID);
  trainRow.remove();
}
