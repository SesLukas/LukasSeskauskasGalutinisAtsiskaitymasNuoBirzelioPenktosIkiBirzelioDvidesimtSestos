import { useState } from "react";
import { fetchWithToken } from "../utils/fetchtwithoken.js";
import { useNavigate } from "react-router";

const QuestionForm = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetchWithToken("http://localhost:5500/questions", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) navigate("/questions");
    else alert("Nepavyko pateikti klausimo");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Klausimo pavadinimas"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        placeholder="Turinys"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />
      <button type="submit">Pateikti</button>
    </form>
  );
};

export default QuestionForm;
