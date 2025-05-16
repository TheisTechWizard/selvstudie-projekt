import { useState } from "react"

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("Response:", data)
      if (response.ok) {
        alert("Bruger oprettet!")
      } else {
        alert("Fejl: " + JSON.stringify(data))
      }
    } catch (error) {
      console.error("Fejl ved registrering:", error)
    }
  }

  return (
    <div>
      <h2>Registrering</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Brugernavn"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Adgangskode"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Opret bruger</button>
      </form>
    </div>
  )
}

export default Register
