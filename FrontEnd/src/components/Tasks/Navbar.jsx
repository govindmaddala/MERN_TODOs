import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ dateBar, searchItem,logoutFunction}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString().toString());
  setInterval(() => {
    setTime(new Date().toLocaleTimeString().toString());
  }, 1000);

  const handleChange = (node) => {
    console.log(node.current.value);
  };

  const profileNode = useRef();

  const dropDownOptionOnClick = () => {
    profileNode.current.classList.toggle("show");
  };

  return (
    <div id="navbar">
      <div id="logo">
        <h2>Logo</h2>
      </div>
      <div id="search">
        <input
          type="search"
          ref={searchItem}
          name=""
          id="searchBar"
          placeholder="Search and press Enter"
          onChange={() => {
            handleChange(searchItem);
          }}
        />
      </div>
      <div id="time">
        <h3 id="timeNow">{time}</h3>
      </div>
      <div id="calender">
        <input
          type="date"
          name=""
          ref={dateBar}
          id="datePicker"
          onChange={() => {
            handleChange(dateBar);
          }}
        />
      </div>
      <div id="options">
        <Link to={"/home"}>Home</Link>

        <Link to={"#"}>
          <div className="dropdown">
            <Link
              to={"#"}
              type="button"
              onClick={dropDownOptionOnClick}
              className="dropbtn"
            >
              Profile
            </Link>
            <div id="myDropdown" className="dropdown-content" ref={profileNode}>
              <Link to="#" onClick={dropDownOptionOnClick}>
                Settings
              </Link>
              <Link to={"/favourite"} onClick={dropDownOptionOnClick}>
                Favourite
              </Link>
              <Link to={"/charts"} onClick={dropDownOptionOnClick}>
                Charts
              </Link>
              <Link to="#" onClick={dropDownOptionOnClick}>
                About
              </Link>
              <Link to="/" onClick={()=>{
                dropDownOptionOnClick();
                logoutFunction();
              }}>
                Logout
              </Link>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
