import dotenv from 'dotenv';
dotenv.config();
import masterdataServices from './masterdataServices';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import datetimeService from './dateTimeServices';
import authenticationJWT from './authenticationJWT';

const savestocksnews = async (dataJSON) => {
  const login_username = "rvp123";
  console.log(dataJSON);
  const { applicationid, client, z_id, lang, t_id, paragraph,date } = dataJSON;

  // Regular expression to match name within symbols
  const nameRegex = /(?:[@!#$%^&*()?`])([^\s@!#$%^&*()?`]+)(?:[@!#$%^&*()?`])/;

  // Extract company name from paragraph if it appears within symbols
  const match = paragraph.match(nameRegex);
  let cname = '';
  if (match) {
    cname = match[1]; // Extract name within symbols
  }

  const prisma = new PrismaClient();

  if (z_id === null || z_id === undefined || z_id === "") {
    const _idGenerated = await masterdataServices.getUniqueID();
    const recotobeCreated = datetimeService.setDateUser(
      {
        z_id: _idGenerated,
        applicationid,
        client,
        lang,
        t_id,
        cname, // Use extracted company name
        paragraph ,// Keep paragraph intact
        date
      },
      'I',
      login_username
    );

    const sportsdataCreated = await prisma.stocksnews.create({
      data: recotobeCreated,
    });

    await prisma.$disconnect();
    console.log(`Saved company name: ${cname}`);
    return sportsdataCreated;
  } else {
    const recotobeUpdated = datetimeService.setDateUser(
      {
        cname, // Use extracted company name
        paragraph ,// Keep paragraph intact
        date
      },
      'U',
      login_username
    );

    const sportsdataUpdated = await prisma.stocksnews.update({
      where: {
        z_id,
      },
      data: recotobeUpdated,
    });

    await prisma.$disconnect();
    console.log(`Updated company name: ${cname}`);
    return sportsdataUpdated;
  }
};

const stocksnews = async (args) => {
  const { applicationid, client, lang, z_id } = args
  try {
    const prisma = new PrismaClient()
    if (z_id === null || z_id === undefined || z_id === "") {
      const sportsdata_list = await prisma.stocksnews.findMany({
        where: {
          applicationid,
          lang,
          client,
        }
      })
      await prisma.$disconnect()
      return sportsdata_list;
    }
    else {
      const sportsdata_list = await prisma.stocksnews.findMany({
        where: {
          applicationid,
          lang,
          client,
          z_id
        }
      })
      await prisma.$disconnect()
      return sportsdata_list;
    }
  }
  catch (e) {
    throw new Error('Error fetching Recommendations');
  }
}

const deletestocksnews = async (dataJSON) => {
  const login_username = "rvp123";
  const { applicationid, client, lang,  z_id } = dataJSON;
  try {
    const prisma = new PrismaClient()
    const deletedsportsdata = await prisma.stocksnews.delete({
      where: {
        z_id
      },
    })
    await prisma.$disconnect()
    return deletedsportsdata;
  } catch (err) {
    throw new Error('Unable to delete stocksnews');
  }
}

export default { deletestocksnews, stocksnews, savestocksnews };
