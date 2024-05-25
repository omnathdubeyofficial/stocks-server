import dotenv from 'dotenv';
dotenv.config();

import masterdataServices from '../services/masterdataServices';
//import { PrismaClient } from '.prisma/client/index';
//import  PrismaClient  from '@prisma/client';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import datetimeService from '../services/dateTimeServices';
import authenticationJWT from '../services/authenticationJWT'
import subscriptionservices from '../services/subscriptionservices';
import mysql from 'mysql';
import stringSimilarity from 'string-similarity';



async function getRecommendations(infostring) {
  console.log("", typeof infostring, infostring);

  // Convert object attributes to a string
  if (typeof infostring === 'object') {
    let infoString = '';
    for (const key in infostring) {
      if (infostring.hasOwnProperty(key)) {
        infoString += `${key}: ${infostring[key]}, `;
      }
    }
    infostring = infoString.slice(0, -2); // Remove the trailing comma and space
    infostring = infostring.toLowerCase();
  }

  // Log the modified value of infostring
  console.log("", typeof infostring, infostring);
  let infoString = infostring.replace("beliw", "below");

  // Split the input string into lines:
  const infoLines = infoString.split('\n').map(line => line.trim()).filter(line => line !== '');

  //To extract the date: check the line which is starts with digit:
  const index = infoLines.findIndex(line => /^\d/.test(line));
  const splitDate = infoLines[index].split('.');
  const day = splitDate[0].length === 2 ? splitDate[0] : `0${splitDate[0]}`;
  const month = splitDate[1].length === 2 ? splitDate[1] : `0${splitDate[1]}`;
  const year = splitDate[2].length === 4 ? splitDate[2] : `20${splitDate[2]}`;
  const recordedDate = `${year}${month}${day}`;

  //To extract the name:
  const index1 = infoLines.findIndex(line => line.startsWith('buy'));
  const actionLine = infoLines[index1].split(' ');
  const startIndex = actionLine.indexOf('buy');
  const endIndex = actionLine.indexOf('cmp');
  let name = actionLine.slice(startIndex + 1, endIndex).join(' ');

  //To extract the targets:
  const targetsStartIndex = actionLine.indexOf('target') !== -1 ? actionLine.indexOf('target') : actionLine.indexOf('tgt');
  const len1 = Object.values(actionLine).length;
  let targets;
  let T1, T2, T3, T4, T5, T6, T7, T8, T9;
  if (len1 - 1 === targetsStartIndex + 1) {
    targets = actionLine[targetsStartIndex + 1].split("/").map(item => item.trim());

    T1 = targets[0]
    T2 = targets[1]
    T3 = targets[2]
    T4 = targets[3]
    T5 = targets[4]
    T6 = targets[5]
    T7 = targets[6]
    T8 = targets[7]
    T9 = targets[8]
  } else {
    targets = actionLine.slice(targetsStartIndex + 1).filter(val => val !== '').map(target => target);

    T1 = targets[0]
    T2 = targets[2]
    T3 = targets[4]
    T4 = targets[6]
    T5 = targets[8]
    T6 = targets[10]
    T7 = targets[12]
    T8 = targets[14]
    T9 = targets[16]
  }

  //To extract the stop loss:
  const slIndex = actionLine.indexOf('below') !== -1 ? actionLine.indexOf('below') : actionLine.indexOf('stop');
  const adduptoIndex = actionLine.indexOf('till');

  //To extract timeframe
  let TF = infoString.includes('timeframe') ? infoLines[infoLines.findIndex(line => line.startsWith('timeframe'))].split(' ')[1] : 0;

  // Define the mapping for the timeframe options
  const timeframeMapping = {
    '0': '0',
    '1': '1',
    '3': '3',
    '6': '6',
    '12': '12',
    '12-24': '12|24',
    '12-18': '12|18',
    '3-6': '3|6',
    '3-6-9': '3|6|9',
    '3-6-9-12': '3|6|9|12',
    '3-9': '3|9',
    '6-24': '6|24',
    '12/24': '12|24',
    '12/18': '12|18',
    '3/6': '3|6',
    '3/6/9': '3|6|9',
    '3/6/9/12': '3|6|9|12',
    '3/9': '3|9',
    '6/24': '6|24'
  };

  // Select the appropriate timeframe from the dropdown
  TF = timeframeMapping[TF] || '0';


  //To extract the weightage:
  let WT = infoString.includes('weightage') ? infoLines[infoLines.findIndex(line => line.startsWith('weightage'))].split(' ')[1] : 0;

  //To extract comments:
  const commentIndex1 = infoLines.findIndex(line => line.startsWith('long')) !== -1 ? infoLines.findIndex(line => line.startsWith('long')) : infoLines.findIndex(line => line.startsWith('short'));
  const comment1 = infoLines[commentIndex1];
  const commentIndex2 = infoLines.findIndex(line => line.startsWith('potential'));
  const comment2 = infoLines[commentIndex2];

  // MySQL database connection configuration
  
  const db_config = {
    host: "localhost",
    user: "root",
    password: "omnath8055",
    database: "alldata"
  };

  // Create a MySQL connection pool
  const pool = mysql.createPool(db_config);

  // Promisify the pool query
  const query = (sql, args) => new Promise((resolve, reject) => {
    pool.query(sql, args, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });

  // Function to fetch company names from MySQL table
  async function fetchCompanyNames() {
    try {
      const results = await query("SELECT DISTINCT name FROM stockinfo");
      return results.map(result => result.name);
    } catch (error) {
      console.error('Error fetching company names:', error);
    }
  }

  // Function to find top correlated names with the input string
  function findTopCorrelated(inputString, companyNames) {
    const similarities = companyNames.map(name => ({
      name,
      similarity: stringSimilarity.compareTwoStrings(inputString.toLowerCase(), name.toLowerCase())
    }));

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }

  try {
    const companyNames = await fetchCompanyNames();
    const topCorrelatedNames = findTopCorrelated(name, companyNames);
    console.log(`Top five correlated companies of "${name}" :`);
    topCorrelatedNames.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.name} (Similarity: ${entry.similarity})`);
    });

    // Print the best match name (the first name in the topCorrelatedNames array)
    const bestMatchName = topCorrelatedNames[0].name;
    console.log(`Best Match Name: ${bestMatchName}`);

    // Create the object 
    const data = {
      recodate: recordedDate,
      name: bestMatchName,
      cmp: actionLine[endIndex + 1],
      addupto: actionLine[adduptoIndex + 1],
      sl: actionLine[slIndex + 1],
      target1: T1 || 0,
      target2: T2 || 0,
      target3: T3 || 0,
      target4: T4 || 0,
      target5: T5 || 0,
      target6: T6 || 0,
      target7: T7 || 0,
      target8: T8 || 0,
      target9: T9 || 0,
      timeframe: TF,
      weightage: WT,
      comment1: comment1,
      comment2: comment2
    };
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}



// import mysql from 'mysql';

// import stringSimilarity from 'string-similarity';

// // ( start function1 )
// function getRecommendations(infostring) {
//   // Log the type and value of infostring
//   console.log("", typeof infostring, infostring);

//   // Convert object attributes to a string
//   if (typeof infostring === 'object') {
//     let infoString = '';
//     for (const key in infostring) {
//       if (infostring.hasOwnProperty(key)) {
//         infoString += `${key}: ${infostring[key]}, `;
//       }
//     }
//     infostring = infoString.slice(0, -2); // Remove the trailing comma and space
//     infostring = infostring.toLowerCase();

//   }

//   // Log the modified value of infostring
//   console.log("", typeof infostring, infostring);
//   let infoString = infostring.replace("beliw", "below")

//   // Split the input string into lines:
//   const infoLines = infoString.split('\n').map(line => line.trim()).filter(line => line !== '');

//   //To extract the date: check the line which is starts with digit:
//   const index = infoLines.findIndex(line => /^\d/.test(line));
//   const splitDate = infoLines[index].split('.')
//   // console.log(splitDate)
//   const day = splitDate[0].length == 2 ? splitDate[0] : 0${splitDate[0]}
//   // console.log(day)
//   const month = splitDate[1].length == 2 ? splitDate[1] : 0${splitDate[1]}
//   const year = splitDate[2].length == 4 ? splitDate[2] : 20${splitDate[2]}
//   const recordedDate = ${year}${month}${day}

//   //To extract the name:
//   const index1 = infoLines.findIndex(line => line.startsWith('buy'));
//   const actionLine = infoLines[index1].split(' ');
//   const startIndex = actionLine.indexOf('buy')
//   const endIndex = actionLine.indexOf('cmp')
//   let name = actionLine.slice(startIndex + 1, endIndex).join(' ')

//   //To extract the targets:
//   const targetsStartIndex = actionLine.indexOf('target') !== -1 ? actionLine.indexOf('target') : actionLine.indexOf('tgt');
//   const len1 = Object.values(actionLine).length
//   let targets;
//   let T1, T2, T3, T4, T5, T6, T7, T8, T9;
//   if (len1 - 1 == targetsStartIndex + 1) {
//     targets = actionLine[targetsStartIndex + 1].split("/").map(item => item.trim())
//     T1 = targets[0]
//     T2 = targets[1]
//     T3 = targets[2]
//     T4 = targets[3]
//     T5 = targets[4]
//     T6 = targets[5]
//     T7 = targets[6]
//     T8 = targets[7]
//     T9 = targets[8]
//   } else {
//     targets = actionLine.slice(targetsStartIndex + 1).filter(val => val !== '').map(target => target);
//     T1 = targets[0]
//     T2 = targets[2]
//     T3 = targets[4]
//     T4 = targets[6]
//     T5 = targets[8]
//     T6 = targets[10]
//     T7 = targets[12]
//     T8 = targets[14]
//     T9 = targets[16]
//   }


//   //To extract the stop loss:
//   const slIndex = actionLine.indexOf('below') !== -1 ? actionLine.indexOf('below') : actionLine.indexOf('stop')
//   const adduptoIndex = actionLine.indexOf('till')
//   let TF;
//   if (infoString.includes('timeframe')) {
//     let index3 = infoLines.findIndex(line => line.startsWith('timeframe'));
//     TF = infoLines[index3].split(' ')[1]
//   } else {
//     TF = 0
//   }


//   //To extract the weightage:
//   let WT;
//   if (infoString.includes('weightage')) {
//     const index2 = infoLines.findIndex(line => line.startsWith('weightage'));
//     WT = infoLines[index2].split(' ')[1]
//   } else {
//     WT = 0
//   }


//   //To extract comments:
//   const commentIndex1 = infoLines.findIndex(line => line.startsWith('long')) !== -1 ? infoLines.findIndex(line => line.startsWith('long')) : infoLines.findIndex(line => line.startsWith('short'))
//   const comment1 = infoLines[commentIndex1]


//   const commnetIndex2 = infoLines.findIndex(line => line.startsWith('potential'))
//   const comment2 = infoLines[commnetIndex2]


//   // MySQL database connection configuration
//   const db_config = {
//     host: "localhost",
//     user: "root",
//     password: "Rutuja_2001",
//     database: "alldata"
//   };

//   // Create a MySQL connection pool
//   const pool = mysql.createPool(db_config);


//   // ( start function2 )

//   // Function to fetch company names from MySQL table
//   function fetchCompanyNames(callback) {
//     pool.query("SELECT name FROM stockinfo WHERE uploaddate = '20240411'", (error, results) => {
//       if (error) {
//         console.error('Error fetching company names:', error);
//         return;
//       }
//       const companyNames = results.map(result => result.name);
//       callback(companyNames);
//     });
//   }


//   // ( end function2 )



//   // ( start function3 )
//   // Function to find top correlated names with the input string
//   function findTopCorrelated(inputString, companyNames) {
//     const similarities = companyNames.map(name => ({
//       name,
//       similarity: stringSimilarity.compareTwoStrings(inputString.toLowerCase(), name.toLowerCase())
//     }));

//     const topCorrelatedNames = similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
//     return topCorrelatedNames;
//   }
//   // ( end function3 )


//   // Define the input string
//   const inputString = ${name};
//   // const inputString = prompt("Enter a company name:")

//   // Connect to MySQL database and perform operations
//   pool.getConnection((err) => {
//     if (err) {
//       console.error('Error connecting to database:', err.stack);
//       return;
//     }

//     fetchCompanyNames(companyNames => {
//       const topCorrelatedNames = findTopCorrelated(inputString, companyNames);
//       console.log(Console.log "${inputString}":);
//       topCorrelatedNames.forEach((entry, index) => {
//         console.log(${index + 1}. ${entry.name} (Similarity: ${entry.similarity}));
//       });

//       // Print the best match name (the first name in the topCorrelatedNames array)
//       let bestMatchName = topCorrelatedNames[0].name;
//       console.log(Best Match Name: ${bestMatchName});




//       // Create the object after collecting data from the Python script
//       const data = {
//         recodate: recordedDate,
//         name: name,
//         // name: bestMatchName,
//         cmp: actionLine[endIndex + 1],
//         addupto: actionLine[adduptoIndex + 1],
//         sl: actionLine[slIndex + 1],
//         target1: T1 || 0,
//         target2: T2 || 0,
//         target3: T3 || 0,
//         target4: T4 || 0,
//         target5: T5 || 0,
//         target6: T6 || 0,
//         target7: T7 || 0,
//         target8: T8 || 0,
//         target9: T9 || 0,
//         timeframe: TF,
//         weightage: WT,
//         comment1: comment1,
//         comment2: comment2
//       };
//       console.log(data);
//       return data;

//     });
//   });
// }

// // ( end function1 )




{/*


function getRecommendations(infostring) {
  console.log("Input String:", infostring);

  // Define the hardcoded data object
  const data = {
    recodate: "20240412",
    name: "20 microns",
    cmp: "24.60",
    addupto: "30.00",
    sl: "23.60",
    target1: "48.90",
    target2: "23.33",
    target3: "45.60",
    target4: "89.89",
    target5: "233",
    target6: "45.60",
    target7: "89.89",
    target8: "233.3",
    target9: "233.3",
    timeframe: "5/9/7",
    weightage: "7",
    comment1: "LongComment",
    comment2: "PotentialComment"
  };

  console.log(data);

  return data;
}
*/}



const sendRecommendationNotification = async ({ recommendation }, context) => {

  console.log(recommendation)
  let { applicationid,
    client,
    lang,
    z_id, name } = recommendation;
  console.log({
    applicationid,
    client,
    lang,
    z_id, name
  })
  const { login_username } = context;

  authenticationJWT.checkUser(login_username);




  let subscriptions = await subscriptionservices.subscriptions({
    applicationid,
    client,
    lang
  }, context)

  subscriptions.forEach(element => {

    // let options={

    //   body:name,
    //   dir:'ltr',
    //   lang:'en-US',
    //   vibrate:[100,50,200],
    //   }






    let options = {
      body: name,
      icon: 'https://img.icons8.com/color/search/96',
      image: 'https://img.icons8.com/search',
      dir: 'ltr',
      lang: 'en-US',
      vibrate: [100, 50, 200],
      badge: 'https://img.icons8.com/color/search/96',
      tag: 'confirm-notification',
      renotify: true,
      actions: [
        { action: 'confirm', title: 'ok', icon: 'https://img.icons8.com/color/search/96' },
        { action: 'cancel', title: 'cancel', icon: 'https://img.icons8.com/color/search/96' }
      ]
    }


    let notification = {
      title: name,
      options: options
    }




    subscriptionservices.sendNotification(element.subobj, notification)

  });




}



const saveRecommendation =
  async (dataJSON, context) => {

    const { login_username } = context;

    authenticationJWT.checkUser(login_username);
    console.log(dataJSON)
    const { applicationid, client, lang, z_id, t_id,
      name,
      recodate,
      cmp,
      addupto,
      sl,
      target1,
      target2,
      target3,
      target4,
      target5,
      target6,
      target7,
      target8,
      target9,
      comment1,
      comment2,
      comment3,
      weightage,
      timeframe, reffiles } = dataJSON;



    if (!name) { throw new Error('You must provide and name.'); }

    const prisma = new PrismaClient()




    if (z_id === null || z_id === undefined || z_id === "") {


      const _idGenerated = await masterdataServices.getUniqueID();



      const recotobeCreated = datetimeService.setDateUser({
        z_id: _idGenerated,
        applicationid, client, lang, t_id,
        name,
        recodate,
        cmp,
        addupto,
        sl,
        target1,
        target2,
        target3,
        target4,
        target5,
        target6,
        target7,
        target8,
        target9,
        comment1,
        comment2,
        comment3,
        weightage,
        timeframe,
        reffiles
      }, 'I', login_username);

      const recommendationCreated = await prisma.recommendations.create({
        data: recotobeCreated
      })
      await prisma.$disconnect();
      return recommendationCreated;



    }
    else {
      const recotobeUpdated = datetimeService.setDateUser({

        name,
        recodate,
        cmp,
        addupto,
        sl,
        target1,
        target2,
        target3,
        target4,
        target5,
        target6,
        target7,
        target8,
        target9,
        comment1,
        comment2,
        comment3,
        weightage,
        timeframe,
        reffiles
      }, 'U', login_username);
      const recommendationUpdated = await prisma.recommendations.update({

        where: {

          z_id
        },
        data: recotobeUpdated
      })

      await prisma.$disconnect();
      return recommendationUpdated;

    }
  }






const recommendations = async (args, context, info) => {
  const { applicationid, client, lang, z_id } = args

  // const {login_username} =context;
  // authenticationJWT.checkUser(login_username);
  const login_username = "rvp123";


  try {
    const prisma = new PrismaClient()

    if (z_id === null || z_id === undefined || z_id === "") {

      const recommendations_list = await prisma.recommendations.findMany({
        where: {
          applicationid,
          lang,
          client,
        }
      })
      await prisma.$disconnect()
      return recommendations_list;



    }
    else {


      const recommendations_list = await prisma.recommendations.findMany({
        where: {
          applicationid,
          lang,
          client,
          z_id
        }
      })
      await prisma.$disconnect()
      return recommendations_list;

    }


  }
  catch (e) {


    throw new Error('Error fetching Recommendations');
  }




}












const deleteRecommendation =
  async (
    dataJSON, context
  ) => {

    const { login_username } = context;
    authenticationJWT.checkUser(login_username);

    const { applicationid, client, lang, username, z_id } = dataJSON;


    try {
      const prisma = new PrismaClient()
      const deletedRecommendation = await prisma.recommendations.delete({
        where: {
          z_id
        },
      })

      await prisma.$disconnect()
      return deletedRecommendation;
    } catch (err) {

      throw new Error('Unable to delete Recommendation');
    }

  }

export default { deleteRecommendation, recommendations, saveRecommendation, sendRecommendationNotification, getRecommendations }