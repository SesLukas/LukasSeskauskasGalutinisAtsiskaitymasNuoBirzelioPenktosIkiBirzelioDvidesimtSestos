import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchWithToken } from "../utils/fetchWithToken";

const Home = () => {
  const { state, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const checkUser = async () => {
      if (!state.user && localStorage.getItem("token")) {
        try {
          const res = await fetchWithToken("http://localhost:5500/me");
          if (res.ok) {
            const data = await res.json();
            dispatch({ type: "LOGIN", payload: { user: data.username, token: localStorage.getItem("token") } });
          }
        } catch (err) {
          console.error("Token netinkamas arba serverio klaida:", err.message);
        }
      }
    };

    checkUser();
  }, [state.user, dispatch]);

  return (
    <div>
      <h1>Pradinis puslapis</h1>
      {state.isAuthenticated ? (
        <p>Sveiki sugrįžę, {state.user}!</p>
      ) : (
        <p>Prašome prisijungti, kad galėtumėte naudotis visomis funkcijomis.</p>
      )}
    </div>
  );
};

export default Home;
