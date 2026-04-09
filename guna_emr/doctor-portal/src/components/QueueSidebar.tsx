interface QueueEntry {
  id: number;
  patient_fhir_id: string;
  encounter_fhir_id: string | null;
  doctor_name: string | null;
  status: string;
  priority: number;
  token_number: number | null;
  check_in_time: string;
  notes: string | null;
}

interface Props {
  queue: QueueEntry[];
  selectedPatient: string | null;
  onSelect: (entry: QueueEntry) => void;
  onUpdateStatus: (queueId: number, status: string) => void;
  doctorName: string;
  onDoctorNameChange: (name: string) => void;
}

export default function QueueSidebar({
  queue, selectedPatient, onSelect, onUpdateStatus, doctorName, onDoctorNameChange,
}: Props) {
  const waiting = queue.filter((q) => q.status === "waiting");
  const inProgress = queue.filter((q) => q.status === "in-progress");

  return (
    <div className="sidebar">
      <h1>🩺 Doctor Portal</h1>
      <p className="subtitle">NIRA EMR — OPD Queue</p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Doctor Name</label>
        <input
          value={doctorName}
          onChange={(e) => onDoctorNameChange(e.target.value)}
          style={{
            width: "100%", padding: "6px 10px", border: "1px solid var(--border)",
            borderRadius: 6, fontSize: "0.9rem", marginTop: 4,
          }}
        />
      </div>

      {inProgress.length > 0 && (
        <>
          <h3>🔵 In Progress ({inProgress.length})</h3>
          {inProgress.map((entry) => (
            <div
              key={entry.id}
              className={`queue-item ${selectedPatient === entry.patient_fhir_id ? "active" : ""}`}
              onClick={() => onSelect(entry)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="token">#{entry.token_number}</span>
                <span className="badge in-progress">In Progress</span>
              </div>
              <div className="meta">Patient: {entry.patient_fhir_id}</div>
              {entry.notes && <div className="meta">{entry.notes}</div>}
              <div className="actions">
                <button className="btn btn-success" onClick={(e) => { e.stopPropagation(); onUpdateStatus(entry.id, "completed"); }}>
                  ✓ Complete
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <h3>⏳ Waiting ({waiting.length})</h3>
      {waiting.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No patients waiting</p>}
      {waiting.map((entry) => (
        <div
          key={entry.id}
          className={`queue-item ${selectedPatient === entry.patient_fhir_id ? "active" : ""}`}
          onClick={() => onSelect(entry)}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="token">#{entry.token_number}</span>
            <span className="badge waiting">Waiting</span>
          </div>
          <div className="meta">Patient: {entry.patient_fhir_id}</div>
          {entry.doctor_name && <div className="meta">Doctor: {entry.doctor_name}</div>}
          {entry.notes && <div className="meta">{entry.notes}</div>}
          <div className="actions">
            <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); onUpdateStatus(entry.id, "in-progress"); }}>
              Call Patient
            </button>
            <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); onUpdateStatus(entry.id, "cancelled"); }}>
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
