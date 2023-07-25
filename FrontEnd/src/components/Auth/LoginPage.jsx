import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import redirectURL from "../utils/redirectURL";
import encryptData from "../utils/encryptData";
import { useNavigate } from "react-router-dom";
import decryptData from "../utils/decryptData";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userID_found, setUserID_found] = useState(false);
  const [key, setKey] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  useEffect(() => {
    const allValues = { ...localStorage };
    let keys = Object.keys(allValues);
    if (keys.length > 0) {
      for (let eachKey of keys) {
        if (decryptData(eachKey) === "user_id") {
          try {
            const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
            if (emailRegex.test(decryptData(localStorage.getItem(eachKey)))) {
              const endpoint = "/checkUser";
              const base64URLEncoded = encryptData(endpoint);
              let params = {
                email: localStorage.getItem(eachKey),
              };

              redirectURL
                .post(`users/${base64URLEncoded}`, params)
                .then((response) => {
                  if (response.data.success) {
                    navigate("/home");
                  }
                })
                .catch((err) => {
                  console.log("login err", err);
                });
            }
            setUserID_found(true);
            setKey(eachKey);
            break;
          } catch (error) {
            console.log("err");
          }
        }
      }
    }
  }, [navigate, userID_found, key]);

  const generateRandomWord = (length) => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let word = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      word += letters[randomIndex];
    }

    return word;
  };

  const handleData = (data, dataType) => {
    if (dataType === "email") {
      setEmail(data);
    }

    if (dataType === "password") {
      setPassword(data);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.clear();
    try {
      const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
      if (emailRegex.test(email)) {
        const endpoint = "/verifyLogin";
        const base64URLEncoded = encryptData(endpoint);

        let params = {
          email: encryptData(email),
          password: encryptData(password),
        };

        await redirectURL
          .post(`users/${base64URLEncoded}`, params)
          .then((response) => {
            if (response.data.success) {
              let { email, username } = response.data;
              let value = encryptData(email);
              let key = encryptData("user_id");
              let userName = encryptData(username);
              let user_key = encryptData("username");
              setEmail("");
              setPassword("");
              setErrorMessage("");
              navigate("/home", { replace: "true" });

              for (let i = 1; i <= 10; i++) {
                if (i === 5) {
                  localStorage.setItem(key, value);
                } else if (i === 3) {
                  localStorage.setItem(user_key, userName);
                } else {
                  let rKey = generateRandomWord(7);
                  let rValue = generateRandomWord(20);
                  localStorage.setItem(encryptData(rKey), encryptData(rValue));
                }
              }
            }
          })
          .catch((err) => {
            if (!err.response.data.success) {
              setErrorMessage(err.response.data.message);
            }
            console.log("login err", err);
          });
      } else {
        setErrorMessage("Invalid Email or Password");
      }
    } catch (error) {}
  };

  const changeVisibility = () => {
    setPasswordVisibility((prev) => !prev);
  };

  return (
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
                    <form onSubmit={handleLogin}>
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
                        Sign into your account
                      </h5>
                      <p
                        htmlFor=""
                        className="text-danger text-center"
                        style={{ animation: "blink 1s linear infinite" }}
                      >
                        {errorMessage}
                      </p>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form2Example17">
                          Email address
                        </label>
                        <input
                          type="email"
                          id="form2Example17"
                          className="form-control form-control-lg"
                          value={email}
                          onChange={(e) => handleData(e.target.value, "email")}
                          required
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form2Example27">
                          Password
                        </label>
                        <input
                          type={passwordVisibility ? "text" : "password"}
                          id="form2Example27"
                          className="form-control form-control-lg"
                          value={password}
                          onChange={(e) =>
                            handleData(e.target.value, "password")
                          }
                          required
                        />
                        {passwordVisibility ? (
                          <EyeInvisibleOutlined
                            style={{
                              position: "relative",
                              top: "-1.2rem",
                              left: "89%",
                              zoom: "2",
                            }}
                            onClick={changeVisibility}
                          />
                        ) : (
                          <EyeOutlined
                            style={{
                              position: "relative",
                              top: "-1.2rem",
                              left: "89%",
                              zoom: "2",
                            }}
                            onClick={changeVisibility}
                          />
                        )}
                      </div>

                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="submit"
                        >
                          Login
                        </button>
                      </div>

                      <a className="small text-muted" href="#!">
                        Forgot password?
                      </a>
                      <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                        Don't have an account?{" "}
                        <Link
                          to={"/register"}
                          style={{ color: "#393f81" }}
                          className="linkClass"
                        >
                          Register here
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
  );
};

export default LoginPage;
