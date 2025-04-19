// hooks/useCalendar.ts
import { useCallback, useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { createMonth, DayInfo, Month } from './calendar.utils';

type CalendarTypeView = 'month' | 'year' | 'date';

interface UseCalendarProps {
  value: Moment;
  typeView: CalendarTypeView;
  dateFormat: string;
  disableFutureDates: boolean;
  onChange: (value: Moment) => void;
}

export const useCalendar = ({
  value,
  typeView,
  dateFormat,
  disableFutureDates,
  onChange
}: UseCalendarProps) => {
  const today = moment();
  const shortMonthNames = moment.monthsShort();
  const fullMonthNames = moment.months();
  const weekDays = moment.weekdaysShort();

  const [currentView, setCurrentView] = useState<CalendarTypeView>(typeView);
  const [visibleDate, setVisibleDate] = useState<Moment>(value?.clone() || today);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [month, setMonth] = useState<Month>(createMonth(visibleDate.month(), visibleDate.year()));
  const [decadeBaseYear, setDecadeBaseYear] = useState<number>(today.year());
  const [yearsList, setYearsList] = useState<number[]>([]);

  useEffect(() => {
    const base = decadeBaseYear - (decadeBaseYear % 10);
    setYearsList(Array.from({ length: 10 }, (_, i) => base + i));
  }, [decadeBaseYear]);

  useEffect(() => {
    if (typeView === 'date') {
      setMonth(createMonth(visibleDate.month(), visibleDate.year()));
    }
  }, [visibleDate]);

  useEffect(() => {
    if (value) {
      setVisibleDate(value.clone());
    }
  }, [value]);

  const getCalendarLabel = () => {
    if (!value) return dateFormat;
    if (typeView === 'date') return value.format(dateFormat);
    if (typeView === 'year') return String(value.year());
    return `${fullMonthNames[value.month()]} ${value.year()}`;
  };

  const onDropdownToggle = (visible?: boolean) => {
    const toggle = visible !== undefined ? visible : !isOverlayVisible;
    setOverlayVisible(toggle);
    if (!toggle) {
      setCurrentView(typeView);
    }
  };

  const onPrev = () => {
    if (currentView === 'month') {
      setVisibleDate((d) => d.clone().subtract(1, 'year'));
      setDecadeBaseYear((prev) => prev - 1);
    } else if (currentView === 'year') {
      setDecadeBaseYear((prev) => prev - 10);
    } else {
      setVisibleDate((d) => d.clone().subtract(1, 'month'));
    }
  };

  const onNext = () => {
    if (currentView === 'month') {
      setVisibleDate((d) => d.clone().add(1, 'year'));
      setDecadeBaseYear((prev) => prev + 1);
    } else if (currentView === 'year') {
      setDecadeBaseYear((prev) => prev + 10);
    } else {
      setVisibleDate((d) => d.clone().add(1, 'month'));
    }
  };

  const isNextDisabled = (): boolean => {
    if (!disableFutureDates) return false;

    if (currentView === 'year') {
      const lastYear = yearsList[yearsList.length - 1];
      return lastYear >= today.year();
    }

    if (currentView === 'month') {
      return visibleDate.year() >= today.year();
    }

    return visibleDate.year() >= today.year() && visibleDate.month() >= today.month();
  };

  const isYearDisabled = (year: number) => disableFutureDates && year > today.year();
  const isMonthDisabled = (monthIdx: number) =>
    disableFutureDates &&
    visibleDate.year() >= today.year() &&
    monthIdx > today.month();

  const isDateDisabled = (date: DayInfo) => {
    if (date.isFromOtherMonth) return true;
    const check = moment({ year: date.year, month: date.month, day: date.day });
    return disableFutureDates && check.isAfter(today);
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
    onDateSelect
  };
};
