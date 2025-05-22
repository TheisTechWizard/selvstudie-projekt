import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Register = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Registrér brugeren
      const registerResponse = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setError("Fejl under registrering: " + JSON.stringify(registerData));
        return;
      }

      // Automatisk login efter registrering
      const loginResponse = await fetch("/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setError(
          "Registreret, men login fejlede: " + JSON.stringify(loginData)
        );
        return;
      }

      // Gem token og navigér
      localStorage.setItem("token", loginData.access);
      const decoded = jwtDecode(loginData.access);
      const userId = decoded.user_id;
      localStorage.setItem("userId", userId);

      if (setIsAuthenticated) {
        setIsAuthenticated(true);
      }

      navigate(`/user/${userId}`);
    } catch (err) {
      console.error("Fejl:", err);
      setError("Uventet fejl ved registrering.");
    }
  };

  return (
    <div>
      <h2>Registrering</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;
