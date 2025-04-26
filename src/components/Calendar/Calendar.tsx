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
  selectionMode?: 'single' | 'multiple'
  disableFutureDates?: boolean;
  typeView?: CalendarTypeView;
  value: Moment | Moment[];
  minDate?: Moment;
  maxDate?: Moment;
  onChange: (value: Moment | Moment[]) => void;
  dateFormat?: string;
}

const Calendar = ({
  size = 'small',
  disableFutureDates = true,
  typeView = 'date',
  value,
  onChange,
  dateFormat = DEFAULT_DATE_FORMAT,
  minDate,
  maxDate,
  selectionMode
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
    isPrevDisabled,
    isYearDisabled,
    isMonthDisabled,
    isDateDisabled,
    onYearSelect,
    onMonthSelect,
    onDateSelect,
    isYearSelected,
    isDateSelected,
    setOverlayVisible,
    isMonthSelected
  } = useCalendar({
    value,
    typeView,
    dateFormat,
    disableFutureDates,
    onChange,
    minDate,
    maxDate,
    selectionMode
  });

  return (
    <div className={styles.Calendar}>
      <Button size={size} onClick={(event) => {
        onDropdownToggle();
        event.stopPropagation();
      }}>
        {getCalendarLabel()}
      </Button>
      <AnchoredFloatingContainer
        isVisible={isOverlayVisible}
        onVisibilityChange={setOverlayVisible}
      >
        <div className={styles['Calendar-header']}>
          <Button
            iconLeft={faChevronLeft}
            appearance="plainDefault"
            isDisabled={isPrevDisabled()}
            onClick={onPrev}
            className={styles['left-chevron']}
          />
          {currentView === 'year' && (
            <div className={styles["decade-range"]}>{yearsList[0]} – {yearsList[yearsList.length - 1]}</div>
          )}
          {currentView === 'date' && (
            <Button appearance="plainDefault" size="large" display="inline" onClick={(e) => {
              setCurrentView('month');
              e.stopPropagation();
            }}>
              {visibleDate ? fullMonthNames[visibleDate.month()] : ''}
            </Button>
          )}
          {(currentView === 'month' || currentView === 'date') && (
            <Button appearance="plainDefault" size="large" onClick={(e) => {
              setCurrentView('year');
              e.stopPropagation();
            }}>
              {visibleDate?.year()}
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
          <div className={`${styles['Calendar-menu']} ${styles['Calendar-yearsMenu']}`}>
            {yearsList.map((year) => (
              <CalendarButton
                key={year}
                isDisabled={isYearDisabled(year)}
                isSelected={isYearSelected(year)}
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
                isSelected={isMonthSelected(i)}
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
            {month?.dates?.map((week, i) => (
              <React.Fragment key={i}>
                {week.map((date) => (
                  <CalendarButton
                    key={date.day}
                    isDisabled={isDateDisabled(date)}
                    isSelected={isDateSelected(date)}
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
