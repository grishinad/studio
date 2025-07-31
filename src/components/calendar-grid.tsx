'use client';

import {
  differenceInCalendarDays,
  format,
  isSameDay,
  isWithinInterval,
} from 'date-fns';

import { CalendarGridHeaders } from '@/components/calendar-grid-headers';
import { isWeekend } from '@/lib/dates';
import { cn } from '@/lib/utils';
import type { Absence, Employee, Holiday } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type CalendarGridProps = {
  year: number;
  daysInYear: Date[];
  employees: Employee[];
  absences: Absence[];
  holidays: Holiday[];
};

export function CalendarGrid({
  year,
  daysInYear,
  employees,
  absences,
  holidays,
}: CalendarGridProps) {
  const getAbsencesForEmployee = (employeeId: string) => {
    return absences.filter(absence => absence.employeeId === employeeId);
  };
  
  const isHoliday = (day: Date) => holidays.some(h => isSameDay(h.date, day));

  const renderEmployeeRow = (employee: Employee) => {
    const employeeAbsences = getAbsencesForEmployee(employee.id);
    const cells = [];
    let i = 0;
    while (i < daysInYear.length) {
      const day = daysInYear[i];
      const absence = employeeAbsences.find(a =>
        isWithinInterval(day, { start: a.startDate, end: a.endDate })
      );

      if (absence) {
        const duration =
          differenceInCalendarDays(absence.endDate, absence.startDate) + 1;
        
        // Ensure we don't exceed array bounds if absence bleeds into next year
        const colSpan = Math.min(duration, daysInYear.length - i);

        cells.push(
          <td
            key={format(day, 'yyyy-MM-dd')}
            colSpan={colSpan}
            className="p-1 h-14"
          >
            <div className="bg-primary/80 hover:bg-primary transition-colors duration-200 text-primary-foreground rounded-lg h-full flex items-center justify-center text-xs px-2 shadow">
              <span className="truncate">Выходной</span>
            </div>
          </td>
        );
        i += colSpan;
      } else {
        cells.push(
          <td
            key={format(day, 'yyyy-MM-dd')}
            className={cn(
              'h-14 w-10 border-r',
              isWeekend(day) && 'bg-muted/50',
              isHoliday(day) && 'bg-accent/30'
            )}
          />
        );
        i++;
      }
    }
    return cells;
  };

  return (
    <div className="overflow-x-auto border rounded-lg shadow-md bg-card">
      <table className="min-w-full border-collapse table-fixed">
        <colgroup>
          <col style={{ width: '12rem' }} />
          {daysInYear.map((_, i) => (
            <col key={i} style={{ width: '2.5rem' }} />
          ))}
        </colgroup>
        <CalendarGridHeaders daysInYear={daysInYear} holidays={holidays} />
        <tbody className="text-sm">
          {employees.map(employee => (
            <tr key={employee.id} className="border-t hover:bg-muted/30">
              <th className="sticky left-0 bg-card hover:bg-muted/30 p-2 font-medium text-left border-r whitespace-nowrap">
                {employee.name}
              </th>
              {renderEmployeeRow(employee)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
