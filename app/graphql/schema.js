module.exports = {
    handlers: (buildSchema, _, TodoType, TodoModel, log, GraphQLObjectType, GraphQLList, GraphQLSchema) => {

        // This is the Root Query
        const BlogQueryRootType = new GraphQLObjectType({
            name: 'BlogAppSchema',
            description: 'Blog Application Schema Root',
            fields: () => ({
                // authors: {
                //     type: new GraphQLList(AuthorType),
                //     description: 'List of all Authors',
                //     resolve: function () {
                //         return Authors
                //     }
                // },
                todos: {
                    type: new GraphQLList(TodoType),
                    description: 'List of all Todos',
                    resolve: async () => {
                        let todos = [];
                        try {
                            todos = await TodoModel.find({});
                        } catch (error) {
                            log.error(error);
                        }
                        return todos;
      
                    }
                }
            })
        });

        // This is the schema declaration
        return new GraphQLSchema({
            query: BlogQueryRootType
            // If you need to create or updata a datasource, 
            // you use mutations. Note:
            // mutations will not be explored in this post.
            // mutation: BlogMutationRootType 
        });
    }
};