import { useParams } from "react-router";
import { useEffect, useState } from "react";

const QuestionDetails = () => {
  const { id } = useParams();
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      const res = await fetch(`http://localhost:5500/questions/${id}/answers`);
      const data = await res.json();
      setAnswers(data);
    };
    fetchAnswers();
  }, [id]);

  return (
    <div>
      <h2>Atsakymai:</h2>
      <ul>
        {answers.map(ans => (
          <li key={ans._id}>{ans.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionDetails;
