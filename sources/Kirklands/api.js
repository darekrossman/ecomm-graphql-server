const { RESTDataSource } = require("apollo-datasource-rest")

const parseProductList = require("./parsers/parse-product-list")
const parseProductDetail = require("./parsers/parse-product-detail")
const parseNavMenu = require("./parsers/parse-nav-menu")
const parseCart = require("./parsers/parse-cart")

class ProductsAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "https://www.kirklands.com/"
  }

  willSendRequest(request) {
    const { cookie } = this.context
    if (cookie) {
      request.headers.set("Cookie", cookie)
    }
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

  async getNavMenu() {
    return parseNavMenu(
      await this.get("/", null, { cacheOptions: { ttl: 3600 } })
    )
  }

  async getCart() {
    return parseCart(await this.get("/checkout/basket.jsp"))
  }
}

module.exports = ProductsAPI
