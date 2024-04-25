/**
 * @author 
 */

// Import Section
import stocknewsService from "../../services/stocksnews";
import individualnewsService from "../../services/individualnewsServices";


// Resolvers
const resolvers =
{

  Query:
  {
    stocksnews: stocknewsService.stocksnews,
    individualnews: individualnewsService.individualnews
  },
  Mutation:
  {
    // Resolver for uploadDocuments(input) : String
    savestocksnews: stocknewsService.savestocksnews,
    deletestocknews: stocknewsService.deletestocknews,
    deleteindividualnews: individualnewsService.deleteindividualnews,
    updateIndividualCompany: individualnewsService.updateIndividualCompany
    //sendRecommendationNotification: recommendationSrevice.sendRecommendationNotification

  }
};



// Export the resolvers
export default resolvers;