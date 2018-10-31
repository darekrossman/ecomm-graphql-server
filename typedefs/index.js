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

  type Product {
    id: ID!
    name: String!
    path: String
    categoryId: String
    parentCategoryId: String
    subCategoryId: String
    price: Float
    description: String
    sku: String
    brand: String
    rating: Float
    thumbnail: Image
    quantity: Int
    deliveryOptions: [ProductDeliveryOption]
    deliveryMethod: String
    images: [Image]
  }

  type Cart {
    items: [Product]!
  }

  type NavMenu {
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
`

module.exports = typeDefs
