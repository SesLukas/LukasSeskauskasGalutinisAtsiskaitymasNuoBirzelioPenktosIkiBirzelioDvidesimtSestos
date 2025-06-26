import { useEffect, useState } from "react";
import { fetchWithToken } from "../utils/fetchtwithoken.js";
import { Link } from "react-router";
import "./Questions.css";

const Questions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getQuestions = async () => {
      const res = await fetchWithToken("http://localhost:5500/questions");
      const data = await res.json();
      setQuestions(data);
    };
    getQuestions();
  }, []);

  return (
    <div className="questions-container">
      <h2>Klausimai</h2>
      <ul className="questions-list">
        {questions.map((q) => (
          <li key={q._id}>
  <Link to={`/questions/${q._id}`} className="question-link">{q.title}</Link>
  <br />
  <p className="question-meta">{q.author?.username ? `Autorius: ${q.author.username}` : ""}</p>
</li>
        ))}
      </ul>
      <Link to="/questions/new" className="ask-button">
        <button>Užduoti naują klausimą</button>
      </Link>
    </div>
  );
};

export default Questions;
