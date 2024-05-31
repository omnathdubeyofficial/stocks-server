/**
 * @author 
 */

// Import Section
import companyService from "../../services/companyServices";

// Resolvers
const resolvers =
{

  Query:
  {
    companystatuslists: companyService.companystatuslists

  },
  Mutation:
  {
    // Resolver for uploadDocuments(input) : String
    savecompanystatus: companyService.savecompanystatus,
    deletecompanystatus: companyService.deletecompanystatus

  }
};



// Export the resolvers
export default resolvers;