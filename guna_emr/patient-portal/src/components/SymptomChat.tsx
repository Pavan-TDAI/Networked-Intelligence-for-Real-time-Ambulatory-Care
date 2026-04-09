import { useState } from "react";

interface Props {
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function SymptomChat({ onSubmit, loading }: Props) {
  const [text, setText] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ text, patientPhone: phone || undefined });
  }

  return (
    <div className="card">
      <h2>🩺 Describe Your Symptoms</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: "0.9rem" }}>
        Tell us what you're feeling. Include any vitals you know (BP, temperature, etc.)
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Phone Number (to link your record)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" />
        </div>
        <div className="form-group">
          <label>Your Symptoms *</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: I have fever, cough for 3 days, BP 140/90, feeling very tired..."
            rows={6}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit Symptoms"}
        </button>
      </form>
    </div>
  );
}
