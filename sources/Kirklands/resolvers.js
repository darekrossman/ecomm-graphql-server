const qs = require("querystring")
const GraphQLJSON = require("graphql-type-json")

const resolvers = {
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

      const params = {
        qlt: 60,
        resMode: "bicub",
        op_sharpen: 1,
        fit: "crop"
      }

      const qtrWidth = Math.floor(mxw / 4)
      const halfWidth = Math.floor(mxw / 2)
      const fullWidth = mxw

      const imgSet = [
        { wid: qtrWidth, hei: qtrWidth },
        { wid: halfWidth, hei: halfWidth },
        { wid: fullWidth, hei: fullWidth }
      ]

      const srcSet = imgSet.map(
        set => `${src}?${qs.stringify({ ...set, ...params })} ${set.wid}w`
      )
      const sizes = `(max-width: ${mxw}px) 100vw, ${mxw}px`
      return {
        src: srcSet[srcSet.length - 1].replace(/ .*$/, ""),
        srcSet: srcSet.join(","),
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
