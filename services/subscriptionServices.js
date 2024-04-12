import dotenv from 'dotenv';
dotenv.config();
import webpush from 'web-push'
 


import masterdataServices from '../services/masterdataServices';
//import { PrismaClient } from '.prisma/client/index';
//import  PrismaClient  from '@prisma/client';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import datetimeService from '../services/dateTimeServices'; 
import authenticationJWT from '../services/authenticationJWT'

//import { PrismaClient, Prisma } from '@prisma/client'



  const  saveSubscription =
  async (dataJSON,context) => {

     const {login_username} =context;
   //  authenticationJWT.checkUser(login_username);
  
    const { applicationid, client, lang, z_id, subobj } = dataJSON;

    if (!subobj) { throw new Error('Subscription object missing'); }
  
    


    
 
    

    if (z_id === null || z_id === undefined || z_id === "" ) {

 
      
  
   try{


    const _idGenerated = await masterdataServices.getUniqueID();

      
    const subscriptiontobeCreated=datetimeService.setDateUser( {
      z_id: _idGenerated,
      applicationid, client, lang, subobj
    },'I',login_username);



      const prisma = new PrismaClient()
      const subscriptionCreated = await prisma.subscriptions.create({
        data: subscriptiontobeCreated
      })
      await prisma.$disconnect();
      return subscriptionCreated;
     } catch (err) {
      console.log(err)
      throw new Error('Unable to create Subscription');
    }



    }
    else {
      const subscriptiontobeUpdated=datetimeService.setDateUser(  {

        applicationid, client, lang, z_id, subobj
      },'U',login_username);
      const subscriptionUpdated = await prisma.subscriptions.update({

        where: {

          z_id
        },
        data: subscriptiontobeUpdated
      })

      await prisma.$disconnect();
      return subscriptionUpdated;


    }





  }







  const deleteSubscription =
  async (
    dataJSON,context
  ) => {

    const {login_username} =context;
    authenticationJWT.checkUser(login_username);

    const { applicationid, client, lang, username, z_id } =dataJSON;


    try {
      const prisma = new PrismaClient()
      const deletedSubscription = await prisma.subscriptions.delete({
        where: {
          z_id
        },
      })

      await prisma.$disconnect()
      return deletedSubscription;
    } catch (err) {
      console.log(err)
      throw new Error('Unable to delete Subscription');
    }

  }



  
  const subscriptions = async (args, context, info) => {
    const { applicationid, client, lang, z_id } = args
  
    const {login_username} =context;
    authenticationJWT.checkUser(login_username);


      try {
        const prisma = new PrismaClient()

        if (z_id === null || z_id === undefined || z_id === "") {
      
         const subscriptions_list = await prisma.subscriptions.findMany({
            where: {
              applicationid,
              lang,
              client,
            }
          })
          await prisma.$disconnect()
          return subscriptions_list;
      

        
        }
        else{

        
          const subscriptions_list = await prisma.subscriptions.findMany({
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
    
    
        throw new Error('Error fetching subscriptions');
      }




    }
  


 





  
  const sendNotification =async (subobj ,notification)=>{

        webpush.setVapidDetails(process.env.VAPID_MAILTO,
          process.env.VAPID_PUBLICKEY,
          process.env.VAPID_PRIVATEKEY        )
          try{
    
          let obj=  await  webpush.sendNotification(subobj,JSON.stringify(notification) )
    
          }
          catch(err){
            console.log(err);
          }
        
        
      
      }
    




  export default {deleteSubscription,saveSubscription,subscriptions,sendNotification}
