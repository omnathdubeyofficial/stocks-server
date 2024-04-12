/**
 * @author 
 */

// Contacts Type
const typeDefs = `

    # Input Type
    input DocInput
    {
        clnt	: String,
        lang	: String,
        docid	: String,
        doccontent : String  ,
        cuser:String,
        z_id:String  
    }
    # Output Type
    type DocOutput
    {
        clnt	: String,
        lang	: String,
        docid	: String,
        doccontent : String  ,
        cuser:String,
        z_id:String  
    }
    # Query Type
    type Query
    {
      
        
        # Get uploaded document details based on criteria
        getDocDetail
        (
            CLNT    :   String!,
            LANG    :   String!,
            DOCID   :   String!
        ) : DocOutput           

    }




    # Mutation type
    type Mutation
    {
        

        
        # Delete the document
        deleteDocument
        (
            CLNT      :   String!,
            LANG      :   String!,
            z_id     :   String!,
        ) : DocOutput

        # Create the document
        createDocument
        (
            clnt	: String,
        lang	: String,
        docid	: String,
        doccontent : String  ,
        cuser:String ,
        ) : DocOutput

        updateDocument
        (
            CLNT       :   String!,
            LANG       :   String!,
            DOCID      :   String!,
            DOCCONTENT :   String!,
            CUSER      :   String!
        ) : DocOutput
    }
    
`;

// Export the typeDefs
export default  typeDefs;