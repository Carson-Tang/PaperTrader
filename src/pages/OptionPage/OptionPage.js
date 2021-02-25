import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const url = 'http://localhost:8080';

const OptionPage = (props) => {
  const quote = props.match.params.quote;

  const [quoteOptionData, setQuoteOptionData] = useState();

  useEffect(() => {
    fetch(url + '/option/' + quote)
    .then(res => res.json())
    .then(data => setQuoteOptionData(data)); 
  }, [quote])


  return (
    <div>
      <h1>This is my profile</h1>
      <Link to="/">DASHBOARD</Link>
    </div>
  );
}
export default OptionPage;