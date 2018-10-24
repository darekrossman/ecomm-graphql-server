const { RESTDataSource } = require("apollo-datasource-rest")
const parseProductList = require("./parse-product-list")
const parseProductDetail = require("./parse-product-detail")

class ProductsAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "https://www.perfume.com/"
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
}

module.exports = ProductsAPI
