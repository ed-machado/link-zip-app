import React from "react";
import TextInput from "../../components/TextInput/TextInput";
import Button from "../../components/Button/Button";
import { Link, useSearchParams } from "react-router-dom";
import "./auth.css";
import { resetPassword, verifyToken } from "../../Services/authServices";

const PasswordReset = () => {
  const [password, setPassword] = React.useState("");
  const [tokenVerified, setTokenVerified] = React.useState(false);
  const [isResetSuccess, setIsResetSuccess] = React.useState(false);
  const [resetToken, setResetToken] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("resetToken");
      if (token) {
        setResetToken(token);
        setTokenVerified(await verifyToken(token));
      } else {
        setTokenVerified(false);
      }
    };
    verify();
  }, [searchParams]);

  const handleReset = async () => {
    setIsLoading(true);
    try {
      const isResetDone = await resetPassword(resetToken, password);
      setIsResetSuccess(isResetDone);
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
          Reset Password
        </h2>
        {tokenVerified ? (
          <>
            <div className="auth__form">
              <TextInput
                label="New Password"
                value={password}
                onChange={(val) => setPassword(val.toLocaleString())}
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div className="auth__action">
              <Button
                label={isLoading ? "Resetting..." : "Reset password"}
                onClick={handleReset}
                disabled={isLoading}
              />
            </div>
            {isResetSuccess && (
              <div className="auth__message">
                Password reset successful! <Link to="/login">Login now</Link>
              </div>
            )}
          </>
        ) : (
          <div className="auth__message auth__error">
            Invalid or expired reset token. Please request a new password reset link.
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;