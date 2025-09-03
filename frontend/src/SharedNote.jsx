import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

function SharedNote() {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        const res = await axios.get(`${API_URL}/share/${shareId}`);
        setNote(res.data);
      } catch (err) {
        console.error("Error fetching shared note:", err);
        setNote(null);
      }
    };
    fetchSharedNote();
  }, [shareId]);

  if (!note) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h2>Note not found or has been deleted</h2>
        <Link to="/">Go Back</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Shared Note</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <strong>{note.title}</strong>
        <p>{note.content}</p>
      </div>
      <Link to="/">Go Back</Link>
    </div>
  );
}

export default SharedNote;
