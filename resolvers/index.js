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
  },
  Product: {
    images: async (_source, args, { dataSources }) => {
      return await dataSources.productsAPI.getProductImages(_source.id)
    },
    thumbnail: async (_source, args, { dataSources }) => {
      if (_source.thumbnail) return `http://s7d5.scene7.com${_source.thumbnail}`
      const images = await dataSources.productsAPI.getProductImages(_source.id)
      return images[0]
    }
  },

  Image: {
    src: src => src,
    s7: src => src
  },

  S7Optimized: {
    fluid: (src, args) => {
      const mxw = args.maxWidth || 640
      const aspectRatio = args.aspectRatio || 1
      const srcSet = [
        `${src}?wid=${Math.floor(mxw / 4)}&hei=${mxw /
          4}&qlt=60,1&fmt=webp&resMode=bicub&op_sharpen=1 ${Math.floor(
          mxw / 4
        )}w`,
        `${src}?wid=${Math.floor(mxw / 2)}&hei=${mxw /
          2}&qlt=60,1&fmt=webp&resMode=bicub&op_sharpen=1 ${Math.floor(
          mxw / 2
        )}w`,
        `${src}?wid=${mxw}&hei=${mxw}&qlt=60,1&fmt=webp&resMode=bicub&op_sharpen=1 ${mxw}w`,
        `${src}?wid=${Math.floor(mxw * 1.5)}&hei=${mxw *
          1.5}&qlt=60,1&fmt=webp&resMode=bicub&op_sharpen=1 ${Math.floor(
          mxw * 1.5
        )}w`,
        `${src}?wid=${Math.floor(mxw * 2)}&hei=${mxw *
          2}&qlt=60,1&fmt=webp&resMode=bicub&op_sharpen=1 ${Math.floor(
          mxw * 2
        )}w`
      ].join(",")
      const sizes = `(max-width: ${mxw}px) 100vw, ${mxw}px`
      return {
        src: `${src}?wid=${mxw}&hei=${mxw}&qlt=60,1&fmt=webp&resMode=bicub&op_sharpen=1`,
        srcSet,
        sizes,
        aspectRatio,
        width: mxw,
        height: mxw / aspectRatio
      }
    }
  },
  JSON: GraphQLJSON
}

module.exports = resolvers
