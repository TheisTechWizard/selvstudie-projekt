import React from "react";
import "../../src/assets/scss/components/button.scss"; // Adjust the path as necessary 

const Button = ({ children, onClick, className = "" }) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;