const graphql = require("graphql");
var _ = require("lodash");
const User = require("../model/user");
const Hobby = require("../model/hobby");
const Post = require("../model/post");

// dummy data
// var usersData = [
//   { id: "91", name: "xavier", age: 12, profession: "carpenter" },
//   { id: "92", name: "david", age: 10, profession: "student" },
//   { id: "93", name: "frank", age: 13, profession: "nurse" },
//   { id: "94", name: "gina", age: 34, profession: "engineer" },
//   { id: "95", name: "henry", age: 57, profession: "police" },
// ];

// var hobbiesData = [
//   { id: "21", title: "art", description: "artsy fartsy", userId: "95" },
//   { id: "22", title: "beer", description: "drunk as a skunk", userId: "94" },
//   { id: "23", title: "food", description: "food is good", userId: "93" },
//   { id: "24", title: "reading", description: "reading rainbow", userId: "92" },
//   { id: "25", title: "hiking", description: "hiking and biking", userId: "91" },
// ];

// var postsData = [
//   { id: "31", comment: "Something to post", userId: "91" },
//   { id: "32", comment: "GraphQL is awesome", userId: "92" },
//   { id: "33", comment: "How to change the world", userId: "93" },
//   { id: "34", comment: "How to change the Universe", userId: "94" },
//   { id: "35", comment: "How to start indoor gardening", userId: "95" },
// ];

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  description: "Documentation for user...",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ userId: parent.id });
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({ userId: parent.id });
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "Hobby Description...",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post Description...",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Root Query Desc",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return User.findById(args.id);
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },

    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },

      resolve(parents, args) {
        return Hobby.findById(args.id);
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({ id: args.userId });
      },
    },

    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return Post.findById(args.id);
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({});
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },

      resolve(parent, args) {
        let user = User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });

        return user.save();
      },
    },

    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        return (updateUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession,
            },
          },
          {
            new: true,
          }
        ));
      },
    },

    removeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let removedUser = User.findByIdAndRemove(args.id).exec();

        if (!removedUser) {
          throw new "Error: error occured for removedUser "();
        }
        return removedUser;
      },
    },

    createPost: {
      type: PostType,
      args: {
        id: { type: GraphQLID },
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        let post = Post({
          id: args.id,
          comment: args.comment,
          userId: args.userId,
        });

        return post.save();
      },
    },

    updatePost: {
      type: PostType,
      args: {
        id: { type: GraphQLID },
        comment: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return (updatedPost = Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment,
            },
          },
          {
            new: true,
          }
        ));
      },
    },

    removePost: {
      type: PostType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        let removedPost = Post.findByIdAndRemove(args.id).exec();

        if (!removedPost) {
          throw new "Error: error occured for removedPost "();
        }
        return removedPost;
      },
    },

    createHobby: {
      type: HobbyType,
      args: {
        id: { type: GraphQLID },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        let hobby = Hobby({
          id: args.id,
          title: args.title,
          description: args.description,
          userId: args.userId,
        });

        return hobby.save();
      },
    },

    updateHobby: {
      type: HobbyType,
      args: {
        id: { type: GraphQLID },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return (updatedHobby = Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
            },
          },
          {
            new: true,
          }
        ));
      },
    },

    removeHobby: {
      type: HobbyType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        let removedHobby = Hobby.findByIdAndRemove(args.id).exec();

        if (!removedHobby) {
          throw new "Error: error occured for removedHobby "();
        }
        return removedHobby;
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
