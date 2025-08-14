import LetterForm from "./LetterForm.js";
import DecorateLetter from "./DecorateLetter.js";  
import "./ContactMeSection.css";
import "./DecorateLetter.css";                   

export default function ContactMeSection() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-title">WRITE TO ME</div>

      {/* Carta com formulário por cima */}
      <div className="letter-wrapper">
        <img
          src="/assets/letter/open-letter.jpg"
          alt="Envelope e cartão onde o formulário será sobreposto"
          className="letter-image"
        />
        <div className="letter-overlay">
          <LetterForm />
        </div>
      </div>

      {/* Mini-game de decoração — fica logo abaixo do formulário */}
      <div className="decorate-below">
        <DecorateLetter />
      </div>
    </section>
  );
}
