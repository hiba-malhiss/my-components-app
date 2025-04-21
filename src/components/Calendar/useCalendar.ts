import { useCallback, useEffect, useMemo, useState } from 'react';
import moment, { Moment } from 'moment';
import { createMonth, DayInfo } from './calendar.utils';

type CalendarTypeView = 'month' | 'year' | 'date';

interface UseCalendarProps {
  value: Moment;
  typeView?: CalendarTypeView;
  dateFormat?: string;
  disableFutureDates?: boolean;
  onChange: (value: Moment) => void;
  minDate?: Moment;
  maxDate?: Moment;
}

export const useCalendar = ({
  value,
  typeView,
  dateFormat,
  disableFutureDates,
  onChange,
  minDate,
  maxDate,
}: UseCalendarProps) => {
  const today = moment();
  const shortMonthNames = moment.monthsShort();
  const fullMonthNames = moment.months();
  const weekDays = moment.weekdaysShort();

  const [currentView, setCurrentView] = useState<CalendarTypeView>(typeView);
  const [visibleDate, setVisibleDate] = useState<Moment>(value?.clone() || today);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [decadeBaseYear, setDecadeBaseYear] = useState<number>(today.year());
  const [yearsList, setYearsList] = useState<number[]>([]);

  useEffect(() => {
    const base = decadeBaseYear - (decadeBaseYear % 10);
    setYearsList(Array.from({ length: 10 }, (_, i) => base + i));
  }, [decadeBaseYear]);

  useEffect(() => {
    if (value) {
      setVisibleDate(value.clone());
    }
  }, [value]);

  const month = useMemo(() => {
    return createMonth(visibleDate.month(), visibleDate.year());
  }, [visibleDate.month(), visibleDate.year()]);

  const getCalendarLabel = () => {
    if (typeView === 'date') return value ? value.format(dateFormat) : dateFormat;
    if (typeView === 'year') return value ? String(value.year()) : 'YYYY';
    return value ? `${fullMonthNames[value.month()]} ${value.year()}` : 'MM YYYY';
  };

  const onDropdownToggle = (visible?: boolean) => {
    const toggle = visible !== undefined ? visible : !isOverlayVisible;
    setOverlayVisible(toggle);
    if (!toggle) {
      setCurrentView(typeView);
    }
  };

  // jump to next/prev valid date
  const clampToBounds = (date: Moment): Moment => {
    if (minDate && date.isBefore(minDate)) return minDate.clone();
    if (maxDate && date.isAfter(maxDate)) return maxDate.clone();
    if (disableFutureDates && date.isAfter(today)) return today.clone();
    return date;
  };

  const onPrev = () => {
    if (currentView === 'month') {
      const newDate = visibleDate.clone().subtract(1, 'year');
      setVisibleDate(clampToBounds(newDate));
      setDecadeBaseYear((prev) => prev - 1);
    } else if (currentView === 'year') {
      setDecadeBaseYear((prev) => prev - 10);
    } else {
      const newDate = visibleDate.clone().subtract(1, 'month');
      setVisibleDate(clampToBounds(newDate));
    }
  };

  const onNext = () => {
    if (currentView === 'month') {
      const newDate = visibleDate.clone().add(1, 'year');
      setVisibleDate(clampToBounds(newDate));
      setDecadeBaseYear((prev) => prev + 1);
    } else if (currentView === 'year') {
      setDecadeBaseYear((prev) => prev + 10);
    } else {
      const newDate = visibleDate.clone().add(1, 'month');
      setVisibleDate(clampToBounds(newDate));
    }
  };

  const isNextDisabled = (): boolean => {
    const nextVisibleDate = visibleDate.clone();

    if (currentView === 'year') {
      const lastYear = yearsList[yearsList.length - 1];
      if (disableFutureDates && lastYear >= today.year()) return true;
      if (maxDate && lastYear >= maxDate.year()) return true;
    }

    if (currentView === 'month') {
      if (disableFutureDates && nextVisibleDate.year() >= today.year()) return true;
      if (maxDate && nextVisibleDate.year() >= maxDate.year()) return true;
    }

    if (currentView === 'date') {
      if (disableFutureDates && nextVisibleDate.isSameOrAfter(today, 'month')) return true;
      if (maxDate && nextVisibleDate.isSameOrAfter(maxDate, 'month')) return true;
    }

    return false;
  };

  const isPrevDisabled = (): boolean => {
    const prevVisibleDate = visibleDate.clone();

    if (currentView === 'year') {
      const firstYear = yearsList[0];
      if (minDate && firstYear <= minDate.year()) return true;
    }

    if (currentView === 'month') {
      if (minDate && prevVisibleDate.year() <= minDate.year()) return true;
    }

    if (currentView === 'date') {
      if (minDate && prevVisibleDate.isSameOrBefore(minDate, 'month')) return true;
    }

    return false;
  };

  const isYearDisabled = (year: number) => {
    if (disableFutureDates && year > today.year()) {
      return true;
    }
    if (minDate && year < minDate.year()) {
      return true;
    }
    return !!(maxDate && year > maxDate.year());
  };

  const isMonthDisabled = (monthIdx: number) => {
    const year = visibleDate.year();
    const dateToCheck = moment({ year, month: monthIdx });
    if (disableFutureDates && dateToCheck.isAfter(today, 'month')) {
      return true;
    }
    if (minDate && dateToCheck.isBefore(minDate, 'month')) {
      return true;
    }
    return !!(maxDate && dateToCheck.isAfter(maxDate, 'month'));

  };

  const isDateDisabled = (date: DayInfo) => {
    if (date.isFromOtherMonth) return true;
    const check = moment({ year: date.year, month: date.month, day: date.day });
    if (disableFutureDates && check.isAfter(today, 'day')) {
      return true;
    }
    if (minDate && check.isBefore(minDate, 'day')) {
      return true;
    }
    return !!(maxDate && check.isAfter(maxDate, 'day'));
  };

  const onYearSelect = (year: number) => {
    const updated = visibleDate.clone().year(year);
    setVisibleDate(updated);

    if (typeView === 'month' || typeView === 'date') {
      setCurrentView('month');
    } else {
      onChange(updated);
      setOverlayVisible(false);
    }
  };

  const onMonthSelect = (monthIdx: number) => {
    const updated = visibleDate.clone().month(monthIdx);
    setVisibleDate(updated);

    if (typeView === 'month') {
      onChange(updated);
      setOverlayVisible(false);
    } else {
      setCurrentView('date');
    }
  };

  const onDateSelect = useCallback((date: DayInfo) => {
    const selected = moment({ year: date.year, month: date.month, day: date.day });
    onChange(selected);
    setOverlayVisible(false);
  }, [onChange]);

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
    isYearDisabled,
    isMonthDisabled,
    isDateDisabled,
    onYearSelect,
    onMonthSelect,
    onDateSelect,
    isPrevDisabled
  };
};
