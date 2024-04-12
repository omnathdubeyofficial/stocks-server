const typeDefs = `
# input stocksnews Type
input inputindividualnewsType {
    z_id: String,
    applicationid: String,
    client: String,
    lang: String,
    t_id: String,
    companyname: String,
    companynews: String,
    date: String,
    isread: String,
    recocompany: String,
    cdate: String,
    ctime: String,
    cuser: String,
    udate: String,
    utime: String,
    uuser: String,
    ddate: String,
    dtime: String,
    duser: String,
}

# individualnews Type
type individualnewsType {
    z_id: String,
    applicationid: String,
    client: String,
    lang: String,
    t_id: String,
    companyname: String,
    companynews: String,
    date: String,
    isread: String,
    recocompany: String,
    cdate: String,
    ctime: String,
    cuser: String,
    udate: String,
    utime: String,
    uuser: String,
    ddate: String,
    dtime: String,
    duser: String,
}

# Query Type
type Query {
    individualnews(
        applicationid: String!,
        client: String!,
        lang: String!,
        z_id: String,
    ): [individualnewsType]
}

# Mutation Type
type Mutation {
    saveindividualnews(  
        z_id: String,
        applicationid: String,
        client: String,
        lang: String,
        t_id: String,
        news: String,
        newsdate: String,
        delimeter: String,
        delimetercount: String,
        isread: String,
        cdate: String,
        ctime: String,
        cuser: String,
        udate: String,
        utime: String,
        uuser: String,
        ddate: String,
        dtime: String,
        duser: String,
    ): individualnewsType

    deleteindividualnews(
        applicationid: String,
        client: String,
        lang: String,
        z_id: String
    ): individualnewsType
}
`;

export default typeDefs;
