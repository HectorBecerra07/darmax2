import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarPlus, Loader2, Clock, Target, Timer } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Form
  const [topic, setTopic] = useState("Demo Virtual");
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
        
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text || 'Respuesta no válida del servidor'}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("El servidor no devolvió un JSON válido. Verifica que el backend esté corriendo.");
        }

        const data = await res.json();
        const times = data.map(meeting => {
          const date = new Date(meeting.startTime);
          return date.toLocaleTimeString('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' });
        });
        setBookedTimes(times);
      } catch (e) {
        console.error("Error fetching booked times:", e);
        setError("No se pudieron cargar los horarios. Asegúrate de que el servidor esté activo.");
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

  const availableTimeSlots = useMemo(() => {
    const slots = [];
    const startHour = 10;
    const endHour = 16;
    const now = new Date(new Date().toLocaleString('en-US', { timeZone }));
    const selected = new Date(selectedDate.toLocaleString('en-US', { timeZone }));
    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += duration) {
        if (h === endHour && m > 0) continue;
        const slotDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), h, m);
        if (slotDate < now) continue;
        const slotStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        if (!bookedTimes.includes(slotStr)) slots.push(slotStr);
      }
    }
    return slots;
  }, [selectedDate, duration, bookedTimes]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-stretch justify-center">
        
        {/* CALENDARIO PREMIUM */}
        <div className="w-full lg:w-[420px] bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <button onClick={handlePrevMonth} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-black text-slate-900 capitalize tracking-tight">{monthYearLabel}</h2>
              <button onClick={handleNextMonth} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-[10px] font-black text-[#168387] uppercase tracking-widest opacity-40">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {(() => {
                const month = currentDate.getMonth();
                const year = currentDate.getFullYear();
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const today = new Date();
                const cells = [];
                for (let i = 0; i < firstDay; i++) cells.push(<div key={`empty-${i}`} className="w-12 h-12" />);
                for (let day = 1; day <= daysInMonth; day++) {
                  const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
                  const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                  cells.push(
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl text-sm font-black transition-all relative group ${
                        isSelected 
                          ? "bg-gradient-to-br from-[#24d4da] to-[#168387] text-white shadow-lg shadow-[#24d4da]/40 scale-110" 
                          : "text-slate-700 hover:bg-cyan-50 hover:text-[#168387]"
                      }`}
                    >
                      {day}
                      {isToday && !isSelected && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#24d4da]" />
                      )}
                    </button>
                  );
                }
                return cells;
              })()}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-[#168387]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zona Horaria</p>
              <p className="text-xs font-bold text-slate-700">CDMX, México (GMT-6)</p>
            </div>
          </div>
        </div>

        {/* FORMULARIO PREMIUM */}
        <div className="w-full lg:max-w-md bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
          {/* Decoración fondo formulario */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-50/30 rounded-full blur-3xl pointer-events-none" />

          {meetingLink ? (
            <div className="relative z-10 text-center py-6">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl shadow-green-500/20"
              >
                ✓
              </motion.div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">¡Todo listo!</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">Hemos reservado tu lugar.<br/>Recibirás los detalles en: <b>{email}</b></p>
              <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="block w-full p-4 bg-slate-950 text-white rounded-2xl font-black text-sm hover:bg-[#168387] transition-all shadow-xl">Entrar a Sesión Zoom</a>
              <button onClick={() => setMeetingLink("")} className="mt-6 text-slate-400 font-bold text-xs hover:text-[#168387] uppercase tracking-widest transition-colors">Agendar otra asesoría</button>
            </div>
          ) : (
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Fecha de Sesión</span>
                  <span className="text-lg font-black text-[#168387] uppercase tracking-tight">{selectedLabel}</span>
                </div>
                {fetchingBookedTimes && <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">
                    <Target className="w-3.5 h-3.5" /> Tipo de asesoría
                  </label>
                  <select 
                    value={topic} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setTopic(val);
                      if (val.includes("Estrategia")) setDuration(45);
                      else if (val.includes("Consulta")) setDuration(15);
                      else setDuration(30);
                    }} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-cyan-100 outline-none appearance-none cursor-pointer transition-all"
                  >
                    <option value="Demo Virtual">🎥 Demo Virtual: Ver equipo en vivo</option>
                    <option value="Sesión Estrategia">📊 Sesión Estrategia: Mi Plan de Negocio</option>
                    <option value="Consulta Rápida">☕ Consulta Rápida: Resolver dudas</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">
                    <span className="flex items-center gap-2"><Timer className="w-3.5 h-3.5" /> Duración estimada</span>
                    <span className="text-[#168387] font-black bg-cyan-50 px-2 py-1 rounded-lg">{duration} min</span>
                  </label>
                  <div className="flex gap-2">
                    {[15, 30, 45, 60].map(m => (
                      <button 
                        key={m} 
                        onClick={() => setDuration(m)}
                        className={`flex-1 py-3 rounded-xl text-[11px] font-black transition-all ${duration === m ? "bg-[#168387] text-white shadow-lg shadow-[#168387]/20" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Horarios Disponibles</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimeSlots.length > 0 ? availableTimeSlots.slice(0, 9).map(slot => (
                    <button key={slot} onClick={() => setSelectedTimeSlot(slot)} className={`py-3 rounded-xl text-xs font-black transition-all ${selectedTimeSlot === slot ? "bg-[#24d4da] text-slate-900 shadow-lg shadow-cyan-500/20 scale-105" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>{slot}</button>
                  )) : <p className="col-span-3 text-xs text-slate-400 text-center py-4 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">No hay horarios disponibles hoy</p>}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="relative group">
                  <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-cyan-100 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-cyan-100 outline-none transition-all" />
                  <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="WhatsApp" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-cyan-100 outline-none transition-all" />
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-500 font-bold italic px-2 bg-red-50 py-2 rounded-lg border border-red-100">
                  ⚠️ {error}
                </motion.p>
              )}

              <button 
                onClick={scheduleMeeting} 
                disabled={loading || !selectedTimeSlot} 
                className="w-full bg-slate-950 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:bg-[#168387] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "Procesando..." : "Agendar mi asesoría"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
