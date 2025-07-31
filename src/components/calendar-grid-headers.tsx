'use client';

import {
  getDayOfMonth,
  getDayOfWeekCharacter,
  getMonthHeaders,
} from '@/lib/dates';
import type { Holiday } from '@/types';
import { isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type CalendarGridHeadersProps = {
  daysInPeriod: Date[];
  holidays: Holiday[];
};

export function CalendarGridHeaders({
  daysInPeriod,
  holidays,
}: CalendarGridHeadersProps) {
  const monthHeaders = getMonthHeaders(daysInPeriod);

  const getHolidayForDay = (day: Date) => holidays.find(h => isSameDay(h.date, day));

  return (
    <thead className="text-xs text-muted-foreground sticky top-0 z-20 bg-background/95 backdrop-blur">
      {/* Month Header */}
      <tr className="text-center">
        <th rowSpan={2} className="sticky left-0 bg-background/95 p-2 font-semibold text-sm border-b border-r align-middle">
          Сотрудник
        </th>
        {monthHeaders.map(({ name, dayCount }) => (
          <th
            key={name}
            colSpan={dayCount}
            className="p-1.5 font-semibold text-lg border-b border-r"
          >
            {name}
          </th>
        ))}
      </tr>
      {/* Day of Month Header */}
      <tr className="text-center">
        <TooltipProvider>
        {daysInPeriod.map(day => {
          const holiday = getHolidayForDay(day);
          const dayOfWeek = getDayOfWeekCharacter(day);
          return (
            <th
              key={day.toISOString()}
              className={cn(
                'p-1 font-normal border-b border-r w-10 text-sm',
                holiday && 'bg-accent/50'
              )}
            >
              <div>{dayOfWeek}</div>
              {holiday ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help font-bold text-accent-foreground text-base">{getDayOfMonth(day)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{holiday.name}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <span className="text-base">{getDayOfMonth(day)}</span>
              )}
            </th>
          );
        })}
        </TooltipProvider>
      </tr>
    </thead>
  );
}
