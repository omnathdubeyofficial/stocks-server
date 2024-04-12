
// Import section 20221114
import dotenv from 'dotenv'
dotenv.config()
import morgan from 'morgan'
import proxy from 'express-http-proxy'
import express from 'express';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import resolvers from './graphQL/resolvers';
import uuidv4 from 'uuid/v4'
import path from 'path';
import https from 'https';
import fs from 'fs';
import sysDateTime from './services/dateTimeServices';
import authenticationJWT from './services/authenticationJWT'
import multer from 'multer';
// Importing types
import typeDefs from './graphQL/types';
import fileServices from './services/fileServices'
import subscriptionServices from './services/subscriptionServices'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser  from 'body-parser';
import webpush from 'web-push'


// Make executable schema
let graphQLSchema = buildSchema(typeDefs);


// Set the port number
const PORT = process.env.MOMOAPIPORT;

// Initialize the app
const server = express();


var myLogger = function (req, res, next) {
  next()
}






server.use(cors());

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
server.use(bodyParser.json())




// simple middleware function
server.use((req, res, next)=>{
  console.log("Request received at : " + sysDateTime.sysdate_yyyymmdd() + "  "+ sysDateTime.systime_hh24mmss());  
  next();
});



server.use((req, res, next)=>{
  console.log("Request received at : " + sysDateTime.sysdate_yyyymmdd() + "  "+ sysDateTime.systime_hh24mmss()); 

  next();
});



// File section Handled 






const DIR = './fileuploads';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname)
//console.log(__dirname)
server.use('/fileuploads', express.static(path.join(__dirname, '/fileuploads')))


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, DIR);
  },
  filename: (req, file, cb) => {
  
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, uuidv4() + '-' + fileName)
  }
});


var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" 
      || file.mimetype == "image/jpg" 
      || file.mimetype == "image/jpeg"
    
    
    ) {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
  }
});








server.post('/uploadfile', upload.array('files', 6), async (req, res, next) => {

 


  const reqFiles = [];
  //const url = req.protocol + '://' + req.get('host')
  const url = '/fileuploads'
  for (var i = 0; i < req.files.length; i++) {
    console.log(req.files[i])
      reqFiles.push( {filepath:url + '/' + req.files[i].filename,
                      fileid:  req.files[i].filename,
                      filename:  req.files[i].originalname,
                      filetype:  req.files[i].mimetype,
                      filesize:  req.files[i].size.toString(),
                      storage:storage
                    })
  }

  try
  {
  const {filepath,fileid,filename,filetype,filesize} =  reqFiles[0];
  const file= await fileServices.saveFile({filepath,fileid,filename,filetype,filesize},{login_username:'rvp'})    
  console.log(file)
        res.status(201).json({
          message: "Done upload!",
          fileCreated: {
              z_id: file.z_id,
              fileCollection: [{fileid:file.fileid,filepath:file.filepath,filename:file.filename,filetype:file.filetype,filesize:file.filesize}] 
          }
        })


  }
  catch(err){
    console.log(err)
    res.status(500).json({
      error: 'error in upload'
  });



  }


 //console.log(reqFiles);

        
 



  // const file = new File({
  //     _id: new mongoose.Types.ObjectId(),
  //     fileCollection: reqFiles,
  //     createatdate:createatdate,
  //     createattime:createattime
  // });

  // file.save().then(result => {
  //     res.status(201).json({
  //         message: "Done upload!",
  //         fileCreated: {
  //             _id: result._id,
  //             fileCollection: result.fileCollection
  //         }
  //     })
  // }).catch(err => {
  //     console.log(err),
  //         res.status(500).json({
  //             error: err
  //         });
  // })
})












server.post(
  '/deletefile',
  async (req, res) => {

 


 let {serverdocid}=req.body.params;
 


 console.log(serverdocid)

 if(serverdocid== null || serverdocid=='' )
{
  res.status(500).json({
    error: 'Please send file'
});
}
else{



  try
  {

  const file= await fileServices.logicaldeleteFile({z_id:serverdocid},{login_username:'rvp'})    
 
       res.status(201).json({
          message: "file  deleted!",
          documentid: file.z_id
        })

  }
  catch(err){
    console.log(err)
    console.log("Error deleting document");
    res.status(500).json({
      error: err,
      documentid: serverdocid
  });


  }

  /*

  File.findOne({_id:serverdocid},function(err, file) {

    file.deleteatdate=deleteatdate;
    file.deleteattime=deleteattime;
    file.deleteuser='deleteuser';
    file.isdeleted='Y'
    file.save(function(err) {



                    if(!err) {
                     
                       res.status(201).json({
                        message: "file  deleted!",
                        documentid: serverdocid
                      })
                      }
                      else{
                        console.log("Error deleting document");
                        res.status(500).json({
                          error: err,
                          documentid: serverdocid
                      });
                      }
  })

}

  ) */




}

})










































//File section end




// Notification Subscribe


server.post('/notifications/subscribe', async (req, res) => {
  const subscription = req.body

  try{


    let savedSubscription = await subscriptionServices.saveSubscription({z_id:'',applicationid:'15001500', client:'45004500', lang:'EN', subobj:subscription},{login_username:''})
    let options={
      
      body:'Successfully Subscribed to RecoKart !',
      dir:'ltr',
      lang:'en-US',
      vibrate:[100,50,200],
      }
      
      let notification ={
        title:'Title-Successfully Subscribed to RecoKart !',
        options:options
      }
 
      await subscriptionServices.sendNotification(savedSubscription.subobj,notification)

      res.status(200).json({'success': true})


  }catch(err){
   

    console.log(err)
  }

  

 
 
    

  
});





server.post(
  '/publishnotification',
  (req, res) => {
    let {serverdocid} =req.body
        let document;
  //  let deleteatdatetime=getDateYYYYMMDDHHMISS(new Date());
  //   let deleteatdate=deleteatdatetime.substring(0, 8)
  //   let deleteattime=deleteatdatetime.substring(8, 14)


})









// Notification Subscribe end














// Use multer middleware to read the files from multipart-request
// Use memory storage
server.use(multer({
  storage: multer.memoryStorage()
}).any());




// New GraphQL endpoint [ Send request and reponse in context ]
server.use('/gqlapi',graphqlHTTP(async (request, response) => {

  const login_username=await authenticationJWT.getUsername(request); 


 return {
    schema: graphQLSchema,
    rootValue: resolvers,
    graphiql: true,
    context: { request, response ,login_username}
  }
  
}
  
  
 


));  





//router(server);
//server.use(express.static(path.join(__dirname,"public")));
server.use(express.static('public'));
server.use(express.static('uploadfiles'))


server.get('*', function(req, res){
  res.sendFile('index.html', { root: 'public' });
});




// const sslServer = https.createServer(
//   {
// key:'',
// cert:''
//   },server
// )



// Start the server

server.listen(PORT,process.env.SERVERIP, () => {
  console.log(`GraphQL Server is now running on http://${process.env.SERVERIP}:${PORT}/gqlapi`);
  console.log(`Go to http://${process.env.SERVERIP}:${PORT}/gqlapi to run queries!`);
  console.log('------------------------------------------------------');
});

