const { makeExecutableSchema } = require('graphql-tools');
const { signup, login } = require('../services/auth')

const typeDefs = [`
  type Query {
    user: User
  }

  type Mutation {
    signup(email: String, password: String): User 
    logout: User
    login(email: String, password: String): User
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
      return signup({ email, password, context })
    },
    logout(root, args, context) {
      const { user } = context
      context.logout()
      return user
    },
    login(root, { email, password }, context) {
      return login({ email, password, context })
    }
  }
};

module.exports = makeExecutableSchema({typeDefs, resolvers});
