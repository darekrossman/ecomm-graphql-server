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
  }
}

module.exports = resolvers
