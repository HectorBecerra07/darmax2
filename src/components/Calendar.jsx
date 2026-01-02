import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarPlus, Loader2 } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Form
  const [topic, setTopic] = useState("Reunión Zoom");
  const [time, setTime] = useState("10:00"); // HH:MM
  const [duration, setDuration] = useState(30); // minutes
  const [timezone, setTimezone] = useState("America/Mexico_City");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setMeetingLink("");
    setError("");
  };

  const monthYearLabel = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" });
    return fmt.format(currentDate);
  }, [currentDate]);

  const selectedLabel = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    return fmt.format(selectedDate);
  }, [selectedDate]);

  const buildStartISO = () => {
    const [hh, mm] = time.split(":").map((x) => parseInt(x, 10));
    const d = new Date(selectedDate);
    d.setHours(hh, mm, 0, 0);
    // Zoom API espera un formato ISO 8601 en UTC, ej: "2024-01-01T10:00:00Z"
    // pero sin el 'Z' final para que lo interprete en la timezone de la cuenta.
    // .toISOString() lo da en UTC. Si tu backend lo requiere así, está bien.
    // Si el backend espera hora local y luego le añade la timezone, esto es correcto.
    return d.toISOString().slice(0, -5); // Formato YYYY-MM-DDTHH:mm:ss
  };

  const scheduleMeeting = async () => {
    setLoading(true);
    setError("");
    setMeetingLink("");

    if (!email || !nombre) {
      setError("Por favor, ingresa tu nombre y correo electrónico.");
      setLoading(false);
      return;
    }

    try {
      const start_time = buildStartISO();

      const res = await fetch("/api/zoom/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          start_time: start_time,
          duration: Number(duration),
          email,
          nombre,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Error del servidor: ${res.status}`);
      }

      setMeetingLink(data.join_url);
    } catch (e) {
      setError(e?.message || "Error creando la reunión");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMeetingLink("");
    setError("");
    setTopic("Reunión Zoom");
    setTime("10:00");
    setDuration(30);
    setEmail("");
    setNombre("");
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between py-4 px-6">
      <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
        <ChevronLeft className="w-6 h-6 text-slate-600" />
      </button>
      <h2 className="text-xl font-extrabold text-slate-800 capitalize">{monthYearLabel}</h2>
      <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
        <ChevronRight className="w-6 h-6 text-slate-600" />
      </button>
    </div>
  );

  const renderDaysOfWeek = () => (
    <div className="grid grid-cols-7 gap-2 px-6">
      {daysOfWeek.map((day) => (
        <div key={day} className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
          {day}
        </div>
      ))}
    </div>
  );

  const renderCells = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const cells = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

      const isSelected =
        selectedDate?.getDate() === day &&
        selectedDate?.getMonth() === month &&
        selectedDate?.getFullYear() === year;

      cells.push(
        <div key={day} className="p-1">
          <button
            onClick={() => handleDateClick(day)}
            className={`
              w-12 h-12 flex items-center justify-center rounded-full text-md font-semibold transition-all duration-200
              ${isSelected ? "bg-[#168387] text-white shadow-lg shadow-[#168387]/40" : "text-slate-700 hover:bg-[#24d4da]/10"}
              ${isToday && !isSelected ? "border-2 border-[#24d4da]" : ""}
            `}
          >
            {day}
          </button>
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-1 p-4">{cells}</div>;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 max-w-md mx-auto">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}

      {/* Panel para agendar */}
      <div className="px-6 pb-6">
        <div className="rounded-2xl border border-slate-200 p-4">
          {meetingLink ? (
            <div>
              <h3 className="text-lg font-bold text-slate-800">¡Reunión creada!</h3>
              <p className="text-sm text-slate-600 mt-1">Tu reunión ha sido agendada. Puedes unirte con el siguiente enlace:</p>
              <a
                href={meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full text-center p-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 break-words"
              >
                Unirse a la reunión
              </a>
              <button
                onClick={resetForm}
                className="mt-2 w-full text-center p-2 text-sm text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
              >
                Agendar otra reunión
              </button>
            </div>
          ) : (
            <>
              <div className="text-sm font-bold text-slate-700 mb-2">
                Seleccionado: <span className="font-semibold">{selectedLabel}</span>
              </div>

              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-3">
                Tema
              </label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da]/40"
                placeholder="Reunión Zoom"
              />

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Duración
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da]/40"
                  >
                    {[15, 30, 45, 60, 90, 120].map((m) => (
                      <option key={m} value={m}>
                        {m} min
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-3">
                Nombre
              </label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da]/40"
                placeholder="Tu nombre"
              />

              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-3">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da]/40"
                placeholder="tu@ejemplo.com"
              />

              {error ? (
                <div className="mt-3 text-sm text-red-600 break-words">
                  <b>Error:</b> {error}
                </div>
              ) : null}

              <button
                onClick={scheduleMeeting}
                disabled={loading}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-[#168387] text-white font-bold py-3 hover:opacity-95 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CalendarPlus className="w-5 h-5" />}
                {loading ? "Creando..." : "Agendar Reunión"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
