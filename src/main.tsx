import React from "react";
import ReactDOM from "react-dom/client";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  console.log("Starting the mocking worker...");
  return worker.start();
}

enableMocking().then(async () => {
  const App = (await import("./App")).default;

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
