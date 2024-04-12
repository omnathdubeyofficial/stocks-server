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
  
    const {login_username} =context;
    authenticationJWT.checkUser(login_username);


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
