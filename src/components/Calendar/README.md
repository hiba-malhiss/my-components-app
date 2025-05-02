# 📅 Calendar Component

A customizable, responsive calendar picker component built with React and Moment.js. Supports multiple views (date/month/year), range selection, min/max constraints, and future date disabling. Designed with accessibility and reusability in mind.

---

## ✨ Features

* View modes: **Date**, **Month**, and **Year**
* Single, multiple, or range date selection
* Optional disabling of future dates
* Constraints with `minDate` and `maxDate`
* Floating overlay calendar triggered via button
* Fully styled and responsive

---

## 📦 Installation

```bash
npm install moment @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
```

*Include or adapt the component’s `.scss` file in your build pipeline.*

---

## 🧩 Usage

```tsx
import Calendar from './components/Calendar/Calendar';
import moment from 'moment';

const MyComponent = () => {
  const [selectedDate, setSelectedDate] = useState(moment());

  return (
    <Calendar
      value={selectedDate}
      onChange={setSelectedDate}
      typeView="date"
      selectionMode="single"
      disableFutureDates={true}
      minDate={moment().subtract(1, 'year')}
      maxDate={moment().add(1, 'year')}
      size="large"
    />
  );
};
```

---

## ⚙️ Props

| Prop                 | Type                                | Default        | Description                               |
| -------------------- | ----------------------------------- | -------------- | ----------------------------------------- |
| `value`              | `Moment , Moment[]`                | **required**   | Selected date(s)                          |
| `onChange`           | `(value) => void`                   | **required**   | Callback when selection changes           |
| `typeView`           | `'date' , 'month' , 'year'`       | `'date'`       | Initial calendar view                     |
| `selectionMode`      | `'single' , 'multiple' , 'range'` | `'single'`     | Selection mode                            |
| `disableFutureDates` | `boolean`                           | `true`         | Whether to disable future dates           |
| `minDate`            | `Moment`                            | `undefined`    | Minimum selectable date                   |
| `maxDate`            | `Moment`                            | `undefined`    | Maximum selectable date                   |
| `dateFormat`         | `string`                            | `'DD/MM/YYYY'` | Format used for displaying selected dates |
| `size`               | `'small' , 'large'`                | `'small'`      | Size of the calendar toggle button        |

---

## 🧠 Internal Architecture

* **`useCalendar` hook**: Centralized state and logic (navigation, view changes, validation, etc.)
* **`CalendarButton`**: Reusable button with status indicators and styling
* **`AnchoredFloatingContainer`**: Handles positioning and visibility of the calendar popover
* **CSS Modules (`.scss`)**: Local styles for layout, responsiveness, and transitions

---

## 🧪 Development Notes

* Relies on **Moment.js** for date manipulation.
* Styles should be imported as CSS Modules (`Calendar.module.scss`).
* Font Awesome icons (`faChevronLeft`, `faChevronRight`) are used for navigation.

