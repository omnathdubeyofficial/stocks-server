import dotenv from 'dotenv';
dotenv.config();
import {
  getStocksQry 
} from '../common/sqlQueries';


//import PrismaClient from '@prisma/client';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;




const getStocks = async (args, context, info) =>
{

    try 
    {
        const prisma = new PrismaClient()
        const result = await prisma.$queryRaw`select distinct name from vstockinfo`
       await prisma.$disconnect();
       return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}


const getUniqueID = async () =>
{

    try 
    {
         const prisma = new PrismaClient()
        const result = await prisma.$queryRaw`select UUID() AS z_id`
       await prisma.$disconnect();
       return result[0].z_id  ;        
    } 
    catch (error) 
    {
        console.log(error)
      throw new Error('Unable to getUniqueID');
           
    }



}


export default {getStocks,getUniqueID}