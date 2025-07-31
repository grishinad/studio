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
        {monthHeaders.map(({ name, dayCount, year }) => (
          <th
            key={name}
            colSpan={dayCount}
            className="p-1.5 font-semibold text-lg border-b border-r border-border"
          >
            <div className="flex items-center justify-center gap-2">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onPrevMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span>{name} {year}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNextMonth}>
                <ChevronRight className="h-5 w-5" />
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
