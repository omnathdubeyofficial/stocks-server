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
import natural from 'natural';
const { JaroWinklerDistance } = natural;


function RecommendationObject(infostring) {
  let infoString = infostring.replace("beliw", "below")

  // Split the input string into lines:
  const infoLines = infoString.split('\n').map(line => line.trim()).filter(line => line !== '');

  //To extract the date: check the line which is starts with digit:
  const index = infoLines.findIndex(line => /^\d/.test(line));

  //To extract the name:
  const index1 = infoLines.findIndex(line => line.startsWith('buy'));
  const actionLine = infoLines[index1].split(' ');
  const startIndex = actionLine.indexOf('buy')
  const endIndex = actionLine.indexOf('cmp')
  let name = actionLine.slice(startIndex + 1, endIndex).join(' ')

  //To extract the targets:
  const targetsStartIndex = actionLine.indexOf('target') !== -1 ? actionLine.indexOf('target') : actionLine.indexOf('tgt');
  const len1 = Object.values(actionLine).length
  let targets;
  let T1, T2, T3, T4, T5, T6, T7, T8, T9;
  if (len1 - 1 == targetsStartIndex + 1) {
    targets = actionLine[targetsStartIndex + 1].split("/").map(item => item.trim())
    T1 = targets[0]
    T2 = targets[1]
    T3 = targets[2]
    T4 = targets[3]
    T5 = targets[4]
    T6 = targets[5]
    T7 = targets[6]
    T8 = targets[7]
    T9 = targets[8]
  }
  else {
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
  const slIndex = actionLine.indexOf('below') !== -1 ? actionLine.indexOf('below') : actionLine.indexOf('stop')
  const adduptoIndex = actionLine.indexOf('till')
  let TF;
  if (infoString.includes('timeframe')) {
    let index3 = infoLines.findIndex(line => line.startsWith('timeframe'));
    TF = infoLines[index3].split(' ')[1]
  } else {
    TF = 0
  }


  //To extract the weightage:
  let WT;
  if (infoString.includes('weightage')) {
    const index2 = infoLines.findIndex(line => line.startsWith('weightage'));
    WT = infoLines[index2].split(' ')[1]
  } else {
    WT = 0
  }


  //To extract comments:
  const commentIndex1 = infoLines.findIndex(line => line.startsWith('long')) !== -1 ? infoLines.findIndex(line => line.startsWith('long')) : infoLines.findIndex(line => line.startsWith('short'))
  const comment1 = infoLines[commentIndex1]


  const commnetIndex2 = infoLines.findIndex(line => line.startsWith('potential'))
  const comment2 = infoLines[commnetIndex2]


  // MySQL database connection configuration
  const db_config = {
    host: "localhost",
    user: "root",
    password: "omnath8055",
    database: "alldata"
  };

  // Create a MySQL connection pool
  const pool = mysql.createPool(db_config);

  // Function to fetch company names from MySQL table
  function fetchCompanyNames(callback) {
    pool.query("SELECT name FROM stockinfo WHERE uploaddate = '20240411'", (error, results) => {
      if (error) {
        console.error('Error fetching company names:', error);
        return;
      }
      const companyNames = results.map(result => result.name);
      callback(companyNames);
    });
  }

  // Function to find top correlated names with the input string
  function findTopCorrelated(inputString, companyNames) {
    const similarities = companyNames.map(name => ({
      name,
      similarity: JaroWinklerDistance(inputString.toLowerCase(), name.toLowerCase())
    }));

    const topCorrelatedNames = similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
    return topCorrelatedNames;
  }

  // Define the input string
  const inputString = `${name}`;
  // const inputString = prompt("Enter a company name:")

  // Connect to MySQL database and perform operations
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err.stack);
      return;
    }

    fetchCompanyNames(companyNames => {
      const topCorrelatedNames = findTopCorrelated(inputString, companyNames);
      console.log(`Top correlated names for "${inputString}":`);
      topCorrelatedNames.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.name} (Similarity: ${entry.similarity})`);
      });

      // Print the best match name (the first name in the topCorrelatedNames array)
      let bestMatchName = topCorrelatedNames[0].name;
      console.log(`Best Match Name: ${bestMatchName}`);

      // Create the object after collecting data from the Python script
      let data = {
        recodate: infoLines[index],
        name: bestMatchName,
        cmp: actionLine[endIndex + 1],
        addupto: actionLine[adduptoIndex + 1],
        sl: actionLine[slIndex + 1],
        target1: T1,
        target2: T2,
        target3: T3,
        target4: T4,
        target5: T5,
        target6: T6,
        target7: T7,
        target8: T8,
        target9: T9,
        timeframe: TF,
        weightage: WT,
        comment1: comment1,
        comment2: comment2
      };

      console.log(data);

      // Release the MySQL connection
      connection.release();

      // Close the MySQL connection pool and terminate the Node.js process
      pool.end((err) => {
        if (err) {
          console.error('Error closing the pool:', err.stack);
        } else {
          console.log('MySQL connection pool closed.');
          process.exit(0); // Terminate the Node.js process with a success code
        }
      });
    });
  });
}


let text = `LONG TERM INVESTMENT
POTENTIAL MULTIBAGGER
27.4.24

BUY GSPL - GUJARAT STATE PETRONET LTD cmp 293.00 add on dips till 240.00.00 stop below 212.00 target 370.00 / 510.00 / 800.00

Weightage 6%
Timeframe 12-24 months`;

//To convert text into lowercase:
text = text.toLowerCase();

RecommendationObject(text);


const  sendRecommendationNotification =async ({ recommendation} ,context )=>
{

  console.log(recommendation)
   let {applicationid ,
    client,
    lang,
    z_id,name} = recommendation;
    console.log({applicationid ,
      client,
      lang,
      z_id,name})
    const {login_username} =context;
     
    authenticationJWT.checkUser(login_username);

 

  
 let subscriptions= await subscriptionservices.subscriptions({applicationid ,
  client,
  lang},context)
  
  subscriptions.forEach(element => {
  
    // let options={
      
    //   body:name,
    //   dir:'ltr',
    //   lang:'en-US',
    //   vibrate:[100,50,200],
    //   }
      
   
 
     


        let options={
    body:name,
    icon:'https://img.icons8.com/color/search/96',
    image:'https://img.icons8.com/search',
    dir:'ltr',
    lang:'en-US',
    vibrate:[100,50,200],
    badge:'https://img.icons8.com/color/search/96',
    tag:'confirm-notification' ,
    renotify:true,
    actions:[
      {action:'confirm',title:'ok',icon:'https://img.icons8.com/color/search/96'},
      {action:'cancel',title:'cancel',icon:'https://img.icons8.com/color/search/96'}
    ]
  }


  let notification ={
    title:name,
    options:options
  }




    subscriptionservices.sendNotification(element.subobj,notification)
  
  });
  
 


}



  const  saveRecommendation =
  async (dataJSON,context) => {

     const {login_username} =context;
     
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
      timeframe,reffiles } = dataJSON;



    if (!name) { throw new Error('You must provide and name.'); }
  
    const prisma = new PrismaClient()


    

    if (z_id === null || z_id === undefined || z_id === "" ) {

      
      const _idGenerated = await masterdataServices.getUniqueID();

    

      const recotobeCreated=datetimeService.setDateUser( {
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
      },'I',login_username);
 
      const recommendationCreated = await prisma.recommendations.create({
        data: recotobeCreated
      })
      await prisma.$disconnect();
      return recommendationCreated;



    }
    else {
      const recotobeUpdated=datetimeService.setDateUser(  {

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
      },'U',login_username);
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
        else{

        
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
    dataJSON,context
  ) => {

    const {login_username} =context;
    authenticationJWT.checkUser(login_username);

    const { applicationid, client, lang, username, z_id } =dataJSON;


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

  export default {deleteRecommendation,recommendations,saveRecommendation,sendRecommendationNotification}






















  import mysql from 'mysql';

// Function to establish a MySQL connection
function establishConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "omnath8055",
    database: "alldata"
  });
}

// Function to fetch company names from the stockinfo table
function fetchCompanyNames(callback) {
  const connection = establishConnection();

  connection.connect(err => {
    if (err) {
      console.error('Error connecting to database:', err.stack);
      return;
    }
    console.log('Connected to MySQL database.');

    const query = "SELECT name FROM stockinfo WHERE uploaddate = '20240411'";
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching company names:', error);
        connection.end();
        return;
      }
      const companyNames = results.map(result => result.name);
      callback(companyNames);
      connection.end();
    });
  });
}

// Function to calculate Jaro-Winkler distance between two strings
function JaroWinklerDistance(s1, s2) {
  // Implementation of the Jaro-Winkler distance algorithm
  // You can find the algorithm implementation from various sources or libraries
  // Here is a simple implementation for demonstration purposes
  const p = 0.1; // Winkler's constant
  let l = 0; // Length of matching prefix
  let m = 0; // Number of matching characters
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    if (s1[i] === s2[i]) {
      m++;
    } else {
      break;
    }
  }
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    if (s1[s1.length - i - 1] === s2[s2.length - i - 1]) {
      l++;
    } else {
      break;
    }
  }
  const jaroDistance = (m / Math.max(s1.length, s2.length));
  const jaroWinklerDistance = jaroDistance + (l * p * (1 - jaroDistance));
  return jaroWinklerDistance;
}

// Function to find top correlated company names based on input string
function findTopCorrelated(inputString, companyNames) {
  const similarities = companyNames.map(name => ({
    name,
    similarity: JaroWinklerDistance(inputString.toLowerCase(), name.toLowerCase())
  }));

  const topCorrelatedNames = similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  return topCorrelatedNames;
}

// Sample input string
const inputString = "ucal";

// Fetching company names and finding top correlated names
fetchCompanyNames(companyNames => {
  const topCorrelatedNames = findTopCorrelated(inputString, companyNames);
  console.log(`Top correlated names for "${inputString}":`);
  topCorrelatedNames.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.name} (Similarity: ${entry.similarity})`);
  });

  const bestMatchName = topCorrelatedNames[0].name;
  console.log(`Best Match Name: ${bestMatchName}`);
});
