module.exports = {
    handlers: (_, TodoModel, UserType, GraphQLObjectType, GraphQLNonNull, GraphQLString) => {
        return new GraphQLObjectType({
            name: 'Todo',
            description: 'This represent a Todo',
            fields: () => ({
                id: { type: new GraphQLNonNull(GraphQLString) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                body: { type: GraphQLString },
                // author: {
                //     type: UserType,
                //     resolve: function (post) {
                //         return _.find(Authors, a => a.id == post.author_id);
                //     }
                // }
            })
        });
    }
};