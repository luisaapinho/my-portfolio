import { RoughNotation } from "react-rough-notation";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [text, setText] = useState("");
  const [showCircle, setShowCircle] = useState(false);

  const fullText = "UI/UX DESIGNER";

    useEffect(() => {
    let i = 0;
    let cancelled = false;

    const type = () => {
        if (cancelled) return;

        if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        i++;
        setTimeout(type, 120);
        } else {
        setShowCircle(true);
        }
    };

    type();
    return () => { cancelled = true; };
    }, []);


  return (
    <div style={styles.splashScreen}>
      <div style={styles.splashContent}>
        <h1 style={styles.splashName}>Luisa Pinho</h1>

        <div style={styles.splashRole}>
          {showCircle ? (
            <RoughNotation
              type="circle"
              show={true}
              animationDuration={2000}
              color="#AF431C"
              padding={8}            
              strokeWidth={3} 
              iterations={Infinity} 
            >
              <span>{text}</span>
            </RoughNotation>
          ) : (
            <span>{text}</span> 
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  splashScreen: {
    position: "fixed",
    inset: 0,
    background: "#494C3B",
    color: "#F1E9DC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    fontFamily: "'Satoshi', sans-serif",
  },
  splashContent: {
    textAlign: "center",
  },
  splashName: {
    fontSize: "6.5rem",
    marginBottom: "-2.2rem",
    fontFamily: "'Gambarino', serif",
    color: "#F1E9DC",
  },
  splashRole: {
    fontSize: "4rem",
    fontFamily: "'Satoshi Light', sans-serif",
    color: "#F1E9DC",
    minHeight: "4.5rem", 
  },
};
