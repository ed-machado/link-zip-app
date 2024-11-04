import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../Services/authServices";
import TextInput from "../../components/TextInput/TextInput";
import Button from "../../components/Button/Button";
import "./auth.css";

const Signup = () => {
  const [signupPayload, setSignupPayload] = React.useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      await signup(signupPayload, navigate);
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
          Create Account
        </h2>
        <div className="auth__form">
          <TextInput
            label="Full name"
            value={signupPayload.fullName}
            onChange={(val) =>
              setSignupPayload({
                ...signupPayload,
                fullName: val.toLocaleString(),
              })
            }
            placeholder="John Doe"
          />
          <TextInput
            label="Email"
            value={signupPayload.email}
            onChange={(val) =>
              setSignupPayload({
                ...signupPayload,
                email: val.toLocaleString(),
              })
            }
            placeholder="yourname@email.com"
          />
          <TextInput
            label="Password"
            value={signupPayload.password}
            onChange={(val) =>
              setSignupPayload({
                ...signupPayload,
                password: val.toLocaleString(),
              })
            }
            type="password"
            placeholder="••••••••"
          />
        </div>
        <div className="auth__action">
          <Button
            label={isLoading ? "Creating account..." : "Sign up"}
            onClick={handleSignup}
            disabled={isLoading}
          />
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;  