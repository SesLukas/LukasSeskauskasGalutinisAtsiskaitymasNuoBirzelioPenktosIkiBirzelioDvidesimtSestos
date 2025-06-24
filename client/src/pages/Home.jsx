import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { fetchWithToken } from "../utils/fetchtwithoken.js";

const Home = () => {
  const { user, isAuthenticated, dispatch } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);

  
  useEffect(() => {
    const checkUser = async () => {
      if (!user && localStorage.getItem("token")) {
        try {
          const res = await fetchWithToken("http://localhost:5500/me");
          if (res.ok) {
            const data = await res.json();
            dispatch({
              type: "LOGIN",
              payload: { user: data.username, token: localStorage.getItem("token") },
            });
          }
        } catch (err) {
          console.error("Token netinkamas arba serverio klaida:", err.message);
        }
      }
    };
    checkUser();
  }, [user, dispatch]);

  // Gauna klausimus
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:5500/questions");
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Nepavyko gauti klausimų:", err.message);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div>
      <h1>Pradinis puslapis</h1>
      {isAuthenticated ? (
        <p>Sveiki sugrįžę, {user}!</p>
      ) : (
        <p>Prašome prisijungti, kad galėtumėte naudotis visomis funkcijomis.</p>
      )}

      <h2>Klausimai:</h2>
      <ul>
        {questions.map(q => (
          <li key={q._id}>{q.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
