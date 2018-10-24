const qs = require("querystring")
const GraphQLJSON = require("graphql-type-json")

const resolvers = {
  Query: {
    getNavMenu: async (_source, { path }, { dataSources }) => {
      return dataSources.navMenuAPI.getNavMenu()
    },
    getProducts: async (_source, { path }, { dataSources }) => {
      return dataSources.productsAPI.getProducts(path)
    },
    getProduct: async (_source, { path }, { dataSources }) => {
      return dataSources.productsAPI.getProduct(path)
    }
  }
}

module.exports = resolvers
