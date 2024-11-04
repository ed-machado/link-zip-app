import React from "react";
import TextInput from "../../components/TextInput/TextInput";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import "./auth.css";
import { forgotPassword } from "../../Services/authServices";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      const isDone = await forgotPassword(email);
      setIsSuccess(isDone);
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
          Forgot Password
        </h2>
        {!isSuccess ? (
          <>
            <div className="auth__form">
              <TextInput
                label="Email"
                value={email}
                onChange={(val) => setEmail(val.toLocaleString())}
                placeholder="yourname@email.com"
              />
            </div>
            <div className="auth__action">
              <Button
                label={isLoading ? "Sending..." : "Send reset link"}
                onClick={handleForgotPassword}
                disabled={isLoading}
              />
              <p>
                Remembered your password? <Link to="/login">Login</Link>
              </p>
            </div>
          </>
        ) : (
          <div className="auth__message">
            <p>Reset instructions sent successfully!</p>
            <p>Please check your email for further instructions.</p>
            <p style={{ marginTop: '1rem' }}>
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;