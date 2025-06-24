import { useContext } from "react";
import { NavLink, useNavigate } from "react-router"; // tik iš react-router!
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, token, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: "10px", padding: "10px", borderBottom: "1px solid #ccc" }}>
      <NavLink to="/">Home</NavLink>

      {isAuthenticated ? (
        <>
          <span>Welcome, {user}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </>
      )}
    </nav>
  );
};

export default Navbar;