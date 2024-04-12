const typeDefs = `

    # stock Type
    type stockType
    {
        name:String
  
    }

    # Query Type
    type Query
    {
    
        stocks:[stockType]
        
  }


`
// Export the typeDefs
export default typeDefs;