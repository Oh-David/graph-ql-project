const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLSchema,
} = graphql;

// Scalar Type
/*
 String = GraphQLString
 int
 Float
 Boolean
 ID 
*/

const Person = new GraphQLObjectType({
  name: "Person",
  description: "represents a person type",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    isMarried: { type: GraphQLBoolean },
    gpa: { type: GraphQLFloat },

    // justAType: {
    //   type: Person,
    //   resolve(parent, args) {
    //     return parent;
    //   },
    // },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    Person: {
      type: Person,

      resolve(parent, args) {
        let personObj = {
          name: "Anthony",
          age: 34,
          isMarried: true,
          gpa: 3.0,
        };

        return personObj;
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
});
