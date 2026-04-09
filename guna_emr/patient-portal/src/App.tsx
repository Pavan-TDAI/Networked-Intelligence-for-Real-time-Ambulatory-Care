import { useState } from "react";
import BookingForm from "./components/BookingForm";
import SymptomChat from "./components/SymptomChat";
import VitalsForm from "./components/VitalsForm";
import ResultDisplay from "./components/ResultDisplay";

type Tab = "booking" | "symptoms" | "vitals";

interface ConvertResult {
  success: boolean;
  inputType: string;
  resourcesCreated: string[];
  patientId?: string;
  encounterId?: string;
  queueToken?: number;
  errors?: string[];
}

const API_BASE = "/api/convert";

export default function App() {
  const [tab, setTab] = useState<Tab>("booking");
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitData(endpoint: string, data: any) {
    setLoading(true);
    setResult(null);
    try {
      const isText = typeof data === "string";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": isText ? "text/plain" : "application/json",
        },
        body: isText ? data : JSON.stringify(data),
      });
      const json = await res.json();
      setResult(json);
    } catch (err: any) {
      setResult({ success: false, inputType: "error", resourcesCreated: [], errors: [err.message] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>🏥 NIRA EMR</h1>
      <p className="subtitle">Patient Portal — Book, Report Symptoms, Submit Vitals</p>

      <div className="tabs">
        <button className={`tab ${tab === "booking" ? "active" : ""}`} onClick={() => setTab("booking")}>
          📅 Book Appointment
        </button>
        <button className={`tab ${tab === "symptoms" ? "active" : ""}`} onClick={() => setTab("symptoms")}>
          🩺 Symptom Interview
        </button>
        <button className={`tab ${tab === "vitals" ? "active" : ""}`} onClick={() => setTab("vitals")}>
          ❤️ Vitals
        </button>
      </div>

      {tab === "booking" && (
        <BookingForm onSubmit={(data) => submitData("/booking", data)} loading={loading} />
      )}
      {tab === "symptoms" && (
        <SymptomChat onSubmit={(data) => submitData("/symptoms", data)} loading={loading} />
      )}
      {tab === "vitals" && (
        <VitalsForm onSubmit={(data) => submitData("/vitals", data)} loading={loading} />
      )}

      {result && <ResultDisplay result={result} />}
    </div>
  );
}
