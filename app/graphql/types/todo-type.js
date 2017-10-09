module.exports = {
    handlers: (_, TodoModel, UserType, GraphQLObjectType, GraphQLNonNull, GraphQLString) => {
        return new GraphQLObjectType({ // since we declare it here our API will be build with this model
            name: 'Todo',
            description: 'This represents a Todo Item from our list',
            fields: () => ({
                _id: { type: new GraphQLNonNull(GraphQLString) },
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