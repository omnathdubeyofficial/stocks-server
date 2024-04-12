const typeDefs = `

# input stocksnews Type
input inputstocksnewsType
{   z_id : String,
        applicationid : String,
        client : String,
        lang : String,
        t_id : String,
        cname: String,
        paragraph: String,
        date:String,
        cdate : String,
        ctime : String,
        cuser : String,
        udate : String,
        utime : String,
        uuser : String,
        ddate : String,
        dtime : String,
        duser : String,
        
    }



    # stocksnews Type
    type stocksnewsType
    {     z_id : String,
        applicationid : String,
        client : String,
        lang : String,
        t_id : String,
        cname: String,
        paragraph: String,
        date:String,
        cdate : String,
        ctime : String,
        cuser : String,
        udate : String,
        utime : String,
        uuser : String,
        ddate : String,
        dtime : String,
        duser : String,
      
    }
    # Query Type
    type Query
    {
        stocksnews (
            applicationid    :   String!,
            client    :   String!,
            lang   :   String!,
            z_id : String,
        ):[stocksnewsType]

        
        
  }
    # Mutation Type
    type Mutation
    {
        savestocksnews
         (  
            z_id : String,
            applicationid : String,
            client : String,
            lang : String,
            t_id : String,
           cname: String,
           paragraph: String,
           date:String,
            cdate : String,
            ctime : String,
            cuser : String,
            udate : String,
            utime : String,
            uuser : String,
            ddate : String,
            dtime : String,
            duser : String,
         )  : stocksnewsType


         deletestocksnews
         (
            applicationid : String,
            client: String ,
            lang: String ,
            z_id:String
         )  : stocksnewsType

         
    }

`
export default typeDefs;