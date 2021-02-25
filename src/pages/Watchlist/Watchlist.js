import React, { useEffect, useState } from "react";
import './Watchlist.css'
import { GREEN, RED, WHITE } from '../../constants/colors'

const stockController = require('../../controllers/stockController');
const storeController = require('../../controllers/storeController');

const Watchlist = () => {

  const rand = () => "hsl(" + 360*Math.random() + ',' + (75 + 70*Math.random()) + '%,' + (50 + 10*Math.random()) + '%)'
  const color = (v) => { return v === 0 ? WHITE : v > 0 ? GREEN : RED }
  const volume = (_v) => {
    let v = Math.abs(_v);
    return (
      v >= 1.0e+12 ? (v/1.0e+12).toFixed(2) + 'T' : 
      v >= 1.0e+9 ? (v/1.0e+9).toFixed(2) + 'B' :
      v >= 1.0e+6 ? (v/1.0e+6).toFixed(2) + 'M' :
      v >= 1.0e+3 ? (v/1.0e+3).toFixed(2) + 'K' :
      v.toFixed(2)
    )
  }

  const [watchlist, setWatchlist] = useState(storeController.getWatchlist() || []);
  const [watchlistData, setWatchlistData] = useState([]);

  useEffect(() => {
    (async () => {
      const newWatchlistData = await stockController.getAllStock(watchlist);
      setWatchlistData(newWatchlistData);
    })();
  }, [watchlist])

  const removeFromWatchlist = (quote) => {
    storeController.removeFromWatchlist(quote);
    setWatchlist(storeController.getWatchlist());
  }

  return (
    <table>
      <thead>
        <tr>
          <th>
            <div class="refresh" onClick={() => console.log(1)}>
              <i class="fas fa-sync" style={{ color: WHITE }}></i>
            </div>
          </th>
          <th>Quote</th>
          <th></th>
          <th></th>
          <th></th>
          <th>Last</th>
          <th>Change ($)</th>
          <th>Change (%)</th>
          <th>Bid</th>
          <th>Ask</th>
          <th>Bid Size</th>
          <th>Ask Size</th>
          <th>Mini chart</th>
          <th>High</th>
          <th>Low</th>
          <th>Prev Close</th>
          <th>Volume</th>
        </tr>
      </thead>
      <tbody>
        { watchlistData.map(data => <tr key={data.symbol}>
          <td>
            <span class="change-icon">
              <i class="fa fa-circle" style={{ color: rand() }}></i>
              <i class="fa fa-times-circle" style={{ color: RED }} onClick={() => removeFromWatchlist(data.symbol)}></i>
            </span>
          </td>
          <td>{data.symbol}</td>
          <td></td>
          <td>O/P</td>
          <td></td>
          <td>{data.regularMarketPrice.toFixed(2)}</td>
          <td>
            <span style={{ color: color(data.regularMarketChange) }}>
              {
                data.regularMarketChange > 0 ?
                `$${data.regularMarketChange.toFixed(2)}` :
                `-$${(-data.regularMarketChange).toFixed(2)}`
              }
            </span>
          </td>
          <td>
            <span style={{ color: color(data.regularMarketChangePercent) }}>
              {data.regularMarketChangePercent.toFixed(2)}%
            </span>
          </td>
          <td>{data.bid}</td>
          <td>{data.ask}</td>
          <td>{data.bidSize}</td>
          <td>{data.askSize}</td>
          <td class="chart">

          </td>
          <td>{data.regularMarketDayHigh.toFixed(2)}</td>
          <td>{data.regularMarketDayLow.toFixed(2)}</td>
          <td>{data.regularMarketPreviousClose.toFixed(2)}</td>
          <td>{volume(data.regularMarketVolume)}</td>
        </tr>) }
      </tbody>
    </table>
  );
}
export default Watchlist;