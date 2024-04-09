import axios from "axios";
import "./Nav.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Nav() {
  const [otpStatus, setOtpStatus] = useState(false);
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState("");
  const [city, setCity] = useState("Choose A City");
  const [cityList, setCityList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredCities, setFilteredCities] = useState([]); // State for filtered cities
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();



  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }




  async function handleSubmit(e) {
    try {
      e.preventDefault();
      await handleOtp();

      const response = await axios.post(
        "http://127.0.0.1:5000/register",
        formData
      );
      console.log(response.status);


      console.log("Form data:", formData);
    } catch (error) {
      console.error("An error occurred:", error);
      alert(error);

    }
  }




  // async function handleOtp() {
  //   try {
  //     const email = { "email": formData.email };
  //     const response = await axios.post(
  //       "http://127.0.0.1:5000/send-otp-email",
  //       email
  //     );
  //     console.log(response.data);

  //     // Assuming OTP is sent successfully, toggle the otpStatus to true
  //     setOtpStatus(true);

  //     console.log("Form data:", formData);
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // }
  function handleOtpInputChange(e){
    setOtp(e.target.value);
  }

  async function handleOtpSubmit() {
    const otpjson={"otp":otp}
    const response = await axios.post("http://127.0.0.1:5000/verify-otp-email",otpjson);
    console.log(response.data)

  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/login",
        loginData
      );
      console.log(response.data);
      sessionStorage.setItem("Loggeduser", response.data.username);
      setUser(response.data.username);
      loadCities();
      if (city === "Choose A City") {
        // Open the city selection modal
        const cityModal = document.getElementById("exampleModal");
        if (cityModal) {
          const bootstrapModal = new bootstrap.Modal(cityModal);
          bootstrapModal.show();
        }
      } else {
        // Navigate to the desired page
        navigate("/categories");
      }
    } catch (error) {
      alert("Invalid Login Credentials");
      console.error("Login error:", error);
    }
  }

  function handleLoginInputChange(e) {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  }
  async function loadCities() {
    try {
      const response = await axios.get("http://127.0.0.1:5000/cities");
      setCityList(response.data["cities"]);
      const storedCity = localStorage.getItem("city");
      if (storedCity !== "Choose A City" || storedCity !== null) {
        setCity(storedCity);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }

  useEffect(() => {
    async function login() {
      setUser(sessionStorage.getItem("Loggeduser"));
      if (localStorage.getItem("city") !== null && localStorage.getItem("city") !== "Choose A City") {
        setCity(localStorage.getItem("city"));
      }
    }
    login();
  }, [user]);
  // console.log(cityList)
  useEffect(() => {
    // Filter cities based on the search term
    const filtered = cityList.filter((cityName) =>
      cityName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [searchTerm, cityList]);

  async function selectCity(cityName) {
    setCity(cityName);
    localStorage.setItem("city", cityName);
  }
  function handleProfile() {
    navigate("/profile");
  }

  async function handlelogout() {
    const res = axios.post("http://127.0.0.1:5000/logout");
    console.log(res);
    setUser();
    setCity("Choose A City");
    sessionStorage.removeItem("Loggeduser");
    localStorage.removeItem("city");
    // alert("Successfully Logged Out")
    navigate("/");
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src="src\assets\Work.png"
              className="my-3 me-2"
              alt=""
              style={{ width: "2.5rem", height: "2.5rem", borderRadius: "5px" }}
            />
            <h6 className="m-0">
              Task
              <br />
              Mate
            </h6>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-primary nav-btn mx-auto px-3 py-2"
                  onClick={loadCities}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  style={{
                    backgroundColor: "#202020",
                    color: "white",
                    borderRadius: "0px",
                    borderWidth: "0",
                  }}
                >
                  {city} <img src="src\assets\location.png" alt="" width={25} />
                </button>
              </li>
              <li className="nav-item d-flex flex-coloumn justify-content-center">
                <Link to="/" className="nav-link pt-2">
                  Home
                </Link>
              </li>
              <li className="nav-item d-flex flex-coloumn justify-content-center">
                <Link to="/categories" className="nav-link pt-2">
                  Services
                </Link>
              </li>
              <li className="nav-item d-flex flex-coloumn justify-content-center">
                <Link to="/store" className="nav-link pt-2">
                  Store
                </Link>
              </li>
              <li className="nav-item d-flex flex-coloumn justify-content-center">
                <Link to="/cart" className="nav-link pt-2">
                  Cart
                </Link>
              </li>

              {user ? (
                <>
                  <li
                    className="nav-item d-flex flex-coloumn justify-content-center  mx-auto "
                    onClick={handleProfile}
                    style={{
                      borderRadius: "0px",
                      backgroundColor: "aliceblue",
                    }}
                  >
                    <Link to="services" className="nav-link ">
                      <img
                        className="me-1 mt-1 "
                        src="src\assets\account.png"
                        alt=""
                        width={20}
                        height={20}
                      />
                      {user}
                    </Link>
                  </li>
                  <li className="nav-item d-flex flex-coloumn justify-content-center">
                    <button
                      className="nav-btn mx-auto px-2 py-2"
                      onClick={handlelogout}
                    >
                      {" "}
                      <img src="src\assets\logout.png" alt="" width={25} />
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item d-flex flex-coloumn justify-content-center">
                    <button
                      className="nav-btn px-3 py-2"
                      type="submit"
                      data-bs-dismiss="modal"
                      data-bs-toggle="modal"
                      data-bs-target="#LoginModal"
                    >
                      Login{" "}
                      <img src="src\assets\right-arrow.png" alt="" width={20} />
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div
        className="modal modal-lg fade "
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content ">
            <div className="modal-body ">
              <div className="row justify-content-center ">
                <div className="col-2"></div>
                <div className="row col-8 mx-auto">
                  <h4 className="text-center py-3">
                    Select Your Location to Continue
                  </h4>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control py-2 "
                      placeholder=" Search Service Categories"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="input-group-append">
                      <span
                        className="input-group-text py-2 ms-2 "
                        style={{
                          backgroundColor: "transparent",
                          borderRadius: "50px",
                        }}
                      >
                        <i className="bi bi-search"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-2"></div>
              </div>
              {/* Search bar */}

              <div className="row my-3 mx-3">
                {filteredCities.map((cityName, index) => (
                  <div className="col m-2  cityname " key={index}>
                    <div
                      onClick={() => selectCity(cityName)}
                      className="text-center m-3 "
                      data-bs-dismiss="modal"
                    >
                      <h6 className="">{cityName}</h6>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal modal-lg fade"
        id="LoginModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content ">
            <div className="modal-body py-4">
              <div className="container-fluid">
                <div className="row d-flex flex-row justify-content-evenly">
                  <div
                    className="col-6 card  px-3 py-2"
                    style={{ backgroundColor: "white", borderRadius: "10px" }}
                  >
                    <h2>Sign Up Here!</h2>

                    {otpStatus === false && (

                      <form onSubmit={handleSubmit} className="mx-1 my-4">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            Name:
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">
                            Email:
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            Password:
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary form-btn-si"

                        >
                          Sign Up
                        </button>
                      </form>
                    )}
                    {otpStatus === true && (
                      <div>
                        <label htmlFor="otp-inp">Enter your Verification Code</label>
                        <input
                          id="otp-inp"
                          type="text"
                          onChange={handleOtpInputChange}
                          value={otp}
                        />
                        <button onClick={handleOtpSubmit}>Submit</button>
                      </div>
                    )}



                  </div>
                  <div
                    className="col-5 d-flex flex-column px-4 py-5 card "
                    style={{ backgroundColor: "#F0F3F3", borderRadius: "10px" }}
                  >
                    <h2 className="">Login</h2>
                    <form onSubmit={handleLoginSubmit}>
                      <div className="mb-3">
                        <label htmlFor="loginEmail" className="form-label">
                          Email:
                        </label>
                        <input
                          type="email"
                          id="loginEmail"
                          name="email"
                          value={loginData.email}
                          onChange={handleLoginInputChange}
                          className="form-control "
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="loginPassword" className="form-label">
                          Password:
                        </label>
                        <input
                          type="password"
                          id="loginPassword"
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary form-btn"
                        data-bs-dismiss="modal"
                      >
                        Login
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Nav;