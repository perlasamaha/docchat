import { useState } from "react";
function Uploader({ onUploaded, currentTitle }) {
  // currentTitle = the restored document's name (from App.jsx)
  const [status, setStatus] = useState("");
  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setStatus(`Reading "${file.name}"…`);
    const form = new FormData(); // multipart upload
    form.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      body: form,
    });
    const data = await res.json();
    if (data.error) setStatus(data.error);
    else {
      setStatus(`Loaded "${data.title}" (${data.chars} characters).`);
      onUploaded(data.id);
    }
  }
  return (
    <div>
      {/* the <label> is the clickable button; the real <input> is hidden, so no "No file
chosen" text appears */}
      <label
        style={{
          display: "inline-block",
          padding: "8px 14px",
          background: "#2563eb",
          color: "#fff",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Choose a document (PDF or .txt)
        <input
          type="file"
          accept=".pdf,.txt,.md"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </label>
      {/* show the just-uploaded file, else the restored document, else a prompt */}
      <p role="status">
        {status ||
          (currentTitle
            ? `Current document: ${currentTitle}`
            : "No document loaded yet.")}
      </p>
    </div>
  );
}
export default Uploader;