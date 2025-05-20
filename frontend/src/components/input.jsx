import React from "react"

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
