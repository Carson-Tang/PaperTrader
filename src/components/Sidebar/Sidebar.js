import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import './Sidebar.css'

import { GREY, GREEN } from '../../constants/colors'


class Sidebar extends Component {

  render() {
    return (
      <div class="sidebar">
        <ul>
          <li>
            <NavLink to="/dashboard" exact activeStyle={{ color: GREEN }}>
              <i class="fa fa-folder-open" style={{ color: GREY }}></i>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/watchlist" exact activeStyle={{ color: GREEN }}>
              <i class="fa fa-binoculars" style={{ color: GREY }}></i>
              Watchlist
            </NavLink>
          </li>
          <li>
            <NavLink to="/stocks" exact activeStyle={{ color: GREEN }}>
              <i class="fas fa-chart-line" style={{ color: GREY }}></i>
              Stocks
            </NavLink>
          </li>
          <li>
            <NavLink to="/options" exact activeStyle={{ color: GREEN }}>
              <i class="fas fa-file-signature" style={{ color: GREY }}></i>
              Options
            </NavLink>
          </li>
          <li>
            <NavLink to="/script" exact activeStyle={{ color: GREEN }}>
              <i class="fas fa-code" style={{ color: GREY }}></i>
              Script
            </NavLink>
          </li>
          <li>
            <NavLink to="/research" exact activeStyle={{ color: GREEN }}>
              <i class="fas fa-search-dollar" style={{ color: GREY }}></i>
              Research
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" exact activeStyle={{ color: GREEN }}>
              <i class="fas fa-cog" style={{ color: GREY }}></i>
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default Sidebar;