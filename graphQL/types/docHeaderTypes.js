/**
 * @author 
 */

// Contacts Type
const typeDefs = `

    # Input Type
    input DocHeaders
    {
        CLNT	: String,
        LANG	: String,
        DOCID	: String,
        DOCDT	: String,
        DOCTYPE	: String,
        DOCNO	: String,
        PONO	: String,
        RMKS	: String,
        CURRENCY	: String,
        DUEDT	: String,
        DOCHDR	: String,
        TOT	: String,
        CUSTCD	: String,
        INVDT	: String,
        BAL	: String,
        CMPN	: String,
        CMPNNM	: String,
        CUSTOMER	: String,
        STATUS	: String,
        VENDORCD	: String
        CIDSYS	: String,
        PAYMENTBY	: String
    }


    # Output Type
    type DocHeader
    {
        CLNT	: String,
        LANG	: String,
        DOCID	: String,
        DOCDT	: String,
        DOCTYPE	: String,
        DOCNO	: String,
        PONO	: String,
        RMKS	: String,
        CURRENCY	: String,
        DUEDT	: String,
        DOCHDR	: String,
        TOT	: String,
        CUSTCD	: String,
        INVDT	: String,
        BAL	: String,
        CMPN	: String,
        CMPNNM	: String,
        CUSTOMER	: String,
        STATUS	: String,
        VENDORCD	: String
        CIDSYS	: String,
        PAYMENTBY	: String
    }
    
`;

// Export the typeDefs
export default typeDefs;