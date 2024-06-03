/**
 * @author 
 */

// Import Section
import companyCodeService from "../../services/companyCodeServices";

// Resolvers
const resolvers =
{

  Query:
  {
    companycodeslists: companyCodeService.companycodeslists

  },
  Mutation:
  {
    savecompanycodes: companyCodeService.savecompanycodes,
    deletecompanycodes: companyCodeService.deletecompanycodes

  }
};



// Export the resolvers
export default resolvers;