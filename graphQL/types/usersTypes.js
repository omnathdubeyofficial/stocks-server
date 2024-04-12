/**
 * @author 
 */

// Users Type
const typeDefs = `

    # Output Type
    type User
    {
        FNAME      : String,
        LNAME      : String,
        USRID      : String,
        USRNM      : String,
        USEX       : String,
        UMAIL      : String,
        PHNO       : String,
        CELLNO     : String,
        ADDR       : String,
        CITY       : String,
        COUNTRY    : String,
        PINC   	   : String,
        STSCD      : String,
        STATECD    : String
    }

    # Input Type
    input Users
    {
        CLNT : String,
        USRID : String,
        USRNM : String,
        LLGDT : String,
        LLGTM : String,
        LLGPC : String,
        LLGIP : String,
        PWDRD : String,
        RPPWDRD : String,
        PDATE : String,
        PTIME : String,
        SQUES : String,
        SANS : String,
        UMAIL : String,
        ISLCK : String,
        LCKDT : String,
        LCKTM : String,
        LCKRS : String,
        LCKUSR : String,
        FLRCNT : String,
        CURDT : String,
        CURTM : String,
        CURPC : String,
        CURIP : String,
        USEX : String,
        FNAME : String,
        LNAME : String,
        CITY : String,
        COUNTRY : String,
        PINC : String,
        ADDR : String,
        PHNO : String,
        CELLNO : String,
        LANG : String,
        ADDR1 : String,
        COFF : String,
        ISFTIME : String,
        PRFLANG : String,
        STSCD : String,
        STATECD : String,
        LICENSEKEYMOBILITY : String,
        LICENSEEXPDT : String,
        DEVID	        : String,
        KEY_GENERATED_BY : String,
        KEY_GENERATION_DATE : String,
        OFFICENM : String,
        FAX	        : String,
        BESTTMCAL : String,
        MODOFCON : String                

    }    

    # Output Type
    type Authorization
    {
        GRPID       : String,
        GRPNM       : String,
        GDESC       : String
    }


    # Output Type
    type TResponse
    {
        TSTATUS       : String,
        SUCCESS_MSG   : String,
        FAIL_MSG       : String
    }

    # Query Type
    type Query
    {
        # Search users based on criteria
        searchUsers
        (
            CLNT    :   String!,
            LANG    :   String!,
            USRID   :   String,
            USRNM   :   String,
            UMAIL   :   String,
            CELLNO  :   String,
            exactMatch   :  Boolean = false
        ) : [User] 
        
        # Get user details based on criteria
        userDetails(
            CLNT        : String!, 
            LANG        : String!,
            USRID       : String!
        ) : [User]

        # Get user authorization details based on criteria
        searchAuthorizations
        (
            CLNT        : String!, 
            LANG        : String!,
            USRID       : String!            
        ) : [Authorization]

        # Forgot Password
        searchPassword
        (
            APPLICATIONID  : String!,
            CLIENT         : String!, 
            LANG           : String!,
            USERNAME       : String!            
        ) : [TResponse]
        
    }

    # Mutation Type
    type Mutation
    {
        # CRUD Operations for Users
        UsersCRUDOps
        (
            users       : [Users!]!,
            transaction : TransactionTypes!
        )   :   String       

        # Update User Authorizations
        updateUserAuthorizations
        (
            CLNT        : String!,
            LANG        : String!,
            USRID       : String!,
            GRPID       : [String!]!
        )  : String
  

        # CRUD Operations for SignUpCustomer
        SignUpCustomerUsernameJWT
        (
            users       : [Users!]!,
            transaction : TransactionTypes!
        )   :   UserTokenType
  
  
        # CRUD Operations for SignUpCustomer
        SignUpCustomerUsername
        (
            users       : [Users!]!,
            transaction : TransactionTypes!
        )   :   UserType
  
  
  
  
    }



    
`;

// Export the typeDefs
export default typeDefs;