import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import './Dashboard.css'
import { GREEN, RED, WHITE } from '../../constants/colors'
import DoughnutChart from "../../components/Doughnut/DoughnutChart";


const stockController = require('../../controllers/stockController');
const storeController = require('../../controllers/storeController');

const store = storeController.getStore();

const Dashboard = () => {
  const history = useHistory();
  const [ownedShares, setOwnedShares] = useState(storeController.getOwnedShares() || []);
  const [sharesData, setSharesData] = useState({});
  const [todayValue, setTodayValue] = useState(0);

  const [portfolioValue, setPortfolioValue] = useState(storeController.getPortfolioValue() || 0);

  store.onDidChange('portfolioValue', (newValue, oldValue) => {
    setPortfolioValue(newValue);
  });

  useEffect(() => {
    (async () => {
      let sharesNames = ownedShares.map(share => share[0]);
      let sharesData = await stockController.getAllStock(sharesNames);
      sharesData = sharesData.reduce((obj, item) => {
        obj[item.symbol] = item;
        return obj;
      }, {});
      //console.log(sharesData)
      setSharesData(sharesData);
      let newTodayValue = 0;
      for (var i = 0; i < ownedShares.length; i++) {
        console.log(ownedShares[i])
        let shareName = ownedShares[i][0];
        let ownedCount = ownedShares[i][1];
        newTodayValue += ownedCount * (sharesData[shareName].regularMarketPrice - sharesData[shareName].regularMarketPreviousClose);
      }
      setTodayValue(newTodayValue);
    })();
  }, [ownedShares])

  store.onDidChange('ownedShares', (newValue, oldValue) => {
    setOwnedShares(newValue);
  });

  function color(q) {
    return q === 0 ? WHITE :
      q > 0 ? GREEN : RED;
  }

  return (
    <div class="container">
      <div class="left-half">
        <div>
          <span class="table-header">Total</span>
        </div>
        <div>
          <h1 class="dollar-sign">$</h1>
          <h2 class="dollars">{~~portfolioValue}.</h2>
          <h2 class="cents">{~~((portfolioValue % 1) * 100)}</h2>
        </div>
        <div>
          <span style={{ color: color(todayValue) }}>
            {
              todayValue > 0 ?
              `+$${todayValue.toFixed(2)}` : 
              `-$${(-todayValue).toFixed(2)}`
            } 
            {' '}
            ({((todayValue / portfolioValue) * 100).toFixed(2)}%)
          </span> 
          {' '}
          <span style={{ color: WHITE }}>TODAY</span>
        </div>
        <div>
          {/* <button onClick={() => console.log(sharesData)}>click me</button> */}
          <span style={{ color: WHITE, fontSize: '30px' }}>Share Holdings</span>
          <DoughnutChart shares={ownedShares} />
        </div>
      </div>
      <div class="right-half">
        <span class="table-header">Shares</span>
        <table>
          <thead>
            <tr>
              <th>Quote</th>
              <th>Shares</th>
              <th>Avg Buy Price</th>
              <th>Current Price</th>
              <th>Today's Return</th>
              <th>Total Return</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {ownedShares.map(share => {
              const quoteName = share[0];
              const ownedCount = share[1];
              const averagePrice = share[2].toFixed(2);
              const shareData = sharesData[quoteName];

              return (
                shareData ? <tr key={quoteName}>
                  <td>{quoteName}</td>
                  {/* <td onClick={() => history.push(`/option/${quoteName}`)} class="cursor-pointer" style={{ color: "lightblue" }}>
                    {quoteName}
                  </td> */}
                  <td>{ownedCount}</td>
                  <td>{averagePrice}</td>
                  <td>{shareData.regularMarketPrice.toFixed(2)}</td>
                  <td>
                    <span style={{ color: color(shareData.regularMarketPrice - shareData.regularMarketPreviousClose) }}>
                      <b>
                        {
                          shareData.regularMarketPrice - shareData.regularMarketPreviousClose > 0 ?
                            `$${(ownedCount * (shareData.regularMarketPrice - shareData.regularMarketPreviousClose)).toFixed(2)}` :
                            `-$${(ownedCount * -(shareData.regularMarketPrice - shareData.regularMarketPreviousClose)).toFixed(2)}`
                        }
                      </b>
                      {' '}({(((shareData.regularMarketPrice - shareData.regularMarketPreviousClose) / shareData.regularMarketPreviousClose) * 100).toFixed(2)}%)
                    </span>
                  </td>
                  <td>
                    <span style={{ color: color(shareData.regularMarketPrice - averagePrice) }}>
                      <b>
                        {
                          shareData.regularMarketPrice - averagePrice > 0 ?
                            `$${(ownedCount * (shareData.regularMarketPrice - averagePrice)).toFixed(2)}` :
                            `-$${(ownedCount * -(shareData.regularMarketPrice - averagePrice)).toFixed(2)}`
                        }
                      </b>
                      {' '}({(((shareData.regularMarketPrice - averagePrice) / averagePrice) * 100).toFixed(2)}%)
                    </span>
                  </td>
                  <td>
                    <span style={{ color: color(shareData.regularMarketPrice - averagePrice) }}>
                      <b>
                        ${(ownedCount * shareData.regularMarketPrice).toFixed(2)}
                      </b>
                    </span>
                  </td>
                </tr> : <tr></tr>
              )
            })}
          </tbody>
        </table>

        <span class="table-header">Contracts</span>
        <table>
          <thead>
            <tr>
              <th>Quote</th>
              <th>Contracts</th>
              <th>Break Even Price</th>
              <th>Current Price</th>
              <th>Equity</th>
              <th>Expiry</th>
              <th>Avg Cost</th>
              <th>Today's Return</th>
              <th>Total Return</th>
            </tr>
          </thead>
          <tbody>
            {/*             { ownedShares.map(share => {
              const quoteName = share[0];
              const ownedCount = share[1];
              const averagePrice = share[2].toFixed(2);
              const shareData = sharesData[quoteName];

              return (
                shareData ? <tr key={quoteName}>
                  <td onClick={() => history.push(`/stock/${quoteName}`)} class="cursor-pointer" style={{ color: "lightblue" }}>
                    {quoteName}
                  </td>
                  <td>{ownedCount}</td>
                  <td>{averagePrice}</td>
                  <td>{shareData.regularMarketPrice.toFixed(2)}</td>
                  <td>
                    <span style={{ color: color(shareData.regularMarketPrice - averagePrice) }}>
                      {(ownedCount * (shareData.regularMarketPrice - averagePrice)).toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: color(shareData.regularMarketPrice - averagePrice) }}>
                      {(((shareData.regularMarketPrice - averagePrice)/averagePrice) * 100).toFixed(2)}
                    </span>
                  </td>
                </tr> : <tr></tr>
              )
            }) } */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Dashboard;