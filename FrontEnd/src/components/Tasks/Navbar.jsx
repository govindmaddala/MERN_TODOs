import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import spiralLogo from '../../images/Spiral-notepad.png'
// import jwtDecode from "jwt-decode";

const Navbar = ({ dateBar, searchItem,logoutFunction,getTasksByDateChange,username}) => {
  // const navigate = useNavigate();
  const [time, setTime] = useState(new Date().toLocaleTimeString().toString());
  setInterval(() => {
    setTime(new Date().toLocaleTimeString().toString());
  }, 1000);

  // const handleChange = (node) => {
  //   // console.log(node.current.value);
  // };

  const profileNode = useRef();

  const dropDownOptionOnClick = () => {
    profileNode.current.classList.toggle("show");
  };

  return (
    <div id="navbar">
      <div id="logo">
        <img src={spiralLogo} alt="logo" />
      </div>
      {/* <div id="search">
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
      </div> */}
      <div id="time">
        <h2 id="timeNow">{time}</h2>
      </div>
      <div id="calender">
        <input
          type="date"
          name=""
          ref={dateBar}
          id="datePicker"
          onChange={() => {
            getTasksByDateChange();
          }}
        />
      </div>
      <div id="options">
        <Link to={"/home"} className="link">Home</Link>

        <Link to={"#"} className="link">
          <div className="dropdown">
            <Link
              to={"#"}
              type="button"
              onClick={dropDownOptionOnClick}
              className="dropbtn link"
              id="profileName"
            >
              {username}
            </Link>
            <div id="myDropdown" className="dropdown-content" ref={profileNode}>
              <Link to="#" onClick={dropDownOptionOnClick} className="link">
                Settings
              </Link>
              <Link to={"/favourite"} onClick={dropDownOptionOnClick} className="link">
                Favourite
              </Link>
              <Link to={"/charts"} onClick={dropDownOptionOnClick} className="link">
                Charts
              </Link>
              <Link to="#" onClick={dropDownOptionOnClick} className="link">
                About
              </Link>
              <Link className="link" to="/" onClick={()=>{
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
