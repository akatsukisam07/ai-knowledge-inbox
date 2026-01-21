import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8000";

export default function App() {
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- API CALLS ---------------- */

  async function fetchItems() {
    const res = await fetch(`${API_BASE}/items`);
    const data = await res.json();
    setItems(data.items || []);
  }

  async function ingestNote() {
    if (!note.trim()) {
      alert("Note cannot be empty");
      return;
    }

    await fetch(`${API_BASE}/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_kind: "note",
        payload: note,
      }),
    });

    setNote("");
    fetchItems();
  }

  async function ingestURL() {
    if (!url.trim()) {
      alert("URL cannot be empty");
      return;
    }

    await fetch(`${API_BASE}/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_kind: "url",
        payload: url,
      }),
    });

    setUrl("");
    fetchItems();
  }

  async function askQuestion() {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    setLoading(true);

    const res = await fetch(`${API_BASE}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        top_k: 3,
      }),
    });

    const data = await res.json();
    setAnswer(data.answer);
    setSources(data.sources || []);
    setLoading(false);
  }

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    fetchItems();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>AI Knowledge Inbox</h1>

        {/* INGEST NOTE */}
        <section style={styles.section}>
          <h3 style={styles.heading}>Ingest Note</h3>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={styles.textarea}
            placeholder="Write a short note..."
          />
          <button style={styles.button} onClick={ingestNote}>
            Save Note
          </button>
        </section>

        {/* INGEST URL */}
        <section style={styles.section}>
          <h3 style={styles.heading}>Ingest URL</h3>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
            placeholder="https://example.com"
          />
          <button style={styles.button} onClick={ingestURL}>
            Save URL
          </button>
        </section>

        {/* SAVED ITEMS */}
        <section style={styles.section}>
          <h3 style={styles.heading}>Saved Items</h3>

          {items.length === 0 && (
            <p style={styles.muted}>No content ingested yet.</p>
          )}

          <ul style={styles.itemList}>
            {items.map((item, i) => (
              <li key={i} style={styles.item}>
                <div style={styles.itemMeta}>
                  <strong>{item.source_kind}</strong>
                  <span style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <div style={styles.itemText}>
                  {item.text.slice(0, 140)}…
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ASK QUESTION */}
        <section style={styles.section}>
          <h3 style={styles.heading}>Ask Question</h3>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={styles.input}
            placeholder="Ask something about your content..."
          />
          <button style={styles.button} onClick={askQuestion}>
            Ask
          </button>
        </section>

        {loading && <p style={styles.muted}>Thinking…</p>}

        {/* ANSWER */}
        {answer && (
          <section style={styles.section}>
            <h3 style={styles.heading}>Answer</h3>
            <p style={styles.answer}>{answer}</p>

            <h4 style={styles.subheading}>Sources</h4>
            <ul style={styles.sources}>
              {sources.map((s, i) => (
                <li key={i} style={styles.sourceItem}>
                  {s.text.slice(0, 140)}…
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f1117",
    padding: "40px",
    color: "#e6e6e6",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "820px",
    backgroundColor: "#161a22",
    borderRadius: "14px",
    padding: "32px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  },
  title: {
    textAlign: "center",
    marginBottom: "32px",
    fontSize: "28px",
    fontWeight: 600,
  },
  section: {
    marginBottom: "28px",
  },
  heading: {
    marginBottom: "8px",
    fontSize: "16px",
    fontWeight: 500,
    color: "#cfd3ff",
  },
  subheading: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#9fa4ff",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #2a2f45",
    backgroundColor: "#0f1117",
    color: "#e6e6e6",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #2a2f45",
    backgroundColor: "#0f1117",
    color: "#e6e6e6",
    marginBottom: "10px",
    resize: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4f5dff",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
  },
  muted: {
    textAlign: "center",
    color: "#888",
  },
  answer: {
    lineHeight: 1.6,
    color: "#eaeaea",
  },
  sources: {
    paddingLeft: "18px",
    marginTop: "8px",
  },
  sourceItem: {
    fontSize: "13px",
    color: "#b3b3b3",
    marginBottom: "6px",
  },
  itemList: {
    listStyle: "none",
    padding: 0,
    marginTop: "10px",
  },
  item: {
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#0f1117",
    border: "1px solid #2a2f45",
    marginBottom: "10px",
  },
  itemMeta: {
    fontSize: "12px",
    color: "#9fa4ff",
    marginBottom: "4px",
  },
  timestamp: {
    marginLeft: "8px",
    color: "#777",
  },
  itemText: {
    fontSize: "13px",
    color: "#ccc",
    lineHeight: 1.4,
  },
};
