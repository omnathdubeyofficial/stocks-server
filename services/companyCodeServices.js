import dotenv from 'dotenv';
dotenv.config();
import masterdataServices from './masterdataServices';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import datetimeService from './dateTimeServices';
import authenticationJWT from './authenticationJWT';

///dsfffsdfs
const savecompanycodes =
  async (dataJSON) => {
    const login_username = "rvp123";
    console.log(dataJSON)
    const { applicationid, client, lang, z_id, t_id,
     code_code, code_type, code_desc, code_desc1, code_desc2
    } = dataJSON;


    const prisma = new PrismaClient();

    console.log("Hello......")
    if (z_id === null || z_id === undefined || z_id === "") {
      const _idGenerated = await masterdataServices.getUniqueID();
      console.log("z_id is:", _idGenerated)
      const recotobeCreated = datetimeService.setDateUser({
        z_id: _idGenerated,
        applicationid, client, lang, t_id,
        code_code, code_type, code_desc, code_desc1, code_desc2
      }, 'I', login_username);

// Check if email ID already exists
//const existdatacompanyname = await prisma.companycodes.findFirst({
  //where: {
    //companyname
 // },
//});

//if (existdatacompanyname) {
 // throw new Error("Company Name Already Exists");
//} 



      console.log("Created records**:", recotobeCreated)

      const companycodesCreated = await prisma.companycodes.create({
        data: recotobeCreated
      })
      console.log("*Data in mysql table:", companycodesCreated)
      await prisma.$disconnect();
      return companycodesCreated;
    }
    else {
      const recotobeUpdated = datetimeService.setDateUser({
        code_code, code_type, code_desc, code_desc1, code_desc2
      }, 'U', login_username);
      const companycodesUpdated = await prisma.companycodes.update({
        where: {
          z_id
        },
        data: recotobeUpdated
      })
      await prisma.$disconnect();
      return companycodesUpdated;
    }

  }


const companycodeslists = async (args) => {
  const { applicationid, client, lang, z_id } = args


  const login_username = "rvp123";

  try {
    const prisma = new PrismaClient()

    if (z_id === null || z_id === undefined || z_id === "") {

      const companycodes_list = await prisma.companycodes.findMany({
        where: {
          applicationid,
          lang,
          client,
        }
      })
      await prisma.$disconnect()
      return companycodes_list;
    }
    else {
      const companycodes_list = await prisma.companycodes.findMany({
        where: {
          applicationid,
          lang,
          client,
          z_id
        }
      })
      await prisma.$disconnect()
      return companycodes_list;
    }
  }
  catch (e) {
    throw new Error('Error fetching companycodes');
  }
}


const deletecompanycodes =
  async (
    dataJSON
  ) => {

    const login_username = 'rvp123';

    const { applicationid, client, lang, username, z_id } = dataJSON;

    try {
      const prisma = new PrismaClient()
      const deletedcompanycodes = await prisma.companycodes.delete({
        where: {
          z_id
        },
      })

      await prisma.$disconnect()
      return deletedcompanycodes;
    } catch (err) {

      throw new Error('Unable to delete companycodes');
    }

  }

export default { deletecompanycodes, companycodeslists, savecompanycodes }