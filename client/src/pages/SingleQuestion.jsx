import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useContext } from "react";
import { fetchWithToken } from "../utils/fetchtwithoken.js";
import { AuthContext } from "../context/AuthContext.jsx";

const SingleQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, id: loggedInUserId } = useContext(AuthContext);

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const startEditingAnswer = (id, text) => {
    setEditingAnswerId(id);
    setEditedText(text);
  };

  const handleUpdateAnswer = async (e) => {
    e.preventDefault();
    const res = await fetchWithToken(`http://localhost:5500/answers/${editingAnswerId}`, {
      method: "PATCH",
      body: JSON.stringify({ text: editedText })
    });

    if (res.ok) {
      setAnswers(answers.map((a) =>
        a.id === editingAnswerId ? { ...a, text: editedText, edited: true } : a
      ));
      setEditingAnswerId(null);
      setEditedText("");
    } else {
      alert("Nepavyko atnaujinti atsakymo");
    }
  };


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
      body: JSON.stringify({ text: newAnswer }),
    });
    if (res.ok) {
      const answer = await res.json();
      setAnswers([...answers, answer]);
      setNewAnswer("");
    }
  };

  const handleDeleteQuestion = async () => {
    const confirmDelete = window.confirm("Ar tikrai ištrinti šį klausimą?");
    if (!confirmDelete) return;

    const res = await fetchWithToken(`http://localhost:5500/questions/${question.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      navigate("/questions");
    } else {
      alert("Nepavyko ištrinti klausimo.");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    const confirmDelete = window.confirm("Ar tikrai ištrinti atsakymą?");
    if (!confirmDelete) return;

    const res = await fetchWithToken(`http://localhost:5500/answers/${answerId}`, {
      method: "DELETE",
    });
    

    if (res.ok) {
      setAnswers(answers.filter(a => a.id !== answerId));
    } else {
      alert("Nepavyko ištrinti atsakymo.");
    }
  };
 const handleLike = async () => {
    const res = await fetchWithToken(`http://localhost:5500/questions/${question.id}/like`, {
      method: "POST"
    });
    if (res.ok) {
      const updated = await fetchWithToken(`http://localhost:5500/questions/${question.id}`);
      const data = await updated.json();
      setQuestion(data);
    }
  };

  const handleDislike = async () => {
    const res = await fetchWithToken(`http://localhost:5500/questions/${question.id}/dislike`, {
      method: "POST"
    });
    if (res.ok) {
      const updated = await fetchWithToken(`http://localhost:5500/questions/${question.id}`);
      const data = await updated.json();
      setQuestion(data);
    }
  };
  if (!question) return <p>Kraunama...</p>;

  return (
    <div>
      <h2>{question.title}</h2>
      <p>
        {question.description}
        {question.edited && (
          <span style={{ fontStyle: "italic", color: "#777" }}> (redaguota)</span>
        )}
      </p>

      {String(loggedInUserId) === String(question.user_id) && (
        <>
          <button onClick={() => navigate(`/questions/${question.id}/edit`)}>
             Redaguoti klausimą
          </button>
          <button onClick={handleDeleteQuestion} style={{ marginLeft: "1rem", color: "red" }}>
             Ištrinti klausimą
          </button>
        </>
      )}

      {question.topics?.length > 0 && (
        <p><strong>Temos:</strong> {question.topics.join(", ")}</p>
      )}
      {question.tags?.length > 0 && (
        <p><strong>Žymos:</strong> {question.tags.join(", ")}</p>
      )}
{isAuthenticated && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleLike}>
            👍 Like ({question.likes?.length || 0})
          </button>
          <button onClick={handleDislike} style={{ marginLeft: "1rem" }}>
            👎 Dislike ({question.dislikes?.length || 0})
          </button>
        </div>
      )}
      <hr />
            <h3>Atsakymai:</h3>
      <ul>
  {answers.map((a) => (
    <li key={a._id}>
      {editingAnswerId === a.id ? (
        <form onSubmit={handleUpdateAnswer}>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            required
          />
          <button type="submit">Išsaugoti</button>
          <button type="button" onClick={() => setEditingAnswerId(null)}>Atšaukti</button>
        </form>
      ) : (
        <>
          <p>
            {a.text}
            {a.edited && <span style={{ fontStyle: "italic", color: "#777" }}> (redaguota)</span>}
          </p>
          <small>
            Autorius: {a.author?.username || "Nežinomas"}
          </small>
          {String(loggedInUserId) === String(a.user_id) && (
            <>
              <button onClick={() => startEditingAnswer(a.id, a.text)} style={{ marginLeft: "1rem" }}>
                Redaguoti
              </button>
              <button
                onClick={() => handleDeleteAnswer(a.id)}
                style={{ marginLeft: "1rem", color: "red" }}
              >
                Trinti
              </button>
            </>
          )}
        </>
      )}
    </li>
  ))}
</ul>


      {isAuthenticated ? (
        <form onSubmit={handleAnswerSubmit}>
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Tavo atsakymas"
            required
          />
          <button type="submit">Pateikti atsakymą</button>
        </form>
      ) : (
        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
          Prisijunkite, jei norite pateikti atsakymą.
        </p>
      )}
    </div>
  );
};

export default SingleQuestion;
