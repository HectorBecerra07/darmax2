import React, { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarPlus, Loader2, Clock } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Form
  const [topic, setTopic] = useState("Reunión Zoom");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); // Stores 'HH:MM' string
  const [duration, setDuration] = useState(30); // minutes
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState(""); // Added telefono state

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  const [bookedTimes, setBookedTimes] = useState([]); // State to store booked times for the selected date
  const [fetchingBookedTimes, setFetchingBookedTimes] = useState(false);

  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Helper to format date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch booked times when selectedDate changes
  useEffect(() => {
    const fetchBookedTimes = async () => {
      setFetchingBookedTimes(true);
      setError("");
      try {
        const formattedDate = formatDateToYYYYMMDD(selectedDate);
        const res = await fetch(`/api/zoom/meetings?date=${formattedDate}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || `Error fetching booked times: ${res.status}`);
        }

        // Convert fetched meeting start times to 'HH:MM' strings
        const times = data.map(meeting => {
          const date = new Date(meeting.startTime);
          return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        });
        setBookedTimes(times);
      } catch (e) {
        console.error("Error fetching booked times:", e);
        setError("Error al cargar horarios disponibles.");
      } finally {
        setFetchingBookedTimes(false);
      }
    };

    fetchBookedTimes();
  }, [selectedDate]);


  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
    setSelectedTimeSlot(""); // Reset selected time slot on date change
    setMeetingLink("");
    setError("");
  };

  const monthYearLabel = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" });
    return fmt.format(currentDate);
  }, [currentDate]);

  const selectedLabel = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return fmt.format(selectedDate);
  }, [selectedDate]);

  const buildStartISO = (timeSlot) => {
    const [hh, mm] = timeSlot.split(":").map((x) => parseInt(x, 10));
    const d = new Date(selectedDate);
    d.setHours(hh, mm, 0, 0);
    return d.toISOString().slice(0, -5); // YYYY-MM-DDTHH:mm:ss
  };

  const scheduleMeeting = async () => {
    setLoading(true);
    setError("");
    setMeetingLink("");

    if (!email || !nombre || !telefono || !selectedTimeSlot) {
      setError("Por favor, ingresa tu nombre, correo electrónico, teléfono y selecciona un horario.");
      setLoading(false);
      return;
    }

    try {
      const start_time = buildStartISO(selectedTimeSlot);

      const res = await fetch("/api/zoom/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          start_time,
          duration: Number(duration),
          email,
          nombre,
          telefono, // Send telefono to backend
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Error del servidor: ${res.status}`);
      }

      setMeetingLink(data.join_url);
      // Re-fetch booked times to update availability for the selected day
      // This ensures the scheduled slot disappears/is marked as occupied
      const formattedDate = formatDateToYYYYMMDD(selectedDate);
      const updatedRes = await fetch(`/api/zoom/meetings?date=${formattedDate}`);
      const updatedData = await updatedRes.json();
      const updatedTimes = updatedData.map(meeting => {
        const date = new Date(meeting.startTime);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      });
      setBookedTimes(updatedTimes);

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
    setSelectedTimeSlot(""); // Reset selected time slot
    setDuration(30);
    setEmail("");
    setNombre("");
    setTelefono(""); // Reset telefono
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between py-4 px-6">
      <button
        onClick={handlePrevMonth}
        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-slate-600" />
      </button>
      <h2 className="text-xl font-extrabold text-slate-800 capitalize">{monthYearLabel}</h2>
      <button
        onClick={handleNextMonth}
        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-slate-600" />
      </button>
    </div>
  );

  const renderDaysOfWeek = () => (
    <div className="grid grid-cols-7 gap-2 px-6">
      {daysOfWeek.map((day) => (
        <div
          key={day}
          className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider"
        >
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
              ${
                isSelected
                  ? "bg-[#168387] text-white shadow-lg shadow-[#168387]/40"
                  : "text-slate-700 hover:bg-[#24d4da]/10"
              }
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

  // Function to generate time slots (10:00 to 16:00)
  const generateTimeSlots = (intervalMinutes) => {
    const slots = [];
    const startHour = 10;
    const endHour = 16; // Up to 16:00
    
    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += intervalMinutes) {
        if (h === endHour && m > 0) continue; // Don't add 16:30 etc if duration is 30 mins

        const slotTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), h, m);
        
        // Only include slots if the selected date is not in the past
        if (selectedDate.setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) {
          continue; // Skip past days entirely
        }

        // For today, filter out past times
        if (selectedDate.toDateString() === new Date().toDateString()) {
          const now = new Date();
          const slotEndTime = new Date(slotTime.getTime() + intervalMinutes * 60 * 1000);
          if (slotEndTime <= now) {
            continue; // Skip if slot has already passed
          }
        }
        
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const availableTimeSlots = useMemo(() => {
    const allSlots = generateTimeSlots(duration);
    return allSlots.filter(slot => !bookedTimes.includes(slot));
  }, [selectedDate, duration, bookedTimes]);


  return (
    <section className="w-full bg-white">
      {/* Contenedor que centra TODO */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex justify-center">
        {/* Tarjeta */}
        <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* IZQUIERDA: CALENDARIO (CENTRADO) */}
            <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200 flex justify-center">
              <div className="w-full max-w-sm">
                {renderHeader()}
                {renderDaysOfWeek()}
                {renderCells()}
              </div>
            </div>

            {/* DERECHA: FORM */}
            <div className="md:w-1/2 p-6">
              <div className="rounded-2xl border border-slate-200 p-4">
                {meetingLink ? (
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">¡Reunión creada!</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Tu reunión ha sido agendada y se ha enviado un correo de confirmación a <b>{email}</b> con los detalles y el enlace para unirte.
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      También puedes unirte directamente desde aquí:
                    </p>
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
                          Duración
                        </label>
                        <select
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da]/40"
                        >
                          {[15, 30, 45, 60].map((m) => ( // Added 60 min option
                            <option key={m} value={m}>
                              {m} min
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-3">
                      Horarios Disponibles
                      {fetchingBookedTimes && (
                          <Loader2 className="w-4 h-4 inline-block ml-2 animate-spin text-slate-500" />
                      )}
                    </label>
                    <div className="mt-1 grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                      {availableTimeSlots.length > 0 ? (
                        availableTimeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`
                              px-3 py-2 rounded-xl text-sm font-medium transition-colors
                              ${selectedTimeSlot === slot ? "bg-[#24d4da] text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}
                            `}
                          >
                            {slot}
                          </button>
                        ))
                      ) : (
                        <p className="col-span-3 text-sm text-slate-500 text-center py-2">No hay horarios disponibles para este día.</p>
                      )}
                    </div>
                    {selectedTimeSlot && (
                      <p className="text-sm font-semibold text-slate-700 mt-2 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Horario seleccionado: {selectedTimeSlot}
                      </p>
                    )}


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

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-3">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#24d4da]/40"
                      placeholder="Ej: 5512345678"
                    />

                    {error ? (
                      <div className="mt-3 text-sm text-red-600 break-words">
                        <b>Error:</b> {error}
                      </div>
                    ) : null}

                    <button
                      onClick={scheduleMeeting}
                      disabled={loading || !selectedTimeSlot}
                      className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-[#168387] text-white font-bold py-3 hover:opacity-95 disabled:opacity-60"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CalendarPlus className="w-5 h-5" />
                      )}
                      {loading ? "Creando..." : "Agendar Reunión"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calendar;
