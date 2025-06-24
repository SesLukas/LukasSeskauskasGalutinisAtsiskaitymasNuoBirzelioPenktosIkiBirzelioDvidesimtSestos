import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Register = () => {
  const { dispatch } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5500/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      dispatch({ type: "LOGIN", payload: { user: data.username, token: data.token } });
    } else {
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Surname" onChange={(e) => setForm({ ...form, surname: e.target.value })} />
      <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
