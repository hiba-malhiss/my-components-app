import moment from 'moment';
import { DayInfo, Month } from "./calendarTypes";

export const DEFAULT_DATE_FORMAT = 'YYYY/MM/DD';

export function createMonth(month: number, year: number, dateFormat: string): Month {
  const currentDate = moment();

  // Get the weekday of the first day, total days in current and previous month
  const firstDay = moment([year, month, 1]).day();
  const daysInMonth = moment([year, month, 1]).daysInMonth();
  const prevMonthDays = moment([
    year,
    month - 1 < 0 ? 11 : month - 1,
    1
  ]).daysInMonth();

  const isCurrentMonth =
    currentDate.month() === month && currentDate.year() === year;

  let dayNumber = 1;
  const dates: DayInfo[][] = [];

  // Generate up to 6 weeks to fill the calendar grid
  for (let weekNum = 0; weekNum < 6; weekNum++) {
    const week: DayInfo[] = [];

    if (weekNum === 0) {
      // Fill first week with trailing days from previous month
      for (let j = prevMonthDays - firstDay + 1; j <= prevMonthDays; j++) {
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const date = moment([prevYear, prevMonth, j]);

        week.push({
          day: j,
          month: prevMonth,
          year: prevYear,
          isFromOtherMonth: true,
          today: isCurrentMonth && j === currentDate.date(),
          formattedDate: date.format(dateFormat)
        });
      }

      // Fill remaining days of the first week from current month
      const remainingDaysLength = 7 - week.length;
      for (let j = 0; j < remainingDaysLength; j++) {
        const date = moment([year, month, dayNumber]);

        week.push({
          day: dayNumber,
          month,
          year,
          today: isCurrentMonth && dayNumber === currentDate.date(),
          isFromOtherMonth: false,
          formattedDate: date.format(dateFormat)
        });
        dayNumber++;
      }
    } else if (weekNum === 5 && dayNumber > daysInMonth) {
      // Skip last week if month days are fully filled
      break;
    } else {
      // Fill remaining weeks with current and next month days
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        if (dayNumber <= daysInMonth) {
          const date = moment([year, month, dayNumber]);

          week.push({
            day: dayNumber,
            month,
            year,
            today: isCurrentMonth && dayNumber === currentDate.date(),
            isFromOtherMonth: false,
            formattedDate: date.format(dateFormat)
          });
          dayNumber++;
        } else {
          const nextMonth = month === 11 ? 0 : month + 1;
          const nextYear = month === 11 ? year + 1 : year;
          const nextDay = dayNumber - daysInMonth;
          const date = moment([nextYear, nextMonth, nextDay]);

          week.push({
            day: nextDay,
            month: nextMonth,
            year: nextYear,
            today: false,
            isFromOtherMonth: true,
            formattedDate: date.format(dateFormat)
          });
          dayNumber++;
        }
      }
    }

    dates.push(week);
  }

  return {
    month,
    year,
    dates
  };
}
