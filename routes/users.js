var express = require('express');
var router = express.Router();
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var fs = require('fs')
var firebase = require('firebase')
var cheerio = require('cheerio')
//var mongoose = require('mongoose')
//var google = require('googleapis');
//var client = require('../helpers/googleAuthClient')
// var async = require('async')
//var gmail = google.gmail('v1');


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
//console.log('my env', process.env.DB_PASS)
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/contacts');

// var contactsSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   address: String,
//   city: String,
//   state: String,
//   zip: String,
//   number: String,
//   numberTwo: String,
//   email: String,
//   cabin: Number,
//   status: String,
//   turnover: Boolean,
//   linensNumber: Number

// })

// var contacts = mongoose.model('mynewcontacts', contactsSchema)
// contacts.remove({}, function(err) {
//    console.log('collection removed')
// }).exec();


//var actives = mongoose.model('actives', contactsSchema)
// contacts.create({
//   name: 'christoph',
//   number: '90980007834'
// }).then(function(err, data){
//   console.log('err data below')
//   console.log(err, data)
// })


/* GET users listing. */
// router.post('/',function(req, res, next){
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   next()
// }, function(req, res, next) {
// 	// Comment out this line:
//   //res.send('respond with a resource');

//   // And insert something like this instead:
//   res.json([{
//   	id: 1,
//   	username: "samsepi0l"
//   }, {
//   	id: 2,
//   	username: "D0loresH4ze"
//   }]);
// });
// function draftslist(tokens){
//   return new Promise((resolve, reject)=>{

//     gmail.users.drafts.list({
//           access_token: tokens.access_token,
//           userId: 'me'}, function(err, drafts){
//             if(err){
//               reject(err)
//             }
//             resolve({tokens, drafts})
//           })
//   })
// }
// function getDraftFromDrafts({tokens, drafts}){
//   console.log('tokensAAA', tokens);

//     var finializedData = []
//     return new Promise(function(resolve, reject){
//               finializedData = drafts.drafts.map(function(draft){
//          // console.log(draft.message)
//             gmail.users.drafts.get({
//               userId: 'me',
//               id: draft.id,
//               access_token: tokens.access_token }, function(err, draftData){
//     //console.log('err', err);
//                 draftData.message.payload.headers.forEach(function(d){
//                       if(d.name === 'Subject' && d.value.length){
//                         //console.log(d.value)
//                         return d.value
//                       }
//                       else{
//                         return 'blank'
//                       }
//                     })

//                 })
//             })
//             resolve(finializedData)
//     })
// }
// function callGoogleAndGetDrafts(cb){
//   var test = {}
//   test.dees = []
// client.execute(['https://www.googleapis.com/auth/gmail.modify'], function(tokens){
//     if(!tokens){
//       console.log('!tokens fired');

//       tokens = JSON.parse(fs.readFileSync('./tokens.json','utf8'))
//       console.log('tokens', tokens);

//     }
//     else{
//       fs.writeFile('./tokens.json', JSON.stringify(tokens), function(err){
//         if(err){
//           throw err
//         }
//       })
//     }
//     //  console.log('tokens', tokens)
//       var gmail = google.gmail('v1');
//         gmail.users.drafts.list({
//           access_token: tokens.access_token,
//           userId: 'me'}, function(err, drafts){
//         //console.log(drafts)
//         //res.json(drafts)
//         //var tee = []
//             drafts.drafts.forEach((draft)=>{
//          // console.log(draft.message)
//             gmail.users.drafts.get({
//               userId: 'me',
//               id: draft.id,
//               access_token: tokens.access_token }, function(err, draftData){
//     //console.log('err', err);
//                 draftData.message.payload.headers.forEach(function(d){
//                       if(d.name === 'Subject' && d.value.length){
//                         console.log(d.value)
//                         test.dees.push(d.value)
//                       }
//                     })

//                 })
//             })

//         })

//     })
// }
function filterCabin(obj){
  var newObj = obj.map(function(anObj){
    var cabinString = anObj.cabin
    var dex = cabinString.indexOf('-')
    //console.log('cabinstring', cabinString.substring(0,dex).replace(/[ #]/g, ''))
    var filtered = parseInt(cabinString.substring(0,dex).replace(/[ #]/g, ''), 10)
    //console.log('filtered',filtered)
    anObj.cabin = filtered
    return anObj
  })
  return newObj
}
function filterName(obj){
  var newObj = obj.map(function(anObj){
    var name = anObj.name
    var filteredName = name.replace(/[^A-Za-z,-]/g, '')
    filteredName = filteredName.split(',')
    if(filteredName.length >= 3){
      console.log(new Error('there is a comma on the name'))
    }
   // console.log(filteredName)
    anObj.firstName = filteredName[1].replace(/\s/g,"")
    anObj.lastName = filteredName[0].replace(/\s/g,"")

   // console.log(filteredName)
    //anObj.name = filteredName
    return anObj
  })
  return newObj
}


// router.get('/drafts', function(req, res){
//   client.execute(['https://www.googleapis.com/auth/gmail.modify'], function(tokens){
//     if(!tokens){
//       console.log('!tokens fired');

//       tokens = JSON.parse(fs.readFileSync('./tokens.json','utf8'))
//       console.log('tokens', tokens);

//     }
//     else{
//       fs.writeFile('./tokens.json', JSON.stringify(tokens), function(err){
//         if(err){
//           throw err
//         }
//       })
//     }
//     draftslist(tokens).then(getDraftFromDrafts).then(function(t){
//       console.log('t', t);

//     })
//   })
// // callGoogleAndGetDrafts(function(d){
// //   console.log('deeee', d)
// // })
// //res.json({test:'one', tester:'two'})
// var test = []
// var asyncTasks = [];
// asyncTasks.push(function(callback){
//   // Set a timeout for 3 seconds
//   setTimeout(function(){
//     // It's been 3 seconds, alert via callback
//     console.log('first wait')
//     test.push(1)
//     callback();
//   }, 10000);
// });

// asyncTasks.push(function(callback){
//   // Set a timeout for 3 seconds
//   setTimeout(function(){
//     // It's been 3 seconds, alert via callback
//     console.log('second wait')
//     test.push(2)
//     callback();
//   }, 10000);
// });

// async.parallel(asyncTasks, function(){
// console.log('test', test)
// })

// router.use(function (req, res, next) {
//   console.log('Time:', Date.now())
//   res.header('Access-Control-Allow-Origin', '*');
//   next()
// })
router.post('/',
// function(req, res, next){
//   res.header('Access-Control-Allow-Origin', '*');
//   next()
// },
upload.array('files', 3),
function (req, res) {
    function getContacts(err, data){
      //console.log('yoyoyoyo')
      //console.log(data.toString().split('\n'))
      var newObj = []
      var contactsArrayOfStr = data.toString().split('\n')
      contactsArrayOfStr.forEach(function(contactStr){
        contactArr = contactStr.replace(/["]+/g, '').split(',')
        //console.log('contactArr', contactArr)
        
      if(contactArr.length > 2){        
        var contact = {
          firstName: contactArr[0].replace(/\s/g,''),
          lastName: contactArr[1].replace(/\s/g,''),
          address: contactArr[2],
          city: contactArr[4],
          state: contactArr[5],
          zip: contactArr[6],
          number: contactArr[7],
          numberTwo:contactArr[8],
          email: contactArr[9],
          cabin: null,
          status: '',
          turnover: false,
          linensNumber: 0
        }
        //console.log('contact', contact)
        newObj.push(contact)
        // contacts.create(contact).then(function(err, data){
        //   console.log('created contact 1')
        // //  console.log(err, data)
        // })
        }
      })
      //console.log("newObj", newObj)
      return newObj
    }
    function getActives(err, data){
      var $ = cheerio.load(data.toString())
      var newObj = []
      $('div.s7').each(function() {
        var $this = $(this);
        newObj.push({
            name : $this.find('span.f15').text(),
            status : $this.find('span.f19').text(),
            cabin : $this.find('span.f14').text(),
            email: '',
            number: '',
            number2:'',
            linensNumber: 0,
            turnover: false
        });

      });
      newObj = filterCabin(newObj)
      newObj = filterName(newObj)
      //console.log(newObj)
      return newObj
      // newObj.forEach(function(aContact){
      // //  console.log('acontact', aContact)
      //   var query = {
      //     firstName: aContact.firstName,
      //     lastName: aContact.lastName
      //   }
      //   var newInfo = {
      //     cabin: aContact.cabin,
      //     status: aContact.status
      //   }
       // contacts.findOneAndUpdate(query, newInfo,{upsert: false, new: true}, function(err, doc){
          // if(err){
          //   throw new Error('contact wasn\'t found')
          // }
          //console.log('err after merge', err)
       //   console.log('merge active 2')
       // })
     // })
     // contacts.remove({cabin: null}).exec()
      //  console.log(newObj)
    }
    function getPOS(err, data){
      var $ = cheerio.load(data.toString())
      var linensObj = []
      var test = $('.s11').find("span:contains('Linen')").parent().nextUntil('.s12').each(function(){
         var $this = $(this);
         var name = $this.find('span.f8').text() || "NO NAME"
         var numberLinens = $this.find('span.f24').text()
         console.log((name.match(/ /g) || []).length)
        if ((name.match(/ /g) || []).length != 1) {
           console.log('name= ', name)
           console.log(new Error('extraa space inside name'))
         }
         name = name.trim()
         var nameArr = name.split(' ')
         var firstName = nameArr[0].trim()
         var lastName = nameArr[1].trim()
         var linenOrder = {numberLinens, firstName, lastName}
          //  name: $this.find('span.f8').text(),
          //  numberLinens: $this.find('span.f24').text()

         linensObj.push(linenOrder)
         //console.log($this.find('span.f8').text())
      })
    //  console.log(linensObj)
      return linensObj
      // linensObj.forEach(function(linenOrder){
      //   var query = {
      //     firstName: linenOrder.firstName,
      //     lastName: linenOrder.lastName
      //   }
      //   var newInfo = {
      //     linensNumber: linenOrder.numberLinens
      //   }
      //    contacts.findOneAndUpdate(query, newInfo,{upsert: false, new: true}, function(err, doc){
      //      console.log('pos 3')
      //    })
      // })
      //console.log(linensObj)
    }
    function mergeAllData(contacts, actives, POSes){
      var merged = actives.map((active)=>{
        contacts.forEach((contact)=>{
          if(active.firstName == contact.firstName && active.lastName == contact.lastName){
            active.email = contact.email
            active.number = contact.number
            active.number2 = contact.number2 || ''
          }
        })
        POSes.forEach(function(pos){
         // console.log(pos)
         // console.log('pos:',pos.firstName)
         // console.log('cont:', contact.firstName)
          if(pos.firstName == active.firstName && pos.lastName == active.lastName){
          //  console.log('true')
            active.linensNumber = pos.numberLinens
          }
        })
        return active
      })
     // console.log(merged)
      return merged
      //var mergedContacts = contacts.map(function(contact){
        // actives.forEach(function(active){
        //   if(active.firstName == contact.firstName && active.lastName == contact.lastName){
        //     contact.status = active.status
        //     contact.cabin = active.cabin
        //   }
        // })
      //   POSes.forEach(function(pos){
      //    // console.log(pos)
      //    // console.log('pos:',pos.firstName)
      //    // console.log('cont:', contact.firstName)
      //     if(pos.firstName == contact.firstName && pos.lastName == contact.lastName){
      //     //  console.log('true')
      //       contact.linensNumber = pos.numberLinens
      //     }
      //   })
      //   return contact
      // })
      // return mergedContacts
    }
    function removeCabinNullsAndStayovers(data){
      var newData = data.filter(function(d){
        return d.cabin != null
      }).filter(function(d2){
        return d2.status != 'Sta'
      })
    //  console.log(newData)
      return newData
    }
    function getCabinOfStatus(data, status){
      var newStatus = []
      data.filter(function(d){
        return d.status == status
      }).forEach(function(d){
        newStatus.push(d.cabin)
      })
     // console.log('statuses', newStatus)
     return newStatus
    }
    function getMatches(arr1, arr2){
      var matches = []
      arr1.forEach(function(a){
        arr2.forEach(function(b){
          if(a == b){
            //console.log('true')
            matches.push(a)
          }
        })
      })
      //console.log(matches)
      return matches
    }
    function calculateTOBool(data){
      var departures = getCabinOfStatus(data, 'Dep')
      var arrivals = getCabinOfStatus(data, 'Arr')
      var matches = getMatches(departures, arrivals)
      var newData = data.map(function(d){
        matches.forEach(function(match){
          if(match == d.cabin){
            d.turnover = true
            //console.log('match', d)
          }
        })
        return d
      })
      return newData
    }
    function addLinenToStrictDeparts(data){
      data.map(function(d){
        if(d.status == 'Dep' && d.turnover == false){
          d.linensNumber = 1
        }
        return d
      })
      return data
    }
    function getFilePathByName(files, fileName){
        let path = ''
        files.forEach((file) =>{
          if(file.originalname == fileName){
            path = file.path
          }
        })
        if(path.length > 0){
          return path
        }
        else{
          console.log(new Error('a different file than what was expected got uploaded'))
        }
    }
    // hook into files
    if(req.files.length != 3){
      console.log(new Error('didn\'t load 3 filess' ))
    }
    var contactsFile = fs.readFileSync(getFilePathByName(req.files, 'Contacts.csv'), 'utf8')
    var activeFile = fs.readFileSync(getFilePathByName(req.files, 'OccupancyActive List.htm'), 'utf8')
    var posFile = fs.readFileSync(getFilePathByName(req.files, 'Point of SaleDetail.htm'), 'utf8')
    //console.log("herheehereh")
    //AO stands for arrayOfObjects
    var contactsAO = getContacts(null, contactsFile)
    console.log("HERE 1", contactsAO)
    var activeAO = getActives(null, activeFile)
    console.log("HERE 2")
    var posAO = getPOS(null, posFile)
    console.log("HERE 3")
    var finalizedData = mergeAllData(contactsAO, activeAO, posAO)
    console.log("HERE 4")
    finalizedData = removeCabinNullsAndStayovers(finalizedData)
    console.log("HERE 5")
    finalizedData = calculateTOBool(finalizedData)
    console.log("HERE 6")
    finalizedData = addLinenToStrictDeparts(finalizedData)
    console.log("FINALIZED:", finalizedData)
    const data = finalizedData
    const arrivals = data.filter((d) => {
      return d.status === 'Arr' && d.turnover === false
    }).map((d2) =>{
      return {cabin:d2.cabin, status:d2.status, linens: d2.linensNumber}
    })
    const strictDeparts = data.filter((d)=>{
      return d.status === 'Dep' && d.turnover === false
    }).map((d2) =>{
      return {cabin:d2.cabin, status:d2.status, linens: d2.linensNumber}
    })
    const tos = data.filter((d)=>{
      return d.status === 'Arr' && d.turnover === true
    }).map((d2) =>{
      return {cabin: d2.cabin, status: 'T.O.', linens: d2.linensNumber}
    })
    const arrivalsNumbers = data.filter((d)=>{
      return d.status === 'Arr'
    }).map((d2) =>{
      //return {number: d2.number}
      return d2.number
    })
    const arrivalsEmails= data.filter((d)=>{
      return d.status === 'Arr'
    }).map((d2) =>{
     // return {email: d2.email}
     return d2.email
    })
    const departuresNumbers= data.filter((d)=>{
      return d.status === 'Dep'
    }).map((d2) =>{
      //return {number: d2.number}
      return d2.number
    })
    const departuresEmails= data.filter((d)=>{
      return d.status === 'Dep'
    }).map((d2) =>{
      // return {email: d2.email}
      return d2.email
      })
    firebase.database().ref('/hkDailyData').set({
      allData: data,
      assignments: [...arrivals, ...strictDeparts, ...tos],
      arrivalsNumbers,
      arrivalsEmails,
      departuresNumbers,
      departuresEmails,
    })
  //  console.log('HEREEEE!!!!!!!')
  //console.log('assignments:', [...arrivals, ...strictDeparts, ...tos])
  //console.log('departuresNumbers', departuresNumbers)
  //console.log('departuresEmails', departuresEmails)
   // res.json({allGood: true})
    //res.json(finalizedData)
    res.redirect('gsheets-inject')
});



module.exports = router;
