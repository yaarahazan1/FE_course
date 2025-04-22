import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  onClick,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${"button"} ${"primary"}`}
    >
      {children}
    </button>
  );
};

export default Button;
