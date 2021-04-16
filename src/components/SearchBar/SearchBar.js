import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import './SearchBar.css'
import { GREEN, GREY } from '../../constants/colors'
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
  res = res.map(v => ({ value: v.Symbol, label: v.Symbol, name: v["Company Name"], exchange: v["Stock Exchange"] }))
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
  let x = stockList.filter(l => regex.test(l.label)).slice(0, 3);
  console.log(x)
  return x;
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
      <button 
        type="button"
        id="stk-button"
        onClick={() => setSelectedSearch('STK')}
        style={{ backgroundColor: selectedSearch === 'STK' ? GREEN : '' }}
      >
        STK
      </button>
      <button
        type="button"
        id="opt-button"
        onClick={() => setSelectedSearch('OPT')}
        style={{ backgroundColor: selectedSearch === 'OPT' ? GREEN : '' }}
      >
        OPT
      </button>
      
      <Autosuggest 
        suggestions={suggestions}
        onSuggestionsFetchRequested={({ value }) => {
          setSuggestions(getSuggestions(value));
        }}
        onSuggestionsClearRequested={() => setSuggestions([])}
        onSuggestionSelected={(e, { suggestion }) => {
          setSearchValue(suggestion.value.toUpperCase());
        }}
        getSuggestionValue={suggestion => suggestion.value}
        renderSuggestion={suggestion => <span>{suggestion.label} &nbsp;&nbsp; {suggestion.name.replace(/(.{34})..+/, "$1...")} ({suggestion.exchange})</span>}
        inputProps={{
          placeholder: "Search by symbol",
          value: searchValue,
          onChange: (_, { newValue, method }) => {
            setSearchValue(newValue.toUpperCase());
            /* if (method === 'click') {
              handleSearch();
            } */
          },
          onKeyDown: function onKeyDown(event, data) {
            if (event.keyCode === 13) { // enter key
              handleSearch();
            }
          }
        }} />
        <i class="fa fa-search fa-lg" style={{ color: GREY }} onClick={() => handleSearch()}></i>
    </>
  );
}

export default SearchBar;