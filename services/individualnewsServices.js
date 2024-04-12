import dotenv from 'dotenv';
dotenv.config();
import masterdataServices from './masterdataServices';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import datetimeService from './dateTimeServices';
import authenticationJWT from './authenticationJWT'


const individualnews = async (args) => {
  const { applicationid, client, lang, z_id } = args

  const login_username = "rvp123";

  try {
    const prisma = new PrismaClient();

    if (z_id === null || z_id === undefined || z_id === "") {

      const individualnews_list = await prisma.individualnews.findMany({
        where: {
          applicationid,
          lang,
          client,
        }
      })
      await prisma.$disconnect()
      return individualnews_list;
    }
    else {
      const individualnews_list = await prisma.individualnews.findMany({
        where: {
          applicationid,
          lang,
          client,
          z_id
        }
      })
      await prisma.$disconnect()
      return individualnews_list;

    }
  }
  catch (e) {
    throw new Error('Error fetching Stocknews');
  }
}


const deleteindividualnews =
  async (
    dataJSON, context
  ) => {

    //const { login_username } = context;
    //authenticationJWT.checkUser(login_username);
    const login_username = 'rvp123';
    const { applicationid, client, lang, username, z_id } = dataJSON;


    try {
      const prisma = new PrismaClient()
      const deletedStocknews = await prisma.individualnews.delete({
        where: {
          z_id
        },
      })

      await prisma.$disconnect()
      return deletedStocknews;
    } catch (err) {

      throw new Error('Unable to delete Recommendation');
    }

  }


export default { deleteindividualnews, individualnews }