const typeDefs = `

    # input companystatus Type
    input inputcompanystatusType
    {   z_id : String,
        applicationid : String,
        client : String,
        lang : String,
        t_id : String,
        companyname : String,
        status : String,
        reviewdate : String,
        comment : String,
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



    # companystatus Type
    type companystatusType
    {    z_id : String,
        applicationid : String,
        client : String,
        lang : String,
        t_id : String,
        companyname : String,
        status : String,
        reviewdate : String,
        comment : String,
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
        companystatuslists (
            applicationid    :   String!,
            client    :   String!,
            lang   :   String!,
            z_id : String,
        ):[companystatusType]
}
    # Mutation Type
    type Mutation
    {
        savecompanystatus
         (  
            z_id : String,
            applicationid : String,
            client : String,
            lang : String,
            t_id : String,
            companyname : String,
            status : String,
            reviewdate : String,
        comment : String,
            cdate : String,
            ctime : String,
            cuser : String,
            udate : String,
            utime : String,
            uuser : String,
            ddate : String,
            dtime : String,
            duser : String,
         )  : companystatusType


         deletecompanystatus
         (
            applicationid : String,
            client: String ,
            lang: String ,
            z_id:String
         )  : companystatusType
    }

`
export default typeDefs;