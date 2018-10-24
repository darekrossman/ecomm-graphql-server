const url = require("url")
const cheerio = require("cheerio")

const extractMenu = html => {
  const $ = cheerio.load(html)
  const items = []
  const menu = {
    id: "main",
    levels: [
      {
        root: true,
        items: []
      }
    ]
  }

  const topLevelItems = $(".pri-nav")
    .eq(1)
    .find("a")
    .toArray()
    .map(el => {
      const $el = $(el)
      console.log($el)
      return {
        text: $el.text().trim(),
        url: $el.attr("href")
      }
    })

  menu.levels[0].items = topLevelItems
  return menu
}

module.exports = extractMenu
