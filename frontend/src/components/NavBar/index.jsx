import { useState, useEffect, useContext } from "react";
import LogoA from "../../assets/logo-a.png";
import { Link } from "react-router-dom";
import "./index.scss";
import api from "../../api/posts";
import {UserContext} from "../../App";

const NavBar = () => {

  const [account, setAccount] = useState("Account");
  const {isLoggedIn, setIsLoggedIn} = useContext(UserContext);
  
  useEffect( () => {

    const getUserName = async () => {
      try {
        const response = await api.get("/myaccount");
        if (response.data) {
          setAccount(response.data.username);
        } else {
          setAccount("Account");
        }
      } catch (err) {
        console.error(err);
      }
    };

    getUserName();

  }, []);

  return (
    <>
      <div className="navigation">
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src={LogoA} alt="A" />
            <h1>Blog</h1>
          </Link>
        </div>
        <div className="nav-links">
          <ul>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="create">Create</Link>
                </li>
                <li>
                  <Link to="account">{account}</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="login">Login</Link>
                </li>
                <li>
                  <Link to="register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;
