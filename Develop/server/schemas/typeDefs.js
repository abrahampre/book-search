// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql` 

type User {
  _id: ID
  username: String
  email: String
  bookCount: Int
  savedBooks: [Book]
  words: [String]
}
type Book {
  title: String
  bookId: String
  authors: [String]
  description: String
  image: String
  link: String
}
type Auth {
  token: ID!
  user: User
}
type Query {
  me: User 
  all: [User]
}
input BookInfo {
  title: String
  bookId: String
  authors: [String]
  description: String
  image: String
  link: String
}
`;

// export the typeDefs
module.exports = typeDefs;