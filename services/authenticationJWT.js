import dotenv from 'dotenv';
dotenv.config();


import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
//import  PrismaClient  from '@prisma/client';
//import { PrismaClient } from '.prisma/client/index';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import masterdataServices from '../services/masterdataServices';
import datetimeService from '../services/dateTimeServices'; 
const secretKey = 'aaabbbccc';
import fast2sms from 'fast-two-sms';


const getUsername = async (req) =>
{
  
if (req.headers && req.headers.authorization) {
  if (req.headers.authorization != 'null')
  {
    const authorization =await req.headers.authorization
    const decoded =await jwt.decode(authorization, secretKey);
    const decoded_user = decoded.sub;
    return decoded_user.username;
  }
  else
  {
    return '';
  }
}
else{
  return '';
}
}


const generateOTP = (otp_length) => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const sendSMS = async ({ message, contactNumber }, next) => {
  try {
    const res = await fast2sms.sendMessage({
      authorization: process.env.FAST2SMS,
      message,
      numbers: [contactNumber],
    });
    console.log(res);
  } catch (error) {
    next(error);
  }
};


const generateTokenUser = function (user) {


  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user, iat: timestamp }, secretKey);
}




const verifyMobileOTPJWT = async (userData, context) => {

  const { client, lang, applicationid, username, password, mobile, email,mobileotp } = userData;


  if (!userData.mobile || !userData.mobileotp) {
    throw new Error('You must provide an mobile number and mobileotp.');
  }

  const prisma = new PrismaClient()



  const userCount = await prisma.users.count({
    where: {
      applicationid: userData.applicationid,
      lang: userData.lang,
      client: userData.client,
      mobile: userData.mobile
    }
  })

  if (userCount == 0) {
    throw new Error('Invalid Mobile Number.');
  }
  else {
    const userFound = await prisma.users.findFirst({
      where: {
        applicationid: userData.applicationid,
        lang: userData.lang,
        client: userData.client,
        mobile: userData.mobile
      }
    })

    await prisma.$disconnect()
    let validMobileotp = await bcrypt.compare(mobileotp, userFound.mobileotp);
    if (validMobileotp) {

      const token = generateTokenUser(userFound);
      return { ...userFound, token }
    }
    else {
      throw new Error('Invalid Mbile number & OTP');
    }


  }


}







const signInMobileJWT = async (userData, context) => {

  const { client, lang, applicationid, username, password, mobile, email } = userData;


  if (!mobile) {
    throw new Error('You must provide mobile number.');
  }

  const prisma = new PrismaClient()



  const userCount = await prisma.users.count({
    where: {
      applicationid: userData.applicationid,
      lang: userData.lang,
      client: userData.client,
      mobile: userData.mobile
    }
  })

  if (userCount == 0) {
    throw new Error('Invalid mobile number or Mobile number not registered.');
  }
  else {
    const userFound = await prisma.users.findFirst({
      where: {
        applicationid: userData.applicationid,
        lang: userData.lang,
        client: userData.client,
        mobile: userData.mobile
      }
    })



    const mobileotp = generateOTP(6);
    const salt = await bcrypt.genSalt(10);
    const hashmobileotp = await bcrypt.hash(mobileotp, salt);
    const  userTobeUpdated = {...userFound,mobileotp:hashmobileotp};

    console.log(userTobeUpdated);
    console.log('mobileotp',mobileotp)

    const userUpdated = await prisma.users.update({

      where: {

        z_id:userFound.z_id
      },
      data: userTobeUpdated
    })


    await prisma.$disconnect()

    

        await sendSMS(
      {
        message: `Your OTP is ${mobileotp}`,
        contactNumber: userUpdated.mobile,
      }
    );

    return userFound;

  }


}






const signUpMobileJWT = async (userData, //Input is user object and request
  context) => {


  
  const { client, lang, applicationid, username, password, mobile, email } = userData;


  if (!userData.mobile ) {
    throw new Error('You must provide an mobile.');
  }


  const prisma = new PrismaClient()


  const userCount = await prisma.users.count({
    where: {
      applicationid: userData.applicationid,
      lang: userData.lang,
      client: userData.client,
      mobile: userData.mobile
    }
  })
  await prisma.$disconnect()

  if (userCount >= 1) {
    throw new Error('Mobile number in use');
  }
  else {
    const _idGenerated = await masterdataServices.getUniqueID();
    const prisma = new PrismaClient()
    const salt = await bcrypt.genSalt(10);
  //  const hashPassword = await bcrypt.hash(password, salt);
    const usertobeCreated=datetimeService.setDateUser( {
      z_id: _idGenerated,
      client,
      lang,
      applicationid,
      username,
    //  password: hashPassword,
      mobile,
      email
    },'I',username);

    const userCreated = await prisma.users.create({
      data: usertobeCreated
    })

    const mobileotp = generateOTP(6);
    const hashmobileotp = await bcrypt.hash(mobileotp, salt);
    const  userTobeUpdated = {...usertobeCreated,mobileotp:hashmobileotp};

    console.log(userTobeUpdated);
    console.log('mobileotp',mobileotp)

    const userUpdated = await prisma.users.update({

      where: {

        z_id:usertobeCreated.z_id
      },
      data: userTobeUpdated
    })






    await prisma.$disconnect()



    await sendSMS(
      {
        message: `Your OTP is ${mobileotp}`,
        contactNumber: userUpdated.mobile,
      }
    );

    
      return userUpdated;
  
  }
}









const signInUsernameJWT = async (userData, context) => {

  const { client, lang, applicationid, username, password, mobile, email } = userData;


  if (!userData.username || !userData.password) {
    throw new Error('You must provide an username and password.');
  }

  const prisma = new PrismaClient()



  const userCount = await prisma.users.count({
    where: {
      applicationid: userData.applicationid,
      lang: userData.lang,
      client: userData.client,
      username: userData.username
    }
  })

  if (userCount == 0) {
    throw new Error('Invalid Username.');
  }
  else {
    const userFound = await prisma.users.findFirst({
      where: {
        applicationid: userData.applicationid,
        lang: userData.lang,
        client: userData.client,
        username: userData.username
      }
    })

    await prisma.$disconnect()
    let validPass = await bcrypt.compare(password, userFound.password);
    if (validPass) {

      const token = generateTokenUser(userFound);
      return { ...userFound, token }
    }
    else {
      throw new Error('Invalid Username & Password');
    }


  }


}




const currentUserUsernameJWT = async (args, context) => {
console.log('******')
  const req = context.request;
  if (req.headers && req.headers.authorization) {


    if (req.headers.authorization == 'null' || req.headers.authorization.length == 4) {


      throw new Error('User not signedin');

    }

    const authorization = req.headers.authorization

    try {
      const prisma = new PrismaClient()

      const decoded = jwt.decode(authorization, secretKey);

      const decoded_user = decoded.sub;

      const userCount = await prisma.users.count({
        where: {
          applicationid: decoded_user.applicationid,
          lang: decoded_user.lang,
          client: decoded_user.client,
          username: decoded_user.username
        }
      })

      await prisma.$disconnect()
      if (userCount == 1) {

        return decoded_user
      }
      else {

        throw new Error('Invalid token');
      }

    }
    catch (e) {


      throw new Error('Invalid token');
    }
  }
  else {

    throw new Error('User not signedin');

  }

}



const signUpUsernameJWT = async (userData, //Input is user object and request
  context) => {


  const { client, lang, applicationid, username, password, mobile, email } = userData;


  if (!userData.username || !userData.password) {
    throw new Error('You must provide an username and password.');
  }


  const prisma = new PrismaClient()


  const userCount = await prisma.users.count({
    where: {
      applicationid: userData.applicationid,
      lang: userData.lang,
      client: userData.client,
      username: userData.username
    }
  })
  await prisma.$disconnect()

  if (userCount >= 1) {
    throw new Error('Username in use');
  }
  else {
    const _idGenerated = await masterdataServices.getUniqueID();
    const prisma = new PrismaClient()
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const usertobeCreated=datetimeService.setDateUser( {
      z_id: _idGenerated,
      client,
      lang,
      applicationid,
      username,
      password: hashPassword,
      mobile,
      email
    },'I',username);

    const userCreated = await prisma.users.create({
      data: usertobeCreated
    })

    const token = generateTokenUser(userCreated);
    userCreated.token = token;
    await prisma.$disconnect()
    return userCreated;
  }
}








const deleteUsername =
  async (
    userData,context
  ) => {


    const { applicationid, client, lang, username, z_id  } = userData;
    const {login_username} =context;
    checkUser(login_username);



    try {
      const prisma = new PrismaClient()
      const deleteUser = await prisma.users.delete({
        where: {
          z_id
        },
      })

      await prisma.$disconnect()
      return deleteUser;
    } catch (err) {
      console.log(err)
      throw new Error('Unable to Update as username not in DB as user not in db');
    }

  }
  const checkUser= (login_username) =>
  {
    if(login_username=='')
    {
      throw new Error('Unauthorised Access'); 
    }
    
  }

const users = async (args, context, info) => {
  const {login_username} =context;
  checkUser(login_username);
  const { applicationid, client, lang } = args
  try {
    const prisma = new PrismaClient()
    const userdocs = await prisma.users.findMany({
      where: {
        applicationid: applicationid,
        lang: lang,
        client: client,

      }
    })

    await prisma.$disconnect()
    return userdocs;

  }
  catch (e) {


    throw new Error('Error fetching Users');
  }

}


const saveUsername =
  async (
    userData,
    context
  ) => {


    const { email, password, applicationid, client, lang, mobile, username, firstname, lastname, userauthorisations, status, z_id } = userData;
    const {login_username} =context;
    checkUser(login_username);

    
    if (!userData.username || !userData.password) {
      throw new Error('You must provide an username and password.');
    }

    const prisma = new PrismaClient()

    const userCount = await prisma.users.count({
      where: {
        applicationid: userData.applicationid,
        lang: userData.lang,
        client: userData.client,
        username: userData.username
      }
    })

    await prisma.$disconnect();


    if (userCount >= 1) {


      const prisma = new PrismaClient()

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const userTobeUpdated = datetimeService.setDateUser({
        client,
        lang,
        applicationid,
        username,
        password: hashPassword,
        mobile,
        email,
        firstname, lastname, userauthorisations, status
      },"U",login_username);

      const userUpdated = await prisma.users.update({

        where: {

          z_id
        },
        data: userTobeUpdated
      })

      await prisma.$disconnect();
      return userUpdated;

    }
    else {

      const prisma = new PrismaClient()
      const _idGenerated = await masterdataServices.getUniqueID();
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const userTobeCreated = datetimeService.setDateUser({
        z_id: _idGenerated,
        client,
        lang,
        applicationid,
        username,
        password: hashPassword,
        mobile,
        email,
        firstname, lastname, userauthorisations, status
      },"I",login_username);

      const userCreated = await prisma.users.create({
        data: userTobeCreated
      })
      await prisma.$disconnect();
      return userCreated;
    }



  }



export default {
  generateTokenUser,
  signUpUsernameJWT,

  currentUserUsernameJWT,
  signInUsernameJWT,



  signUpMobileJWT,
  signInMobileJWT,
  verifyMobileOTPJWT,


  saveUsername,
  users,
  deleteUsername,
  getUsername,
  checkUser
}