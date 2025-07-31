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
import type { Absence, Organization } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type CalendarGridProps = {
  daysInPeriod: Date[];
  organizations: Organization[];
  absences: Absence[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

const getAbsenceTypeColor = (absenceType: string) => {
  switch (absenceType) {
    case 'отпуск ежегодный':
      return 'bg-green-400/80 hover:bg-green-400 text-green-950';
    case 'командировка':
      return 'bg-pink-400/80 hover:bg-pink-400 text-pink-950';
    case 'больничный':
      return 'bg-orange-400/80 hover:bg-orange-400 text-orange-950';
    case 'отпуск декретный':
      return 'bg-blue-400/80 hover:bg-blue-400 text-blue-950';
    case 'отгул за свой счет':
      return 'bg-slate-400/80 hover:bg-slate-400 text-slate-950';
    case 'прогул':
      return 'bg-red-500/80 hover:bg-red-500 text-white';
    case 'другое':
      return 'bg-teal-400/80 hover:bg-teal-400 text-teal-950';
    default:
      return 'bg-primary/80 hover:bg-primary text-primary-foreground';
  }
};

export function CalendarGrid({
  daysInPeriod,
  organizations,
  absences,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const getAbsencesForOrganization = (organizationId: string) => {
    return absences.filter(absence => absence.organizationId === organizationId);
  };
  
  const renderOrganizationRow = (organization: Organization) => {
    const organizationAbsences = getAbsencesForOrganization(organization.id);
    const cells = [];
    let i = 0;
    while (i < daysInPeriod.length) {
      const day = daysInPeriod[i];
      const absence = organizationAbsences.find(a =>
        isWithinInterval(day, { start: a.startDate, end: a.endDate })
      );

      if (absence) {
        const intervalStart = isWithinInterval(absence.startDate, { start: daysInPeriod[0], end: daysInPeriod[daysInPeriod.length - 1]}) ? absence.startDate : daysInPeriod[0];
        const intervalEnd = isWithinInterval(absence.endDate, { start: daysInPeriod[0], end: daysInPeriod[daysInPeriod.length - 1]}) ? absence.endDate : daysInPeriod[daysInPeriod.length-1];
        
        let duration = differenceInCalendarDays(intervalEnd, day) + 1;
        
        const colSpan = Math.min(duration, daysInPeriod.length - i);
        
        const absenceBarText = `${absence.absenceType} (${format(absence.startDate, 'dd.MM')} - ${format(absence.endDate, 'dd.MM')})`;

        cells.push(
          <td
            key={format(day, 'yyyy-MM-dd')}
            colSpan={colSpan}
            className="p-1 h-7"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn("transition-colors duration-200 rounded-lg h-full flex items-center justify-center text-xs px-2 shadow cursor-help", getAbsenceTypeColor(absence.absenceType))}>
                    <span className="truncate">{absenceBarText}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-bold text-base">{absence.absenceType}</p>
                    <p>{format(absence.startDate, 'dd.MM.yyyy')} - {format(absence.endDate, 'dd.MM.yyyy')}</p>
                    {absence.replacement && <p>Исполняющий обязанности: {absence.replacement}</p>}
                  </div>
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
              'h-7 w-10 border-r',
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
          {organizations.map(organization => (
            <tr key={organization.id} className="border-t hover:bg-muted/30">
              <th className="sticky left-0 bg-card hover:bg-muted/30 p-2 font-medium text-left border-r whitespace-nowrap z-10">
                {organization.name}
              </th>
              {renderOrganizationRow(organization)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
