import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../utils/fetchtwithoken";

const QuestionEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    topics: "",
    tags: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetchWithToken(`http://localhost:5500/questions/${id}`);
        const data = await res.json();
        setForm({
          title: data.title,
          description: data.description,
          topics: data.topics?.join(", ") || "",
          tags: data.tags?.join(", ") || ""
        });
        setLoading(false);
      } catch (err) {
        console.error("Nepavyko gauti klausimo duomenų:", err);
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      topics: form.topics.split(",").map(t => t.trim()).filter(Boolean),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
    };

    const res = await fetchWithToken(`http://localhost:5500/questions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      navigate(`/questions/${id}`);
    } else {
      const msg = await res.text();
      alert("Nepavyko atnaujinti klausimo: " + msg);
    }
  };

  if (loading) return <p>Kraunama klausimo informacija...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Redaguoti klausimą</h2>

      <label>Pavadinimas:</label>
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <label>Aprašymas:</label>
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />

      <label>Temos (atskirta kableliais):</label>
      <input
        type="text"
        value={form.topics}
        onChange={(e) => setForm({ ...form, topics: e.target.value })}
      />

      <label>Žymos (atskirta kableliais):</label>
      <input
        type="text"
        value={form.tags}
        onChange={(e) => setForm({ ...form, tags: e.target.value })}
      />

      <button type="submit">Išsaugoti pakeitimus</button>
    </form>
  );
};

export default QuestionEditForm;
