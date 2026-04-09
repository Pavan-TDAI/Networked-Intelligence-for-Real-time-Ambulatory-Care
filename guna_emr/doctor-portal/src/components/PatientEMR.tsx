import { useState, useEffect } from "react";

interface Props {
  patientId: string;
}

export default function PatientEMR({ patientId }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/fhir/patient/${patientId}/everything`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId]);

  if (loading) return <div className="card">Loading EMR...</div>;
  if (!data) return null;

  const observations = data.observations?.entry?.map((e: any) => e.resource) || [];
  const conditions = data.conditions?.entry?.map((e: any) => e.resource) || [];
  const compositions = data.compositions?.entry?.map((e: any) => e.resource) || [];
  const medications = data.medications?.entry?.map((e: any) => e.resource) || [];

  // Extract vitals from observations
  const vitals = observations.filter((o: any) =>
    o.category?.some((c: any) => c.coding?.some((cd: any) => cd.code === "vital-signs"))
  );

  return (
    <div>
      <h2>📋 Patient EMR — {patientId}</h2>

      {/* Vitals */}
      {vitals.length > 0 && (
        <div className="card">
          <h3>Vitals</h3>
          <div className="section-grid">
            {vitals.map((v: any, i: number) => {
              let display = "";
              if (v.component) {
                display = v.component
                  .map((c: any) => `${c.valueQuantity?.value} ${c.valueQuantity?.unit || ""}`)
                  .join(" / ");
              } else if (v.valueQuantity) {
                display = `${v.valueQuantity.value} ${v.valueQuantity.unit || ""}`;
              }
              return (
                <div key={i} className="vital-card">
                  <div className="value">{display}</div>
                  <div className="label">{v.code?.text || "Vital"}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Clinical Notes */}
      {compositions.length > 0 && (
        <div className="card">
          <h3>Clinical Notes</h3>
          {compositions.map((comp: any, i: number) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <strong>{comp.title}</strong>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginLeft: 8 }}>
                by {comp.author?.[0]?.display} — {new Date(comp.date).toLocaleString()}
              </span>
              {comp.section?.map((s: any, j: number) => (
                <div key={j} style={{ marginTop: 4 }}>
                  <em>{s.title}:</em>{" "}
                  <span dangerouslySetInnerHTML={{ __html: s.text?.div?.replace(/<[^>]*>/g, "") || "" }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Conditions/Diagnoses */}
      {conditions.length > 0 && (
        <div className="card">
          <h3>Diagnoses</h3>
          {conditions.map((c: any, i: number) => (
            <div key={i} style={{ padding: "4px 0" }}>
              <strong>{c.code?.text}</strong>
              {c.code?.coding?.[0]?.code && (
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginLeft: 8 }}>
                  ({c.code.coding[0].system === "http://hl7.org/fhir/sid/icd-10" ? "ICD-10" : ""}: {c.code.coding[0].code})
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Medications */}
      {medications.length > 0 && (
        <div className="card">
          <h3>Medications</h3>
          {medications.map((m: any, i: number) => (
            <div key={i} style={{ padding: "4px 0" }}>
              <strong>{m.medicationCodeableConcept?.text}</strong>
              {m.dosageInstruction?.[0]?.text && (
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginLeft: 8 }}>
                  — {m.dosageInstruction[0].text}
                </span>
              )}
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginLeft: 8 }}>
                (by {m.requester?.display})
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Raw FHIR data */}
      <details className="fhir-section">
        <summary>View Raw FHIR Data</summary>
        <pre className="fhir-json">{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  );
}
