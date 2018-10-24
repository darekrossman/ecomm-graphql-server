const { ApolloServer, gql } = require("apollo-server")
const typeDefs = require("./typedefs")
const baseResolvers = require("./resolvers")

const NavMenuAPI = require("./sources/Kirklands/NavMenu")
const ProductsAPI = require("./sources/Kirklands/Products")
const resolvers = require("./sources/Kirklands/resolvers")

const ENGINE_API_KEY = "service:subpopular-4512:BOzArVEjePRR86E7D8uCiA"

const server = new ApolloServer({
  typeDefs,
  resolvers: { ...baseResolvers, ...resolvers },
  useGETForQueries: true,
  dataSources: () => {
    return {
      productsAPI: new ProductsAPI(),
      navMenuAPI: new NavMenuAPI()
    }
  },
  introspection: true,
  playground: true
})

server.listen({ port: 4000 })
