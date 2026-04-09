import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import QueueSidebar from "./components/QueueSidebar";
import PatientEMR from "./components/PatientEMR";
import DoctorNotes from "./components/DoctorNotes";

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

interface Notification {
  id: number;
  message: string;
}

const API_BASE = "/api";
let socket: Socket;

export default function App() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedEncounter, setSelectedEncounter] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [doctorName, setDoctorName] = useState("Dr Rao");

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/queue`);
      const data = await res.json();
      setQueue(data.queue || []);
    } catch (err) {
      console.error("Failed to fetch queue:", err);
    }
  }, []);

  useEffect(() => {
    fetchQueue();

    socket = io(window.location.origin, { path: "/socket.io" });
    socket.emit("join-doctor-room", doctorName);

    socket.on("queue-update", (data: any) => {
      const notif: Notification = {
        id: Date.now(),
        message: `New ${data.type}: Token #${data.queueToken || "N/A"}`,
      };
      setNotifications((prev) => [...prev, notif]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      }, 5000);
      fetchQueue();
    });

    return () => {
      socket?.disconnect();
    };
  }, [doctorName, fetchQueue]);

  async function updateStatus(queueId: number, status: string) {
    await fetch(`${API_BASE}/queue/${queueId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchQueue();
  }

  function handleSelectPatient(entry: QueueEntry) {
    setSelectedPatient(entry.patient_fhir_id);
    setSelectedEncounter(entry.encounter_fhir_id);
  }

  return (
    <div className="app">
      <QueueSidebar
        queue={queue}
        selectedPatient={selectedPatient}
        onSelect={handleSelectPatient}
        onUpdateStatus={updateStatus}
        doctorName={doctorName}
        onDoctorNameChange={setDoctorName}
      />

      <div className="main">
        {selectedPatient ? (
          <>
            <PatientEMR patientId={selectedPatient} />
            <DoctorNotes
              patientId={selectedPatient}
              encounterId={selectedEncounter}
              doctorName={doctorName}
              onSaved={fetchQueue}
            />
          </>
        ) : (
          <div className="empty-state">
            Select a patient from the queue to view their EMR
          </div>
        )}
      </div>

      {notifications.map((n) => (
        <div key={n.id} className="notification">{n.message}</div>
      ))}
    </div>
  );
}
