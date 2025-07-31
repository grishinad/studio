'use client';

import {
  getDayOfMonth,
  getDayOfWeekCharacter,
  getMonthHeaders,
} from '@/lib/dates';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CalendarGridHeadersProps = {
  daysInPeriod: Date[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function CalendarGridHeaders({
  daysInPeriod,
  onPrevMonth,
  onNextMonth,
}: CalendarGridHeadersProps) {
  const monthHeaders = getMonthHeaders(daysInPeriod);

  return (
    <thead className="text-xs text-muted-foreground z-20">
      {/* Month Header */}
      <tr className="text-center">
        <th rowSpan={2} className="sticky left-0 bg-background p-2 font-semibold text-sm border-b border-r border-border align-middle z-30">
          Организация
        </th>
        {monthHeaders.map(({ name, dayCount, year }) => (
          <th
            key={name}
            colSpan={dayCount}
            className="p-1.5 font-semibold text-base sm:text-lg border-b border-r border-border relative z-20"
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Button variant="outline" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={onPrevMonth}>
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <span className="whitespace-nowrap">{name} {year}</span>
              <Button variant="outline" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={onNextMonth}>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </th>
        ))}
      </tr>
      {/* Day of Month Header */}
      <tr className="text-center">
        {daysInPeriod.map(day => {
          const dayOfWeek = getDayOfWeekCharacter(day);
          return (
            <th
              key={day.toISOString()}
              className='p-1 font-normal border-b border-r border-border w-10 text-sm relative z-20'
            >
              <div>{dayOfWeek}</div>
              <span className="text-lg font-medium">{getDayOfMonth(day)}</span>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
