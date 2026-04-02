import React, { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarPlus, Loader2, Clock } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Form
  const [topic, setTopic] = useState("Reunión Zoom");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); 
  const [duration, setDuration] = useState(30); 
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState(""); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  const timeZone = "America/Mexico_City";
  const [bookedTimes, setBookedTimes] = useState([]); 
  const [fetchingBookedTimes, setFetchingBookedTimes] = useState(false);

  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchBookedTimes = async () => {
      setFetchingBookedTimes(true);
      setError("");
      try {
        const formattedDate = formatDateToYYYYMMDD(selectedDate);
        const res = await fetch(`/api/zoom/meetings?date=${formattedDate}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `Error fetching booked times: ${res.status}`);
        const times = data.map(meeting => {
          const date = new Date(meeting.startTime);
          return date.toLocaleTimeString('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' });
        });
        setBookedTimes(times);
      } catch (e) {
        console.error("Error fetching booked times:", e);
        setError("Error al cargar horarios.");
      } finally {
        setFetchingBookedTimes(false);
      }
    };
    fetchBookedTimes();
  }, [selectedDate]);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDateClick = (day) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newSelectedDate);
    setSelectedTimeSlot(""); 
    setMeetingLink("");
    setError("");
  };

  const monthYearLabel = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" });
    return fmt.format(currentDate);
  }, [currentDate]);

  const selectedLabel = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("es-MX", { weekday: "short", day: "numeric", month: "short" });
    return fmt.format(selectedDate);
  }, [selectedDate]);

  const scheduleMeeting = async () => {
    setLoading(true);
    setError("");
    if (!email || !nombre || !telefono || !selectedTimeSlot) {
      setError("Completa todos los campos.");
      setLoading(false);
      return;
    }
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const start_time_local = `${year}-${month}-${day}T${selectedTimeSlot}:00`;
      
      const res = await fetch("/api/zoom/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, start_time_local, timezone: timeZone, duration: Number(duration), email, nombre, telefono }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error: ${res.status}`);
      setMeetingLink(data.join_url);
    } catch (e) {
      setError(e?.message || "Error al crear cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 lg:items-start justify-center">
        
        {/* CALENDARIO COMPACTO */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="flex items-center justify-between py-2 mb-4 px-2">
            <button onClick={handlePrevMonth} className="p-1.5 rounded-full hover:bg-slate-100"><ChevronLeft className="w-5 h-5 text-slate-500" /></button>
            <h2 className="text-lg font-black text-slate-800 capitalize">{monthYearLabel}</h2>
            <button onClick={handleNextMonth} className="p-1.5 rounded-full hover:bg-slate-100"><ChevronRight className="w-5 h-5 text-slate-500" /></button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => <div key={day} className="text-center text-[9px] font-black text-slate-400 uppercase tracking-tighter">{day}</div>)}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {(() => {
              const month = currentDate.getMonth();
              const year = currentDate.getFullYear();
              const firstDay = new Date(year, month, 1).getDay();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const today = new Date();
              const cells = [];
              for (let i = 0; i < firstDay; i++) cells.push(<div key={`empty-${i}`} />);
              for (let day = 1; day <= daysInMonth; day++) {
                const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
                const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                cells.push(
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full text-sm font-bold transition-all ${isSelected ? "bg-[#168387] text-white shadow-md shadow-[#168387]/30" : "text-slate-600 hover:bg-[#24d4da]/10"} ${isToday && !isSelected ? "ring-2 ring-[#24d4da]" : ""}`}
                  >
                    {day}
                  </button>
                );
              }
              return cells;
            })()}
          </div>
        </div>

        {/* FORMULARIO COMPACTO */}
        <div className="flex-1 max-w-lg bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          {meetingLink ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">✓</div>
              <h3 className="text-xl font-black text-slate-900 mb-1">¡Cita Agendada!</h3>
              <p className="text-xs text-slate-500 mb-6">Detalles enviados a <b>{email}</b>.</p>
              <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="block w-full p-3.5 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg">Entrar a Zoom</a>
              <button onClick={() => setMeetingLink("")} className="mt-4 text-slate-400 font-bold text-xs hover:text-[#168387] uppercase tracking-widest">Agendar otra</button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <span className="text-[10px] font-black uppercase text-[#168387] tracking-widest">Fecha: {selectedLabel}</span>
                {fetchingBookedTimes && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
              </div>

              <div className="space-y-3">
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-widest px-1">Horarios Disponibles</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimeSlots.length > 0 ? availableTimeSlots.slice(0, 9).map(slot => (
                    <button key={slot} onClick={() => setSelectedTimeSlot(slot)} className={`py-2 rounded-xl text-xs font-black transition-all ${selectedTimeSlot === slot ? "bg-[#168387] text-white shadow-md" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}>{slot}</button>
                  )) : <p className="col-span-3 text-[10px] text-slate-400 text-center py-2 italic">Sin horarios para este día</p>}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-widest px-1">Información de contacto</label>
                <div className="grid grid-cols-1 gap-2.5">
                  <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre completo" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold focus:bg-white outline-none" />
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold focus:bg-white outline-none" />
                  <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold focus:bg-white outline-none" />
                </div>
              </div>

              {error && <p className="text-[10px] text-red-500 font-bold italic px-1">{error}</p>}

              <button onClick={scheduleMeeting} disabled={loading || !selectedTimeSlot} className="w-full bg-[#168387] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#168387]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-2">
                {loading ? "Confirmando..." : "Agendar Mi Sesión"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
