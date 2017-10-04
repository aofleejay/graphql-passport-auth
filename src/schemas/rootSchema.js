const { makeExecutableSchema } = require('graphql-tools');
const { signup } = require('../services/auth')

const typeDefs = [`
  type Query {
    hello: String
  }

  type Mutation {
    signup(email: String, password: String): User 
  }

  type User {
    email: String!
    password: String!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`];

const resolvers = {
  Query: {
    hello(root) {
      return 'world';
    }
  },
  Mutation: {
    signup(root, { email, password }, context) {
      return signup(email, password, context)
    }
  }
};

module.exports = makeExecutableSchema({typeDefs, resolvers});
