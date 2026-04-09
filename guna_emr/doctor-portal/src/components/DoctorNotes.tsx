import { useState } from "react";

interface Props {
  patientId: string;
  encounterId: string | null;
  doctorName: string;
  onSaved: () => void;
}

export default function DoctorNotes({ patientId, encounterId, doctorName, onSaved }: Props) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit() {
    if (!notes.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/convert/doctor-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: notes,
          patientId,
          encounterId,
          doctorName,
        }),
      });
      const json = await res.json();
      setResult(json);
      if (json.success) {
        setNotes("");
        onSaved();
      }
    } catch (err: any) {
      setResult({ success: false, errors: [err.message] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>✍️ Add Doctor Notes</h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 12 }}>
        Write notes freely — diagnoses, exam findings, and prescriptions will be auto-extracted into FHIR.
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Example: Exam normal, Dx viral URTI, Rx paracetamol 500mg TDS x 5 days"
        rows={4}
      />
      <div className="actions">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !notes.trim()}>
          {loading ? "Processing..." : "Save & Convert to FHIR"}
        </button>
      </div>

      {result && (
        <div style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 8,
          background: result.success ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${result.success ? "#bbf7d0" : "#fecaca"}`,
          fontSize: "0.85rem",
        }}>
          {result.success ? (
            <>
              <strong>✅ Notes saved!</strong> Created: {result.resourcesCreated?.join(", ")}
            </>
          ) : (
            <>
              <strong>❌ Error:</strong> {result.errors?.join(", ")}
            </>
          )}
        </div>
      )}
    </div>
  );
}
