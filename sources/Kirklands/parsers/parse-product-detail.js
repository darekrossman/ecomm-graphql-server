const cheerio = require("cheerio")
const url = require("url")

module.exports = async data => {
  const $ = cheerio.load(data)
  const productForm = $('[name="productForm"]')
  const productId = productForm.find('[name="productId"]').val()
  const name = productForm
    .find('[itemprop="name"]')
    .text()
    .trim()

  let prefix = productForm.find("button.addtocart").attr("onclick") || null
  if (prefix) {
    prefix = prefix.replace("addToCart('", "").replace(/',.*/, "")
  }

  const price = parseFloat(
    productForm
      .find('[itemprop="price"]')
      .text()
      .trim()
      .replace("$", ""),
    10
  )
  const strikePrice =
    parseFloat(
      productForm
        .find(".priceDisplaySale")
        .text()
        .trim()
        .replace("$", ""),
      10
    ) || null

  $(".details-container #info-collapse1 .card-body")
    .find("font")
    .each((idx, el) => {
      const html = $(el).html()
      $(el).replaceWith($(`<p>${html}</p>`))
    })
    .end()
    .find("br")
    .remove()
  const description = $(".details-container #info-collapse1 .card-body").html()

  const result = {
    id: productId,
    name,
    price,
    path: url.parse($('meta[itemprop="url"]').attr("content")).pathname,
    description,
    sku: productForm
      .find(".productstyle")
      .text()
      .trim()
      .replace("Item #", ""),
    quantity: 1,
    categoryId: productForm.find('[name="categoryId"]').val(),
    parentCategoryId: productForm.find('[name="parentCategoryId"]').val(),
    subCategoryId: productForm.find('[name="subCategoryId"]').val(),
    productVariantId: productForm.find('[name="productVariantId"]').val(),
    deliveryOptions: productForm
      .find(".delivery-options .delivery-form-check")
      .not("[hidden]")
      .not(".hidden")
      .toArray()
      .map(item => {
        return {
          key: $(item)
            .find(".delivery-form-check-input")
            .attr("name"),
          value: $(item)
            .find(".delivery-form-check-input")
            .attr("value"),
          primaryLabel:
            $(item)
              .find(".label-primary")
              .text() || null,
          secondaryLabel:
            $(item)
              .find(".label-secondary")
              .text() || null
        }
      }),
    rating: parseFloat(
      $(".bvseo-ratingValue")
        .text()
        .trim() || 0.0
    ),
    reviewCount: parseInt($(".bvseo-reviewCount").text() || "0", 10) || 0
  }

  result.deliveryMethod = result.deliveryOptions[0].value

  return result
}
