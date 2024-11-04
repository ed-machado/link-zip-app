import React from "react";

import "./Appbar.css";
import useAuth from "../../util/useAuth";
import Button from "../Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../Services/authServices";

const Appbar = () => {
  const isLoggedIn = useAuth();
  const navigate = useNavigate();
  return (
    <div className="appbar">
      <div className="appbar__inner">
        <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="" />

        <div className="appbar__menus">
          <Link className="active" to="/">
            Home{" "}
          </Link>
          
          {isLoggedIn && <Link to="/profile">Profile </Link>}

          <div className="appbar__auth">
            {isLoggedIn ? (
              <Button
                label="Logout"
                variant="outlined-secondary"
                onClick={() => logout(navigate)}
              />
            ) : (
              <>
                <Button
                  label="Login"
                  variant="outlined-primary"
                  onClick={() => navigate("/login")}
                />
                <Button
                  label="Register"
                  
                  onClick={() => navigate("/signup")}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appbar;