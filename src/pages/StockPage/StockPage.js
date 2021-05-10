import React, { useEffect, useState } from "react";
import './StockPage.css';
import LoadingBars from '../../components/LoadingBars/LoadingBars';
import Chart from '../../components/Chart/Chart';
import { BACKGROUND, BLUE, GREEN, WHITE, RED } from '../../constants/colors';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const stockController = require('../../controllers/stockController');
const storeController = require('../../controllers/storeController');

const store = storeController.getStore();
/*
OPEN, HIGH, LOW, VOLUME, MARKET CAP, PE RATIO, PREV CLOSE, div yield,
50 day avg, 200 day avg, 52 week high, 52 week low

ask: 0
askSize: 9
averageDailyVolume3Month: 44658776
averageDailyVolume10Day: 77585220
bid: 0
bidSize: 8
currency: "USD"
exchange: "NMS"
exchangeDataDelayedBy: 0
exchangeTimezoneName: "America/New_York"
exchangeTimezoneShortName: "EST"
fiftyDayAverage: 561.29395
fiftyDayAverageChange: 102.39606
fiftyDayAverageChangePercent: 0.18242858
fiftyTwoWeekHigh: 695
fiftyTwoWeekHighChange: -31.309998
fiftyTwoWeekHighChangePercent: -0.045050357
fiftyTwoWeekLow: 70.102
fiftyTwoWeekLowChange: 593.588
fiftyTwoWeekLowChangePercent: 8.467491
fullExchangeName: "NasdaqGS"
gmtOffSetMilliseconds: -18000000
market: "us_market"
marketState: "PREPRE"
postMarketChange: -1.4500122
postMarketChangePercent: -0.21847734
postMarketPrice: 662.24
postMarketTime: 1609203599
preMarketChange: 0
preMarketChangePercent: 0
preMarketPrice: 0
preMarketTime: 0
quoteSourceName: "Delayed Quote"
quoteType: "EQUITY"
regularMarketChange: 1.9199829
regularMarketChangePercent: 0.29012844
regularMarketDayHigh: 681.4
regularMarketDayLow: 660.8
regularMarketOpen: 674.51
regularMarketPreviousClose: 661.77
regularMarketPrice: 663.69
regularMarketTime: 1609189202
regularMarketVolume: 32278561
shortName: "Tesla, Inc."
sourceInterval: 15
symbol: "TSLA"
tradeable: false
twoHundredDayAverage: 402.01407
twoHundredDayAverageChange: 261.67593
twoHundredDayAverageChangePercent: 0.6509124
*/


const StockPage = (props) => {
  const quote = props.match.params.quote;

  const [quoteData, setQuoteData] = useState();
  const [chartData, setChartData] = useState();
  const [watchlist, setWatchlist] = useState(storeController.getWatchlist() || []);
  const [chartParam, setChartParam] = useState({interval: '15m', duration: '5D'});

  const [drawerOpen, setDrawerOpen] = useState(false);
  // 1 day - 1 min
  // 5 day - 15 min
  // 1 month - 1 day
  // 6 month - 1 day
  // YTD - 1 week
  // 1 year - 1 week
  // 5 year - 1 month
  // max - 1 month

  useEffect(() => {
    (async () => {
      const newChartData = await stockController.getStockChart(quote, chartParam.duration, chartParam.interval)
      console.log(newChartData);
      setChartData(newChartData);
      const newQuoteData = await stockController.getStock(quote)
      setQuoteData(newQuoteData);
    })();
  }, [quote])

  useEffect(() => {
    (async () => {
      const newChartData = await stockController.getStockChart(quote, chartParam.duration, chartParam.interval)
      setChartData(newChartData);
    })();
  }, [chartParam])

  function color(q) {
    return q === 0 ? WHITE :
           q > 0 ? GREEN : RED;
  }
  
  function largeNumberFormat(value) {
    let v = Math.abs(Number(value))
    return v >= 1.0e+12 ? (v/1.0e+12).toFixed(2) + 'T' :
      v >= 1.0e+9 ? (v/1.0e+9).toFixed(2) + 'B' :
      v >= 1.0e+6 ? (v/1.0e+6).toFixed(2) + 'M' :
      v >= 1.0e+3 ? (v/1.0e+3).toFixed(2) + 'K' :
      (v).toFixed(2)
  }

  function valueExists(value) {
    return value > 0 ? value : 'N/A'
  }

  function date(value) {
    return value > 0 ? new Date(value * 1000).toDateString() : 'N/A'
  }

  function adjustContent() {
    document.getElementById("content").style.marginRight = "450px";
    document.getElementById("side-drawer").style.width = "450px";
  }

  function unadjustContent() {
    document.getElementById("content").style.marginRight = "0";
    document.getElementById("side-drawer").style.width = "0";
  }

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  function controlDrawer() {
    if (!drawerOpen) {
      setDrawerOpen(true);
      //adjustContent();
    } else {
      setDrawerOpen(false);
      //sleep(500).then(() => unadjustContent());
    }
  }

/*   const removeFromWatchlist = () => {
    storeController.removeFromWatchlist(quote);
    setWatchlist(storeController.getWatchlist());
  }

  const addToWatchlist = () => {
    storeController.addToWatchlist(quote);
    setWatchlist(storeController.getWatchlist());
  } */

	store.onDidChange('watchlist', (newValue, oldValue) => {
		setWatchlist(newValue);
	});

  return (
    <div>
      { 
        quoteData && quoteData !== {} ? 
        <div class="quote-list">
          {/* <button onClick={() => console.log(quoteData)}>quote data</button>
          <button onClick={() => console.log(chartData)}>chart data</button> */}
          <div class="title">
            <div>
              <h1>{quoteData.shortName} ({quoteData.symbol})</h1>
              <h4>{quoteData.fullExchangeName}</h4>

              { watchlist.includes(quote) ? 
                <button style={{ backgroundColor: RED }} onClick={() => storeController.removeFromWatchlist(quote)}>Remove from Watchlist</button> :
                <button style={{ backgroundColor: BLUE }} onClick={() => storeController.addToWatchlist(quote)}>Add to Watchlist</button>
              }
              <button style={{ backgroundColor: GREEN }} onClick={() => controlDrawer()}>Buy / Sell</button>
{/*               <button style={{ backgroundColor: GREEN }} onClick={() => storeController.buyShares(quote, 4, 30.20, quoteData.regularMarketPrice)}>Buy</button>
              <button style={{ backgroundColor: RED }} onClick={() => storeController.sellShares(quote, 1, 129.20, quoteData.regularMarketPrice)}>Sell</button> */}
            </div>
            <h1 class="market-price">${quoteData.regularMarketPrice.toFixed(2)}</h1>
            <h4>{quoteData.currency}</h4>
            <h2 style={{ color: color(quoteData.regularMarketChange), fontSize: '30px' }}>{quoteData.regularMarketChange.toFixed(2)}</h2>
            <h2 style={{ color: color(quoteData.regularMarketChangePercent), fontSize: '30px' }}>({quoteData.regularMarketChangePercent.toFixed(2)}%)</h2>
            <i class={quoteData.regularMarketChange > 0 ? "fas fa-arrow-up" : "fas fa-arrow-down" }
              style={{ color: color(quoteData.regularMarketChange) }}></i>
          </div>
          <div id="chart-time">
              <button 
                style={{ borderColor: (chartParam.duration === '1D' ? WHITE : BLUE) }}
                onClick={() => setChartParam({interval: '1m', duration: '1D'})}
              >
                1D
              </button>
              <button 
                style={{ borderColor: (chartParam.duration === '5D' ? WHITE : BLUE) }}
                onClick={() => setChartParam({interval: '15m', duration: '5D'})}
              >
                5D
              </button>
              <button 
                style={{ borderColor: (chartParam.duration === '1M' ? WHITE : BLUE) }}
                onClick={() => setChartParam({interval: '1d', duration: '1M'})}
              >
                1M
              </button>
              <button 
                style={{ borderColor: (chartParam.duration === '6M' ? WHITE : BLUE) }}
                onClick={() => setChartParam({interval: '1d', duration: '6M'})}
              >
                6M
              </button>
              <button 
                style={{ borderColor: (chartParam.duration === 'YTD' ? WHITE : BLUE) }}
                onClick={() => setChartParam({interval: '5d', duration: 'YTD'})}
              >
                YTD
              </button>
              <button 
                style={{ borderColor: (chartParam.duration === '1Y' ? WHITE : BLUE) }}
                onClick={() => setChartParam({interval: '5d', duration: '1Y'})}
              >
                1Y
              </button>
              <button 
                style={{ borderColor: (chartParam.duration === '5Y' ? WHITE : BLUE) }}
                onClick={() => setChartParam({interval: '1mo', duration: '5Y'})}
              >
                5Y
              </button>
              <button 
                style={{ borderColor: (chartParam.duration === 'Max' ? WHITE : BLUE) }}
                onClick={() => setChartParam({interval: '1mo', duration: 'Max'})}
              >
                Max
              </button>
          </div>
          { 
            chartData !== null ? 
            <div class="margin-top"><Chart data={chartData} width={drawerOpen ? 1250 : 1600} /></div> :
            <LoadingBars /> 
          }
          <div class={`margin-top ${drawerOpen ? 'squish' : ''}`}>
            <ul>
              <li>Open: {quoteData.regularMarketOpen.toFixed(2)}</li>
              <li>Day's Range: {quoteData.regularMarketDayLow.toFixed(2)} - {quoteData.regularMarketDayHigh.toFixed(2)}</li>
              <li>52 Week Range: {quoteData.fiftyTwoWeekLow.toFixed(2)} - {quoteData.fiftyTwoWeekHigh.toFixed(2)}</li>
              <li>Volume: {largeNumberFormat(quoteData.regularMarketVolume)}</li>
              <li>Avg. Volume: {largeNumberFormat(quoteData.averageDailyVolume3Month)}</li>
              <li>Ask: {quoteData.ask.toFixed(2)} x {quoteData.askSize * 100}</li>
              <li>Bid: {quoteData.bid.toFixed(2)} x {quoteData.bidSize * 100}</li>
              <li>Market Cap: {largeNumberFormat(quoteData.marketCap)}</li>
              <li>PE Ratio: {valueExists(quoteData.trailingPE)}</li>
              <li>Total Shares: {largeNumberFormat(quoteData.sharesOutstanding)}</li>
              <li>Dividend Date: {date(quoteData.dividendDate)}</li>
              <li>Dividend & Yield: {quoteData.trailingAnnualDividendRate.toFixed(2)} ({(quoteData.trailingAnnualDividendYield * 100).toFixed(2)}%)</li>
              <li>Earnings Date: {date(quoteData.earningsTimestamp)}</li>
            </ul>
          </div>
          <div className={drawerOpen ? 'side-drawer open' : 'side-drawer'} id="side-drawer"
               style={{ borderLeft: `5px solid ${BLUE}` }} >
            <div className="quoteName">
              <h1>{quoteData.symbol}{' '}</h1>
              <h3>{quoteData.shortName.replace(/(.{12})..+/, "$1...")}</h3>
              <h4>({quoteData.fullExchangeName})</h4>
            </div>

            <br></br>

            <div className="side-drawer-info">
              <p class="stacked-text-container">
                <span class="stacked-text">
                  <span class="stacked-text-text">Last</span>
                  <span class="stacked-text-number">{quoteData.regularMarketPrice.toFixed(2)}</span>
                </span>
                <span class="stacked-text">
                  <span class="stacked-text-text">Bid</span>
                  <span class="stacked-text-number">{quoteData.bid.toFixed(2)}</span>
                </span>
                <span class="stacked-text">
                  <span class="stacked-text-text">Bid Size</span>
                  <span class="stacked-text-number">{quoteData.bidSize}</span>
                </span>
                <span class="stacked-text">
                  <span class="stacked-text-text">Ask</span>
                  <span class="stacked-text-number">{quoteData.ask.toFixed(2)}</span>
                </span>
                <span class="stacked-text">
                  <span class="stacked-text-text">Ask Size</span>
                  <span class="stacked-text-number">{quoteData.askSize}</span>
                </span>
              </p>
            </div>

            <br />
            <br />

            <div>
              <h2>Quantity</h2>  
              <input id="quantity" type="number" value={100} />
            </div>

            <br />

            <div>
              <h2>Order Type</h2>
              <Dropdown options={['Limit', 'Market']} value={'Limit'} />
              
            </div>

            <br />

            <div>
              <h2>Limit Price</h2>  
              <input id="limit-price" type="number" />
            </div>

            <br />

            <div>
              <h2>Duration</h2>
              <Dropdown options={['Day', 'Week']} value={'Day'} />
            </div>

            <br />
            <br />
            {/* <button onClick={() => console.log(document.getElementById('quantity').value)}>test</button> */}
            <button style={{ backgroundColor: GREEN }} onClick={() => storeController.buyShares(quote, 4, 30.20, quoteData.regularMarketPrice)}>Buy</button>
            <button style={{ backgroundColor: RED }} onClick={() => storeController.sellShares(quote, 1, 129.20, quoteData.regularMarketPrice)}>Sell</button>
          </div>
        </div> :
        <div>
          <h3>Getting data for {quote}...</h3> 
          <LoadingBars />
        </div>
      }
    </div>
  );  
}
export default StockPage;