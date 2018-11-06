const { ApolloServer, gql } = require("apollo-server")
const typeDefs = require("./typedefs")
const baseResolvers = require("./resolvers")

const KirklandsAPI = require("./sources/Kirklands/api")
const resolvers = require("./sources/Kirklands/resolvers")

const ENGINE_API_KEY = "service:subpopular-4512:BOzArVEjePRR86E7D8uCiA"

const server = new ApolloServer({
  typeDefs,
  resolvers: { ...baseResolvers, ...resolvers },
  dataSources: () => {
    return {
      clientAPI: new KirklandsAPI()
    }
  },
  context: ({ req, res }) => ({
    cookie: req.headers["x-cookie-payload"]
  }),
  introspection: true,
  playground: true
})

server.listen({ port: 4000 })
