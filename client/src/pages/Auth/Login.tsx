import React from "react";
import TextInput from "../../components/TextInput/TextInput";
import Button from "../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { login } from "../../Services/authServices";

const Login = () => {
  const [loginPayload, setLoginPayload] = React.useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(loginPayload, navigate);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <img 
          src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} 
          alt="Logo" 
        />
        <h2 style={{ marginBottom: '1.5rem', color: '#1e293b', textAlign: 'center' }}>
          Welcome Back
        </h2>
        <div className="auth__form">
          <TextInput
            label="Email"
            value={loginPayload.email}
            onChange={(val) =>
              setLoginPayload({
                ...loginPayload,
                email: val.toLocaleString(),
              })
            }
            placeholder="yourname@email.com"
          />
          <TextInput
            label="Password"
            value={loginPayload.password}
            onChange={(val) =>
              setLoginPayload({
                ...loginPayload,
                password: val.toLocaleString(),
              })
            }
            type="password"
            placeholder="••••••••"
          />
        </div>
        <div className="auth__action">
          <Button 
            label={isLoading ? "Logging in..." : "Login"} 
            onClick={handleLogin}
            disabled={isLoading}
          />
          <p>
            No account yet? <Link to="/signup">Sign up</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;