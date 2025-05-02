# 📅 Calendar Component

A flexible, interactive calendar component built with React and `moment.js`, supporting multiple views (date, month, year), selection modes (single/range/multiple), and constraints (min/max dates, disabling future dates).

---

## ✨ Features

* **Date, Month, and Year View Switching**
* **Single, Multiple or Range Date Selection**
* **Min/Max Date Constraints**
* **Disable Future Dates Option**
* **Custom Date Format**
* **Clear Selection Footer Option**
* **Floating Anchored Dropdown UI**
* **Fully Keyboard and Mouse Accessible**
* **Styled with SCSS Modules**

---

## 🚀 Installation

Ensure you have the following dependencies:

```bash
npm install react moment clsx @fortawesome/react-fontawesome
```

---

## 🔧 Usage

```tsx
import Calendar from './Calendar';
import moment from 'moment';

const MyComponent = () => {
  const [selectedDate, setSelectedDate] = useState(moment());

  return (
    <Calendar
      value={selectedDate}
      onChange={setSelectedDate}
      typeView="date"
      selectionMode="single"
    />
  );
};
```

---

## 📌 Props

| Prop                 | Type                                                                                            | Default        | Description                                                                  |
| -------------------- |-------------------------------------------------------------------------------------------------| -------------- | ---------------------------------------------------------------------------- |
| `value`              | `Moment , Moment[]`                                                                             | **Required**   | Currently selected date(s).                                                  |
| `onChange`           | `(value) => void`                                                                               | **Required**   | Callback when a date is selected.                                            |
| `typeView`           | `'date' , 'month' , 'year'`                                                                     | `'date'`       | Initial calendar view.                                                       |
| `selectionMode`      | `'single' , 'range'`                                                                            | `'single'`     | Date selection mode.                                                         |
| `disableFutureDates` | `boolean`                                                                                       | `true`         | Disable selecting future dates.                                              |
| `isDisabled`         | `boolean`                                                                                       | `false`        | Disables the input.                                                          |
| `isCalculated`       | `boolean`                                                                                       | `false`        | Indicates if the value is system-calculated.                                 |
| `withClearFooter`    | `boolean`                                                                                       | `false`        | Displays a footer with a clear button.                                       |
| `minDate`            | `Moment`                                                                                        | `undefined`    | Minimum date allowed.                                                        |
| `maxDate`            | `Moment`                                                                                        | `undefined`    | Maximum date allowed.                                                        |
| `dateFormat`         | `string`                                                                                        | `'DD/MM/YYYY'` | Format to display date labels.                                               |
| `getCalendarLabel`   | `(value: Moment , Moment[], selectionMode: SelectionMode,typeView: CalendarTypeView) => string` | `undefined`    | Custom function to generate the label shown in the input or calendar header. |

---

## 🧠 Internal Behavior

* Uses a custom hook `useCalendar` to manage state and logic.
* Handles navigation (prev/next) with constraints.
* Dynamically switches between views.
* Renders calendar buttons with appropriate accessibility and layout logic.

---

## 🎨 Styling

Styles are managed via SCSS Modules. The main file is `Calendar.module.scss`, and class names are scoped locally using `clsx`.

---
