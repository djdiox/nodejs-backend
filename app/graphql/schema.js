module.exports = {
    handlers: (buildSchema, _, TodoType, TodoModel, log, GraphQLObjectType, GraphQLList, GraphQLSchema) => {
        // This is the Root Query
        const TodoQueryRootType = new GraphQLObjectType({
            name: 'TodosSchema',
            description: 'This Schema will returns all todos stored in the app.',
            fields: () => ({
                // authors: {
                //     type: new GraphQLList(AuthorType),
                //     description: 'List of all Authors',
                //     resolve: function () {
                //         return Authors
                //     }
                // },
                todos: {
                    type: new GraphQLList(TodoType), // Tell the list its from type todo
                    description: 'It will return a list of all todos',
                    resolve: async () => { // gets called when the query is being executed
                        let todos = [];
                        /**
                         * yey ES2017 is featured so we use it for finding all the models with mongoose.
                         * It's not necessary to try catch this. we can simply use catch from Promise library to log errors.
                         */
                        todos = await TodoModel.find({}).catch(err => log.error(err));
                        return todos;
                    }
                }
            })
        });
        // This is the schema declaration
        return new GraphQLSchema({
            query: TodoQueryRootType
            // If you need to create or updata a datasource, 
            // you use mutations. Note:
            // mutations will not be explored in this post.
            // mutation: BlogMutationRootType 
        });
    }
};