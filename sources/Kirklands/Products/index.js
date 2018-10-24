const { RESTDataSource } = require("apollo-datasource-rest")

const parseProductList = require("./parse-product-list")
const parseProductDetail = require("./parse-product-detail")

class ProductsAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "https://www.kirklands.com/"
  }

  async getProducts(path) {
    return parseProductList(
      await this.get(path, null, { cacheOptions: { ttl: 300 } })
    )
  }

  async getProduct(path) {
    return parseProductDetail(
      await this.get(path, null, { cacheOptions: { ttl: 60 } })
    )
  }

  async getProductImages(productId) {
    const images = await this.get(
      `/product/getImagesForProduct.do?productId=${productId}`,
      null,
      { cacheOptions: { ttl: 60 } }
    )
    return Array.isArray(images) ? images : []
  }
}

module.exports = ProductsAPI
