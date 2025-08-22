import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function LetterForm() {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [canSend, setCanSend] = useState(false);

  useEffect(() => {
    // Allow sending only after 5 seconds (anti-spam delay)
    const t = setTimeout(() => setCanSend(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);

    // Honeypot field (bot protection)
    if (fd.get("company")) return;

    // Rate limiter: user must wait 1 minute before sending again
    const last = localStorage.getItem("lastSentTime");
    if (last && Date.now() - Number(last) < 60000) {
      setStatus("error");
      setErrorMsg("Please wait 1 minute before sending again.");
      return;
    }

    // Prevent sending if anti-spam delay not reached
    if (!canSend) {
      setStatus("error");
      setErrorMsg("Please wait a few seconds before sending.");
      return;
    }

    const email = String(fd.get("email") || "");
    const subject = String(fd.get("title") || "");
    const message = String(fd.get("message") || "");

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    // Validate required fields
    if (!subject || !message) {
      setStatus("error");
      setErrorMsg("Please fill in both subject and message.");
      return;
    }

    try {
      setStatus("sending");

      // Send form with EmailJS
      emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      // Reset form and update status
      setStatus("success");
      formRef.current.reset();
      localStorage.setItem("lastSentTime", Date.now().toString());
    } catch {
      setStatus("error");
      setErrorMsg("Message could not be sent. Please try again shortly.");
    }
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className="letter-form">
      {/* Honeypot field (hidden) */}
      <input
        type="text"
        name="company"
        className="hp"
        tabIndex="-1"
        autoComplete="off"
      />

      {/* FROM (sender email) */}
      <label className="lf-label">FROM</label>
      <input
        type="email"
        name="email"
        placeholder="Write your e-mail"
        required
        className="lf-input"
      />

      {/* TO (fixed display) */}
      <div className="lf-to">TO: luisapinho2005@gmail.com</div>

      {/* Greeting (static display) */}
      <p className="lf-greeting">
        Dear Luísa Pinho, I’m writing you this letter because:
      </p>

      {/* SUBJECT */}
      <input
        type="text"
        name="title"
        placeholder="Subject of the letter"
        required
        className="lf-input"
      />

      {/* MESSAGE */}
      <textarea
        name="message"
        placeholder="How can I help you?"
        rows="6"
        required
        className="lf-textarea"
      />

      {/* from_name for EmailJS template */}
      <input type="hidden" name="from_name" value="Website Visitor" />

      <div className="lf-footer">
        <span className="lf-best">Best Regards, XXX</span>
        <button
          type="submit"
          disabled={status === "sending"}
          className="lf-send"
        >
          {status === "sending" ? "Sending…" : "SEND LETTER"}
        </button>
      </div>

      {status === "success" && (
        <p className="lf-msg ok">✅ Message sent successfully.</p>
      )}
      {status === "error" && <p className="lf-msg err">⚠️ {errorMsg}</p>}
    </form>
  );
}
