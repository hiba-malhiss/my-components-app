export interface DayInfo {
  day: number;
  month: number;
  year: number;
  isFromOtherMonth: boolean;
  today: boolean;
  formattedDate: string;
}

export interface Month {
  month: number;
  year: number;
  dates: DayInfo[][];
}

export type CalendarTypeView = 'month' | 'year' | 'date';
export type SelectionMode = 'single' | 'multiple' | 'range';
