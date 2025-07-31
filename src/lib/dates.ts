import {
  eachDayOfInterval,
  endOfYear,
  format,
  getISODay,
  getMonth,
  startOfYear,
} from 'date-fns';
import { ru } from 'date-fns/locale';

export const getDaysInYear = (year: number) => {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));
  return eachDayOfInterval({ start, end });
};

export const getMonthHeaders = (days: Date[]) => {
  const months: { name: string; dayCount: number }[] = [];
  if (!days.length) return months;

  let currentMonth = getMonth(days[0]);
  let monthName = format(days[0], 'LLLL', { locale: ru });
  let dayCount = 0;

  days.forEach(day => {
    if (getMonth(day) === currentMonth) {
      dayCount++;
    } else {
      months.push({ name: monthName, dayCount });
      currentMonth = getMonth(day);
      monthName = format(day, 'LLLL', { locale: ru });
      dayCount = 1;
    }
  });
  months.push({ name: monthName, dayCount });
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
