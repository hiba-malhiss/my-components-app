import React, { useState } from 'react';
import moment from 'moment';
import Calendar from './components/Calendar/Calendar';

const typeViews = ['date', 'month', 'year'] as const;
const selectionModes = ['single', 'multiple', 'range'] as const;
const sizes = ['small', 'medium', 'large'] as const;

const App = () => {
  const [value, setValue] = useState<moment.Moment | moment.Moment[] | null>(null);
  const [typeView, setTypeView] = useState<typeof typeViews[number]>('date');
  const [selectionMode, setSelectionMode] = useState<typeof selectionModes[number]>('range');
  const [size, setSize] = useState<typeof sizes[number]>('small');
  const [disableFutureDates, setDisableFutureDates] = useState(true);

  const handleTypeViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeView(e.target.value as typeof typeViews[number]);
    setValue(null);
  };

  const handleSelectionModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectionMode(e.target.value as typeof selectionModes[number]);
    setValue(null);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(e.target.value as typeof sizes[number]);
  };

  const toggleDisableFutureDates = () => {
    setDisableFutureDates(!disableFutureDates);
    setValue(null);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Calendar Test Page</h2>

      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div>
          <label>Type View: </label>
          <select value={typeView} onChange={handleTypeViewChange}>
            {typeViews.map((view) => (
              <option key={view} value={view}>
                {view}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Selection Mode: </label>
          <select value={selectionMode} onChange={handleSelectionModeChange}>
            {selectionModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Size: </label>
          <select value={size} onChange={handleSizeChange}>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={disableFutureDates}
              onChange={toggleDisableFutureDates}
            />
            Disable Future Dates
          </label>
        </div>
      </div>
      {Array.isArray(value) ? value.map(v=>v.format('YYYY/MM/DD')).join(','): value?.format('YYYY/MM/DD')}
      <div></div>
      <Calendar
        value={value}
        onChange={setValue}
        typeView={typeView}
        selectionMode={selectionMode}
        size={size}
        disableFutureDates={disableFutureDates}
      />
    </div>
  );
};

export default App;
