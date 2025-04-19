import React, { useState } from 'react';
import moment from 'moment';
import Calendar from './components/Calendar/Calendar';

const App = () => {
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);

  return (
    <div style={{ padding: 40 }}>
      <h2>Custom Calendar Component</h2>
      <Calendar
        value={selectedDate}
        onChange={setSelectedDate}
        size="small"
        typeView="date"
        disableFutureDates={true}
      />

      {selectedDate && (
        <p style={{ marginTop: 20 }}>
          Selected: {selectedDate.format('YYYY/MM/DD')}
        </p>
      )}
    </div>
  );
};

export default App;
