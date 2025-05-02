import React, { useState } from 'react';
import moment from 'moment';
import Calendar from './components/Calendar/Calendar';

const typeViews = ['date', 'month', 'year'] as const;
const selectionModes = ['single', 'multiple', 'range'] as const;

const App = () => {
  const [value, setValue] = useState<moment.Moment | moment.Moment[] | null>(moment());
  const [typeView, setTypeView] = useState<typeof typeViews[number]>('date');
  const [selectionMode, setSelectionMode] = useState<typeof selectionModes[number]>('range');
  const [disableFutureDates, setDisableFutureDates] = useState(true);
  const [withClearFooter, setWithClearFooter] = useState(true);
  const [minDate, setMinDate] = useState<moment.Moment | undefined>(moment().subtract(1, 'month'));
  const [maxDate, setMaxDate] = useState<moment.Moment | undefined>(moment().add(1, 'month'));
  const [disabledDates, setDisabledDates] = useState<moment.Moment[]>([
    moment().add(1, 'day'),
    moment().add(2, 'days'),
  ]);

  return (
    <div style={{ padding: 40 }}>
      <h2>Calendar Test Page</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
        <div>
          <label>Type View: </label>
          <select value={typeView} onChange={(e) => {
            setTypeView(e.target.value as typeof typeViews[number]);
            setValue(null);
          }}>
            {typeViews.map((view) => (
              <option key={view} value={view}>{view}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Selection Mode: </label>
          <select value={selectionMode} onChange={(e) => {
            setSelectionMode(e.target.value as typeof selectionModes[number]);
            setValue(null);
          }}>
            {selectionModes.map((mode) => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>

        <div>
          <label>
            <input type="checkbox" checked={disableFutureDates} onChange={() => {
              setDisableFutureDates(!disableFutureDates);
              setValue(null);
            }} />
            Disable Future Dates
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" checked={withClearFooter} onChange={() => setWithClearFooter(!withClearFooter)} />
            Show Clear Footer
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Calendar
          value={value}
          onChange={setValue}
          typeView={typeView}
          selectionMode={selectionMode}
          disableFutureDates={disableFutureDates}
          withClearFooter={withClearFooter}
          // minDate={minDate}
          // maxDate={maxDate}
          disabledDates={disabledDates}
        />
        <div>
          {Array.isArray(value)
            ? value.map(v => v.format('YYYY/MM/DD')).join(', ')
            : value?.format('YYYY/MM/DD')}
        </div>
      </div>
    </div>
  );
};

export default App;
