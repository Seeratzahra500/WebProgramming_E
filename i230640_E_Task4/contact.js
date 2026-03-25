import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="page">
      <h1>Contact</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
        </label>
        <label>Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
        </label>
        <label>Message
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message" rows={4} required />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Contact;