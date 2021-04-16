import React, { useEffect, useState } from "react";
import './Header.css';
import SearchBar from '../SearchBar/SearchBar'

import { GREY } from '../../constants/colors';

const storeController = require('../../controllers/storeController');
const store = storeController.getStore();

const Header = () => {

	const [portfolioValue, setPortfolioValue] = useState(storeController.getPortfolioValue() || 0);
	const [buyingPower, setBuyingPower] = useState(storeController.getBuyingPower() || 0);

	store.onDidChange('portfolioValue', (newValue, oldValue) => {
		setPortfolioValue(newValue);
	});

	store.onDidChange('buyingPower', (newValue, oldValue) => {
		setBuyingPower(newValue);
	});

	useEffect(() => {
		const interval = setInterval(() => {
			(async () => {
				await storeController.updatePortfolioValue();
				console.log('hi')
			})();
		}, 100000);
		return () => clearInterval(interval);
	}, []);

  return (
    <div class="header">
			<header>Stock Simulator</header>
			<ul>
				<li>
					<span style={{ color: GREY }}>Portfolio Value</span>
					<br></br>
					${portfolioValue.toFixed(2)}
				</li>
				<li>
					<span style={{ color: GREY }}>Buying Power</span>
					<br></br> 
					${buyingPower.toFixed(2)}
				</li>
				{/* lets hope no one ever sees this */}
				<li></li><li></li><li></li>
				<li></li><li></li><li></li>
				<li></li><li></li><li></li>
				<li></li><li></li><li></li>
				<li></li><li></li><li></li>
				<li></li><li></li><li></li>
				<li></li><li></li><li></li>
				{/* <li></li><li></li><li></li> */}
				{/* <li></li><li></li><li></li> */}
				<div class="floatright">
					<li class="searchbar"><SearchBar /></li>
				</div>
			</ul>
    </div>
  );  
}
export default Header;