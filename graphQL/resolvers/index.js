/**
 * @author 
 */

import merge from 'lodash/merge';

//Importing resolvers





import authenticationResolvers from './authenticationResolvers';
import companystatusResolver from './companystatusResolver';
import Rcecommendation from './recommendationResolver'
import masterdatResolvers from './masterdataResolvers';
import stocknewsResolver from './stocksnewsresolvers';
// import individualnewsResolver from './individualnewsResolver';

// Merge all of the resolver objects together
const resolvers = merge(
    authenticationResolvers.Query,
    authenticationResolvers.Mutation,
    Rcecommendation.Mutation,
    Rcecommendation.Query,
    masterdatResolvers.Query,
    stocknewsResolver.Mutation,
    stocknewsResolver.Query,
    companystatusResolver.Mutation,
    companystatusResolver.Query
);

// Export merged resolvers
export default resolvers;