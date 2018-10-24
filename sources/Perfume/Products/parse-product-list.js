const cheerio = require("cheerio")
const qs = require("querystring")
const url = require("url")

module.exports = (response, params = {}) => {
  const $ = cheerio.load(response)
  const items = $(".product")
    .toArray()
    .map((el, i) => {
      const $el = $(el)
      const productPath = $el
        .find("a")
        .eq(0)
        .attr("href")

      return {
        id: productPath,
        path: productPath,
        brand: $el
          .find("p")
          .find("br")
          .remove()
          .end()
          .text()
          .replace(/as low as .*/i, ""),
        name: $el
          .find("h2")
          .text()
          .trim(),
        thumbnail: { src: $el.find(".product-img img").attr("src") },
        price: parseFloat(
          $el
            .find("p .flag")
            .text()
            .replace("$", "")
        )
      }
    })

  return items
}
