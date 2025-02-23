import React, { useState } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderHeader = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return (
      <div className="flex justify-between items-center p-4">
        <button onClick={handlePrevMonth} className="text-[#8b5e34] hover:text-[#DFD2BC] transition duration-200">
          &#9664; Prev
        </button>
        <h2 className="font-semibold text-[#8b5e34]">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <button onClick={handleNextMonth} className="text-[#8b5e34] hover:text-[#DFD2BC] transition duration-200">
          Next &#9654;
        </button>
      </div>
    );
  };

  const renderDays = () => {
    return (
      <div className="grid grid-cols-7 text-center text-[#8b5e34]">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-semibold text-md">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const startDay = monthStart.getDay();
    const totalDays = monthEnd.getDate();

    const cells = [];
    
    // Empty cells before the first day of the month
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="text-transparent">.</div>);
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      cells.push(
        <div key={day} className="h-10 w-10 flex items-center justify-center hover:bg-[#DFD2BC]/40 transition duration-200 rounded-lg cursor-pointer text-lg border border-transparent hover:border-[#8b5e34]">
          {day}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2"> {/* Adjusted gap for spacing */}
        {cells}
      </div>
    );
  };

  return (
    <div className="h-full bg-gradient-to-br from-[#DFD2BC]/30 to-[#8b5e34]/20 p-4 rounded-xl border border-[#DFD2BC]/60 shadow-md">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
