import { useState } from "react";

interface Props {
  onSubmit: (data: any) => void;
  loading: boolean;
}

export default function BookingForm({ onSubmit, loading }: Props) {
  const [phone, setPhone] = useState("");
  const [patientName, setPatientName] = useState("");
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ phone, patientName: patientName || undefined, time, doctor });
  }

  return (
    <div className="card">
      <h2>📅 Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient Name</label>
          <input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter your name" />
        </div>
        <div className="form-group">
          <label>Phone Number *</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" required />
        </div>
        <div className="form-group">
          <label>Preferred Time *</label>
          <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="10:00 AM" required />
        </div>
        <div className="form-group">
          <label>Doctor *</label>
          <input value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="Dr. Rao" required />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}
