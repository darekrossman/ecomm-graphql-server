const url = require("url")
const cheerio = require("cheerio")

const relativeUrl = rawUrl => url.parse(rawUrl).path

const correctMenuText = txt => {
  return txt.trim()
}

const getTopNavLabel = text => {
  return (
    {
      "Collections & New Arrivals": "New",
      "Lamps & Lighting": "Lighting",
      "Kitchen & Dining": "Kitchen & Entertaining",
      "Seasonal & Gifts": "Holiday",
      "Home Decor & Pillows": "Decor & Pillows",
      Sales: "Sales & Clearance"
    }[text] || text
  )
}

const extractMenu = html => {
  const $ = cheerio.load(html)
  let menu = {
    id: "main",
    levels: [
      {
        root: true,
        items: []
      }
    ]
  }

  let items = []
  $("#mainNav li.top-level").each((idx, elem) => {
    let topItem = {}
    topItem.text = getTopNavLabel(
      $("> a", elem)
        .attr("title")
        .trim()
    )
    topItem.items = []

    // these cms elements are all same level so adjust them to have nested html before parsing
    $(elem)
      .find(".navColBegin > ul.level2 > li:has(a.cmsCat)")
      .append("<ul></ul>")
      .addClass("_cleaned")
    $(elem)
      .find(".navColBegin > ul.level2 > li:has(a.cmsSubCat)")
      .each(function(i, el) {
        $(el)
          .prevAll("li:has(a.cmsCat)")
          .first()
          .find("ul")
          .append($(el).clone())
      })
    $(elem)
      .find(".navColBegin > ul.level2 > li:not(._cleaned):has(a.cmsSubCat)")
      .remove()

    $(elem)
      .find(".navColBegin > ul.level2")
      .each((i, el) => {
        if ($(el).find(".cmsImage").length > 0) {
          $(el).empty()
        }
      })

    $(elem)
      .find("a.cat, a.cmsCat")
      .each((idx2, elem2) => {
        let subItem = {}
        subItem.text = correctMenuText($(elem2).text())

        let subSubCats = []
        if ($(elem2).hasClass("cmsCat")) {
          subSubCats = $(elem2)
            .closest("li")
            .find("a.cmsSubCat")
        } else {
          subSubCats = $(elem2)
            .closest("li")
            .find("a.subCat")
        }

        if (subSubCats.length) {
          subItem.items = []
          subSubCats.each((idx3, elem3) => {
            let subSubItem = {}
            subSubItem.text = correctMenuText($(elem3).text())
            subSubItem.url = relativeUrl($(elem3).attr("href"))

            subItem.items.push(subSubItem)
          })
        } else {
          subItem.url = relativeUrl($(elem2).attr("href"))
        }

        topItem.items.push(subItem)
      })

    items.push(topItem)
  })

  menu.levels[0].items = items
  return menu
}

module.exports = extractMenu
