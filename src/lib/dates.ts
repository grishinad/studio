import {
  eachDayOfInterval,
  endOfMonth,
  endOfYear,
  format,
  getISODay,
  getMonth,
  getYear,
  startOfMonth,
  startOfYear,
} from 'date-fns';
import { ru } from 'date-fns/locale';

export const MONTHS = Array.from({ length: 12 }, (_, i) => 
  format(new Date(2000, i, 1), 'LLLL', { locale: ru })
);

export const getDaysInYear = (year: number) => {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));
  return eachDayOfInterval({ start, end });
};

export const getDaysInMonthForYear = (year: number, month: number) => {
  const date = new Date(year, month);
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const getMonthHeaders = (days: Date[]) => {
  const months: { name: string; dayCount: number; year: number }[] = [];
  if (!days.length) return months;

  let currentMonth = getMonth(days[0]);
  let monthName = format(days[0], 'LLLL', { locale: ru });
  let currentYear = getYear(days[0]);
  let dayCount = 0;

  days.forEach(day => {
    if (getMonth(day) === currentMonth) {
      dayCount++;
    } else {
      months.push({ name: monthName, dayCount, year: currentYear });
      currentMonth = getMonth(day);
      monthName = format(day, 'LLLL', { locale: ru });
      currentYear = getYear(day);
      dayCount = 1;
    }
  });
  months.push({ name: monthName, dayCount, year: currentYear });
  return months;
};

export const getDayOfWeekCharacter = (day: Date) => {
  return format(day, 'EEEEEE', { locale: ru });
};

export const getDayOfMonth = (day: Date) => {
  return format(day, 'd');
};

export const isWeekend = (day: Date) => {
  const dayOfWeek = getISODay(day);
  return dayOfWeek === 6 || dayOfWeek === 7;
};
