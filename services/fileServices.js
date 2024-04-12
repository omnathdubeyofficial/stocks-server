import dotenv from 'dotenv';
dotenv.config();
 


import masterdataServices from '../services/masterdataServices';
//import { PrismaClient } from '.prisma/client/index';
//import  { PrismaClient }  from '@prisma/client';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import datetimeService from '../services/dateTimeServices'; 
import authenticationJWT from '../services/authenticationJWT'

//import { PrismaClient, Prisma } from '@prisma/client'



  const  saveFile =
  async (dataJSON,context) => {

     const {login_username} =context;
   //  authenticationJWT.checkUser(login_username);
  
    const { applicationid, client, lang, z_id, t_id,
        fileid,filepath,filename,filetype,filesize } = dataJSON;

    if (!fileid) { throw new Error('You must provide fileid'); }
  
    const prisma = new PrismaClient()


    

    if (z_id === null || z_id === undefined || z_id === "" ) {

      
      const _idGenerated = await masterdataServices.getUniqueID();


      const filetobeCreated=datetimeService.setDateUser( {
        z_id: _idGenerated,
        applicationid, client, lang, t_id,
        fileid,filepath,filename,filetype,filesize
      },'I',login_username);
 
      const fileCreated = await prisma.files.create({
        data: filetobeCreated
      })
      await prisma.$disconnect();
      return fileCreated;



    }
    else {
      const filetobeUpdated=datetimeService.setDateUser(  {

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
        timeframe
      },'U',login_username);
      const fileUpdated = await prisma.files.update({

        where: {

          z_id
        },
        data: filetobeUpdated
      })

      await prisma.$disconnect();
      return fileUpdated;


    }





  }





  const  logicaldeleteFile =
  async (dataJSON,context) => {

     const {login_username} =context;
   //  authenticationJWT.checkUser(login_username);
  
    const { applicationid, client, lang, z_id, t_id,
        fileid,filepath } = dataJSON;

    if (!z_id) { throw new Error('You must provide fileid'); }
  
    try {
    const prisma = new PrismaClient()



      const filetobeUpdated=datetimeService.setDateUser(  {


      },'D',login_username);
      const fileUpdated = await prisma.files.update({

        where: {

          z_id
        },
        data: filetobeUpdated
      })

      await prisma.$disconnect();
      return fileUpdated;
    } catch (err) {
      console.log(err)
      throw new Error('Unable to delete File');
    }

    





  }

  






  


  const deleteFile =
  async (
    dataJSON,context
  ) => {

    const {login_username} =context;
    authenticationJWT.checkUser(login_username);

    const { applicationid, client, lang, username, z_id } =dataJSON;


    try {
      const prisma = new PrismaClient()
      const deletedFile = await prisma.files.delete({
        where: {
          z_id
        },
      })

      await prisma.$disconnect()
      return deletedFile;
    } catch (err) {
      console.log(err)
      throw new Error('Unable to delete File');
    }

  }

  export default {deleteFile,saveFile,logicaldeleteFile}
