const qs = require("querystring")
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

  async addToCart(product) {
    const body = qs.stringify({
      ts: new Date().getTime(),
      action: "addProduct",
      productName: product.name,
      productId: product.id,
      categoryId: product.categoryId,
      parentCategoryId: product.parentCategoryId,
      subCategoryId: product.subCategoryId,
      quantity: product.quantity,
      productVariantId: product.productVariantId,
      deliveryMethod: product.deliveryMethod,
      selectedStore: "1847",
      crossSellItem: "",
      itemGUID: "",
      isUpdate: 1,
      deliveryMethodNotRequired: true,
      prefix: ".EntityBody"
    })

    const addResponse = await this.post("/checkout/add_item_pc.cmd", body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    })

    if (
      addResponse
        .toLowerCase()
        .indexOf("has been updated in your shopping cart") > -1
    ) {
      return parseCart(await this.get("/checkout/basket.jsp"))
    }
  }

  async removeFromCart(uuid) {
    const res = await this.get(
      `/checkout/delete_item_from_order.cmd?itemUUID=${uuid}`
    )
    return parseCart(await this.get("/checkout/basket.jsp"))
  }
}

module.exports = ProductsAPI
