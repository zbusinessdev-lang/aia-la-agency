import { createFileRoute } from "@tanstack/react-router";
import aiaHtml from "../aia.html?raw";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <iframe
      title="AïA Villas"
      srcDoc={aiaHtml}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: "none" }}
    />
  );
}
