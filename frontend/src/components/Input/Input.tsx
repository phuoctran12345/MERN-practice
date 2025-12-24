import React from 'react';
import './Input.css';

interface InputProps {
  type?: string;
  id: string;
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  step?: number;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  id,
  label,
  value,
  onChange,
  step,
  placeholder,
  required = false,
  min,
  max,
}) => {
  return (
    <div className="input">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        step={step}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
      />
    </div>
  );
};

export default Input;

