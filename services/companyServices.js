import dotenv from 'dotenv';
dotenv.config();
import masterdataServices from './masterdataServices';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import datetimeService from './dateTimeServices';
import authenticationJWT from './authenticationJWT';


const savecompanystatus =
  async (dataJSON) => {
    const login_username = "rvp123";
    console.log(dataJSON)
    const { applicationid, client, lang, z_id, t_id,
      companyname, status, reviewdate, comment
    } = dataJSON;


    const prisma = new PrismaClient();

    console.log("Hello......")
    if (z_id === null || z_id === undefined || z_id === "") {
      const _idGenerated = await masterdataServices.getUniqueID();
      console.log("z_id is:", _idGenerated)
      const recotobeCreated = datetimeService.setDateUser({
        z_id: _idGenerated,
        applicationid, client, lang, t_id,
        companyname,
        status,
        reviewdate,
        comment
      }, 'I', login_username);

// Check if email ID already exists
const existdatacompanyname = await prisma.companystatus.findFirst({
  where: {
    companyname
  },
});

if (existdatacompanyname) {
  throw new Error("Company Name Already Exists");
} 



      console.log("Created records**:", recotobeCreated)

      const companystatusCreated = await prisma.companystatus.create({
        data: recotobeCreated
      })
      console.log("*Data in mysql table:", companystatusCreated)
      await prisma.$disconnect();
      return companystatusCreated;
    }
    else {
      const recotobeUpdated = datetimeService.setDateUser({
        companyname, status, reviewdate, comment
      }, 'U', login_username);
      const companystatusUpdated = await prisma.companystatus.update({
        where: {
          z_id
        },
        data: recotobeUpdated
      })
      await prisma.$disconnect();
      return companystatusUpdated;
    }

  }


const companystatuslists = async (args) => {
  const { applicationid, client, lang, z_id } = args


  const login_username = "rvp123";

  try {
    const prisma = new PrismaClient()

    if (z_id === null || z_id === undefined || z_id === "") {

      const companystatus_list = await prisma.companystatus.findMany({
        where: {
          applicationid,
          lang,
          client,
        }
      })
      await prisma.$disconnect()
      return companystatus_list;
    }
    else {
      const companystatus_list = await prisma.companystatus.findMany({
        where: {
          applicationid,
          lang,
          client,
          z_id
        }
      })
      await prisma.$disconnect()
      return companystatus_list;
    }
  }
  catch (e) {
    throw new Error('Error fetching companystatus');
  }
}


const deletecompanystatus =
  async (
    dataJSON
  ) => {

    const login_username = 'rvp123';

    const { applicationid, client, lang, username, z_id } = dataJSON;

    try {
      const prisma = new PrismaClient()
      const deletedcompanystatus = await prisma.companystatus.delete({
        where: {
          z_id
        },
      })

      await prisma.$disconnect()
      return deletedcompanystatus;
    } catch (err) {

      throw new Error('Unable to delete companystatus');
    }

  }

export default { deletecompanystatus, companystatuslists, savecompanystatus }