import { useEffect, useState } from "react";
import { fetchWithToken } from "../utils/fetchtwithoken.js";
import { Link } from "react-router";

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
    <div>
      <h2>Klausimai</h2>
      <ul>
        {questions.map((q) => (
          <li key={q._id}>
  <Link to={`/questions/${q._id}`}>{q.title}</Link>
  <br />
  <small>{q.author?.username ? `Autorius: ${q.author.username}` : ""}</small>
</li>
        ))}
      </ul>
      <Link to="/questions/new">
        <button>Užduoti naują klausimą</button>
      </Link>
    </div>
  );
};

export default Questions;
