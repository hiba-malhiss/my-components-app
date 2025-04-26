import { useEffect, useMemo, useState } from 'react';
import moment, { Moment } from 'moment';
import { createMonth, DayInfo } from './calendar.utils';

type CalendarTypeView = 'month' | 'year' | 'date';

interface UseCalendarProps {
  value: Moment | Moment[];
  typeView?: CalendarTypeView;
  selectionMode?: 'single' | 'multiple';
  dateFormat?: string;
  disableFutureDates?: boolean;
  onChange: (value: Moment | Moment[]) => void;
  minDate?: Moment;
  maxDate?: Moment;
}

export const useCalendar = ({
  value,
  typeView,
  dateFormat,
  disableFutureDates,
  selectionMode = 'single',
  onChange,
  minDate,
  maxDate,
}: UseCalendarProps) => {
  const today = moment();
  const shortMonthNames = moment.monthsShort();
  const fullMonthNames = moment.months();
  const weekDays = moment.weekdaysShort();

  const [currentView, setCurrentView] = useState<CalendarTypeView>(typeView);
  const [visibleDate, setVisibleDate] = useState<Moment>(today);
  const [selectedDates, setSelectedDates] = useState<Moment[]>([]);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [decadeBaseYear, setDecadeBaseYear] = useState<number>(today.year());
  const [yearsList, setYearsList] = useState<number[]>([]);

  useEffect(() => {
    const base = decadeBaseYear - (decadeBaseYear % 10);
    setYearsList(Array.from({ length: 10 }, (_, i) => base + i));
  }, [decadeBaseYear]);

  useEffect(() => {
    if (selectionMode === 'single') {
      if (moment.isMoment(value)) {
        if (selectedDates[0]?.isSame(value)) return;
        setVisibleDate(value.clone());
        setSelectedDates([value.clone()]);
      } else {
        setVisibleDate(today.clone());
        setSelectedDates([]);
      }
    } else {
      if (Array.isArray(value) && value.length) {
        if (value.every(d => selectedDates.some(s => d.isSame(s)))) return;
        setVisibleDate(value[value.length - 1].clone());
        setSelectedDates(value.map(v => v.clone()));
      } else {
        setVisibleDate(today.clone());
        setSelectedDates([]);
      }
    }
  }, [value, selectionMode]);

  const month = useMemo(() => {
    if (!visibleDate) return null;
    return createMonth(visibleDate.month(), visibleDate.year());
  }, [visibleDate.month(), visibleDate.year()]);

  const getCalendarLabel = () => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      if (typeView === 'year') return 'YYYY';
      if (typeView === 'date') return dateFormat || 'DD/MM/YYYY';
      return 'MM YYYY';
    }

    const formatValue = (val: Moment) => {
      if (typeView === 'date') return val.format(dateFormat);
      if (typeView === 'year') return String(val.year());
      return `${fullMonthNames[val.month()]} ${val.year()}`;
    };

    return Array.isArray(value)
      ? value.map(formatValue).join(', ')
      : formatValue(value);
  };

  const onDropdownToggle = (visible?: boolean) => {
    const toggle = visible ?? !isOverlayVisible;
    setOverlayVisible(toggle);
    if (!toggle) setCurrentView(typeView);
  };

  const moveVisibleDate = (unit: 'year' | 'month', amount: number) => {
    setVisibleDate(prev => prev.clone().add(amount, unit));
  };

  const onPrev = () => {
    if (currentView === 'year') {
      setDecadeBaseYear(prev => prev - 10);
    } else if (currentView === 'month') {
      moveVisibleDate('year', -1);
    } else {
      moveVisibleDate('month', -1);
    }
  };

  const onNext = () => {
    if (currentView === 'year') {
      setDecadeBaseYear(prev => prev + 10);
    } else if (currentView === 'month') {
      moveVisibleDate('year', 1);
    } else {
      moveVisibleDate('month', 1);
    }
  };

  const isNavigationDisabled = (direction: 'prev' | 'next') => {
    if (!visibleDate) return true;
    const compareDate = visibleDate.clone();
    const offset = direction === 'next' ? 1 : -1;

    if (currentView === 'year') {
      const year = direction === 'next' ? yearsList[yearsList.length - 1] : yearsList[0];
      if (disableFutureDates && year >= today.year()) return true;
      if (maxDate && direction === 'next' && year >= maxDate.year()) return true;
      if (minDate && direction === 'prev' && year <= minDate.year()) return true;
    }

    if (currentView === 'month') {
      compareDate.add(offset, 'year');
      if (disableFutureDates && direction === 'next' && compareDate.year() > today.year()) return true;
      if (maxDate && direction === 'next' && compareDate.year() > maxDate.year()) return true;
      if (minDate && direction === 'prev' && compareDate.year() < minDate.year()) return true;
    }

    if (currentView === 'date') {
      compareDate.add(offset, 'month');
      if (disableFutureDates && direction === 'next' && compareDate.isAfter(today, 'month')) return true;
      if (maxDate && direction === 'next' && compareDate.isAfter(maxDate, 'month')) return true;
      if (minDate && direction === 'prev' && compareDate.isBefore(minDate, 'month')) return true;
    }

    return false;
  };

  const isNextDisabled = () => isNavigationDisabled('next');
  const isPrevDisabled = () => isNavigationDisabled('prev');

  const isYearDisabled = (year: number) => {
    if (disableFutureDates && year > today.year()) return true;
    if (minDate && year < minDate.year()) return true;
    return !!(maxDate && year > maxDate.year());

  };

  const isMonthDisabled = (monthIdx: number) => {
    if (!visibleDate) return true;
    const year = visibleDate.year();
    const dateToCheck = moment({ year, month: monthIdx });
    if (disableFutureDates && dateToCheck.isAfter(today, 'month')) return true;
    if (minDate && dateToCheck.isBefore(minDate, 'month')) return true;
    return !!(maxDate && dateToCheck.isAfter(maxDate, 'month'));

  };

  const isDateDisabled = (date: DayInfo) => {
    if (date.isFromOtherMonth) return true;
    const check = moment({ year: date.year, month: date.month, day: date.day });
    if (disableFutureDates && check.isAfter(today, 'day')) return true;
    if (minDate && check.isBefore(minDate, 'day')) return true;
    return !!(maxDate && check.isAfter(maxDate, 'day'));
  };

  const updateSelectedDates = (date: Moment) => {
    let updated = selectedDates.map(v => v.clone());
    const isSelected = selectedDates.some(d => d.isSame(date));

    if (selectionMode === 'single') {
      updated = [date];
    } else if (isSelected) {
      updated = updated.filter(d => !d.isSame(date));
    } else {
      updated.push(date.clone());
    }

    setSelectedDates(updated);
    onChange(selectionMode === 'single' ? updated[0] : updated);

    if (selectionMode === 'single') {
      setOverlayVisible(false);
    }
  };

  const onYearSelect = (year: number) => {
    const updated = visibleDate.clone().year(year);
    setVisibleDate(updated);

    if (typeView === 'month' || typeView === 'date') {
      setCurrentView('month');
    } else {
      updateSelectedDates(updated);
    }
  };

  const onMonthSelect = (monthIdx: number) => {
    const updated = visibleDate.clone().month(monthIdx);
    setVisibleDate(updated);

    if (typeView === 'month') {
      updateSelectedDates(updated);
    } else {
      setCurrentView('date');
    }
  };

  const onDateSelect = (date: DayInfo) => {
    const selectedMoment = moment({ year: date.year, month: date.month, day: date.day });
    updateSelectedDates(selectedMoment);
  };

  const isDateSelected = (date: DayInfo) => {
    return selectedDates.some(d =>
      d.date() === date.day &&
      d.month() === date.month &&
      d.year() === date.year
    );
  };

  const isYearSelected = (year: number) => {
    if (selectionMode === "single" || typeView == "year") {
      return selectedDates.some(d => d.year() === year);
    }
    return false;
  };

  const isMonthSelected = (monthIdx: number) => {
    if (selectionMode === "single" || typeView == "month") {
      return selectedDates.some(d =>
        d.month() === monthIdx && d.year() === visibleDate.year()
      );
    }
    return false;
  };

  return {
    shortMonthNames,
    fullMonthNames,
    weekDays,
    currentView,
    setCurrentView,
    visibleDate,
    month,
    decadeBaseYear,
    yearsList,
    isOverlayVisible,
    onDropdownToggle,
    onPrev,
    onNext,
    getCalendarLabel,
    isNextDisabled,
    isPrevDisabled,
    isYearDisabled,
    isMonthDisabled,
    isDateDisabled,
    onYearSelect,
    onMonthSelect,
    onDateSelect,
    selectedDates,
    isDateSelected,
    isYearSelected,
    isMonthSelected,
  };
};