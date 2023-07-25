import React from "react";
import { Link, useNavigate } from "react-router-dom";
import encryptData from "./encryptData";
import redirectURL from "./redirectURL";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const endpoint = "/logoutUser";
    const base64URLEncoded = encryptData(endpoint);
    let userId = localStorage.getItem("user_id");

    let params = {
      email: userId,
    };

    redirectURL
      .post(`users/${base64URLEncoded}`, params)
      .then((response) => {
        if (response.data.success) {
          localStorage.removeItem("user_id");
          navigate("/", { replace: "true" });
        }
      })
      .catch((err) => {
        console.log("login err", err);
      });
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-toggler bg-light">
        <Link className="navbar-brand" to={"/home"}>
          📑
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <Link to={"/user"}>
              <li
                className="nav-item active"
                style={{
                  border: "solid",
                  borderRadius: "50%",
                  padding: "0px 4px",
                  marginRight: "6px",
                  cursor: "pointer",
                }}
              >
                U
              </li>
            </Link>
            <li
              className="nav-item"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              Logout
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
