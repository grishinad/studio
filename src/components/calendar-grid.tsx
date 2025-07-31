'use client';

import {
  differenceInCalendarDays,
  format,
  isSameDay,
  isWithinInterval,
} from 'date-fns';
import { ru } from 'date-fns/locale';

import { CalendarGridHeaders } from '@/components/calendar-grid-headers';
import { isWeekend } from '@/lib/dates';
import { cn } from '@/lib/utils';
import type { Absence, Employee } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type CalendarGridProps = {
  daysInPeriod: Date[];
  employees: Employee[];
  absences: Absence[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function CalendarGrid({
  daysInPeriod,
  employees,
  absences,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const getAbsencesForEmployee = (employeeId: string) => {
    return absences.filter(absence => absence.employeeId === employeeId);
  };
  
  const renderEmployeeRow = (employee: Employee) => {
    const employeeAbsences = getAbsencesForEmployee(employee.id);
    const cells = [];
    let i = 0;
    while (i < daysInPeriod.length) {
      const day = daysInPeriod[i];
      const absence = employeeAbsences.find(a =>
        isWithinInterval(day, { start: a.startDate, end: a.endDate })
      );

      if (absence) {
        // Calculate duration only within the current view
        const intervalStart = isWithinInterval(absence.startDate, { start: daysInPeriod[0], end: daysInPeriod[daysInPeriod.length - 1]}) ? absence.startDate : daysInPeriod[0];
        const intervalEnd = isWithinInterval(absence.endDate, { start: daysInPeriod[0], end: daysInPeriod[daysInPeriod.length - 1]}) ? absence.endDate : daysInPeriod[daysInPeriod.length-1];
        
        let duration = differenceInCalendarDays(intervalEnd, day) + 1;
        
        // Ensure we don't exceed array bounds
        const colSpan = Math.min(duration, daysInPeriod.length - i);
        
        const absenceText = absence.replacement
          ? `${format(absence.startDate, 'dd.MM.yyyy')} - ${format(absence.endDate, 'dd.MM.yyyy')}, Исполняющий обязанности: ${absence.replacement}`
          : `${format(absence.startDate, 'dd.MM.yyyy')} - ${format(absence.endDate, 'dd.MM.yyyy')}`;

        cells.push(
          <td
            key={format(day, 'yyyy-MM-dd')}
            colSpan={colSpan}
            className="p-1 h-14"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-primary/80 hover:bg-primary transition-colors duration-200 text-primary-foreground rounded-lg h-full flex items-center justify-center text-xs px-2 shadow cursor-help">
                    <span className="truncate">{absence.absenceType}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{absenceText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          {daysInPeriod.map((_, i) => (
            <col key={i} style={{ width: '2.5rem' }} />
          ))}
        </colgroup>
        <CalendarGridHeaders
          daysInPeriod={daysInPeriod}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
        />
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
