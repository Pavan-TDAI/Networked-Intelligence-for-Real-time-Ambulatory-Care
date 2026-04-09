import { useState } from "react";

interface Props {
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function VitalsForm({ onSubmit, loading }: Props) {
  const [patientId, setPatientId] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [spo2, setSpo2] = useState("");
  const [weight, setWeight] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data: any = { patientId };
    if (systolic) data.systolic = parseInt(systolic);
    if (diastolic) data.diastolic = parseInt(diastolic);
    if (heartRate) data.heartRate = parseInt(heartRate);
    if (temperature) data.temperature = parseFloat(temperature);
    if (spo2) data.spo2 = parseInt(spo2);
    if (weight) data.weight = parseFloat(weight);
    onSubmit(data);
  }

  return (
    <div className="card">
      <h2>❤️ Record Vitals</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient ID *</label>
          <input value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="FHIR Patient ID" required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-group">
            <label>Systolic BP</label>
            <input type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)} placeholder="120" />
          </div>
          <div className="form-group">
            <label>Diastolic BP</label>
            <input type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} placeholder="80" />
          </div>
          <div className="form-group">
            <label>Heart Rate (bpm)</label>
            <input type="number" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} placeholder="72" />
          </div>
          <div className="form-group">
            <label>Temperature (°F)</label>
            <input type="number" step="0.1" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="98.6" />
          </div>
          <div className="form-group">
            <label>SpO2 (%)</label>
            <input type="number" value={spo2} onChange={(e) => setSpo2(e.target.value)} placeholder="98" />
          </div>
          <div className="form-group">
            <label>Weight (kg)</label>
            <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Vitals"}
        </button>
      </form>
    </div>
  );
}
