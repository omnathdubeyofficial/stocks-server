import { exec } from 'child_process';
// const { spawn } = require('child_process');
import dotenv from 'dotenv';
dotenv.config();
import masterdataServices from './masterdataServices';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import datetimeService from './dateTimeServices';
import authenticationJWT from './authenticationJWT';
import moment from 'moment';

const savestocksnews =
  async (dataJSON) => {
    const login_username = "rvp123";
    console.log(dataJSON)
    const { applicationid, client, lang, z_id, t_id,
      news, delimeter, delimetercount, newsdate,
      isread
    } = dataJSON;

    // if (isread == "N") {
    //   await saveindividualnews(dataJSON);
    // }

    if (!news) { throw new Error('You must provide school name.'); }

    const prisma = new PrismaClient()
    if (z_id === null || z_id === undefined || z_id === "") {
      const _idGenerated = await masterdataServices.getUniqueID();
      const recotobeCreated = datetimeService.setDateUser({
        z_id: _idGenerated,
        applicationid, client, lang, t_id,
        news, delimeter, delimetercount, newsdate,
        isread: "N"
      }, 'I', login_username);

      if (recotobeCreated.isread == "N") {
        await saveindividualnews(dataJSON);
      }

      const stocknewsCreated = await prisma.stocknews.create({
        data: recotobeCreated
      })
      await prisma.$disconnect();
      return stocknewsCreated;
    }
    else {
      const recotobeUpdated = datetimeService.setDateUser({
        news, delimeter, delimetercount, newsdate, isread
      }, 'U', login_username);
      const stocknewsUpdated = await prisma.stocknews.update({
        where: {
          z_id
        },
        data: recotobeUpdated
      })
      await prisma.$disconnect();
      return stocknewsUpdated;
    }

  }




const saveindividualnews = async (dataJSON) => {
  const login_username = "rvp123";
  const { applicationid, client, lang, t_id, news, delimeter, newsdate } = dataJSON;

  let Date = () => {
    let now = moment();
    return now.format("YYYYMMDD")
  }
  // console.log(sysdate());

  let Time = () => {
    let now = moment();
    return now.format("HHmmss")
  }

  const prisma = new PrismaClient();

  try {
    const companyNews = news.split(/\n\s*\n/);

    for (let i = 0; i < companyNews.length; i++) {
      let companyName;
      if (companyNews[i].startsWith(delimeter)) {
        let companyNames = companyNews[i].split(delimeter).filter(item => item.trim() !== '');
        companyName = companyNames[0];
      } else {
        let companyNames = companyNews[i].split(delimeter).filter(item => item.trim() !== '');
        companyName = companyNames[1];
      }

      const _idGenerated = await masterdataServices.getUniqueID();
      const query = Prisma.sql`INSERT INTO individualnews (applicationid, client, lang, z_id, t_id, companyname, companynews, date, isread, recocompany, cdate, ctime, cuser, udate, utime, uuser, ddate, dtime, duser) VALUES (${applicationid}, ${client}, ${lang}, ${_idGenerated}, ${t_id}, ${companyName}, ${companyNews[i]}, ${newsdate}, ${"N"}, '', ${Date()}, ${Time()}, ${login_username}, '', '', '', '', '', '')`;

      await prisma.$queryRaw(query);

      // Execute the Python script with the company name as an argument
      exec(`python C:\\Users\\navne\\Desktop\\stocks-server\\script.py "${companyName}"`, async (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`)
        }
        console.log(`stdout: ${stdout}`);
        // console.error(`stderr: ${stderr}`);

        const bestMatchName = stdout.trim();

        // Update recocompany in the database
        const updateQuery = Prisma.sql`UPDATE individualnews SET recocompany = ${bestMatchName} WHERE companyname = ${companyName}`;
        await prisma.$queryRaw(updateQuery);
console.log("**************" , bestMatchName)

      });

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
      const stocknews_list = await prisma.stocknews.findMany({
        where: {
          applicationid,
          lang,
          client,
        }
      })
      await prisma.$disconnect()
      return stocknews_list;
    }
    else {
      const stocknews_list = await prisma.stocknews.findMany({
        where: {
          applicationid,
          lang,
          client,
          z_id
        }
      })
      await prisma.$disconnect()
      return stocknews_list;
    }
  }
  catch (e) {
    throw new Error('Error fetching Recommendations');
  }
}

const deletestocknews = async (dataJSON) => {
  // const login_username = "rvp123";
  const { applicationid, client, lang, z_id } = dataJSON;
  try {
    const prisma = new PrismaClient()
    const deletedstocknews = await prisma.stocknews.delete({
      where: {
        z_id
      },
    })
    await prisma.$disconnect();
    return deletedstocknews;
  } catch (err) {
    throw new Error('Unable to delete stocksnews');
  }
}

export default { deletestocknews, stocksnews, savestocksnews };