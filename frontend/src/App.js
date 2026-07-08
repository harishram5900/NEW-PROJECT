import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(14,19,32,0.95)",
            border: "1px solid rgba(0,255,135,0.35)",
            color: "#fff",
            backdropFilter: "blur(12px)",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
