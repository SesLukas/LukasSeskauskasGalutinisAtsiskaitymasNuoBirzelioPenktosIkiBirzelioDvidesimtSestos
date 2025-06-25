import { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
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

  const handleAskQuestionClick = () => {
    if (isAuthenticated) navigate("/questions/new");
    else navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: "10px", padding: "10px", borderBottom: "1px solid #ccc" }}>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/questions">Klausimai</NavLink>

      <button onClick={handleAskQuestionClick}>+ Naujas klausimas</button>

      {isAuthenticated ? (
        <>
          <span>Sveikas, {user}</span>
          <button onClick={handleLogout}>Atsijungti</button>
        </>
      ) : (
        <>
          <NavLink to="/login">Prisijungti</NavLink>
          <NavLink to="/register">Registruotis</NavLink>
        </>
      )}
    </nav>
  );
};

export default Navbar;
