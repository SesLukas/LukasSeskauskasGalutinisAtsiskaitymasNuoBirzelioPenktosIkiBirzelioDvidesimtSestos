import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5500/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      dispatch({ type: "LOGIN", payload: { user: data.username, token: data.token } });
      navigate("/"); 
    } else {
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        placeholder="Username"
      />
      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

