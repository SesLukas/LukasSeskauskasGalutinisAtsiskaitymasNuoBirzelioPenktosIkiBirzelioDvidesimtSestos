import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { fetchWithToken } from "../utils/fetchtwithoken.js";

const Home = () => {
  const { user, isAuthenticated, dispatch } = useContext(AuthContext);
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);

  
  const refreshQuestions = async () => {
    try {
      const res = await fetch("http://localhost:5500/questions");
      const questions = await res.json();

      const questionsWithAnswers = await Promise.all(
        questions.map(async (q) => {
          const ansRes = await fetch(`http://localhost:5500/questions/${q.id || q._id}/answers`);
          const answers = await ansRes.json();
          return { ...q, answers };
        })
      );

      setQuestionsWithAnswers(questionsWithAnswers);
    } catch (err) {
      console.error("Nepavyko gauti klausimų:", err.message);
    }
  };

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

  useEffect(() => {
    refreshQuestions();
  }, []);

  return (
    <div className="container">
      <h1>Pradinis puslapis</h1>
      {isAuthenticated ? (
        <p>Sveiki sugrįžę, {user}!</p>
      ) : (
        <p>Prašome prisijungti, kad galėtumėte naudotis visomis funkcijomis.</p>
      )}

      <h2>Klausimai su atsakymais:</h2>
      <ul>
        {questionsWithAnswers.map((q) => (
          <li key={`question-${q._id || q.id}`} className="card">
            <strong>{q.title}</strong>
            <br />
            <small>{q.author?.username ? `Autorius: ${q.author.username}` : ""}</small>

            <ul>
              {q.answers.length > 0 ? (
                q.answers.map((ans, i) => (
                  <li key={`answer-${ans._id || i}`}>
                    {ans.text}
                    {ans.edited && (
                      <span style={{ fontStyle: "italic", color: "#777" }}> (redaguota)</span>
                    )}
                    – <small>{ans.author?.username || "Nežinomas"}</small>
                  </li>
                ))
              ) : (
                <li>Nėra atsakymų</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

