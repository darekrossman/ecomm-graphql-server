const cheerio = require("cheerio")
const qs = require("querystring")
const url = require("url")

const getRating = $el => {
  const cls = $el
    .find(".result-rating div")
    .eq(0)
    .attr("class")
  const match = cls.match(/^stars_(\d)\d/)
  const rating = match && match[1] ? parseInt(match[1], 10) : 0
  return (Math.round(rating * 2) / 2).toFixed(1)
}

module.exports = (response, params = {}) => {
  const $ = cheerio.load(response)
  const items = $(".result.product")
    .toArray()
    .slice(0, 25)
    .map((el, i) => {
      const $el = $(el)
      const reviewCount = $el.find(".result-rating a").text()

      const salePrice = $el
        .find(".result-price .sale")
        .text()
        .trim()
        .replace("$", "")
      const strikePrice = $el
        .find(".result-price .strike")
        .text()
        .trim()
        .replace("$", "")
      const price =
        salePrice ||
        $el
          .find(".result-price")
          .text()
          .trim()
          .replace("$", "")

      const productUrl = $el.find(".result-body a").attr("href")
      const queryParamMatch = $el
        .find(".quickview_btn")
        .attr("href")
        .match(/\?(.*)/)
      const { categoryId, parentCategoryId, subCategoryId } = queryParamMatch
        ? qs.parse(queryParamMatch[0])
        : {}

      const [m, id] = productUrl.match(/\/(\d*).uts$/) // eslint-disable-line no-unused-vars
      return {
        id,
        name: $el.find(".result-title").text(),
        thumbnail: url.parse($el.find(".result-image img").attr("data-src"))
          .pathname,
        path: productUrl,
        description: null,
        price: parseFloat(price),
        rating: getRating($el),
        categoryId: categoryId,
        parentCategoryId: parentCategoryId,
        subCategoryId: subCategoryId
      }
    })

  return items
}
