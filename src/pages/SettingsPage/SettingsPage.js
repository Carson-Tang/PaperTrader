import React, { useState } from "react";
import { RED, BLUE } from "../../constants/colors";
import './SettingsPage.css'

const storeController = require('../../controllers/storeController');

const SettingsPage = () => {

  const [newBuyingPower, setNewBuyingPower] = useState(1000);
  const [newCommissionFee, setNewCommissionFee] = useState(0);

  return (
    <div class="settings">

      <h2>Watchlist</h2>
      <div>
        <div class="text">
          Clear all stocks from your watchlist
        </div>
        <button style={{ backgroundColor: RED }} onClick={() => storeController.clearWatchlist()}>Clear Watchlist</button>
        
      </div>

      <h2>Portfolio</h2>
      <div>
        <div class="text">
          Warning! This will permanently clear all your owned shares or owned options
        </div>
        <button style={{ backgroundColor: RED }} onClick={() => storeController.clearOwnedShares()}>Clear Owned Shares</button>
        <button style={{ backgroundColor: RED }} onClick={() => storeController.clearOwnedOptions()}>Clear Owned Options</button>
      </div>

      <h2>Buying Power</h2>
      <div>
        <button style={{ backgroundColor: BLUE }} onClick={() => storeController.setBuyingPower(newBuyingPower)}>Update Buying Power</button>
        <input type="number" value={newBuyingPower} onChange={e => setNewBuyingPower(e.target.value)} />
      </div>

      <h2>Commission Fee</h2>
      <div>
        <button style={{ backgroundColor: BLUE }} onClick={() => storeController.setCommissionFee(0)}>Set Commission Fee</button>
        <input type="number" value={newCommissionFee} onChange={e => setNewCommissionFee(e.target.value)} />
      </div>

      
      
    </div>
  );
}
export default SettingsPage;