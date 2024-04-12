// Users Type
const typeDefs = `

    # Output Type
    type UserType
    {

        applicationid      : String,
        client      : String,
		lang      : String,
		email      : String,
        username      : String,
        password      : String,
        mobile      : String
    }



    type UserNewType
    {

        applicationid      : String,
        client      : String,
		lang      : String,
		email      : String,
        username      : String,
        password      : String,
        mobile      : String,
        firstname      : String,
        lastname      : String,
        userauthorisations      : String,
        token      : String,
        status :String,
        z_id:String

    }



    # Output Type
    type UserTokenType
    {
        applicationid      : String,
        client      : String,
		lang      : String,
		email      : String,
        username      : String,
        password      : String,
        mobile      : String,
        token      : String
    }

    # Query Type
    type Query
    {
        currentUsername
     : UserType 
  
        currentUsernameJWT
         : UserNewType


         users    (
            applicationid    :   String!,
            client    :   String!,
            lang   :   String!
        ):[UserNewType]


        
  }






    # Mutation Type
    type Mutation
    {
        
        signUpUsername
        (
            applicationid : String,
            client: String ,
                lang: String ,
                email: String,
            username:String,
            password: String,
            mobile: String
        )   :   UserType       



        



        signUpUsernameJWT
        (
            applicationid :  String,
            client:  String ,
                lang:  String ,
                email:  String,
            username: String,
            password:  String,
            mobile:  String
        )   :   UserNewType     


        signUpMobileJWT
        (
            applicationid :  String,
            client:  String ,
                lang:  String ,
                email:  String,
            username: String,
            password:  String,
            mobile:  String
        )   :   UserNewType     



        signInUsername
        (
            applicationid : String,
            client: String,
                lang: String,
                username: String,
            password: String
        )   :   UserType 

        signInUsernameJWT
        (
            applicationid :  String,
            client:  String ,
                lang:  String ,
                username: String,
            password:  String

        )  :   UserNewType     




        signInMobileJWT
        (
            applicationid :  String,
            client:  String ,
                lang:  String ,
                mobile:String,
                username: String,
                email:String,
            password:  String

        )  :   UserNewType     



        verifyMobileOTPJWT
        (
            applicationid :  String,
            client:  String ,
                lang:  String ,
                mobile:String,
                username: String,
                email:String,
            password:  String,
            mobileotp:String

        )  :   UserNewType     




        signOutUsername
          :   UserType 


         createUsername
         (
            applicationid : String,
            client: String ,
                lang: String ,
                email: String,
            username:String,
            password: String,
            mobile: String
         )   :   UserType 



         updateUsername
         (
            applicationid : String,
            client: String ,
                lang: String ,
                email: String,
            username:String,
            password: String,
            mobile: String
         )   :   UserType 

         



         saveUsername
         (
            applicationid : String,
            client: String ,
            lang: String ,
            email: String,
            username:String,
            password: String,
            mobile: String,
            firstname: String,
            lastname: String,
            userauthorisations : String,
            status:String,
            z_id:String
         )  : UserNewType


         deleteUsername
         (
            applicationid : String,
            client: String ,
            lang: String ,
            username:String,
            z_id:String
         )  : UserNewType



    }

    
`;

// Export the typeDefs
export default typeDefs;