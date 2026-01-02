import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const renderHeader = () => {
    const monthYearFormat = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' });
    return (
      <div className="flex items-center justify-between py-4 px-6">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="text-xl font-extrabold text-slate-800 capitalize">
          {monthYearFormat.format(currentDate)}
        </h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronRight className="w-6 h-6 text-slate-600" />
        </button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    return (
      <div className="grid grid-cols-7 gap-2 px-6">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const cells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
      const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;

      cells.push(
        <div key={day} className="p-1">
          <button
            onClick={() => handleDateClick(day)}
            className={`
              w-12 h-12 flex items-center justify-center rounded-full text-md font-semibold transition-all duration-200
              ${isSelected ? 'bg-[#168387] text-white shadow-lg shadow-[#168387]/40' : 'text-slate-700 hover:bg-[#24d4da]/10'}
              ${isToday && !isSelected ? 'border-2 border-[#24d4da]' : ''}
              disabled:opacity-50 disabled:cursor-not-allowed
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
    </div>
  );
};

export default Calendar;
