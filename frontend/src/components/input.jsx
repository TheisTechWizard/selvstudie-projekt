import React from "react"
import "../../src/assets/scss/components/input.scss"

const Input = ({
  placeholder,
  type = "text",
  value,
  onChange,
  required,
  ...rest
}) => {
  return (
    <input
      className="input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      {...rest}
    />
  )
}

export default Input
