import React, { useState } from 'react';
import moment from 'moment';
import Calendar from './components/Calendar/Calendar';

const App = () => {
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [selectedYear, setSelectedYear] = useState<moment.Moment | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<moment.Moment | null>(null);

  return (
    <div style={{ padding: 40, display: 'flex', gap: '20px' }}>
      <h2>Custom Calendar Component</h2>
      <Calendar
        value={selectedDate}
        onChange={setSelectedDate}
        size="small"
        typeView="date"
        disableFutureDates={true}
      />
      <Calendar
        value={selectedYear}
        onChange={setSelectedYear}
        size="small"
        typeView="year"
        disableFutureDates={true}
      />
      <Calendar
        value={selectedMonth}
        onChange={setSelectedMonth}
        size="small"
        typeView="month"
        disableFutureDates={true}
      />

    </div>
  );
};

export default App;
