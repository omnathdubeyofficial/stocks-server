// Import Section


import AuthServiceJWT from '../../services/authenticationJWT';


// Resolvers
const resolvers = 
{
    Query: 
    {
      
        currentUsernameJWT: AuthServiceJWT.currentUserUsernameJWT,
        users:AuthServiceJWT.users
    },

    Mutation:
    {
        signUpMobileJWT:AuthServiceJWT.signUpMobileJWT,
        signUpUsernameJWT : AuthServiceJWT.signUpUsernameJWT,
        signInUsernameJWT : AuthServiceJWT.signInUsernameJWT,
        signInMobileJWT:AuthServiceJWT.signInMobileJWT,
        verifyMobileOTPJWT:AuthServiceJWT.verifyMobileOTPJWT,
        saveUsername:AuthServiceJWT.saveUsername,
        deleteUsername:AuthServiceJWT.deleteUsername,
        
    }
};



// Export the resolvers
export default resolvers;