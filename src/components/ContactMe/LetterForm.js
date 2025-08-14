import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function LetterForm() {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [canSend, setCanSend] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCanSend(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    if (fd.get("company")) return; // honeypot

    const last = localStorage.getItem("lastSentTime");
    if (last && Date.now() - Number(last) < 60000) {
      setStatus("error");
      setErrorMsg("Por favor, aguarde 1 minuto antes de enviar novamente.");
      return;
    }
    if (!canSend) {
      setStatus("error");
      setErrorMsg("Aguarde alguns segundos antes de enviar.");
      return;
    }

    const email = String(fd.get("email") || "");
    const subject = String(fd.get("title") || "");
    const message = String(fd.get("message") || "");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Introduza um e-mail válido.");
      return;
    }
    if (!subject || !message) {
      setStatus("error");
      setErrorMsg("Preencha o assunto e a mensagem.");
      return;
    }

    try {
      setStatus("sending");
      emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );  
      setStatus("success");
      formRef.current.reset();
      localStorage.setItem("lastSentTime", Date.now().toString());
    } catch {
      setStatus("error");
      setErrorMsg("Não foi possível enviar. Tente novamente em instantes.");
    }
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className="letter-form">
      {/* honeypot */}
      <input type="text" name="company" className="hp" tabIndex="-1" autoComplete="off" />

      {/* FROM */}
      <label className="lf-label">FROM</label>
      <input type="email" name="email" placeholder="Write your e-mail" required className="lf-input" />

      {/* TO (display) */}
      <div className="lf-to">TO: luisapinho2005@gmail.com</div>

      {/* Greeting (display) */}
      <p className="lf-greeting">Dear Luísa Pinho, I’m writing you this letter because:</p>

      {/* SUBJECT */}
      <input type="text" name="title" placeholder="Subject of the letter" required className="lf-input" />

      {/* MESSAGE */}
      <textarea name="message" placeholder="How can i help you?" rows="6" required className="lf-textarea" />

      {/* from_name para o template */}
      <input type="hidden" name="from_name" value="Website Visitor" />

      <div className="lf-footer">
        <span className="lf-best">Best Regards, XXX</span>
        <button type="submit" disabled={status === "sending"} className="lf-send">
          {status === "sending" ? "A enviar…" : "SEND LETTER"}
        </button>
      </div>

      {status === "success" && <p className="lf-msg ok">✅ Mensagem enviada com sucesso.</p>}
      {status === "error" && <p className="lf-msg err">⚠️ {errorMsg}</p>}
    </form>
  );
}
