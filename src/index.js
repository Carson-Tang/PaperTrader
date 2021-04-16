import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';

import Dashboard from './pages/Dashboard/Dashboard';
import Watchlist from './pages/Watchlist/Watchlist';
import Stocks from './pages/Stocks/Stocks';
import StockPage from './pages/StockPage/StockPage';
import Options from './pages/Options/Options';
import OptionPage from './pages/OptionPage/OptionPage'; 
import ScriptPage from './pages/ScriptPage/ScriptPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';

//import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals'; 

const Root = (
  <React.StrictMode>
    <BrowserRouter>
      <div class="header">
        <Header />
      </div>

      <app>
        <nav><Sidebar /></nav>
        <div class="content" id="content">
          <Switch>
            <Route path="/" exact component={App} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/watchlist" component={Watchlist} />
            <Route path="/stocks" component={Stocks} />
            <Route path="/stock/:quote" component={StockPage} /> 
            <Route path="/options" component={Options} />
            <Route path="/option/:quote" component={OptionPage} />
            <Route path="/script" component={ScriptPage} />
            <Route path="/settings" component={SettingsPage} />
          </Switch>
        </div>
      </app>
   </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.render(Root, document.getElementById('root'));
 
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
