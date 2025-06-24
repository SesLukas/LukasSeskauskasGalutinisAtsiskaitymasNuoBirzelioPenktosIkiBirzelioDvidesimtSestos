import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../utils/fetchtwithoken.js";

const SingleQuestion = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const qRes = await fetchWithToken(`http://localhost:5500/questions/${id}`);
      const aRes = await fetchWithToken(`http://localhost:5500/questions/${id}/answers`);
      const qData = await qRes.json();
      const aData = await aRes.json();
      setQuestion(qData);
      setAnswers(aData);
    };
    loadData();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    const res = await fetchWithToken(`http://localhost:5500/questions/${id}/answers`, {
      method: "POST",
      body: JSON.stringify({ content: newAnswer }),
    });
    if (res.ok) {
      const answer = await res.json();
      setAnswers([...answers, answer]);
      setNewAnswer("");
    }
  };

  if (!question) return <p>Kraunama...</p>;

  return (
    <div>
      <h2>{question.title}</h2>
      <p>{question.content}</p>
      <hr />
      <h3>Atsakymai:</h3>
      <ul>
        {answers.map((a) => (
          <li key={a._id}>{a.content}</li>
        ))}
      </ul>
      <form onSubmit={handleAnswerSubmit}>
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Tavo atsakymas"
        />
        <button type="submit">Pateikti atsakymą</button>
      </form>
    </div>
  );
};

export default SingleQuestion;
