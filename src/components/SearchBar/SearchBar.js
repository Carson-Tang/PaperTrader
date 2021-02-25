import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import './SearchBar.css'
import { GREEN } from '../../constants/colors'
import Autosuggest from 'react-autosuggest';

import nasdaqSymbols from '../../constants/nasdaqSymbols.json'
import nyseSymbols from '../../constants/nyseSymbols.json'

const stockTickets = () => {
  let res = []
  nasdaqSymbols.forEach((v) => {
    res.push({
      "Symbol": v.Symbol,
      "Company Name": v["Company Name"],
      "Stock Exchange": "NASDAQ",
    })
  })
  nyseSymbols.forEach((v) => {
    res.push({
      "Symbol": v["ACT Symbol"],
      "Company Name": v["Company Name"],
      "Stock Exchange": "NYSE",
    })
  })
  res = res.map(v => ({ value: v.Symbol, label: v.Symbol }))
  //console.log(res)
  return res
} 

const stockList = stockTickets();

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  if (escapedValue === '') {
    return [];
  }
  const regex = new RegExp('^' + escapedValue, 'i');
  return stockList.filter(l => regex.test(l.label));
}

const SearchBar = () => {
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSearch, setSelectedSearch] = useState('STK');

  const handleSearch = () => {
    history.push(selectedSearch === "STK" ? `/stock/${searchValue}` : `/options/${searchValue}`)
  }

  return (
    <>
      <button type="button" id="stk-button" onClick={() => setSelectedSearch('STK')} style={{ backgroundColor: selectedSearch === 'STK' ? GREEN : '' }}>STK</button>
      <button type="button" id="opt-button" onClick={() => setSelectedSearch('OPT')} style={{ backgroundColor: selectedSearch === 'OPT' ? GREEN : '' }}>OPT</button>
      
      <Autosuggest 
        suggestions={suggestions}
        onSuggestionsFetchRequested={({ value }) => {
          setSuggestions(getSuggestions(value));
        }}
        onSuggestionsClearRequested={() => setSuggestions([])}
        getSuggestionValue={suggestion => suggestion.value}
        renderSuggestion={suggestion => <span>{suggestion.label}</span>}
        inputProps={{
          placeholder: "Search by symbol",
          value: searchValue,
          onChange: (_, { newValue, method }) => {
            setSearchValue(newValue.toUpperCase());
            console.log(newValue)
            if (method === 'click') {
              handleSearch();
            }
          },
          onKeyDown: function onKeyDown(event, data) {
            if (event.keyCode === 13) {
              handleSearch();
            }
          }
        }} />
    </>
  );
}

export default SearchBar;