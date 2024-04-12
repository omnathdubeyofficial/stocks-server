/**
 * @author 
 */

// Import Section
import masterdataServices from "../../services/masterdataServices";


// Resolvers
const resolvers = 
{

    Query: 
    {
      
        
        stocks:masterdataServices.getStocks
     }
};



// Export the resolvers
export default resolvers;