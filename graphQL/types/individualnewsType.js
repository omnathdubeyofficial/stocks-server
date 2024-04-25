const typeDefs = `
# input individualnews Type
input inputindividualnewsType
{   z_id : String,
    applicationid : String,
    client : String,
    lang : String,
    t_id : String,
    companyname : String,
    companynews : String,
    date : String,
    recocompany : String,
    isread : String,
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
   

    # individualnews Type
    type individualnewsType
    {    z_id : String,
        applicationid : String,
        client : String,
        lang : String,
        t_id : String,
        companyname : String,
        companynews : String,
        date : String,
        isread : String,
        recocompany : String,
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
      individualnews (
            applicationid    :   String!,
            client    :   String!,
            lang   :   String!,
            z_id : String,
        ):[individualnewsType]
}

# Mutation Type
type Mutation
{
    updateIndividualCompany
         (  
            z_id : String,
            applicationid : String,
            client : String,
            lang : String,
            t_id : String,
            recocompany : String,
            cdate : String,
            ctime : String,
            cuser : String,
            udate : String,
            utime : String,
            uuser : String,
            ddate : String,
            dtime : String,
            duser : String
         )  : individualnewsType

    deleteindividualnews
     (
        applicationid : String,
        client: String ,
        lang: String ,
        z_id:String
     )  : individualnewsType
}

`
export default typeDefs;