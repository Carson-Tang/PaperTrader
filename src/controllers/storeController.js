const stockController = require("./stockController");
const Store = window.require('electron-store');

const store = new Store();

const storeController = {};

storeController.set = (key, val) => {
  store.set(key, val);
}

storeController.get = (key) => {
  return store.get(key);
}

storeController.delete = (key) => {
  store.delete(key);
}

storeController.getStore = () => {
  return store;
}

// Watchlist 
storeController.getWatchlist = () => {
  if (!store.get('watchlist')) {
    store.set('watchlist', []);
  }
  return store.get('watchlist');
}

storeController.addToWatchlist = (quote) => {
  if (!store.get('watchlist')) {
    store.set('watchlist', []);
  }
  let watchlist = store.get('watchlist');
  if (!watchlist.includes(quote)) {
    watchlist.push(quote);
    watchlist.sort();
    store.set('watchlist', watchlist);
  }
}

storeController.removeFromWatchlist = (quote) => {
  if (!store.get('watchlist')) {
    store.set('watchlist', []);
  }
  let watchlist = store.get('watchlist').filter(item => item !== quote);
  store.set('watchlist', watchlist);
}

// Portfolio Value
storeController.getPortfolioValue = () => {
  if (!store.get('portfolioValue')) {
    store.set('portfolioValue', 0);
  }
  return store.get('portfolioValue');
}

storeController.setPortfolioValue = (value) => {
  store.set('portfolioValue', value);
}

storeController.updatePortfolioValue = async () => {
  let portfolioValue = 0;
  const ownedShares = storeController.getOwnedShares();
  for (var i = 0; i < ownedShares.length; i++) {
    let quote = ownedShares[i][0];
    let quotePrice = await stockController.getStockPrice(quote)
    portfolioValue += quotePrice * ownedShares[i][1];
  }
  store.set('portfolioValue', portfolioValue);
}

// Buying Power
storeController.getBuyingPower = () => {
  if (!store.get('buyingPower')) {
    store.set('buyingPower', 0);
  }
  return store.get('buyingPower');
}

storeController.setBuyingPower = (value) => {
  store.set('buyingPower', value);
}

storeController.increaseBuyingPower = (value) => {
  if (!store.get('buyingPower')) {
    store.set('buyingPower', 0);
  }
  store.set('buyingPower', store.get('buyingPower') + value);
}

storeController.decreaseBuyingPower = (value) => {
  if (!store.get('buyingPower')) {
    store.set('buyingPower', 0);
  }
  store.set('buyingPower', store.get('buyingPower') - value);
}

// Commission Fee
storeController.getCommissionFee = () => {
  if (!store.get('commissionFee')) {
    store.set('commissionFee', 0);
  }
  return store.get('commissionFee');
}

storeController.setCommissionFee = (value) => {
  store.set('commissionFee', value);
}

// Owned Shares
storeController.getOwnedShares = () => {
  if (!store.get('ownedShares')) {
    store.set('ownedShares', []);
  }
  return store.get('ownedShares');
}

storeController.buyShares = (quote, amount, avgPrice, currentPrice) => {
  let buyingPower = storeController.getBuyingPower();
  if (buyingPower >= amount * avgPrice && avgPrice >= currentPrice) {
    storeController.setBuyingPower(buyingPower - amount * avgPrice);
    storeController.addToOwnedShares(quote, amount, avgPrice);
    return true;
  }
  return false;
}

storeController.addToOwnedShares = (quote, amount, avgPrice) => {
  if (!store.get('ownedShares')) {
    store.set('ownedShares', []);
  }
  let ownedShares = store.get('ownedShares');

  let index = -1;
  for (var i = 0; i < ownedShares.length; i++) {
    if (ownedShares[i][0] === quote) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    ownedShares.push([quote, amount, avgPrice]);
  } else {
    let oldAmount = ownedShares[index][1];
    let oldAvgPrice = ownedShares[index][2];
    let newAmount = oldAmount + amount;
    let newAvgPrice = ((oldAmount * oldAvgPrice) + (amount * avgPrice)) / newAmount;
    ownedShares[index][1] = newAmount;
    ownedShares[index][2] = newAvgPrice;
  }

  ownedShares.sort((a,b) => a[0] - b[0]);
  store.set('ownedShares', ownedShares);
}

storeController.sellShares = (quote, amount, sellPrice, currentPrice) => {
  if (currentPrice >= sellPrice) {
    let buyingPower = storeController.getBuyingPower();
    const res = storeController.removeFromOwnedShares(quote, amount);
    if (res) {
      storeController.setBuyingPower(buyingPower + amount * sellPrice);
      return true;
    }
  }
  return false;
}

storeController.removeFromOwnedShares = (quote, amount) => {
  if (!store.get('ownedShares')) {
    store.set('ownedShares', []);
  }
  let ownedShares = store.get('ownedShares');

  let index = -1;
  for (var i = 0; i < ownedShares.length; i++) {
    if (ownedShares[i][0] === quote) {
      index = i;
      break;
    }
  }

  if (index !== -1) {
    let amountOwned = ownedShares[index][1];
    if (amountOwned === amount) {
      ownedShares.splice(index, 1);
    } else if (amountOwned > amount) {
      ownedShares[index][1] -= amount;
    } else {
      console.log('TRYING TO SELL MORE SHARES THAN OWNED')
      return false;
    }
    store.set('ownedShares', ownedShares);
    return true;
  }
  return false;
}

storeController.testing = () => {
  storeController.setPortfolioValue(1234);
}

module.exports = storeController;