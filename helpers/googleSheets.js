var firebase = require('firebase')

var config = {
  apiKey: "AIzaSyBQ8Ctq120oA1r-uWcGxh08fc7pVu7pw6M",
  authDomain: "jwt-0001.firebaseapp.com",
  databaseURL: "https://jwt-0001.firebaseio.com",
  projectId: "jwt-0001",
  storageBucket: "jwt-0001.appspot.com",
  messagingSenderId: "396218277249"
}
firebase.initializeApp(config)
// firebase.database().ref('/mytester').update({cmon:'pleasework'})
// firebase.database().ref('/hkDailyData').once('value',function (snap) {
//   var data = snap.val()
//   console.log(getFormattedAssignmentsValues(data.assignments))
// })
function getAssignmentsA1NotationRange(assignmentsAO) {
  //console.log(assignmentsAO.length)
  return 'A1:C' + assignmentsAO.length

}
function getFormattedAssignmentsValues(assignmentsAO) {
  //var formatted =
  return assignmentsAO.map(function (assignmentObj, index) {
    var cabin =  assignmentObj.cabin
    var status = assignmentObj.status
    var linens = assignmentObj.linens

    return [cabin, status, linens]
  })
}
