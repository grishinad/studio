'use client';

import {
  getDayOfMonth,
  getDayOfWeekCharacter,
  getMonthHeaders,
} from '@/lib/dates';

type CalendarGridHeadersProps = {
  daysInPeriod: Date[];
};

export function CalendarGridHeaders({
  daysInPeriod,
}: CalendarGridHeadersProps) {
  const monthHeaders = getMonthHeaders(daysInPeriod);

  return (
    <thead className="text-xs text-muted-foreground sticky top-0 z-20 bg-background/95 backdrop-blur">
      {/* Month Header */}
      <tr className="text-center">
        <th rowSpan={2} className="sticky left-0 bg-background/95 p-2 font-semibold text-sm border-b border-r border-border align-middle">
          Сотрудник
        </th>
        {monthHeaders.map(({ name, dayCount }) => (
          <th
            key={name}
            colSpan={dayCount}
            className="p-1.5 font-semibold text-lg border-b border-r border-border"
          >
            {name}
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
