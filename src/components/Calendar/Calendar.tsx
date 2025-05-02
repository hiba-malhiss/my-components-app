import React from 'react';
import { Moment } from 'moment';

import AnchoredFloatingContainer from '../AnchoredFloatingContainer/AnchoredFloatingContainer';
import CalendarButton from './CalendarButton/CalendarButton';

import { DEFAULT_DATE_FORMAT } from './utils/calendarUtils';

import styles from './Calendar.module.scss';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import Button from "../Button/Button";
import { useCalendar } from "./useCalendar";
import { CalendarTypeView, SelectionMode } from "./calendarTypes";
import StringInput from "../StringInput/StringInput";
import clsx from "clsx";

interface CalendarProps {
  selectionMode?: SelectionMode;
  disableFutureDates?: boolean;
  isDisabled?: boolean;
  isCalculated?: boolean;
  withClearFooter?: boolean;
  typeView?: CalendarTypeView;
  value: Moment | Moment[];
  minDate?: Moment;
  maxDate?: Moment;
  onChange: (value: Moment | Moment[]) => void;
  dateFormat?: string;
  getLabel?: (value: Moment | Moment[], selectionMode: SelectionMode, typeView: CalendarTypeView) => string;
}

const Calendar = ({
  disableFutureDates = true,
  typeView = 'date',
  value,
  onChange,
  dateFormat = DEFAULT_DATE_FORMAT,
  minDate,
  maxDate,
  selectionMode,
  withClearFooter,
  isDisabled,
  isCalculated,
  getLabel
}: CalendarProps) => {
  const {
    month,
    weekDays,
    shortMonthNames,
    fullMonthNames,
    currentView,
    visibleDate,
    yearsList,
    isOverlayVisible,
    getCalendarLabel,
    goToPrevious,
    goToNext,
    isNextDisabled,
    isPrevDisabled,
    isDateDisabled,
    isMonthDisabled,
    isYearDisabled,
    onDateSelect,
    onMonthSelect,
    onYearSelect,
    setCurrentView,
    setOverlayVisible,
    getSelectionBtnStatus,
    onInputClick,
    reset
  } = useCalendar({
    value,
    typeView,
    dateFormat,
    disableFutureDates,
    onChange,
    minDate,
    maxDate,
    selectionMode,
    getLabel
  });

  return (
    <div className={clsx(styles.Calendar, { [styles['Calendar-withFooter']]: withClearFooter })}>
      <StringInput
        value={getCalendarLabel()}
        onIconClick={onInputClick}
        onClick={onInputClick}
        placeholder="Select Date"
        iconRight={faCalendar}
        readOnly
        isDisabled={isDisabled}
        isCalculated={isCalculated}
      />
      <AnchoredFloatingContainer
        isVisible={isOverlayVisible}
        onVisibilityChange={setOverlayVisible}
      >
        <div className={styles['Calendar-header']}>
          <Button
            iconLeft={faChevronLeft}
            appearance="plainDefault"
            isDisabled={isPrevDisabled()}
            onClick={goToPrevious}
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
            onClick={goToNext}
            isDisabled={isNextDisabled()}
            className={styles['right-chevron']}
          />
        </div>

        {currentView === 'year' && (
          <div className={`${styles['Calendar-menu']} ${styles['Calendar-yearsMenu']}`}>
            {yearsList.map((year, i) => (
              <CalendarButton
                key={year}
                isDisabled={isYearDisabled(year)}
                onClick={() => onYearSelect(year)}
                selectionStatus={getSelectionBtnStatus('year', year)}
                isFirstColumn={i % 2 === 0}
                isLastColumn={i % 2 === 1}
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
                onClick={() => onMonthSelect(i)}
                selectionStatus={getSelectionBtnStatus('month', i)}
                isFirstColumn={i % 3 === 0}
                isLastColumn={i % 3 === 2}
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
                {week.map((date, j) => (
                  <CalendarButton
                    key={date.day}
                    isDisabled={isDateDisabled(date)}
                    appearance="rounded"
                    selectionStatus={getSelectionBtnStatus('date', date)}
                    isFirstColumn={j === 0}
                    isLastColumn={j === 6}
                    onClick={() => onDateSelect(date)}
                  >
                    {date.day}
                  </CalendarButton>
                ))}
              </React.Fragment>
            ))}
          </div>
        )}

        {withClearFooter && (
          <div className={styles['Calendar-footer']}>
            <Button
              appearance="plainDefault"
              onClick={reset}>
              Clear
            </Button>
          </div>
        )}
      </AnchoredFloatingContainer>
    </div>
  );
};

export default Calendar;
