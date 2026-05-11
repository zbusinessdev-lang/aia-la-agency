import { createFileRoute } from "@tanstack/react-router";
import aiaHtml from "../aia.html?raw";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <style>{`html,body{margin:0;padding:0;overflow-x:hidden;max-width:100%;width:100%}`}</style>
      <iframe
        title="AïA Villas"
        srcDoc={aiaHtml}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          border: "none",
          display: "block",
        }}
      />
    </>
  );
}
