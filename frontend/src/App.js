import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "./pages/Landing";
import ErrorBoundary from "./components/ErrorBoundary";
import ConsoleShell from "./pages/console/ConsoleShell";
import Dashboard from "./pages/console/Dashboard";
import Meetings from "./pages/console/Meetings";
import LiveMeeting from "./pages/console/LiveMeeting";
import Integrations from "./pages/console/Integrations";
import ThreatLog from "./pages/console/ThreatLog";
import Fingerprints from "./pages/console/Fingerprints";
import Settings from "./pages/console/Settings";

function App() {
  return (
    <ErrorBoundary>
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
          <Route path="/console" element={<ConsoleShell />}>
            <Route index element={<Dashboard />} />
            <Route path="meetings" element={<Meetings />} />
            <Route path="meetings/:id" element={<LiveMeeting />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="threats" element={<ThreatLog />} />
            <Route path="fingerprints" element={<Fingerprints />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
