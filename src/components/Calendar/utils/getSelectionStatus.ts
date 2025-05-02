import { CalendarTypeView, DayInfo } from "./calendarTypes";
import moment from "moment";

export interface SelectionStatus {
  isSelected: boolean;
  isSelectedSecondary: boolean;
  isStartInterval: boolean;
  isEndInterval: boolean;
  isMiddleInterval: boolean;
}

export const toMomentValue = (
  type: CalendarTypeView,
  value: DayInfo | number,
  visibleYear?: number
): moment.Moment => {
  if (type === 'date') {
    const date = value as DayInfo;
    return moment({ year: date.year, month: date.month, day: date.day });
  } else if (type === 'month') {
    return moment({ year: visibleYear, month: value as number });
  } else {
    return moment({ year: value as number });
  }
};

export const isExactMatch = (
  type: CalendarTypeView,
  value: DayInfo | number,
  selectedDate: moment.Moment,
  visibleYear?: number
): boolean => {
  if (type === 'date') {
    const date = value as DayInfo;
    return (
      selectedDate.date() === date.day &&
      selectedDate.month() === date.month &&
      selectedDate.year() === date.year
    );
  } else if (type === 'month') {
    return selectedDate.month() === (value as number) && selectedDate.year() === visibleYear;
  } else if (type === 'year') {
    return selectedDate.year() === (value as number);
  }
  return false;
};

const isPrimarySelection = (view: CalendarTypeView, type: CalendarTypeView): boolean => {
  return (
    (view === 'date' && type === 'date') ||
    (view === 'month' && type === 'month') ||
    (view === 'year' && type === 'year')
  );
};

export const getSelectionStatus = (
  view: CalendarTypeView,
  type: CalendarTypeView,
  value: DayInfo | number,
  selectedDates: moment.Moment[],
  selectionMode: 'single' | 'range',
  visibleYear?: number,
): SelectionStatus => {
  const defaultStatus: SelectionStatus = {
    isSelected: false,
    isSelectedSecondary: false,
    isStartInterval: false,
    isEndInterval: false,
    isMiddleInterval: false,
  };

  if (!Array.isArray(selectedDates) || selectedDates.length === 0) return defaultStatus;

  const momentValue = toMomentValue(type, value, visibleYear);
  const [start, end] = selectedDates;

  const isSame = (d: moment.Moment) => momentValue.isSame(d, type);
  const isBetween = () =>
    end && momentValue.isAfter(start, type) && momentValue.isBefore(end, type);

  const isExact = selectedDates.some(d => isExactMatch(type, value, d, visibleYear));

  const isSelected = isPrimarySelection(view, type) && isExact;
  const isSelectedSecondary = !isPrimarySelection(view, type) && isExact;

  return {
    isSelected,
    isSelectedSecondary,
    isStartInterval: selectionMode === 'range' && !!end && isSame(start) && view === type,
    isEndInterval: selectionMode === 'range' && !!end && isSame(end) && view === type,
    isMiddleInterval: selectionMode === 'range' && !!end && isBetween() && view === type,
  };
};