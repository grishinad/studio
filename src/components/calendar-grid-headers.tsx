'use client';

import {
  getDayOfMonth,
  getDayOfWeekCharacter,
  getMonthHeaders,
  getWeekHeaders,
} from '@/lib/dates';
import type { Holiday } from '@/types';
import { isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type CalendarGridHeadersProps = {
  daysInYear: Date[];
  holidays: Holiday[];
};

export function CalendarGridHeaders({
  daysInYear,
  holidays,
}: CalendarGridHeadersProps) {
  const monthHeaders = getMonthHeaders(daysInYear);
  const weekHeaders = getWeekHeaders(daysInYear);

  const getHolidayForDay = (day: Date) => holidays.find(h => isSameDay(h.date, day));

  return (
    <thead className="text-xs text-muted-foreground sticky top-0 z-20 bg-background/95 backdrop-blur">
      {/* Employee Header */}
      <tr className="text-center">
        <th rowSpan={4} className="sticky left-0 bg-background/95 p-2 font-semibold text-sm border-b border-r align-middle">
          Employee
        </th>
        {monthHeaders.map(({ name, dayCount }) => (
          <th
            key={name}
            colSpan={dayCount}
            className="p-1.5 font-semibold text-sm border-b border-r"
          >
            {name}
          </th>
        ))}
      </tr>
      {/* Week Header */}
      <tr className="text-center">
        {weekHeaders.map(({ name, dayCount }) => (
          <th
            key={name}
            colSpan={dayCount}
            className="p-1 font-medium border-b border-r"
          >
            {name}
          </th>
        ))}
      </tr>
      {/* Day of Week Header */}
      <tr className="text-center">
        {daysInYear.map(day => (
          <th key={day.toISOString()} className="p-1 font-normal border-b border-r w-10">
            {getDayOfWeekCharacter(day)}
          </th>
        ))}
      </tr>
      {/* Day of Month Header */}
      <tr className="text-center">
        <TooltipProvider>
        {daysInYear.map(day => {
          const holiday = getHolidayForDay(day);
          return (
            <th
              key={day.toISOString()}
              className={cn(
                'p-1 font-normal border-b border-r w-10',
                holiday && 'bg-accent/50'
              )}
            >
              {holiday ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help font-bold text-accent-foreground">{getDayOfMonth(day)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{holiday.name}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                getDayOfMonth(day)
              )}
            </th>
          );
        })}
        </TooltipProvider>
      </tr>
    </thead>
  );
}
