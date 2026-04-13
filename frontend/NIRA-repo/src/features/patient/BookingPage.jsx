import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarCheck2, CalendarClock, CheckCircle2, FileText, Star, UserCircle2 } from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader } from "../../components/ui/Card";
import { Field, Input, Select } from "../../components/ui/FormFields";
import { useDemoData } from "../../app/DemoDataProvider";
import { getBookableDoctors, getPatientWorkspace, getScheduleByDate } from "../shared/selectors";
import { formatDate, formatDayKey, formatTime } from "../../lib/format";
import { getDateRange } from "../../lib/schedule";
import { usePatientLanguage } from "./usePatientLanguage";

function getDoctorRating(doctorId) {
  if (!doctorId) {
    return "4.8";
  }
  const tail = doctorId.charCodeAt(doctorId.length - 1) % 3;
  return (4.7 + tail * 0.1).toFixed(1);
}

export function BookingPage() {
  const { state, session, actions } = useDemoData();
  const navigate = useNavigate();
  const { patient } = getPatientWorkspace(state);
  const [language] = usePatientLanguage(patient?.preferredLanguage || "en");
  const doctors = useMemo(() => getBookableDoctors(state), [state]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [visitType, setVisitType] = useState("booked");
  const [submitting, setSubmitting] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");

  const doctor = doctors.find((item) => item.id === selectedDoctorId) || null;
  const dateOptions = useMemo(() => getDateRange(state.meta.today, 14), [state.meta.today]);
  const schedules = useMemo(
    () =>
      doctor
        ? dateOptions.map((date) => ({
            date,
            schedule: getScheduleByDate(state, doctor.id, date)
          }))
        : [],
    [state, doctor, dateOptions]
  );
  const selectedSchedule = doctor ? getScheduleByDate(state, doctor.id, selectedDate) : null;
  const selectedSlot = selectedSchedule?.slots.find((slot) => slot.id === selectedSlotId) || null;
  const confirmationBundle = confirmationId ? state.appointments.byId[confirmationId] : null;

  useEffect(() => {
    if (!doctor) {
      setSelectedDate("");
      setSelectedSlotId("");
      return;
    }

    const nextWithAvailability = schedules.find((entry) => entry.schedule?.slotSummary.available > 0);
    setSelectedDate(nextWithAvailability?.date || state.meta.today);
    setSelectedSlotId("");
  }, [doctor?.id]);

  useEffect(() => {
    setSelectedSlotId("");
  }, [selectedDate, selectedSchedule?.id, selectedDoctorId]);

  async function handleBooking() {
    if (!selectedSlotId || !doctor) {
      return;
    }

    setSubmitting(true);
    const snapshot = await actions.booking.bookAppointment({
      patientId: patient.id,
      doctorId: doctor.id,
      slotId: selectedSlotId,
      date: selectedDate,
      bookedByUserId: session.userId,
      visitType,
      language
    });
    setConfirmationId(snapshot.ui.lastViewedAppointmentId);
    setSubmitting(false);
  }

  return (
    <AppShell
      title="Book by live doctor slots"
      subtitle="Doctor cards, live teal slots, and a one-tap confirmation flow."
    >
      <div className="space-y-4">
        <Card density="compact">
          <CardHeader
            eyebrow="Doctor list"
            title="Choose your doctor"
            description="Goal: 30-second booking"
          />
          {selectedDoctorId ? (
            <div className="mb-3 flex justify-end">
              <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedDoctorId("")}>
                Change doctor
              </Button>
            </div>
          ) : null}
          <div className={`grid gap-3 ${selectedDoctorId ? "" : "lg:grid-cols-2"}`}>
            {(selectedDoctorId ? doctors.filter((entry) => entry.id === selectedDoctorId) : doctors).map((entry) => {
              const quickSlots = getDateRange(state.meta.today, 14)
                .map((date) => getScheduleByDate(state, entry.id, date))
                .flatMap((schedule) => (schedule?.slots || []).filter((slot) => slot.status === "available"))
                .slice(0, 3);
              const isSelected = selectedDoctorId === entry.id;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedDoctorId(entry.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-brand-sky bg-brand-mint p-5 shadow-soft ring-2 ring-brand-sky/30"
                      : "border-line bg-surface-2 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-white p-2 text-brand-tide shadow-sm">
                        <UserCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-ink">{entry.fullName}</div>
                        <div className="mt-1 text-sm text-muted">{entry.specialty || "General"}</div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink">
                      <Star className="h-3.5 w-3.5 text-amber-500" /> {getDoctorRating(entry.id)}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2" aria-hidden="true">
                    {quickSlots.length ? (
                      quickSlots.map((slot) => (
                        <span key={slot.id} className="rounded-full bg-brand-sky px-2.5 py-1 text-[11px] font-semibold text-white">
                          {formatTime(slot.startAt)}
                        </span>
                      ))
                    ) : (
                      <Badge tone="warning">FULL</Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card density="compact">
          <CardHeader
            eyebrow="Pick date & slot"
            title="Live availability"
            description="Only available slots can be selected."
          />
          <div className="space-y-4">
            <div className="-mx-1 overflow-x-auto px-1 pb-1">
              <div className="inline-flex min-w-full gap-2 sm:flex sm:flex-wrap">
                {schedules.map(({ date, schedule }) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`whitespace-nowrap rounded-full border px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                      selectedDate === date
                        ? "border-brand-sky bg-brand-mint text-ink"
                        : "border-line bg-white text-muted hover:bg-surface-2"
                    }`}
                  >
                    {formatDayKey(date)} ({schedule?.slotSummary.available || 0})
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {(selectedSchedule?.slots || []).map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  disabled={slot.status !== "available"}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`rounded-xl border px-2.5 py-2.5 text-xs font-semibold transition sm:px-3 sm:text-sm ${
                    selectedSlotId === slot.id
                      ? "border-brand-sky bg-brand-sky text-white"
                      : slot.status === "available"
                        ? "border-cyan-200 bg-cyan-50 text-ink hover:-translate-y-0.5"
                        : "border-line bg-surface-2 text-muted"
                  } disabled:cursor-not-allowed disabled:opacity-80`}
                >
                  {formatTime(slot.startAt)} - {formatTime(slot.endAt)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <Card density="compact">
            <CardHeader
              eyebrow="Summary"
              title={doctor && selectedSlot ? `${doctor.fullName} - ${formatTime(selectedSlot.startAt)}` : "Select doctor and slot"}
              description="Minimal patient form, prefilled from profile."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name">
                <Input value={patient?.fullName || ""} readOnly />
              </Field>
              <Field label="Phone">
                <Input value={patient?.phone || ""} readOnly />
              </Field>
              <Field label="Visit type">
                <Select value={visitType} onChange={(event) => setVisitType(event.target.value)}>
                  <option value="booked">Booked</option>
                  <option value="walk_in">Walk-in</option>
                </Select>
              </Field>
              <div className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
                {doctor ? (
                  <>
                    {doctor.fullName} · {selectedDate ? formatDate(`${selectedDate}T00:00:00+05:30`) : "Select date"}
                    {selectedSlot ? ` · ${formatTime(selectedSlot.startAt)}` : ""}
                  </>
                ) : (
                  "Choose a doctor and slot to continue."
                )}
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Button onClick={handleBooking} disabled={!selectedSlotId || submitting} className="w-full sm:min-w-[220px]">
              <CalendarCheck2 className="h-4 w-4" />
              {submitting ? "Creating appointment..." : "Confirm slot"}
            </Button>
            <Button asChild variant="secondary" className="w-full sm:min-w-[220px]">
              <Link to="/patient/appointments">
                <CalendarClock className="h-4 w-4" />
                View appointments
              </Link>
            </Button>
          </div>
        </div>

        {confirmationBundle ? (
          <Card density="compact" className="border-emerald-200 bg-emerald-50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white p-2 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-base font-semibold text-emerald-900">Appointment created</div>
                  <div className="text-sm text-emerald-800">
                    Token {confirmationBundle.token} confirmed for {formatDate(confirmationBundle.startAt)} at {formatTime(confirmationBundle.startAt)}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link to={`/patient/appointments/${confirmationBundle.id}?bucket=action`}>
                    <FileText className="h-4 w-4" />
                    Open appointment
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}
