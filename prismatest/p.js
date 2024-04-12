//import { PrismaClient } from '@prisma/client'
const { PrismaClient }  = require('.prisma/client/index')

const prisma = new PrismaClient()



  async function main() {
    const u1 = await prisma.user.create({
        data: {
    
    
            id  :'dadad',
            email :'ssss@itss.com',
            name  :'ddddd',
        },
      })
    console.log(u1)
  }

  main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })