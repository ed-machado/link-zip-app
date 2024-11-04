import React from "react";
import "./Button.css";

type ButtonProps = {
  label: string;
  variant?: "primary" | "outlined-primary" | "outlined-secondary";
  onClick: () => void;
  disabled?: boolean;
  style?: {};
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  onClick,
  disabled = false,
  style,
  size = "medium",
  fullWidth = false,
  loading = false,
}) => {
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        button 
        button__${variant} 
        button__${size}
        ${fullWidth ? 'button__full-width' : ''}
        ${loading ? 'button__loading' : ''}
      `}
      style={style}
    >
      {loading ? (
        <span className="button__spinner"></span>
      ) : (
        label
      )}
    </button>
  );
};

export default Button;