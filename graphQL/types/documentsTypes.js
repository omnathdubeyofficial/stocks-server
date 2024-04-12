/**
 * @author 
 */

// Documents Type
const typeDefs = `

    # Output Type
    type CompanyDocuments
    {
        CLNT	:	String,
        LANG	:	String,
        DOCTYPE	:	String,
        DOCID	:	String,
        DOCNM	:	String,
        DOCUMENT	    :	String,
        DOCEXTENSION	:	String,
        CDATE	:	String,
        CTIME	:	String,
        CUSER	:	String,
        UDATE	:	String,
        UTIME	:	String,
        UUSER	:	String,
        ISDEL	:	String,
        DDATE	:	String,
        DTIME	:	String,
        DUSER	:	String
    }

    # Output Type
    type UploadedDocuments
    {
        CLNT	:  String,
        LANG	:  String,
        CENTITY	:  String,
        CENTITYID	:  String,
        CIMGDOC	    :  String,
        CDOCTYPE	:  String,
        CDOC	    :  String,
        CDOCDESC	:  String,
        CDOCEXTENSION	:  String,
        CDOCSIZE	    :  String,
        CDATE	:  String,
        CTIME	:  String,
        CUSER	:  String,
        UDATE	:  String,
        UTIME	:  String,
        UUSER	:  String,
        ISDEL	:  String,
        DDATE	:  String,
        DTIME	:  String,
        DUSER	:  String,
        SRNO	:  String,
        CDOCNAME	:  String,
        SYSTEM	:  String,
        USERID	:  String,
        NOTE	:  String,
        LEADID	:  String,
        USERNM  :  String        
    }

    # Query Type
    type Query
    {
        # Search company documents based on criteria
        searchCompanyDocuments
        (
            CLNT    :   String!,
            LANG    :   String!
        ) : [CompanyDocuments]   

        # Search uploaded documents based on criteria
        searchUploadedDocuments
        (
            CLNT    :   String!,
            LANG    :   String!,
            CENTITYID   :   String!,
            CENTITY     :   String!
        ) : [UploadedDocuments]           

        
        # Get uploaded document details based on criteria
        documentDetails
        (
            CLNT    :   String!,
            LANG    :   String!,
            CENTITYID   :   String!,
            CENTITY     :   String!,
            SRNO	    :   String!
        ) : [UploadedDocuments]           

    }

    # Mutation type
    type Mutation
    {
        # Upload the document, returns no of documents uploaded
        uploadDocuments
        (
            CLNT      :   String,
            LANG      :   String,
            CENTITY     :   String,
            CENTITYID   :   String,
            CIMGDOC     :   String,
            CDOCTYPE    :   String,
            CDOCDESC    :   String,
            CDOCEXTENSION   :   String,
            CDOCSIZE    :   String,
            SRNO	:  String,
            CDOCNAME	:  String,
            SYSTEM	:  String,
            USERID	:  String,
            NOTE	:  String,
            LEADID	:  String            
        ) : String

        # Edit the document, returns no of documents uploaded
        editDocuments
        (
            CLNT      :   String!,
            LANG      :   String!,
            CENTITY     :   String!,
            CENTITYID   :   String!,
            CIMGDOC     :   String,
            CDOCTYPE    :   String,
            CDOCDESC    :   String,
            CDOCEXTENSION   :   String,
            CDOCSIZE    :   String,
            SRNO	:  String!,
            CDOCNAME	:  String,
            SYSTEM	:  String,
            USERID	:  String,
            NOTE	:  String,
            LEADID	:  String            
        ) : String

        
        # Delete the document, returns ids of documents deleted
        deleteDocuments
        (
            CLNT      :   String!,
            LANG      :   String!,
            CENTITY     :   String!,
            CENTITYID   :   String!,
            SRNO        :   String!
        ) : String


        # Upload the company documents
        uploadCompanyDocuments
        (
            CLNT      :   String!,
            LANG      :   String!,
            DOCTYPE   :   String!
        ) : String

        # Delete the company document
        deleteCompanyDocuments
        (
            CLNT      :   String!,
            LANG      :   String!,
            DOCID     :   String!
        ) : String
    }


`;

// Export the typeDefs
export default typeDefs;