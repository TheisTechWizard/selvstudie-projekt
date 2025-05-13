import React from "react";
// import "../../assets/scss/components/card.scss";

const Card = ({ children, className = "" }) => {
  return <div className={`card ${className}`}>{children}</div>;
};

export default Card;