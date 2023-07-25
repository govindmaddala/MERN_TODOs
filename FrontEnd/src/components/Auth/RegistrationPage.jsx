import React, { useState } from "react";
import { Link } from "react-router-dom";
import redirectURL from "../utils/redirectURL";
import encryptData from "../utils/encryptData";
import { useNavigate } from "react-router-dom";
const RegistrationPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleData = (data, dataType) => {
    if (dataType === "username") {
      setUsername(data);
    }

    if (dataType === "email") {
      setEmail(data);
    }

    if (dataType === "password") {
      setPassword(data);
    }
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    console.log(process.env.REACT_APP_SECRET_KEY);
    const endpoint = "/registerUser";

    const base64URLEncoded = encryptData(endpoint);

    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    if (emailRegex.test(email) && passwordRegex.test(password)) {
      let params = {
        username: encryptData(username),
        email: encryptData(email),
        password: encryptData(password),
      };

      redirectURL
        .post(`users/${base64URLEncoded}`, params)
        .then((response) => {
          console.log("login", response);
          if (response.data.success) {
            navigate('/')
          }
        })
        .catch((err) => {
          if (!err.response.data.success) {
            setErrorMessage(err.response.data.message);
          }
          console.log("login err", err);
        });
    } else {
      setErrorMessage("Invalid email or password format")
    }
  };
  return (
    <div>
      <section
        className="min-vh-100"
        style={{ backgroundColor: "steelblue", backgroundSize: "0vh" }}
      >
        <div className="container h-100" style={{ padding: "13vh 0px" }}>
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                      alt="login form"
                      className="img-fluid"
                      style={{ borderRadius: "1rem 0 0 1rem" }}
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleRegistration}>
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i
                            className="fas fa-cubes fa-2x me-3"
                            style={{ color: "#ff6219" }}
                          ></i>
                          <span className="h1 fw-bold mb-0">My_Notes📑</span>
                        </div>

                        <h5
                          className="fw-normal mb-3 pb-3"
                          style={{ letterSpacing: "1px" }}
                        >
                          Register your account
                        </h5>
                        <p
                          htmlFor=""
                          className="text-danger text-center"
                          style={{ animation: "blink 1s linear infinite" }}
                        >
                          {errorMessage}
                        </p>
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="username">
                            Username
                          </label>
                          <input
                            type="text"
                            id="username"
                            className="form-control form-control-lg"
                            value={username}
                            onChange={(e) =>
                              handleData(e.target.value, "username")
                            }
                            required
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="email">
                            Email address
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="form-control form-control-lg"
                            value={email}
                            onChange={(e) =>
                              handleData(e.target.value, "email")
                            }
                            pattern="^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$"
                            required
                          />
                        </div>

                        <div className="form-outline mb-4">
                          <label
                            className="form-label"
                            htmlFor="form2Example27"
                          >
                            Password
                          </label>
                          <input
                            type="password"
                            id="form2Example27"
                            className="form-control form-control-lg"
                            value={password}
                            onChange={(e) =>
                              handleData(e.target.value, "password")
                            }
                            required
                          />
                        </div>

                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="submit"
                          >
                            Register
                          </button>
                        </div>
                        <p
                          className="mb-5 pb-lg-2"
                          style={{ color: "#393f81" }}
                        >
                          Already have an account?{" "}
                          <Link
                            to={"/"}
                            style={{ color: "#393f81" }}
                            className="linkClass"
                          >
                            Login here
                          </Link>
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegistrationPage;
