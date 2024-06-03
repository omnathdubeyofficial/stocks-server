const typeDefs = `

    # input companycodes Type
    input inputcompanycodesType
    {   z_id : String,
        applicationid : String,
        client : String,
        lang : String,
        t_id : String,
        code_code : String,
        code_type : String,
        code_desc : String,
        code_desc1 : String,
        code_desc2 : String,
        cdate : String,
        ctime : String,
        cuser : String,
        udate : String,
        utime : String,
        uuser : String,
        ddate : String,
        dtime : String,
        duser : String
    }



    # companycodes Type
    type companycodesType
    {    z_id : String,
        applicationid : String,
        client : String,
        lang : String,
        t_id : String,
        code_code : String,
        code_type : String,
        code_desc : String,
        code_desc1 : String,
        code_desc2 : String,
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
      companycodeslists (
            applicationid    :   String!,
            client    :   String!,
            lang   :   String!,
            z_id : String,
        ):[companycodesType]
}
    # Mutation Type
    type Mutation
    {
      savecompanycodes
         (  
            z_id : String,
            applicationid : String,
            client : String,
            lang : String,
            t_id : String,
            code_code : String,
        code_type : String,
        code_desc : String,
        code_desc1 : String,
        code_desc2 : String,
            cdate : String,
            ctime : String,
            cuser : String,
            udate : String,
            utime : String,
            uuser : String,
            ddate : String,
            dtime : String,
            duser : String,
         )  : companycodesType


         deletecompanycodes
         (
            applicationid : String,
            client: String ,
            lang: String ,
            z_id:String
         )  : companycodesType
    }

`
export default typeDefs;