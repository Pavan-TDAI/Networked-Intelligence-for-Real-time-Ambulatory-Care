interface Props {
  result: {
    success: boolean;
    inputType: string;
    resourcesCreated: string[];
    patientId?: string;
    encounterId?: string;
    queueToken?: number;
    errors?: string[];
  };
}

export default function ResultDisplay({ result }: Props) {
  if (!result.success) {
    return (
      <div className="result error">
        <strong>❌ Error</strong>
        <p>{result.errors?.join(", ") || "Something went wrong"}</p>
      </div>
    );
  }

  return (
    <div className="result success">
      <strong>✅ Successfully processed ({result.inputType})</strong>

      {result.queueToken && (
        <div className="token-display">
          Token #{result.queueToken}
        </div>
      )}

      {result.patientId && <p><strong>Patient ID:</strong> {result.patientId}</p>}
      {result.encounterId && <p><strong>Encounter ID:</strong> {result.encounterId}</p>}

      {result.resourcesCreated.length > 0 && (
        <>
          <p style={{ marginTop: 12 }}><strong>FHIR Resources Created:</strong></p>
          <ul className="resource-list">
            {result.resourcesCreated.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
