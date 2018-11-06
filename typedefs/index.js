const { gql } = require("apollo-server")

const typeDefs = gql`
  scalar JSON

  type S7Optimized {
    fluid(maxWidth: Int): Picture
  }

  type Image {
    src: String
    s7: S7Optimized
  }

  type Picture {
    src: String
    srcSet: String
    sizes: String
    width: String
    height: String
    aspectRatio: Float
  }

  type Product @cacheControl(maxAge: 3600) {
    id: ID!
    uuid: String
    name: String!
    path: String
    categoryId: String
    parentCategoryId: String
    subCategoryId: String
    productVariantId: String
    price: Float
    description: String
    sku: String
    brand: String
    rating: Float
    reviewCount: Int
    thumbnail: Image
    quantity: Int
    deliveryOptions: [ProductDeliveryOption]
    deliveryMethod: String
    images: [Image]
    mergeUUID: String
  }

  type CartProduct {
    id: ID!
    uuid: String
    name: String!
    path: String
    categoryId: String
    parentCategoryId: String
    subCategoryId: String
    productVariantId: String
    price: Float
    description: String
    sku: String
    brand: String
    rating: Float
    reviewCount: Int
    thumbnail: Image
    quantity: Int
    deliveryOptions: [ProductDeliveryOption]
    deliveryMethod: String
    images: [Image]
    mergeUUID: String
  }

  type Cart @cacheControl(maxAge: 0) {
    items: [CartProduct]!
  }

  type NavMenu @cacheControl(maxAge: 3600) {
    id: ID!
    levels: JSON
  }

  type ProductDeliveryOption {
    key: String!
    value: String!
    primaryLabel: String
    secondaryLabel: String
  }

  type Query {
    getNavMenu: NavMenu
    getProducts(path: String!): [Product]
    getProduct(path: String!): Product
    getCart: Cart
  }

  type Mutation {
    addToCart(
      id: String!
      name: String!
      categoryId: String!
      parentCategoryId: String!
      subCategoryId: String!
      quantity: Int!
      productVariantId: String!
      deliveryMethod: String!
    ): Cart
    removeFromCart(uuid: String!): Cart
  }
`

module.exports = typeDefs
