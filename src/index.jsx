import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

function Overlay() {
  return (
    <div style={{ pointerEvents: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
      <div style={{ position: "absolute", bottom: 40, left: 40, fontSize: "13px" }}>
        don't overthink it
        <br />
        hackathon
      </div>
      <div style={{ position: "absolute", top: 40, left: 40, fontSize: "13px" }}>ok —</div>
      <div style={{ position: "absolute", bottom: 40, right: 40, fontSize: "13px" }}>17/05/2024</div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <>
    <App />
    <Overlay />
  </>
);
