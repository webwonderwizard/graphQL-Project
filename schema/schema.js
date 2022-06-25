const graphql = require("graphql");
var _ = require("lodash");
const User = require("../model/user");
const Hobby = require("../model/hobby");
const Post = require("../model/post");

//dummy data structure
// var usersData = [
//     { id: "1", name: "John", age: 30, profession: "programmer" },
//     { id: "2", name: "Amber", age: 45, profession: "Doctor" },
//     { id: "3", name: "Raj", age: 67, profession: "Singer" },
//     { id: "4", name: "Tarun", age: 23, profession: "Dancer" },
// ];

// var hobbiesData = [{
//         id: "1",
//         title: "Programming",
//         description: "uses computers to solve",
//         userId: "2",
//     },
//     {
//         id: "2",
//         title: "Swimming",
//         description: "swims across the ocean",
//         userId: "2",
//     },
//     {
//         id: "3",
//         title: "Hiking",
//         description: "Hikes across the hills",
//         userId: "3",
//     },
//     {
//         id: "4",
//         title: "Rowing",
//         description: "Rows on the water with a ship",
//         userId: "1",
//     },
// ];

// var postsData = [
//     { id: "1", comment: "ohh!! Hello there", userId: "1" },
//     { id: "2", comment: "wooowwww", userId: "1" },
//     { id: "3", comment: "I am so happy", userId: "3" },
//     { id: "4", comment: "Wish you were here", userId: "1" },
// ];

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
} = graphql;

//create types
const UserType = new GraphQLObjectType({
    name: "user",
    description: "Documentation for user",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString },

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                //return _.filter(postsData, { userId: parent.id });
                return Post.find({ userId: parent.id });
            },
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                //return _.filter(hobbiesData, { userId: parent.id });
                return Hobby.find({ userId: parent.id });
            },
        },
    }),
});

const HobbyType = new GraphQLObjectType({
    name: "hobby",
    description: "Documentation for hobby",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(usersData, { id: parent.userId });
            },
        },
    }),
});

//Post Type (id, comment)
const PostType = new GraphQLObjectType({
    name: "post",
    description: "Documentation for post",
    fields: () => ({
        id: { type: GraphQLID },
        comment: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(usersData, { id: parent.userId });
            },
        },
    }),
});

//Root Query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    description: "Root Query", //description for the root query
    fields: () => ({
        user: {
            //user is the name of the query
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                //we resolve with data
                //get and return data from a database
                // let user = {
                //     id: "345",
                //     age: 20,
                //     name: "John",
                // };
                // return user;

                return User.findById(args.id);
                /*


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
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
            resolve(parent, args) {
                //return data for hobby
                return Hobby.findById(args.id);
            },
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                // return hobbiesData;
                return Hobby.find({});
            },
        },
        post: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //return data for post
                return Post.findById(args.id);
            },
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({});
            },
        },
    }),
});

//new section
//Mutations - modify and send the data
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
        UpdateUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                profession: { type: GraphQLString },
            },
            resolve(parent, args) {
                return (updateUser = User.findByIdAndUpdate(
                    args.id, {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession,
                        },
                    }, { new: true }
                ));
            },
        },
        RemoveUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                let removedUser = User.findByIdAndRemove(args.id).exec();
                if (!removedUser) {
                    throw new Error("Error");
                }
                return removedUser;
            },
        },
        //create post mutation
        createPost: {
            type: PostType,
            args: {
                comment: { type: new GraphQLNonNull(GraphQLString) },
                userId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                let post = Post({
                    comment: args.comment,
                    userId: args.userId,
                });
                return post.save();
            },
        },
        UpdatePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                comment: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return (updatePost = Post.findByIdAndUpdate(
                    args.id, {
                        $set: {
                            comment: args.comment,
                        },
                    }, { new: true }
                ));
            },
        },
        RemovePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                let removedPost = Post.findByIdAndRemove(args.id).exec();
                if (!removedPost) {
                    throw new Error("Error");
                }
                return removedPost;
            },
        },
        createHobby: {
            type: HobbyType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                userId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                let hobby = Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId,
                });
                return hobby.save();
            },
        },
        UpdateHobby: {
            type: HobbyType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return (updateHobby = Hobby.findByIdAndUpdate(
                    args.id, {
                        $set: {
                            title: args.title,
                            description: args.description,
                        },
                    }, { new: true }
                ));
            },
        },
        RemoveHobby: {
            type: HobbyType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                let removedHobby = User.findByIdAndRemove(args.id).exec();
                if (!removedHobby) {
                    throw new Error("Error");
                }
                return removedHobby;
            },
        },
    },
});
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});