/**
 * @author 
 */

// Contacts Type
const typeDefs = `

    # Input Type
    input DocDetails
    {
        CLNT	: String,
        LANG	: String,
        LINEITEMNO	: String,
        DOCID	: String,
        PARTNUMBER	: String,
        PARTDESC	: String,
        RATE	: String,
        QUANTITY	: String,
        TAX	: String,
        AMOUNT	: String,
        SIGN	: String,
        ACCCODE	: String        
    }


    # Output Type
    type DocDetail
    {
        CLNT	: String,
        LANG	: String,
        LINEITEMNO	: String,
        DOCID	: String,
        PARTNUMBER	: String,
        PARTDESC	: String,
        RATE	: String,
        QUANTITY	: String,
        TAX	: String,
        AMOUNT	: String,
        SIGN	: String,
        ACCCODE	: String        
    }
    
`;

// Export the typeDefs
export default typeDefs;