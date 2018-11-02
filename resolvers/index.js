const qs = require("querystring")
const GraphQLJSON = require("graphql-type-json")

const resolvers = {
  Query: {
    getNavMenu: async (_source, { path }, { dataSources }) => {
      return dataSources.clientAPI.getNavMenu()
    },
    getProducts: async (_source, { path }, { dataSources }) => {
      return dataSources.clientAPI.getProducts(path)
    },
    getProduct: async (_source, { path }, { dataSources }) => {
      return dataSources.clientAPI.getProduct(path)
    },
    getCart: async (_source, { path }, { dataSources }) => {
      return dataSources.clientAPI.getCart()
    }
  },
  Mutation: {
    addToCart: async (_source, data, { dataSources }) => {
      return dataSources.clientAPI.addToCart(data)
    },
    removeFromCart: async (_source, { uuid }, { dataSources }) => {
      return dataSources.clientAPI.removeFromCart(uuid)
    }
  }
}

module.exports = resolvers
