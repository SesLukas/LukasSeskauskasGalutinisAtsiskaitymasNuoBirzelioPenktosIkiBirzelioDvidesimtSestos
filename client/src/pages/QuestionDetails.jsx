import { useParams } from "react-router";
import { useEffect, useState } from "react";

const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`http://localhost:5500/questions/${id}`);
        if (!res.ok) throw new Error("Nepavyko gauti klausimo");
        const data = await res.json();
        setQuestion(data);
      } catch (err) {
        console.error("Klaida gaunant klausimą:", err.message);
      }
    };
    fetchQuestion();
  }, [id]);

  
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await fetch(`http://localhost:5500/questions/${id}/answers`);
        if (!res.ok) throw new Error("Nepavyko gauti atsakymų");
        const data = await res.json();
        setAnswers(data);
      } catch (err) {
        console.error("Klaida gaunant atsakymus:", err.message);
      }
    };
    fetchAnswers();
  }, [id]);

  
  if (!question) return <p>Kraunama klausimo informacija...</p>;

  return (
    <div>
      <h2>{question.title}</h2>
      <p>{question.description}</p>

      <h3>Atsakymai:</h3>
      {answers.length === 0 ? (
        <p>Nėra atsakymų</p>
      ) : (
        answers.map(ans => (
          <div key={ans._id}>
            <p>{ans.text}</p>
            <small>Autorius: {ans.author?.username || "Nežinomas"}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionDetails;