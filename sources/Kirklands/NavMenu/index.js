const { RESTDataSource } = require("apollo-datasource-rest")

const parseNavMenu = require("./parse-nav-menu")

class ProductsAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "https://www.kirklands.com"
  }

  async getNavMenu() {
    return parseNavMenu(
      await this.get("/", null, { cacheOptions: { ttl: 3600 } })
    )
  }
}

module.exports = ProductsAPI
