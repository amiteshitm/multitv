import Config from 'config/client'

// SEO Class for Price Page.
export class PricePageMeta {
  // Get Title
  static title (crypto, fiat) {
    let title = 'BTC To USD Price (BTC/USD)'
    let selectedCrypto = Config.cryptos.filter(selCrypto => selCrypto.value === crypto)

    if (selectedCrypto.length > 0) {
      title = `${selectedCrypto[0].label} to ${fiat.toUpperCase()} Price (${crypto.toUpperCase()}/${fiat.toUpperCase()})`
    }

    return title
  }

  static desc (crypto = 'btc', fiat = 'usd') {
    let desc = 'Latest Cryptocurrency Price, Set Crypto Currency Price Alerts'
    let selectedCrypto = Config.cryptos.filter(selCrypto => selCrypto.value === crypto)

    if (selectedCrypto.length > 0) {
      desc = `Latest ${selectedCrypto[0].value} to ${fiat.toUpperCase()} Price (${crypto.toUpperCase()}/${fiat.toUpperCase()}).` +
               ` Subscribe to ${selectedCrypto[0].label} (${selectedCrypto[0].value}) Price Alerts`
    }

    return desc
  }
}
export class AlertPageMeta {
  static title (coin, alert) {
    let title = coin != null ? `Set ${coin.name.toUpperCase()}(${coin.symbol}) Price Alert,Notification,Reminder`
      : alert.isWaitingForLogin === true ? `Set ${alert.fromSym.toUpperCase()} Price Alert`
        : `Bitcoin(BTC) Price, Ethereum(ETH) Price, Cryptocurrency price alerts`
    return title
  }

  static desc (coin, alert) {
    let desc = coin != null ? `Set ${coin.toUpperCase()} Price Alert and get live Price movements to your inbox`
      : alert.isWaitingForLogin === true ? `Set ${alert.fromSym.toUpperCase()} Price Alert 
            and get live Price movements into your inbox`
        : `Get Bitcoin(BTC) Price Alerts, Ethereum(ETH) Price Alerts and All Cryptocurrency price alerts to your inbox`
    return desc
  }
}
export class CoinPageMeta {
  // Get Title
  static title (coin, price = null) {
    let title = price ? `${price} USD - ` : ''
    title += `${coin.name}(${coin.symbol}) Cryptocurrency Review, Price, Market Cap, Charts`

    return title
  }

  static desc (coin) {
    let desc = `Detailed overview of ${coin.name}(${coin.symbol}) Cryptocurrency, Price Movements, Market Cap, Token Details, Returns and Analysis`

    return desc
  }

  static buyTitle (coin) {
    let title = `Buy ${coin.name} (${coin.symbol}) | How to buy ${coin.name}`
    return title
  }

  static buyDesc (coin) {
    let desc = `Buying ${coin.name} (${coin.symbol}). Step by step guide to buy ${coin.name}.` +
      ` Buy ${coin.name} with Credit Card. Buy ${coin.name} with Debit Card and Paypal.`
    return desc
  }

  static getIndexPageTitle () {
    return `Cryptocurrency Market Cap, Latest Price`
  }

  static getIndexPageDesc () {
    return `Latest crypto currency market prices.` +
      ` Get Price of Bitcoin, Ethereum, Ripple and other coins at one place.`
  }

  static getIcoIndexPageTitle () {
    return `List of ICOs and token sales. ICO Coin Reviews-Sipacoin`
  }

  static getIcoIndexPageDesc () {
    return `Browse complete list of Upcoming ICOs and token sales. ` +
      ` Check out ICO Ratings and ICO Coin Reviews. Best ICO Cryptocurrency Analysis.`
  }

  static getIcoShowPageTitle (coin) {
    return `${coin.name} ICO: Details and analysis on ${coin.name} Token ICO and token sale`
  }

  static getIcoShowPageDesc (coin) {
    return `Get all the information of ${coin.name} ICO and ` +
      `${coin.name} Crowd sale. Best analysis of ${coin.name} ICO and ${coin.name} ICO Ratings.`
  }
}
