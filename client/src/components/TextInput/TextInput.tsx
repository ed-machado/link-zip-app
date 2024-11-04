import React from "react";
import "./TextInput.css";

type Props = {
  label?: string;
  placeholder?: string;
  onChange: (val: string | number) => void;
  type?: "text" | "password";
  value: string;
  style?: {};
  error?: string;
  disabled?: boolean;
};

const TextInput: React.FC<Props> = ({
  label,
  placeholder,
  onChange,
  type = "text",
  value,
  style,
  error,
  disabled = false,
}) => {
  return (
    <div className="text-input" style={style}>
      {Boolean(label) && (
        <label className={error ? "label-error" : ""}>
          {label}
          {error && <span className="error-message">* {error}</span>}
        </label>
      )}
      <div className="input-wrapper">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className={error ? "input-error" : ""}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default TextInput;