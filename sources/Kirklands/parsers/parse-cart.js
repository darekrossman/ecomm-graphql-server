const cheerio = require("cheerio")
const qs = require("querystring")
const url = require("url")

const toNumber = n => {
  return n
    ? parseFloat(
        n
          .trim()
          .replace("$", "")
          .replace(",", ""),
        10
      )
    : null
}

const extractItems = $ => {
  const _items = $("form#basket_body .cart-item").toArray()

  const items =
    _items.length > 0
      ? _items.map(item => {
          const $item = $(item)
          const scriptText = $item.find("script").html()
          // eslint-disable
          const _itemMergeUUID = scriptText.match(
            /persistDeleveryOptions\('(.*?)'/
          ) || [null, null]
          // eslint-enable

          const quicklookUrl = $item
            .find(".cart-images span")
            .eq(0)
            .text()
            .trim()

          const {
            productId,
            productVariantId,
            itemGUID,
            itemUUID,
            parentCategoryId,
            categoryId,
            quantity
          } = qs.parse(quicklookUrl.replace("/?", ""))

          return {
            id: productId,
            quicklookUrl: `/catalog/includes/quicklook_miniproduct.jsp.json?${quicklookUrl}`,
            name: $item
              .find(".cart-description h3")
              .text()
              .trim(),
            thumbnail: url.parse(
              $item
                .find(".cart-images .item-img")
                .eq(0)
                .attr("src")
                .replace("http:", "https:")
            ).pathname,
            sku: $item
              .find(".cart-description .sku")
              .text()
              .trim()
              .replace("Item #", ""),
            price: toNumber(
              $item.find(".cart-price .priceDisplay").text() ||
                $item.find(".cart-price .saleDisplay").text()
            ),
            strikePrice: toNumber(
              $item.find(".cart-price .priceDisplaySale").text()
            ),
            productId,
            productVariantId,
            itemGUID,
            itemUUID,
            parentCategoryId,
            categoryId,
            quantity: toNumber(quantity),
            deliveryMethod: $item
              .find(".delivery-form-check-input[checked]")
              .val(),
            deliveryOptions: $item
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
                      .text()
                      .replace(/(\t|\n)/g, "")
                      .trim() || null,
                  secondaryLabel:
                    $(item)
                      .find(".label-secondary a")
                      .remove()
                      .end()
                      .find(".label-secondary")
                      .text()
                      .trim()
                      .replace(/\s+/g, " ") || null
                }
              }),
            itemMergeUUID: _itemMergeUUID[1],
            deliveryOptionErrors: $item
              .find(".delivery-options > p.alert")
              .toArray()
              .map(item => {
                const err = $(item)
                  .text()
                  .trim()
                if (err.length > 0) {
                  return err
                }
                return null
              }),
            deliveryMethodUpdateKey: $item
              .find('input[name^="deliveryMethod_"]')
              .eq(0)
              .attr("name"),
            quantityUpdateKey: $item
              .find('input[name^="quantity_"]')
              .attr("name")
          }
        })
      : []
  console.log(JSON.stringify(items, null, 2))
  return { items, hasItems: items.length > 0 }
}

const extractFormData = $ => {
  const formData = $("#basket_body input")
    .not('[type="radio"]')
    .not('[type="submit"]')
    .toArray()
    .concat($('#basket_body input[type="radio"][checked]').toArray())
    .concat($("#basket_body select").toArray())
    .map(input => {
      const $input = $(input)
      const name = $input.attr("name")
      const value = $input.val()
      return { name, value }
    })
  return { formData }
}

const extractJson = $ => {
  const result = {
    cartFormUrl: $("form#basket_body").attr("action"),
    summarySubtotal: toNumber(
      $(".estimatedShippingWrapper > dl:first-child dd").text()
    ),
    savingsTotal: toNumber($(".estimatedShippingWrapper .saving dd").text()),
    summaryGrandTotal: toNumber($("#estimated-grand-total").text()),
    ...extractItems($),
    ...extractShippingOptions($),
    ...extractFormData($),
    ...extractPromoCodes($)
  }
  result.itemCount = result.items.reduce((a, b) => a + b.quantity, 0)
  return result
}

const extractPromoCodes = $ => {
  const promoCode = (
    $('#promocodeblock input[name="promoCode"]').val() || ""
  ).trim()
  const hasPromoCode = promoCode.length > 0
  const promoCodes = $('.promoCode div[id="promocoderemoveblock"]')
    .toArray()
    .map(pc => {
      return $(pc)[0]
        .children[0].data.replace(/\(.*/, "")
        .trim()
    })
  return { promoCode, hasPromoCode, promoCodes }
}

const extractShippingOptions = $ => {
  const summaryShipping = $("#carrierCode option")
    .toArray()
    .map(option => {
      return {
        optText: $(option).text(),
        optVal: $(option).val(),
        optSelected: $(option).is(":selected") ? true : false
      }
    })
  return { summaryShipping }
}

module.exports = (rawHtml, params = {}) => {
  const $ = cheerio.load(rawHtml)
  return extractJson($, params)
}
