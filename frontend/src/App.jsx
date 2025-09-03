import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [shareLink, setShareLink] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_URL}/notes`);
      setNotes(res.data.data || res.data); // handle different backend responses
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      if (editId) {
        await axios.put(`${API_URL}/notes/${editId}`, { title, content });
      } else {
        await axios.post(`${API_URL}/notes`, { title, content });
      }
      setTitle("");
      setContent("");
      setEditId(null);
      fetchNotes();
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note._id || note.id);
  };

  const handleShare = (shareId) => {
    const url = `${window.location.origin}/shared/${shareId}`;
    setShareLink(url);
    navigator.clipboard.writeText(url)
      .then(() => alert("Share URL copied to clipboard!"))
      .catch(() => alert("Failed to copy URL"));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Notes App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ marginRight: "10px", width: "45%" }}
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ marginRight: "10px", width: "45%" }}
        />
        <button type="submit">{editId ? "Update Note" : "Add Note"}</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {notes.map((note) => (
          <li
            key={note._id || note.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <strong>{note.title}</strong>: {note.content} <br />
            <button onClick={() => handleEdit(note)} style={{ marginRight: "5px" }}>Edit</button>
            <button onClick={() => handleDelete(note._id || note.id)} style={{ marginRight: "5px" }}>Delete</button>
            <button onClick={() => handleShare(note.share_id)} style={{ marginRight: "5px" }}>Share</button>
          </li>
        ))}
      </ul>

      {shareLink && (
        <div style={{ marginTop: "20px" }}>
          <strong>Share this note:</strong>
          <input type="text" value={shareLink} readOnly style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}

export default App;
