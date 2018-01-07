var express = require('express');
var app = express()
var router = express.Router();
var google = require('googleapis')
var sheets = google.sheets('v4');
var querystring = require('querystring');
var url = require('url')
var firebase = require('firebase')
var OAuth2 = google.auth.OAuth2;
if (!firebase.apps.length) {
  var config = {
    apiKey: "AIzaSyBQ8Ctq120oA1r-uWcGxh08fc7pVu7pw6M",
    authDomain: "jwt-0001.firebaseapp.com",
    databaseURL: "https://jwt-0001.firebaseio.com",
    projectId: "jwt-0001",
    storageBucket: "jwt-0001.appspot.com",
    messagingSenderId: "396218277249"
  }
  firebase.initializeApp(config)
}
    var oauth2Client = new OAuth2(
      /*YOUR_CLIENT_ID*/
      '396218277249-32dqbsf2kvi7mc6e8vj7e63mj090jk6p.apps.googleusercontent.com',
      /*YOUR_CLIENT_SECRET*/
      'F4WF5n4zHVu3uv59oo2cvOdV',
      /*YOUR_REDIRECT_URL*/
      'http://localhost:3001/authorize'
    );
    console.log("oauth2Client", oauth2Client )
// app.use(function (req, res, next) {
//   console.log('Time:', Date.now())
//   res.header('Access-Control-Allow-Origin', '*');
//   next()
// })
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/authorize',
  // function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', '*');
  // next()
  // },
  function (req, res, next) {
  var qs = querystring.parse(url.parse(req.url).query);
  var code = qs.code
  console.log("code is:", code)
  console.log("AUTHORIZE hit")
  oauth2Client.getToken(code, function (err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.

    if (!err) {
      console.log('tokens set!!!!!!!!!!!!!!!')

      firebase.database().ref('/tokens').update(tokens)
      oauth2Client.setCredentials(tokens)
    }
    // if (tokens.hasOwnProperty('refresh_token')) {
    //   console.log('token has a REFRESH_TOKEN TRUE !!!!')
    //   firebase.database().ref('/tokens').child('refresh_token').set(tokens.refresh_token)
    // }
    res.redirect('gsheets-inject')
  });
  //res.json({ code: qs.code})
});
router.get('/gsheets-inject',
//   function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   next()
// },
  function (req, res, next) {
    firebase.database().ref('/tokens').once("value", function(snapshot){
      var token = snapshot.val()
      if (token !== null) {
        var access_token = token.access_token
      }

      console.log('access_token = ', access_token)
      if (access_token === null || access_token === 0 || access_token === undefined){
        // you need a token! start auth flow
        // generate a url that asks permissions for Google+ and Google Calendar scopes
        var scopes = [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive'
        ];

        var authUrl = oauth2Client.generateAuthUrl({
          // 'online' (default) or 'offline' (gets refresh_token)
          access_type: 'offline',
          approval_prompt:'force',

          // If you only need one scope you can pass it as a string
          scope: scopes,

          // Optional property that passes state parameters to redirect URI
          // state: 'foo'
        });
        console.log('authUrl=== ', authUrl)
        //res.redirect(authUrl)
        res.json({ authUrl, tokenExists:false })
      }
      else {
        // we have a token, use it!
        // console.log("token exists! you can start doing work here!!!");
        // res.json({tokenExists: true})
        // firebase.database().ref('/tokens').once('value', function (snapshot2) {
        // var token = snapshot2.val()
        // console.log('token ==========', token)

         // oauth2Client.setCredentials(token) <-- bug from lib. alternate
         oauth2Client.credentials = token

        if (tokenExpired(token)) {
          oauth2Client.refreshAccessToken(function (err, tokens) {
            console.log('manual refresh hit. tokens = ', tokens)
            oauth2Client.credentials = tokens
            firebase.database().ref('/tokens').update(tokens)
          });
        }
        firebase.database().ref('/hkDailyData').once('value', function (snap) {
          var data = snap.val()
          console.log("departuresEmails", data.departuresEmails)
          console.log("departuresNumbers", data.departuresNumbers)
          var assignments = {
            range: "Assignments!A3:C" + (data.assignments.length + 2),
            values: getFormattedAssignmentsValues(data.assignments)
          }
          var departuresEmails = {
            range: "Contact!A2:A" + (data.departuresEmails.length + 1),
            values: ArrayStringsToArrays(data.departuresEmails)
          }
          var departuresNumbers = {
            range: "Contact!B2:B" + (data.departuresNumbers.length + 1),
            values: ArrayStringsToArrays(data.departuresNumbers)
          }
          var arrivalsEmails = {
            range: "Contact!C2:C" + (data.arrivalsEmails.length + 1),
            values: ArrayStringsToArrays(data.arrivalsEmails)
          }
          var arrivalsNumbers = {
            range: "Contact!D2:D" + (data.arrivalsNumbers.length + 1),
            values: ArrayStringsToArrays(data.arrivalsNumbers)
          }
          var request = {
            spreadsheetId: '1eqhipLJUpqSWjYdHr59m9FbsQonPJn4YkrGZnzIbBjM',  // TODO: Update placeholder value.
            // valueInputOption: 'RAW',  // TODO: Update placeholder value.
           // range: getAssignmentsA1NotationRange(data.assignments),  // TODO: Update placeholder value.
            resource: {
              valueInputOption: 'RAW',  // TODO: Update placeholder value.
              // values: getFormattedAssignmentsValues(data.assignments),
              data: [
                assignments,
                departuresEmails,
                departuresNumbers,
                arrivalsEmails,
                arrivalsNumbers
              ]
                // {
                //   range: getAssignmentsA1NotationRange(data.assignments),  // TODO: Update placeholder value.,
                //   majorDimension: "ROWS",
                //   values: getFormattedAssignmentsValues(data.assignments)
                // },
                // {
                //   range: departuresEmailsA1Notation(data.departuresEmails),
                //   majorDimension: "ROWS",
                //   values: ArrayStringsToArrays(data.departuresEmails)
                // }
             // ]
            },
            auth: oauth2Client,
          }
        sheets.spreadsheets.values.batchUpdate(request, function(err, response) {
          if (err) {
            console.log('update values error!')
            console.error(err);
            return;
          }
          console.log(JSON.stringify(response, null, 2));
        });
      })
    }
   });
  });
function tokenExpired(token) {
  return Date.now() > token.expiry_date
}
function departuresEmailsA1Notation(data) {
  return 'Contact!A2:C' + (data.length + 1)
}
function ArrayStringsToArrays(data) {
  return data.map(function (StringVal, index) {
    if (StringVal.length) {
      return [StringVal]
    }
  })
}
function getAssignmentsA1NotationRange(assignmentsAO) {
  //console.log(assignmentsAO.length)
  return 'A2:C' + (assignmentsAO.length + 1)

}
function getFormattedAssignmentsValues(assignmentsAO) {
  return assignmentsAO.map(function (assignmentObj, index) {
    var cabin =  assignmentObj.cabin
    var status = assignmentObj.status
    var linens = assignmentObj.linens
    return [cabin, status, linens]
  })
}
///////
/** example on how to merge cells*/
// var tester = {
//   "mergeCells": {
//     "range": {
//       "sheetId": "1833673665",
//       "startRowIndex": 0,
//       "endRowIndex": 2,
//       "startColumnIndex": 0,
//       "endColumnIndex": 2
//     },
//     "mergeType": "MERGE_ALL"
//   }
// }
// sheets.spreadsheets.batchUpdate({
//   spreadsheetId: '1eqhipLJUpqSWjYdHr59m9FbsQonPJn4YkrGZnzIbBjM',  // TODO: Update placeholder value.
//   auth: oauth2Client,
//   resource: {
//     requests:[tester]
//   }
// }, function (error, resp) {
//   console.log('cbcbcbcbcbcb22')
//   if (error) {
//       console.log("request error")
//       console.error(error)
//     return
//   }
//   console.log(JSON.stringify(response, null, 2));
// })

/////
module.exports = router;
