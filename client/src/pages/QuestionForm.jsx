import { useContext, useEffect, useState } from "react";
import { fetchWithToken } from "../utils/fetchtwithoken.js";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext.jsx";

const QuestionForm = () => {
  const { isAuthenticated, id } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    
    setTimeout(() => setLoading(false), 100); 
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return alert("Naudotojo ID nerastas – prisijunkite iš naujo.");

    const res = await fetchWithToken("http://localhost:5500/questions", {
      method: "POST",
      body: JSON.stringify({ ...form, user_id: id }),
    });

    if (res.ok) navigate("/questions");
    else alert("Klaida pateikiant klausimą");
  };

  if (loading) return <p>Kraunama...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Naujas klausimas</h2>
      <input
        type="text"
        placeholder="Klausimo pavadinimas"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <br />
      <textarea
        placeholder="Klausimo turinys"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        required
      />
      <br />
      <button type="submit">Pateikti</button>
    </form>
  );
};

export default QuestionForm;
