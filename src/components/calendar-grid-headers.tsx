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
    <thead className="text-xs text-muted-foreground sticky top-0 bg-background/95 backdrop-blur z-20">
      {/* Month Header */}
      <tr className="text-center">
        <th rowSpan={2} className="sticky left-0 bg-background/95 p-2 font-semibold text-sm border-b border-r border-border align-middle z-30">
          Сотрудник
        </th>
        {monthHeaders.map(({ name, dayCount, year }, index) => (
          <th
            key={name}
            colSpan={dayCount}
            className="p-1.5 font-semibold text-lg border-b border-r border-border relative"
          >
             {index === 0 && (
              <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7" onClick={onPrevMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            {name} {year}
            {index === monthHeaders.length - 1 && (
               <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7" onClick={onNextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
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
              className='p-1 font-normal border-b border-r border-border w-10 text-sm'
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
