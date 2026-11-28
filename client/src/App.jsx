import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Uploader from "./components/Uploader";
import Chat from "./components/Chat";

function App() {
  const [user, setUser] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [registrationOpen, setRegistrationOpen] = useState(true);   // assume open until /api/me answers (avoids a flash)

  useEffect(() => {
    // on load, ask "who am I?"
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { setUser(data.user); setRegistrationOpen(data.registrationOpen); });
  }, []);

  // after login (including after a reload), re-select the most recent document so its chat history loads
  useEffect(() => {
    if (!user) return; // wait until we know who's logged in
    fetch("/api/documents", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.documents.length) {
          setDocumentId(data.documents[0].id);
          setDocumentTitle(data.documents[0].title); // ADDED: remember the title for the uploader
        }
      });
  }, [user]);

  async function logout() {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUser(null);
  }

  if (user) {
    // LOGGED IN: upload + chat
    return (
      <main>
        <p>
          Hi, {user.name}! <button onClick={logout}>Log out</button>
        </p>
        <Uploader onUploaded={setDocumentId} currentTitle={documentTitle} />
        <Chat documentId={documentId} />
      </main>
    );
  }
  return (
    // LOGGED OUT: the forms
    <main>
      <h2>Create an account</h2>
      {/* closed on the live site → the form shows but is disabled */} 
      <RegisterForm onLoggedIn={setUser} disabled={!registrationOpen} /> 
      <h2>Or log in</h2>
      <LoginForm onLoggedIn={setUser} />
    </main>
  );
}
export default App;