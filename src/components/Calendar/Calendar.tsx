import React, { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';

import AnchoredFloatingContainer from '../AnchoredFloatingContainer/AnchoredFloatingContainer';
import CalendarButton from './CalendarButton';

import { createMonth, DayInfo, DEFAULT_DATE_FORMAT, Month } from './calendar.utils';

import styles from './Calendar.module.scss';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Button from "../Button/Button";

type CalendarTypeView = 'month' | 'year' | 'date';

interface CalendarProps {
  size?: 'small' | 'large';
  disableFutureDates?: boolean;
  typeView?: CalendarTypeView;
  value: Moment;
  onChange: (value: Moment) => void;
  dateFormat?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  size = 'small',
  disableFutureDates = true,
  typeView = 'date',
  value,
  onChange,
  dateFormat = DEFAULT_DATE_FORMAT
}) => {
  const today = moment();
  const [currentView, setCurrentView] = useState<CalendarTypeView>(typeView);
  const [visibleDate, setVisibleDate] = useState<Moment>(value?.clone() || today);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [month, setMonth] = useState<Month>(createMonth(visibleDate.month(), visibleDate.year()));
  const [decadeBaseYear, setDecadeBaseYear] = useState<number>(today.year());
  const [yearsList, setYearsList] = useState<number[]>([]);

  const shortMonthNames = moment.monthsShort();
  const fullMonthNames = moment.months();
  const weekDays = moment.weekdaysShort();

  const getCalendarLabel = () => {
    if (!value) return dateFormat;
    if (typeView === 'date') return value.format(dateFormat);
    if (typeView === 'year') return String(value.year());
    return `${fullMonthNames[value.month()]} ${value.year()}`;
  };

  const updateYearList = (baseYear = decadeBaseYear) => {
    const base = baseYear - (baseYear % 10);
    setYearsList(Array.from({ length: 10 }, (_, i) => base + i));
  };

  const updateMonth = () => {
    setMonth(createMonth(visibleDate.month(), visibleDate.year()));
  };

  useEffect(() => {
    updateYearList();
  }, [decadeBaseYear]);

  useEffect(() => {
    if (typeView === 'date') {
      updateMonth();
    }
  }, [visibleDate]);

  useEffect(() => {
    if (value) {
      setVisibleDate(value.clone());
    }
  }, [value]);

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
      updateYearList(visibleDate.year() - 1);
    } else if (currentView === 'year') {
      setDecadeBaseYear((prev) => prev - 10);
    } else {
      setVisibleDate((d) => d.clone().subtract(1, 'month'));
    }
  };

  const onNext = () => {
    if (currentView === 'month') {
      setVisibleDate((d) => d.clone().add(1, 'year'));
      updateYearList(visibleDate.year() + 1);
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

    return (
      visibleDate.year() >= today.year() &&
      visibleDate.month() >= today.month()
    );
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

  const onDateSelect = (date: DayInfo) => {
    const selected = moment({ year: date.year, month: date.month, day: date.day });
    onChange(selected);
    setOverlayVisible(false);
  };

  return (
    <div className={styles.Calendar}>
      <Button size={size} onClick={() => onDropdownToggle()}>
        {getCalendarLabel()}
      </Button>

      {isOverlayVisible && (
        <AnchoredFloatingContainer
          isVisible={isOverlayVisible}
          onVisibilityUpdate={onDropdownToggle}
        >
          <div className={styles['Calendar-header']}>
            <Button iconLeft={faChevronLeft} appearance="plainDefault" onClick={onPrev}
                    className={styles['left-chevron']}/>
            {currentView === 'year' && (
              <div className={styles["decade-range"]}>{yearsList[0]}–{yearsList[yearsList.length - 1]}</div>
            )}
            {currentView === 'date' && (
              <Button appearance="plainDefault" size="large" display="inline" onClick={() => setCurrentView('month')}>
                {fullMonthNames[visibleDate.month()]}
              </Button>
            )}
            {(currentView === 'month' || currentView === 'date') && (
              <Button appearance="plainDefault" size="large" onClick={() => setCurrentView('year')}>
                {visibleDate.year()}
              </Button>
            )}
            <Button
              iconLeft={faChevronRight}
              appearance="plainDefault"
              onClick={onNext}
              isDisabled={isNextDisabled()}
              className={styles['right-chevron']}
            />
          </div>

          {currentView === 'year' && (
            <div className={styles['Calendar-menu']}>
              {yearsList.map((year) => (
                <CalendarButton
                  key={year}
                  isDisabled={isYearDisabled(year)}
                  isSelected={visibleDate.year() === year}
                  onClick={() => onYearSelect(year)}
                >
                  {year}
                </CalendarButton>
              ))}
            </div>
          )}

          {currentView === 'month' && (
            <div className={`${styles['Calendar-menu']} ${styles['Calendar-monthsMenu']}`}>
              {shortMonthNames.map((monthName, i) => (
                <CalendarButton
                  key={monthName}
                  isDisabled={isMonthDisabled(i)}
                  isSelected={visibleDate.month() === i}
                  onClick={() => onMonthSelect(i)}
                >
                  {monthName}
                </CalendarButton>
              ))}
            </div>
          )}

          {currentView === 'date' && (
            <div className={`${styles['Calendar-menu']} ${styles['Calendar-datesMenu']}`}>
              {weekDays.map((day) => (
                <span key={day} className={styles["days"]}>{day}</span>
              ))}
              {month.dates.map((week, i) => (
                <React.Fragment key={i}>
                  {week.map((date) => (
                    <CalendarButton
                      key={date.formattedDate}
                      isDisabled={isDateDisabled(date)}
                      isSelected={
                        value?.date() === date.day &&
                        value?.month() === date.month &&
                        value?.year() === date.year
                      }
                      isRounded
                      isHighlighted={date.today}
                      onClick={() => onDateSelect(date)}
                    >
                      {date.day}
                    </CalendarButton>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </AnchoredFloatingContainer>
      )}
    </div>
  );
};

export default Calendar;
