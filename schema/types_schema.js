const graphql = require("graphql");

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLSchema,
} = graphql;

//scalar types
/*
  String
  int
  float
  boolean
  ID
 

*/

const Person = new GraphQLObjectType({
    name: "Person",
    description: "Description of Person",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        isMarried: { type: GraphQLBoolean },
        gpa: { type: GraphQLFloat },

        justAType: {
            type: Person,
            resolve(parent, args) {
                return parent;
            },
        },
    }),
});
//root query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    description: "Root Query",
    fields: () => ({
        person: {
            type: Person,
            resolve(parent, args) {
                let personObj = {
                    name: "Antonio",
                    age: 25,
                    isMarried: true,
                    gpa: 3.5,
                };
                return personObj;
            },
        },
    }),
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});