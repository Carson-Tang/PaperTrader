import React from "react";
import { Link } from "react-router-dom";
 
export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Home page</h1>
        <Link to="/profile">Go back to profile</Link>
        <Link to="/dashboard">Go to dashboard</Link>
      </div>
    );
  }
}
