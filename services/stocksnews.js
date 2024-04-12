import dotenv from 'dotenv';
dotenv.config();
import masterdataServices from './masterdataServices';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import datetimeService from './dateTimeServices';
import authenticationJWT from './authenticationJWT';

const savestocksnews =
  async (dataJSON) => {
    const login_username = "rvp123";
    console.log(dataJSON)
    const { applicationid, client, lang, z_id, t_id,
      news, delimeter, delimetercount, newsdate, isread
    } = dataJSON;

    if (isread === "N") {
      await saveindividualnews(dataJSON);
    }

    if (!news) { throw new Error('You must provide school name.'); }
    const prisma = new PrismaClient()
    if (z_id === null || z_id === undefined || z_id === "") {
      const _idGenerated = await masterdataServices.getUniqueID();
      const recotobeCreated = datetimeService.setDateUser({
        z_id: _idGenerated,
        applicationid, client, lang, t_id,
        news, delimeter, delimetercount, newsdate, isread : "N"
      }, 'I', login_username);
      const schoolCreated = await prisma.stocknews.create({
        data: recotobeCreated
      })
      await prisma.$disconnect();
      return schoolCreated;
    }
    else {
      const recotobeUpdated = datetimeService.setDateUser({
        news, delimeter, delimetercount, newsdate, isread
      }, 'U', login_username);
      const schoolUpdated = await prisma.stocknews.update({
        where: {
          z_id
        },
        data: recotobeUpdated
      })
      await prisma.$disconnect();
      return schoolUpdated;
    }
  }


const saveindividualnews = async (dataJSON) => {
  const login_username = "rvp123";
  console.log(dataJSON);
  const { applicationid, client, lang, t_id, news, delimeter, delimetercount, date, isread } = dataJSON;

  try {
    let companies = [];

    // Extract company names from the news
    const items = news.split(' ');
    for (let i = 0; i < items.length; i++) {
      if (items[i].startsWith(delimeter.repeat(delimetercount)) && items[i].endsWith(delimeter.repeat(delimetercount))) {
        companies.push(items[i].replaceAll(delimeter.repeat(delimetercount), ''));
      }
    }

    console.log(companies);

    // Split news into individual news items
    const allnews = news.split(".");
    let result = [];
    for (const singlenews of allnews) {
      result.push(singlenews);
    }

    console.log(result);

    const prisma = new PrismaClient();


    for (let i = 0; i < companies.length; i++) {
      const _idGenerated = await masterdataServices.getUniqueID();
      const query = Prisma.sql`INSERT INTO individualnews (applicationid, client, lang, z_id, t_id, companyname, companynews, date, isread, cdate, ctime, cuser, udate, utime, uuser, ddate, dtime, duser) VALUES (${applicationid}, ${client}, ${lang}, ${_idGenerated}, ${t_id}, ${companies[i]}, ${result[i]}, ${date}, ${isread}, now(), now(), ${login_username}, '', '', '', '', '', '')`;

      await prisma.$queryRaw(query);

    }

    await prisma.$disconnect();
  } catch (e) {
    console.error("Error saving individual news:", e);
    throw new Error("Error saving individual news");
  }
};



const stocksnews = async (args) => {
  const { applicationid, client, lang, z_id } = args
  try {
    const prisma = new PrismaClient()
    if (z_id === null || z_id === undefined || z_id === "") {
      const sportsdata_list = await prisma.stocknews.findMany({
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
      const sportsdata_list = await prisma.stocknews.findMany({
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

const deletestocknews = async (dataJSON) => {
  const login_username = "rvp123";
  const { applicationid, client, lang, z_id } = dataJSON;
  try {
    const prisma = new PrismaClient()
    const deletedsportsdata = await prisma.stocknews.delete({
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

export default { deletestocknews, stocksnews, savestocksnews };