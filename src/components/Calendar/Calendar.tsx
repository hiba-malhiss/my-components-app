import React from 'react';
import { Moment } from 'moment';

import AnchoredFloatingContainer from '../AnchoredFloatingContainer/AnchoredFloatingContainer';
import CalendarButton from './CalendarButton/CalendarButton';

import { DEFAULT_DATE_FORMAT } from './calendar.utils';

import styles from './Calendar.module.scss';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Button from "../Button/Button";
import { useCalendar } from "./useCalendar";

type CalendarTypeView = 'month' | 'year' | 'date';

interface CalendarProps {
  size?: 'small' | 'large';
  disableFutureDates?: boolean;
  typeView?: CalendarTypeView;
  value: Moment;
  onChange: (value: Moment) => void;
  dateFormat?: string;
}

const Calendar = ({
  size = 'small',
  disableFutureDates = true,
  typeView = 'date',
  value,
  onChange,
  dateFormat = DEFAULT_DATE_FORMAT
}: CalendarProps) => {
  const {
    shortMonthNames,
    fullMonthNames,
    weekDays,
    currentView,
    setCurrentView,
    visibleDate,
    month,
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
  } = useCalendar({
    value,
    typeView,
    dateFormat,
    disableFutureDates,
    onChange
  });

  return (
    <div className={styles.Calendar}>
      <Button size={size} onClick={() => onDropdownToggle()}>
        {getCalendarLabel()}
      </Button>
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
    </div>
  );
};

export default Calendar;
