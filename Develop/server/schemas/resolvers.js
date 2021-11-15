
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user }
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return { user, token };
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in to save books!');
        },
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );

                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in to delete books!');
        },
        addWord: async (parent, { word }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: {words: word} },
                    { new: true}
                );

                return updatedUser; 
            }
            throw new AuthenticationError('This was a test that failed.');
        }
    },
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findById({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks')
                console.log(userData); 
                return userData;
            }

            throw new AuthenticationError('Not logged in!');
        },
        all: async () => {
            const usersData = await User.find()
                .select('-__v -password')
                .populate('savedBooks')
            
            return usersData; 
        }
    }
};

module.exports = resolvers;

