import { useParams } from "react-router";
import { useEffect, useState } from "react";

const QuestionDetails = () => {
  const { id } = useParams();
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
  const fetchAnswers = async () => {
    try {
      const res = await fetch(`http://localhost:5500/questions/${id}/answers`);
      if (!res.ok) throw new Error("Nepavyko gauti atsakymų");
      const data = await res.json();
      console.log("Gauti atsakymai:", data); // ← čia pridėk
      console.log(`/questions/${id}/answers`)
      setAnswers(data);
    } catch (err) {
      console.error("Klaida gaunant atsakymus:", err.message); // ← šitas irgi padės
    }
  };
  fetchAnswers();
}, [id]);

  return (
    <div>
      <h2>Atsakymai</h2>
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
