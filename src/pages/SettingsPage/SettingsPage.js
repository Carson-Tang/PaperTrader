import React from "react";
import './SettingsPage.css'

const storeController = require('../../controllers/storeController');

const SettingsPage = () => {

  return (
    <div>
      <span class="text">Settings Page </span>
      <button onClick={() => storeController.setPortfolioValue(1000)}>set portfolio value to 1000</button>
      <button onClick={() => storeController.setPortfolioValue(0)}>set portfolio value to 0</button>
      <button onClick={() => storeController.testing()}>testing</button>
      <button onClick={() => storeController.setBuyingPower(1000)}>set buying power to 1000</button>
      <button onClick={() => storeController.setBuyingPower(0)}>set buying power to 0</button>
    </div>
  );
}
export default SettingsPage;