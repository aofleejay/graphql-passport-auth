const { makeExecutableSchema } = require('graphql-tools');
const { signup } = require('../services/auth')

const typeDefs = [`
  type Query {
    user: User
  }

  type Mutation {
    signup(email: String, password: String): User 
  }

  type User {
    id: String!
    email: String!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`];

const resolvers = {
  Query: {
    user(root, args, context) {
      return context.user
    }
  },
  Mutation: {
    signup(root, { email, password }, context) {
      return signup(email, password, context)
    }
  }
};

module.exports = makeExecutableSchema({typeDefs, resolvers});
